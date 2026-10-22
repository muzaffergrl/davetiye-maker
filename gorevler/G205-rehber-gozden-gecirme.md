---
id: G205
baslik: İlk 6 rehberin gözden geçirmesi — kaynaklar, ürün iddiaları, iç linkler (5 dil)
rol: claude-metin
durum: inceleme
alan: claude-session-nice-faraday
oncelik: 1
bagimli: [G204]
yazar: [platform/content/guides/, platform/tests/g205.test.ts, docs/35_SEO_GEO_AEO.md, docs/36_ICERIK_PLANI.md, gorevler/G205-rehber-gozden-gecirme.md]
---

## Amaç
Kullanıcı (2026-10-22): "3 aylık gözden geçirmeyle devam et" (`docs/36` dalga 3 ve 6). Rehberler 2026-10-14 tarihli; takvime
göre erken, bu yüzden "erken gözden geçirme" olarak kaydedildi. Sıradaki gerçek 3 aylık tur 2027-01-22 civarı, 18 rehberin hepsi.

## Yöntem
1. Dış kaynaklar: her linkin hâlâ var olduğu ve rehberdeki cümleyi desteklediği (emilypost.com ve canva.com bu ortamdan
   açılmıyor; WebSearch ile doğrulandı).
2. Ürün iddiaları: "our/we" cümleleri koda karşı (indirme biçimleri, RSVP son tarihte kapanması, karakter sınırları ve sayaç,
   sayfa yapısı, demo tasarımları).
3. İç linkler: 18 rehberin gelen link dağılımı; yeni N11/N12'ye eski rehberlerden yol.

## Sonuç (2026-10-22, bulut oturumu)
- **Kaynak düzeltmesi:** G3 ve N5 düğün zamanlaması için `emilypost.com/advice/invitation-timing` gösteriyordu; o sayfa genel
  bir etkinlik tablosu (yıldönümü, balo…), düğün süreleri yok. Yerine Emily Post'un düğün planlama takvimi
  (`wedding-planning-series`: davetiye 6–8 hafta, save the date 3–6 ay ya da daha erken) ve yanıt kartı sayfası
  (`how-to-word-a-wedding-response-card`: yanıt tarihi 2–3 hafta) × 5 dil.
- Diğer kaynaklar geçerli: Emily Post wedding-website-tips, wedding-email-dos-and-donts, wedding-evites, attire guide;
  Canva help (my.canva.site ücretsiz, kendi alan adı ücretli plan).
- **Ürün düzeltmesi:** G1, G3, G6 yanıtlar için yalnız "CSV" diyordu; panelde Excel ve CSV var → "Excel or CSV" × 5 dil.
- G4'teki 200 / 60 karakter sabit sayıları `{{storyIntroChars}}` / `{{storyCaptionChars}}` jetonu oldu (değer aynı, artık koddan) × 5 dil.
- Doğrulanan ve değişmeyenler: RSVP formu son tarihten sonra kapanır (`lib/rsvp/deadline.ts`), alanlarda karakter sayacı
  (`components/panel/fields.tsx`), Blush Garden Rose ve storybook tasarımı var, 4 sayfa yapısı, {{months}} ay.
- **İç linkler:** G1 adım 7 → N12 ve N11; G5 önizleme paragrafı → N11 × 5 dil.
- Tarihler: G1–G6 ve N5 `updated`/`reviewed` 2026-10-22 × 5 dil (G2 için G203'teki link eklemesi de içerik değişikliği).
- `tests/g205.test.ts`: yalnız-CSV cümlesi kalmadı, G4 jetonları, invitation-timing linki yok.
- Doğrulama: 72 çeviride link/H2/SSS eşit; build; 35 sayfa 200, tek H1, `dateModified` 2026-10-22; `npm test` 1702/1702
  (0 hata, 0 atlanan), typecheck temiz.

## Günlük
- 2026-10-22 alindi: claude-session-nice-faraday
- 2026-10-22 inceleme: 7 rehber × 5 dil güncellendi
