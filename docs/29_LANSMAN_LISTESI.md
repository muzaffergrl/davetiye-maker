# Lansman listesi — ilk satış dalgası 01–20 (2026-10-23)

Tek sayfa, sıralı. Kaynak: `launchProblems()` (`platform/lib/marketing/placeholders.ts`; `launched: true` olunca bunlardan biri
kalırsa build durur), `PROJECT_STATE.json` → `platform.presale_blockers`, docs/10 §2c, docs/20 §7.13, docs/01 K50–K58.
**Satışa açılan: yalnız 01–20** (K55; 1.190 TL, K49). 21 ve 49 `preview`, 22–32 `preview`, 33–48 `coming`; hepsi Etsy'de taslak
kalır. Etsy işleri bu bulut oturumundan yapılamaz (etsy.com'a vekil 403): yerel oturum belgeleri **`docs/37`** ve **`docs/38`**.

## A. Yapıldı (kanıtıyla)
- [x] **Yayın yolu:** bkestudio.com Vercel `bkestudio` (Pro) / `davetiye-maker`, Git bağlı — main'e push = production
      (docs/10 §2c, 2026-10-20, yerel oturum). Barındırma ticari kullanıma uygun (Pro).
- [x] **Production ortam değişkenleri:** `ADMIN_PASSWORD` ≥ 16 karakter yenilendi; `PLATFORM_PUBLIC_URL` = `MARKETING_SITE_URL`
      = `https://bkestudio.com` (docs/10 §2c, 2026-10-20). `CLAIM_ORDER_VERIFICATION=trust` (G191 günlüğü, 2026-10-22).
- [x] **Destek e-postası** bkestudio01@gmail.com her yerde (K50; 519d39f86, 1fdbb315d).
- [x] **Fiyat** 1.190 TL düz (K49); 49 tasarımın `etsy_upload.json`'u ve Etsy taslakları bu fiyatta (docs/20 §7.13).
- [x] **Etsy taslakları:** 52 taslak (49 tasarım + 3 hizmet), 0 aktif; 01–49'da 19 v4 görsel + 4:5 video + START_HERE.pdf;
      `etsy_upload.py --check --strict` 0 hata (docs/20 §7.13, 2026-10-23).
- [x] **Gerçek telefon:** sahibi canlı siteyi gerçek telefonlarda denedi, sorun yok (K52, kullanıcı beyanı; cihaz/adım kaydı yok).
      `verified.realDevices: true` (G954). Bugünkü değişikliklerden sonra telefonda yeniden bakılmadı.
- [x] **İlk dalga 01–20 platformda** (G954): 21 ve 49 `preview` ("Coming soon on Etsy", üretimde /start kapalı); katalog
      satıştakileri önce gösteriyor — *bu entegrasyon dalında, yayında değil.*
- [x] **Bir siparişte iki tasarım** (K53, G951): /start seçim ekranı, makbuz/e-posta tasarım satırlarıyla sınır, trust'ta anında
      admin To-do; `claim-browser` 57/57 (build ile) — *dalda, yayında değil; gerçek Etsy makbuzuyla denenmedi.*
- [x] **Kullanım Koşulları + KVKK aydınlatma** (K56, G961): `/terms`, `/kvkk` 5 dilde, gizlilik ekleri, /start satırı; köşeli
      parantezli yer tutucu yok — *dalda, yayında değil.* Açık maddeler docs/39 §4.
- [x] **START HERE yeni görünüm** 01–49 (PR #37, merge-3 `3c75ce9f4`); `build_customer_guides.py` 49/49, QR'lar okundu —
      *repoda; Etsy'deki PDF'ler eski.*
- [x] **Ses efektleri** (K57, G967–G969): 50 efekt, temaya özel açılışlar (docs/40) — *dalda; kulakla dinlenmedi.*
- [x] **Görsel cila 01–20** (K52; docs/41) — *dalda.*
- [x] **Canlı izleme** (G966): saatlik salt okunur kontrol + tek issue — main'e girince çalışır.

## B. Kalan — sırayla
1. **Bu entegrasyonu main'e al** (dal `claude/adoring-gates-10grne`; bu oturum push etmez) → Vercel production. Sonra
   `docs/38` adım 0: G951/G954 yayında mı, `/start`, `/privacy`, `/terms`, `/kvkk` 200 mü; `live-check` (docs/10 §2c'ye satır).
   `/terms` ve `/kvkk` canlıya çıkınca `.github/workflows/live-check.yml`'deki `--allow-404 /terms,/kvkk` kaldırılır.
2. **E-posta + Gmail sipariş doğrulaması + Google Sheets** (K51) — yerel oturum `docs/37` (bkestudio01; iki uygulama şifresi,
   OAuth istemcisi, test e-postası, gelen kutusu denemesi, test sitesinde Sheets'e RSVP). Trust modu kalır.
3. **Etsy hazırlığı** — yerel oturum `docs/38`: (1) bütün taslaklara yeni START HERE PDF'leri; (2) 22–32 medyası yeni tasarımdan
   yeniden çekildiyse yükle (commit yoksa atla); (3) "Message to Buyers for Digital Items" + iki SSS; (4) yayın öncesi rapor.
4. **Sahibin "yayınla" onayı** → yalnız 01–20, ilan ilan (toplu seçim yok; K55).
5. **İlan linkleri:** 20 linki `python3 tools/ilan_baglantilari.py linkler.txt --yaz` → `config.ts` `etsyListingUrl` ×20 +
   `lib/etsy/listings.json`.
6. **Gizlilik + yasal kimlik** (K58, sahip): `legal.controllerName` + `legal.postalAddress` (config) ve docs/28 → Etsy Policy
   settings → Privacy policy. Avukat okuması sonrası `verified.privacyText: true`.
7. **Kalan bayraklar:** `verified.editRights`, `verified.archive` (panel kuralları canlıda kontrol edilince), `verified.orderCheck`
   (sipariş kontrolü canlıda doğrulanınca) → `true`; sonra `launched: true`. `launchProblems()` boş değilse build durur.
8. **Etsy ilan yenileme** kararı (otomatik önerildi) → her `etsy_upload.json`'daki tek açık madde.
9. `npm test`, typecheck, build; yayın + `live-check`.

## C. Bugün `launchProblems()` — 26 madde
(`launched: true` denenince; build ortamında `CLAIM_ORDER_VERIFICATION=trust` ve `ADMIN_PASSWORD` ≥ 12 ile)
- `verified.editRights`, `verified.archive`, `verified.privacyText`, `verified.orderCheck` false (B6–B7)
- `legal.controllerName`, `legal.postalAddress` boş (B6, K58)
- 20 tasarımın (01–20) `etsyListingUrl`'i yer tutucu (B4–B5)

Eski sürümler: docs/30 (1.460 TL, "21 tasarım") ve docs/36 eskidi; yerini docs/38 aldı.
