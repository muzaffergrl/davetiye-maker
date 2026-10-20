---
id: G190
baslik: Lansman hazırlığı — alıcı dosyaları bkestudio.com'a, gizlilik metni, ilan linki aracı, lansman listesi
rol: claude-canva
durum: bitti
alan: koordinator
oncelik: 0
bagimli: [G189]
yazar: [tools/build_customer_guides.py, tools/listing_kit.py, tools/listing_editorial/, tools/listing_v2/capture.ts, tools/listing_templates/capture.ts, tools/tests/test_build_customer_guides.py, tools/ilan_baglantilari.py, tools/tests/test_ilan_baglantilari.py, platform/scripts/print-sample.ts, platform/scripts/marketing-assets.ts, collections/*/package/customer/, collections/*/package/listing/, collections/_services/, docs/05_SET_PAKETI.md, docs/18_GUNCEL_DURUM.md, docs/19_ALICI_YOLCULUGU.md, docs/20_ETSY_DUKKAN_KURULUMU.md, docs/22_GOOGLE_SHEETS.md, docs/28_ETSY_GIZLILIK_METNI.md, docs/29_LANSMAN_LISTESI.md, PROJECT_STATE.json, gorevler/G190-lansman-hazirligi.md]
---

## Amaç
Kullanıcı (2026-10-20): "eksikleri tamamlayalım, hemen canlı satışa çıkacağız; yapabileceğin bütün işleri tamamla."

## Sonuç (2026-10-20, bulut oturumu)
- 0dedaed2 bkestudio.com'u birincil yaptı; alıcı dosyaları hâlâ IDN adresini gösteriyordu. Varsayılan taban
  `https://bkestudio.com`: araçlar + START HERE 01–32 (`build_customer_guides.py --designs all`, her PDF 3 link, QR jsQR ile
  okundu), hizmet kılavuzları, `etsy_upload.py` (01–32 + hizmetler), ilan PDF'leri 01–21 (`listing_kit.py pdf`), `listing_v3.md`
  01–38 ("Web address" satırı), docs/05, 19, 20, 22. ilan PDF'lerinde kalan tek eski ad "Web address" satırındaki 308 notu.
- `docs/28_ETSY_GIZLILIK_METNI.md`: Etsy gizlilik politikası (3.745 karakter), sitenin `/privacy` sayfasıyla aynı içerik;
  yalnız `[DATA CONTROLLER NAME]` + `[POSTAL ADDRESS]` açık.
- `tools/ilan_baglantilari.py` (+ 4 test): Etsy ilan linkleri → `config.ts` `etsyListingUrl` + `lib/etsy/listings.json`
  (`listings` / `services`), utm atar, kuru varsayılan.
- `docs/29_LANSMAN_LISTESI.md`: sıralı lansman listesi; `launchProblems()` bugün 25 madde (4 `verified.*`, 21 ilan linki).
- `launchProblems()` dışında görülen: canlı siteyi sunan Vercel projesi bulut bağlantısında yok; `live-check` koşulamadı.

## Açık (kullanıcı)
docs/29 B1–B8: yayın, ortam değişkenleri, plan, gerçek telefon testi, gizlilik adı/adresi, ilan yenileme kararı, ilan yükleme.
