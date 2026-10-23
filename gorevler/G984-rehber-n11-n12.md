---
id: G984
baslik: Rehber N11 (gizlilik) ve N12 (QR) — İngilizce + dalga 6 iç linkleri
rol: claude-metin
durum: inceleme
alan: claude-session-nice-faraday
oncelik: 1
bagimli: [G981, G983]
yazar: [platform/content/guides/, platform/tests/g984.test.ts, platform/previews/g984/, docs/36_ICERIK_PLANI.md, gorevler/G984-rehber-n11-n12.md]
---

## Amaç
Kullanıcı (2026-10-22): "dalga 6 ile devam et, N11 ve N12'yi yaz" (`docs/36_ICERIK_PLANI.md` dalga 6).

## Sonuç (2026-10-22, bulut oturumu)
- **N11** `content/guides/wedding-website-privacy.md` (order 17): link alan herkesin açabildiği sayfa mantığı; arama /
  erişim / link önizlemesi tablosu; yazılmaması gerekenler kontrol listesi; fotoğraflardaki ev numarası vb.; şifre ne zaman
  gerekir; düzenleme linki; düğün sonrası. Kaynak: Google "block indexing" (noindex gizlilik değildir, şifre önerir).
  Ürün bölümü koddan: çift siteleri `noindex` (`lib/site/render.ts`), şifre sayfası ve önizleme yalnız isimler +
  "You're invited" (`lib/site/gate.ts`), yanıtlar yalnız panelde ve indirilebilir, düğünden sonra 12 ay açık, teşekkür sayfası,
  yayından kaldırma.
- **N12** `content/guides/qr-code-wedding-rsvp.md` (order 18): N4'teki baskı listesini tekrar etmeden statik / yönlendirmeli
  kod tablosu, kodun hangi sayfayı açacağı, okuma mesafesine göre boyut tablosu (10:1 "rule of thumb" olarak, kaynak iddiası
  yok), logo/foil/kontrast riskleri, mekân tabelaları kontrol listesi, yazılı adres, test adımları. Kaynaklar: DENSO WAVE
  hata düzeltme seviyeleri ve 4 modül boşluk. Ürün bölümü koddan: Q seviyesi, 4 modül, 3 PNG boyutu + SVG, tasarım rengi
  ≥ 7:1 (`lib/panel/share.ts`), 4 × 6 in QR kartı (isteğe bağlı şifre), davetiye arka yüzü.
- İç linkler: G2 → N11, N4 → N11 ve N12, N2 → N12; N11 → G2, N4; N12 → N4, N2, N11.
- G2 gizlilik bölümü kısaltılmadı (plan "kısalır" diyordu); 1200 kelime alt sınırına yakın olduğu için yalnız N11 linki eklendi.
- Ölçüler: başlık 58 / 55, açıklama 144 / 157, quick answer 60 / 54 kelime, 4'er SSS. content_quality 76 / 80, filler 0, AI kalıbı 0.
- `tests/g984.test.ts`: rehberlerdeki ürün iddiaları kaynak sabitlerle (noindex, "You're invited", ecc Q, QR_BORDER,
  QR_PNG_SIZES, kart ölçüsü) ve iç linkler.
- Build: iki sayfa 200, tek H1, jeton kalmadı; 390 px'de sayfa taşması 0 (`previews/g984/`).
- Testler: `npm test` 1699/1699 (0 hata, 0 atlanan; build güncel), typecheck temiz.
- Çeviri yapılmadı (kullanıcı isterse ayrı görev).

## Günlük
- 2026-10-22 alindi: claude-session-nice-faraday
- 2026-10-22 inceleme: N11 + N12 + 5 iç link
