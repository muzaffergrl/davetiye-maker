---
id: G147
baslik: Tam otomatik sipariş kontrolü (Etsy API) + gerçek e-posta gönderimi (SMTP)
rol: claude-kod
durum: bitti
alan: claude-G147
oncelik: 1
bagimli: [G045, G060, G087, G128, G145]
yazar: [platform/lib/claim/verify.ts, platform/lib/claim/mailer.ts, platform/lib/claim/claim.ts, platform/lib/etsy/, platform/lib/mail/, platform/lib/admin/connections.ts, platform/app/admin/page.tsx, platform/app/api/admin/connections/, platform/app/api/etsy/callback/, platform/components/admin/AdminConnections.tsx, platform/lib/panel/api.ts, platform/components/panel/api.ts, platform/components/panel/usePanel.ts, platform/components/panel/Panel.tsx, platform/tests/g147-etsy-mail.test.ts, platform/tests/claim.test.ts, platform/package.json, platform/package-lock.json, platform/README.md, docs/10_SITE_PLATFORMU.md, gorevler/G147-etsy-eposta.md]
---

## Amaç
Sahip her şeyin otomatik olmasını istiyor. Bugün canlıda `CLAIM_ORDER_VERIFICATION=manual`: her yeni site dükkân onaylayana kadar
bekliyor ve hiçbir e-posta gitmiyor (link yalnız ekranda). İkisi de kuruldu; **yalnız ortam değişkenleriyle açılır** — sahip
ayarlamadan canlıda hiçbir şey değişmez. Koordinatör: session_01HP9ZrJ8mhZnigbvsvUQ4pR. Paralel G146 (`/my`, `/start` kullanılmış
sipariş girişi, cihaz anahtarları, menü etiketi, panel kartları) — onlara dokunulmadı.

## Yapılacaklar
A. `EtsyOrderVerifier` (`CLAIM_ORDER_VERIFICATION=etsy`), admin "Etsy mağazasını bağla" (tek seferlik OAuth), şifreli token, otomatik
yenileme, bağlantıyı kes; bağlı değilken `manual` gibi (500 yok); bekleyenlerin otomatik yeniden kontrolü.
B. SMTP `EditLinkMailer` (Gmail uygulama şifresiyle), `kind: created | signin`, dükkâna "onay bekleyen yeni site" bildirimi, admin
durum satırları + test e-postası.
C. `docs/10` §3 kurulum adımları, bu dosya, testler.

## Sonuç
**2026-10-17 · claude-G147 — durum: inceleme.** Dal `claude/g147-etsy-eposta`. Yayın yok, main'e dokunulmadı, PR açılmadı.

