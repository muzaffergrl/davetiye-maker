# Lansman listesi — 01–21 ile canlı satış (2026-10-20)

Tek sayfa, sıralı. Her satır: kim yapar, tam olarak ne. Kaynak: `launchProblems()` (`platform/lib/marketing/placeholders.ts`;
`launched: true` olunca build bunlardan biri kalırsa durur), `PROJECT_STATE.json` `presale_blockers`, docs/10, docs/20.
Satışa açılan: **01–21** (21 tasarım, 1.460 TL). 22–38 ve paletler sonra eklenir; lansmanı beklemez.

## A. Bulut oturumunda yapıldı (2026-10-20, G190)
- [x] Alıcı dosyaları **bkestudio.com**'a taşındı: START HERE MD + PDF + QR 01–32 (her PDF'te 3 link; QR'lar jsQR ile okundu),
      hizmet kılavuzları, `etsy_upload.json` 01–32 + hizmetler, ilan PDF'leri 01–21, `listing_v3.md` 01–38, Etsy mesaj
      metinleri (docs/20 §1.4–1.5), docs/05, docs/19, docs/22. Eski `xn--bkestudo-zkb.com` linkleri sitede 308 ile yönleniyor.
- [x] Etsy gizlilik politikası metni hazır: `docs/28_ETSY_GIZLILIK_METNI.md` (yalnız ad + posta adresi eksik).
- [x] İlan linkleri aracı: `tools/ilan_baglantilari.py` — Etsy linkleri gelince `config.ts` + `lib/etsy/listings.json` tek komut.
- [x] GPT iş listesi güncel (351 görsel; 22–32'nin geçersiz parçaları çıktı) — `docs/27_GPT_IS_LISTESI.html`.

## B. Senin yapman gereken (bu ortamdan erişilemiyor) — hepsi tek talimatta: `docs/30_YEREL_LANSMAN_TALIMATI.md`
Sıra önemli; her adım bir öncekine dayanır.

1. **Yayın.** Son main + bu dalı (`claude/focused-tesla-37o26v`) birleştirip bkestudio.com'u sunan Vercel projesine yayınla
   (yerel oturumunun kullandığı yol). Bu bulut oturumunun Vercel bağlantısı o projeyi görmüyor (görünen `davetiye-platform`
   projesinin son production yayını 17 Ekim, `477589f`; bkestudio.com ona bağlı değil). Yayından sonra:
   `cd platform && LIVE_BASE_URL=https://bkestudio.com node scripts/live-check.mjs` ve `node scripts/blob-smoke.mjs` (ikisi de `BLOB_READ_WRITE_TOKEN` ister); sonucu
   docs/10 §2c'ye bir satır. *(Commit'leri benim adıma değil kendi Git kimliğinle yayınla: Vercel Claude yazarlı commit'i
   BLOCKED yapıyor, docs/10 G049 notu.)*
2. **Vercel ortam değişkenleri (Production):**
   - `CLAIM_ORDER_VERIFICATION=manual` — her sipariş admin'den onaylanana kadar site yayınlanamaz (K34). Etsy API onayı
     gelince `etsy` (docs/10 §3 "Sahibin kurulumu").
   - `ADMIN_PASSWORD` — **en az 12 karakter** (şu an kısa geçici şifre; build lansmanda reddeder).
   - `PLATFORM_PUBLIC_URL=https://bkestudio.com` ve `MARKETING_SITE_URL=https://bkestudio.com` (0dedaed2 commit'i bunların
     ayarlandığını yazıyor; kontrol et).
   - E-posta (önerilir, şart değil): `SMTP_HOST`, `SMTP_USER`, `SMTP_PASS`, `MAIL_FROM`, `ADMIN_NOTIFY_EMAIL` — ör. Gmail
     uygulama şifresi. Yoksa alıcıya düzenleme linki e-postayla gitmez; `/my` (sipariş no + e-posta) yolu yine çalışır.
3. **Barındırma planı.** Vercel Hobby ticari kullanıma kapalı; bkestudio.com'u sunan projenin ekibi Pro değilse Pro'ya geç.
4. **Gerçek telefon testi** — `docs/20_ELLE_TEST_PLANI.md` (iPhone Safari + Android Chrome). En azından: §1 alıcı akışı bir
   tasarımla baştan sona, §3 yayın + paylaşım, §4 misafir RSVP, §2 admin "Siparişi onayla". Bulgular tablo satırı olarak.
5. **Gizlilik:** `docs/28_ETSY_GIZLILIK_METNI.md`'deki iki alanı (yasal ad, posta adresi) bana yaz ya da metne koyup
   Etsy → Policy settings → Privacy policy'ye yapıştır.
6. **Etsy ilan yenileme (renewal):** her `etsy_upload.json`'da tek açık madde "renewal not decided". Öneri: **automatic**
   (satılan dijital ilan stokta kalsın; her yenileme 0,20 USD). Kararını yaz, 21 dosyaya ben işlerim.
7. **21 ilanı Etsy'ye yükle** (`collections/NN_*/package/listing/etsy_upload.json` + `images_editorial/` + `video.mp4` +
   dijital dosya `package/customer/START_HERE.pdf`). Hizmet ilanları (kurulum, özel tasarım, ek revizyon) isteğe bağlı.
8. **Etsy dükkân mesajlarını güncelle:** docs/20 §1.4–1.5'teki "Message to buyers" metinleri bkestudio.com'a geçti; Etsy'de
   eski adres kayıtlıysa yenisini yapıştır.

## C. Linkler gelince (ben, ~5 dk)
1. 21 ilan linkini bir metin olarak at (`01 https://www.etsy.com/listing/…` ya da `olive-ivory https://…`).
2. `python3 tools/ilan_baglantilari.py linkler.txt --yaz` → `config.ts` `etsyListingUrl` ×21 + `listings.json` eşlemesi.
3. B4 testleri geçtiyse `config.ts` → `verified.editRights`, `verified.archive`, `verified.orderCheck` (manual açık),
   `verified.realDevices`, `verified.privacyText` (B5 sonrası) → `true`, sonra `launched: true`. Build `launchProblems()`
   listesini boş görmezse durur — yarım lansman olmaz.
4. `npm test`, typecheck, build; senin yayının (B1 yolu) + `live-check`.

## Bugün `launchProblems()` (launched: true denenince, CLAIM_ORDER_VERIFICATION=manual ile) — 25 madde
- `verified.editRights`, `verified.archive`, `verified.privacyText`, `verified.orderCheck` false (B2, B4, B5 → C3)
- 21 tasarımın `etsyListingUrl`'i yer tutucu (B7 → C2)
- `ADMIN_PASSWORD` < 12 (B2; build ortamında ölçülür)
