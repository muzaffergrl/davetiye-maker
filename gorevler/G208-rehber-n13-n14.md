---
id: G208
baslik: Rehber N13 (iki dilli düğün websitesi) ve N14 (düğünden sonra website) — İngilizce + iç linkler
rol: claude-metin
durum: inceleme
alan: claude-session-nice-faraday
oncelik: 1
bagimli: [G207]
yazar: [platform/content/guides/, platform/tests/g208.test.ts, platform/previews/g208/, docs/36_ICERIK_PLANI.md, gorevler/G208-rehber-n13-n14.md]
---

## Amaç
Kullanıcı (2026-10-22): "dalga 7 ile devam et, N13 ve N14'ü yaz" (`docs/36` §7).

## Sonuç (2026-10-22, bulut oturumu)
- **N13** `content/guides/bilingual-wedding-website.md` (order 19): ne zaman gerekir; üç kurulum yolu tablosu (aynı sayfada iki
  dil / dil düğmesi / iki ayrı site); çeviri öncelik kontrol listesi; 6 dil için hitap (resmî/samimi), tarih ve saat biçimi
  tablosu (özgün öğe); makine çevirisinin tipik hataları; iki sürümü eşit tutma adımları; her misafire kendi dilinde link.
  Kaynak: W3C "Date formats" (sayısal tarih belirsizliği, ay adıyla yazma). Ürün bölümü koddan: 5 dil (`lib/i18n/langs.ts`),
  ana dil + ek diller, hazır metinler çevrili, kendi metinler alan alan; otomatik taslak tarayıcı çevirmeni ya da ücretsiz
  çevrimiçi servis; yalnız onaylanan çeviri misafire gider, kaynak değişince ana dil gösterilir (`lib/i18n/content.ts`);
  her sayfada dil düğmesi ve her dil için ayrı link.
- **N14** `content/guides/wedding-website-after-the-wedding.md` (order 20): ne kadar açık kalmalı (Emily Post: hediye en geç
  3 ay, "bir yıl" efsane; teşekkür notları 3 ay içinde); 5 seçenek tablosu (bırak / teşekkür sayfası / şifre / yayından kaldır /
  sil); düğünden sonraki hafta kontrol listesi; 4 tonda teşekkür mesajı; saklanacaklar; düğün sonrası gizlilik. Ürün bölümü
  koddan: teşekkür modu düğün gününün ertesi gecesi sitenin saat diliminde kendiliğinden açılır, elle açılır/kapanır
  (`lib/content/thank-you.ts`), RSVP kapanır (`lib/rsvp/deadline.ts`), panelde hazır teşekkür mesajı (`lib/panel/share.ts`),
  Excel/CSV ve site PDF'i, {{months}} ay. Arşiv sonrası davranış (`verified.archive: false`) iddia edilmedi.
- İç linkler (İngilizce): N10 ve G2 → N13; G3 ve N11 → N14. Çevirilerdeki karşılıkları çeviri göreviyle eklenecek
  (betik: scratchpad `g208links.py`, önceki dalgaların düzeni).
- Ölçüler: başlık 58 / 54, açıklama 160 / 157, quick answer 56 / 56 kelime, 4'er SSS (48–59 kelime). Kelime 1440 / 1261.
  content_quality 81 / 76, filler 0, AI kalıbı 0.
- `tests/g208.test.ts`: 5 dil, onaysız çevirinin misafire gitmemesi, teşekkür modunun zamanı (Lizbon), RSVP kapanışı,
  hazır mesaj, linkler.
- Build: iki sayfa 200, tek H1; 390 px taşma 0 (`previews/g208/`). `npm test` 1708/1708 (0 hata, 0 atlanan), typecheck temiz.
- Çeviri yapılmadı; TR/DE/ES/FR'de iki sayfa şimdilik "This guide is available in English" notuyla İngilizce açılıyor.

## Günlük
- 2026-10-22 alindi: claude-session-nice-faraday
- 2026-10-22 inceleme: N13 + N14 + 4 iç link