### Etsy (A)
- **Doğrulama kaynağı:** developers.etsy.com bu ortamdan açılamadı (çıkış vekili etsy.com alanlarını reddediyor). Doğrulananlar ve
  kaynakları `platform/lib/etsy/config.ts` başında: `x-api-key: <keystring>:<shared secret>` zorunlu (2026-02-09'dan beri; Etsy'nin
  github.com/etsy/open-api #1529 duyurusu), OAuth 2.0 + PKCE S256 (`https://www.etsy.com/oauth/connect`,
  `https://api.etsy.com/v3/public/oauth/token`, form gövdesi, client secret yok), erişim tokenı 3600 sn, yenileme ~90 gün ve her
  yenilemede yeni refresh token (#996, #1351 — topluluk yanıtı), `getMe` → `{user_id, shop_id}`, `getShopReceipt` alanları
  (`status`, `is_paid`, `buyer_email` "erişim verilmemişse null", `transactions[].listing_id`) — Etsy OpenAPI şemasının etsy-ts@8.0.1'e
  üretilmiş metni; 429 başlıkları @profplum700/etsy-v3-api-client@4.0.0'dan. **Sahip uygulamayı açarken developers.etsy.com'da
  yeniden okunmalı** (aşağıda "Sonra").
- `lib/etsy/config.ts` (env: `ETSY_API_KEY`, `ETSY_SHARED_SECRET`; anahtar `GOOGLE_TOKEN_KEY`'den HKDF-SHA256 + ayrı etiket
  `bke-studio/etsy-shop-tokens/v1` — yeni gizli bilgi yok), `client.ts` (fetch, 10 sn zaman aşımı, hata yalnız kod + durum),
  `shop.ts` (bağlantı belgesi: ayrılmış site kimliği `00000000-0000-0000-0000-000000000000`, ad `etsy-shop` — mevcut
  `readSiteDoc/updateSiteDoc` her adaptörde çalışır, adaptör değişmedi; refresh/access/PKCE verifier AES-256-GCM, alan başına AAD;
  süreç içinde tek yenileme; başka örnek tokenı döndürdüyse yenisiyle bir kez daha; `invalid_grant` → "yeniden bağla"),
  `verify.ts` (kurallar), `recheck.ts` (yeniden kontrol), `listings.json` (boş eşleme).
- Kurallar: ödenmiş + bizim mağaza → `verified` (by `etsy`); `canceled` / `fully refunded` → `not_paid`; 404/400, başka satıcı,
  makbuz no farkı → `not_found`; tek makbuzda 403 → liste okunabiliyorsa `not_found`, okunamıyorsa (uygulama onaysız / izin yok)
  `pending` + admin uyarısı; ödenmemiş (`open`, `payment processing`) → `pending` (site açılır, ödeme gelince kendiliğinden onaylanır);
  `buyer_email` doluysa ve farklıysa → `email_mismatch` (null/boşsa karşılaştırılmaz); eşlenmiş ilan başka tasarımsa → `theme_mismatch`
  (eşlenmemiş → tasarım kontrolü yok); zaman aşımı/ağ/429/5xx → `unavailable` (503, hiçbir şey kaydedilmez).
- Geri düşüş: ayar eksik, mağaza bağlı değil, `invalid_grant` → `/start` 201 + `orderPending` (manual gibi). Admin kartı uyarı gösterir.
- Yeniden kontrol: admin "Bekleyen siparişleri Etsy'de kontrol et" (her modda, Etsy bağlıyken; en eski 100 site); `etsy` modunda
  alıcı paneli açıkken durum yoklamasında (site başına en çok 2 dk'da bir, paylaşılan sayaç) ve Publish'e basınca (`?orderCheck=now`,
  15 sn). Reddedilen yeniden kontrol hiçbir şeyi değiştirmez (site bekler, admin karar verir). Panel değişikliği küçük:
  `api.state({orderCheck})`, `usePanel.recheckOrder()`, `Panel.startPublish` önce sorar; sunucu `publish` de bekleyen siparişi bir kez sorar.
- Admin: Özet → **Bağlantılar** kartı (`components/admin/AdminConnections.tsx`): "Etsy mağazası: Bağlı / Bağlı değil / Ayarlanmadı",
  mod satırı, geri düşüş uyarısı, son Etsy hata kodu, Bağla / Yeniden bağla / Bekleyenleri kontrol et / Bağlantıyı kes (onaylı).
  Rotalar: `/api/admin/connections` (GET durum, POST `mail-test | etsy-connect | etsy-disconnect | etsy-recheck`; admin oturumu,
  aynı köken), `/api/etsy/callback` (state çerezi `bke_estate`, `Path=/api/etsy`, `SameSite=Lax`, 10 dk, tek kullanım; admin çerezi
  `SameSite=Strict` olduğundan Etsy dönüşünde gelmez → yetki yalnız state ile, dönüş "Yönetime dön" bağlantısıyla).

### E-posta (B)
- `nodemailer@10.0.16` (tam sürüm) eklendi. `lib/mail/config.ts` (`SMTP_HOST`, `SMTP_USER`, `SMTP_PASS` zorunlu; `SMTP_PORT` 465
  varsayılan + TLS, 587 → STARTTLS zorunlu; `SMTP_SECURE` isteğe bağlı; `MAIL_FROM` varsayılan `"BKE Studio" <SMTP_USER>`;
  `ADMIN_NOTIFY_EMAIL` varsayılan `SMTP_USER`; Gmail uygulama şifresinin boşlukları atılır), `transport.ts` (tek bağlantı/mesaj, 10/20 sn
  zaman aşımı, nodemailer günlüğü kapalı, hata yalnız `EAUTH` gibi kod + SMTP yanıt kodu), `templates.ts` (İngilizce alıcı e-postaları:
  `created` = özel link + "başka cihazda `<origin>/my` ile sipariş no + e-posta"; `signin` = /my'den istenen giriş linki; dükkân bildirimi
  ve test e-postası Türkçe; tek sütun, satır içi stil, metin parçası, yalnız http(s) link, kaçışlı içerik; fiyat/destek adresi uydurulmadı),
  `index.ts` (`SmtpEditLinkMailer`, `SmtpShopNotifier`, env seçimi önbellekli, `mailStatus` — adres maskeli).
- `lib/claim/mailer.ts`: `EditLinkMessage.kind?: 'created' | 'signin'` (G146 de ekleyebilir: aynı isteğe bağlı alan), `getEditLinkMailer()`
  = kayıtlı sahte (testler) → env'deki SMTP → `DisabledMailer`. Böylece `/start` "e-postayla gönderdik" metnine kendiliğinden geçer.
- `lib/claim/claim.ts`: alıcı e-postası ve (yalnız YENİ + `pending` sitede) dükkân bildirimi paralel gider; tekrar deneme (aynı claim
  token) ikinci bildirim yollamaz; hata talebi bozmaz.
- Admin kartı: "E-posta gönderimi: Açık / Ayarlanmadı", eksik değişken ADLARI, bildirim adresi maskeli, **Test e-postası gönder**
  (dükkânın kendi adresine; hata Türkçe ipucuyla: EAUTH → uygulama şifresi vb.).

### Testler
- `tests/g147-etsy-mail.test.ts` **14/14**: ayarlar/HKDF/başlık, kurallar, PKCE + state + şifreli saklama + tek kullanım, token önbelleği +
  yenileme + döndürülen refresh token + `invalid_grant`, bağlı değil/ayarsız → pending (Etsy çağrısı yok), 404/403 (yabancı vs. izinsiz)/429/
  5xx/ağ/zaman aşımı/401 → yeni token, `/start` etsy modu uçtan uca, admin yeniden kontrolü + panel yoklaması + Publish, manual'de Etsy
  çağrısı yok, SMTP ayarları, iki e-posta türü + kaçış + metin parçası, gerçek nodemailer kapalı porta (güvenli hata), `/start` + dükkân
  bildirimi (linksiz, tekrarda yok), admin rotaları (401, aynı köken, test e-postası, bağla → callback → kontrol → kes). Her akışta log'da
  token/anahtar/adres/link olmadığı denetlendi.
- `tests/claim.test.ts`: "etsy = uygulanmadı, 500" beklentisi → "etsy seçilir; bağlı değilken 201 + pending".
- `rm -rf .next && npx tsc --noEmit && npm test && npm run build`: typecheck temiz; `npm test` **1349 test, 1347 geçti, 0 hata,
  2 atlandı** (build'e bağlı `marketing-build`; build sonrası ayrıca 2/2); build + `trace-check` yeşil.
- Production build üzerinde tek seferlik duman testi (390 px, Playwright; repoya konmadı): admin Bağlantılar kartı (e-posta "Açık",
  Etsy "Bağlı değil" + geri düşüş uyarısı, yatay kaydırma yok), kapalı SMTP portuna test e-postası → "Sunucuya bağlanılamadı (ESOCKET)…",
  "Etsy mağazasını bağla" → `www.etsy.com/oauth/connect` (client_id, `/api/etsy/callback`, `transactions_r shops_r`, S256; shared
  secret URL'de yok); sunucu log'unda gizli değer / adres yok.

### Sahibin yapacakları (env ADLARI; değerler yalnız Vercel'de)
1. E-posta: Gmail 2 Adımlı Doğrulama → Uygulama şifreleri → `SMTP_HOST=smtp.gmail.com`, `SMTP_PORT=465`, `SMTP_USER`, `SMTP_PASS`
   (+ isteğe bağlı `ADMIN_NOTIFY_EMAIL`, `MAIL_FROM`) → yeniden yayın → admin "Test e-postası gönder".
2. Etsy: etsy.com/developers'ta uygulama → callback `https://<site>/api/etsy/callback` → `ETSY_API_KEY`, `ETSY_SHARED_SECRET`
   (`GOOGLE_TOKEN_KEY` zaten var) → Etsy onayı (günler–haftalar; bu arada `manual` sürer) → admin "Etsy mağazasını bağla" →
   `CLAIM_ORDER_VERIFICATION=etsy` → yeniden yayın → "Bekleyen siparişleri Etsy'de kontrol et". Ayrıntı: `docs/10` §3.
3. İlanlar yayınlanınca `platform/lib/etsy/listings.json` (`listing_id → tema id`).

### Sonra (açık işler)
- **Çok ürünlü siparişler:** kural hâlâ "bir sipariş = bir site". İki tasarım tek siparişte alınırsa ikinci site açılamaz (`order_used`);
  "sipariş KALEMİ başına bir site" (transaction_id) ve `/start`'ta kalem seçimi gerekir.
- **Belgeyi yeniden oku:** sahip uygulamayı açarken developers.etsy.com'daki Authentication / Requests / Rate limits sayfalarıyla
  `lib/etsy/config.ts` başındaki maddeleri karşılaştır (özellikle token uç noktasının `x-api-key` isteyip istemediği — biz gönderiyoruz —
  ve kapsam adları). Gerçek uygulamayla canlı bağlanma + bir gerçek makbuz okuma denenmedi (uygulama yok).
- **`buyer_email`:** Etsy'den alıcı e-postası erişimi (`email_r` + Etsy onayı) alınırsa e-posta karşılaştırması kendiliğinden devreye girer.
  O zamana kadar yalnız sipariş no + ödendi + bizim mağaza kontrol edilir: geçerli bir sipariş numarasını bilen yabancı o siparişin
  sitesini başlatabilir (bugünkü manual/off riskiyle aynı, daha dar).
- **`/my` girişi (G146):** "created" e-postası `<origin>/my` ile sipariş no + e-postayla devam etmeyi anlatıyor; bu G146 birleşince doğru
  olur. `signin` türü G146'nın göndermesi için hazır.
- RSVP bildirimi e-postası yok (kapsam dışı). Gmail kişisel hesap günlük gönderim sınırı; büyürse aynı değişkenlerle SMTP servisi.

## Günlük
- 2026-10-17 entegratör onayladı
