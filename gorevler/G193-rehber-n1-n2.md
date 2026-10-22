---
id: G193
baslik: Rehber N1 (animated envelope) ve N2 (RSVP questions) — İngilizce
rol: claude-metin
durum: inceleme
alan: claude-session-nice-faraday
oncelik: 1
bagimli: [G192]
yazar: [platform/content/guides/, platform/previews/g193/, docs/36_ICERIK_PLANI.md, gorevler/G193-rehber-n1-n2.md]
---

## Amaç
Kullanıcı (2026-10-22): "N1 ve N2'yi yazmaya başla" (docs/36 §5 brifleri).

## Sonuç (2026-10-22, bulut oturumu)
- `content/guides/animated-envelope-wedding-invitations.md` (order 7, 1.425 kelime) ve `content/guides/wedding-rsvp-questions.md`
  (order 8, 1.514 kelime). Hızlı yanıt 57/57 kelime, 4 soruluk SSS, tablo + kontrol listesi.
  claude-seo `content_quality.py`: 76 / 77 (dolgu 0, AI kalıbı 0; "low-density" uyarısı, G5/G6 ile aynı).
- Ürün cümleleri koddan doğrulandı: RSVP alanları ve 10 soru, 5 soru türü, zorunlu işareti, ek sorular yalnız
  "geliyorum" diyenlere (`lib/rsvp/validate.ts`, `lib/content/types.ts`); 40 temanın hepsi `prefers-reduced-motion`
  kullanıyor; Excel/CSV indirme (`facts.ts`). Rakip adı yok.
- Kaynaklar (arama sonuçlarından doğrulandı; WebFetch bu ortamda DNS hatası verdi): Emily Post (wedding-evites,
  how-to-word-a-wedding-response-card, the-continuing-importance-of-the-rsvp), W3C WCAG 2.2 SC 2.3.3, ogp.me.
- İç linkler: G1 ve G2 → N2; G5 ve G6 → N1. Footer ve /guides yeni rehberleri kendiliğinden listeliyor.
- G1 ile tutarlılık: N2 "toplam dört ya da beş soru" diyor (2 temel + G1'deki 2–3 kendi sorusu).
- Kontrol: build temiz; iki sayfa 200, tek H1, Article + BreadcrumbList; 390 px'te yatay taşma yok (tablolar kendi kutusunda
  kayıyor). Görüntüler `platform/previews/g193/`.
- Testler: TEST_SONUCU
- Çeviri yapılmadı: TR/DE/ES/FR sayfaları şimdilik İngilizce metni gösteriyor (G144 davranışı). Site noindex olduğu için
  arama tarafında zararı yok; lansmandan önce çevrilmeli.

## Önerilen görevler (entegratöre)
- N1 + N2 çevirisi (`content/guides/{tr,de,es,fr}/`), mevcut çevirilere yeni iç link cümleleri.
- Dalga 2: N3, N4 (docs/36).

## Günlük
- 2026-10-22 alindi: claude-session-nice-faraday
- 2026-10-22 inceleme: iki rehber yazıldı
