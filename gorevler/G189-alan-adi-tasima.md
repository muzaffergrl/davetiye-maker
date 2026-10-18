---
id: G189
baslik: Alıcı dosyalarını marka alan adına taşı (START HERE, QR, ilan metinleri, Etsy mesajları)
rol: claude-canva
durum: bitti
alan: koordinator
oncelik: 0
bagimli: [G148, G175]
yazar: [tools/build_customer_guides.py, tools/listing_kit.py, tools/listing_editorial/, tools/listing_v2/capture.ts, tools/listing_templates/capture.ts, tools/tests/test_build_customer_guides.py, platform/scripts/print-sample.ts, platform/scripts/marketing-assets.ts, collections/*/package/customer/, collections/*/package/listing/, docs/05_SET_PAKETI.md, docs/19_ALICI_YOLCULUGU.md, docs/20_ETSY_DUKKAN_KURULUMU.md, docs/22_GOOGLE_SHEETS.md, PROJECT_STATE.json, gorevler/G189-alan-adi-tasima.md]
---

## Amaç
Kullanıcı bkestudıo.com'u aldı ve Vercel'e bağladı (PROJECT_STATE hosting.domain). Alıcıya giden START HERE PDF'leri,
QR'lar, ilan metinleri ve Etsy dükkân mesajları hâlâ eski geçici `davetiye-platform-five.vercel.app` adresini gösteriyordu:
gerçek bir alıcı eski yayına (G146 `/my` girişi olmayan sürüme) giderdi.

## Sonuç (2026-10-18, koordinatör)
- Varsayılan taban `https://xn--bkestudo-zkb.com` (bkestudıo.com'un IDNA biçimi; Etsy ve PDF okuyucular `ı`'yı her yerde
  doğru göstermeyebilir): `build_customer_guides.py`, `listing_kit.py`, yakalama betikleri, `print-sample.ts`, `marketing-assets.ts`.
- START HERE md + pdf + start QR 01–32 yeniden üretildi (`--designs all`): her PDF'te 3 link yeni adreste, QR'lar jsQR ile
  okundu. `etsy_upload.json` 01–32 + hizmetler ve 21 ilan PDF'i yeniden üretildi.
- `listing_v3.md` 01–38: adresler değişti; durum tablosundaki "Live: answered 200 on 2026-10-16" satırları "taşındı, yeni
  adreste telefondan açılmadı" diye düzeltildi; "Web address" satırına `[VERIFY]` notu kondu (canlı doğrulama bekliyor).
- Etsy mesajları (docs/20 §1.4–1.5), Google Sheets dönüş adresi (docs/22), docs/05 §C ve docs/19 yeni adreste.
- İlan görselleri (images_editorial) adres ve QR içermiyor; değişmedi. Eski `images/08_live_demo.png` + `demo_qr.png` (01–05)
  yüklenmiyor; eski adresi gösteriyorlar, kayıt olarak kaldı.
- `pytest tools/tests`: 111/111.

## Açık
- Yeni adreste canlı doğrulama (bu ortamın ağ politikası alan adını engelliyor): `/start?theme=olive-ivory`, `/my`, `/privacy` 200.
- Vercel'de `PLATFORM_PUBLIC_URL` (ve varsa Google OAuth dönüş adresi) yeni adres olmalı; eski Vercel adresinden 308 yönlendirme.
- Etsy dükkânında kayıtlı mesajlar eski adresle girildiyse güncellenmeli.
