---
id: G146
baslik: "Create your website" + her cihazdan Etsy sipariş no + e-postayla devam (K46)
rol: claude-kod
durum: inceleme
alan: claude-G146
oncelik: 1
bagimli: [G095, G135, G144, G145]
yazar: [platform/lib/device-keys.ts, platform/lib/sites.ts, platform/lib/rsvp/couple.ts, platform/lib/claim/, platform/lib/panel/devices.ts, platform/lib/panel/remember.ts, platform/lib/panel/signin.ts, platform/lib/i18n/dict/, platform/app/api/my/, platform/app/api/edit/[slug]/devices/, platform/app/my/, platform/app/edit/[slug]/, platform/app/start/StartForm.tsx, platform/app/signin/page.tsx, platform/components/my/, platform/components/panel/DevicesCard.tsx, platform/components/panel/devices.module.css, platform/components/panel/views.tsx, platform/components/panel/Panel.tsx, platform/components/panel/panel.module.css, platform/components/marketing/Shell.tsx, platform/components/marketing/marketing.module.css, platform/next.config.ts, platform/scripts/trace-check.cjs, platform/scripts/reissue-edit-key.ts, platform/tests/g146.test.ts, platform/tests/claim.test.ts, platform/tests/blob-adapter.test.ts, platform/tests/g060-browser.ts, platform/previews/g146/, platform/README.md, docs/10_SITE_PLATFORMU.md, gorevler/G146-devam-sistemi.md]
---

## Amaç
Dükkân sahibi: satış sitesindeki "My website" düğmesi "Davetiye siteni oluştur" gibi olsun; içeride önce açıklama (önce Etsy'den
al, sonra buraya gel, kodunu gir); alıcı bir cihazda düzenleyip başka cihazda açınca **kaldığı yerden, sistemle, tamamen otomatik**
devam etsin (Etsy'den mesaj yok, dükkânın işi yok). Karar **K46** (koordinatör): Etsy'nin anında indirmesi herkese aynı PDF'i verir,
alıcıya özel kod olamaz → alıcının kodu **Etsy sipariş numarası**; **sipariş no + kullandığı e-posta = her cihazdan erişim**, hesap
ve şifre yok. Özel düzenleme linki kolaylık olarak kalır. Paralel: G147 (gerçek e-posta gönderici, Etsy sipariş doğrulayıcı, admin
kartları) — `lib/claim/verify.ts`'e, e-posta sağlayıcısına ve admin kartlarına dokunulmadı; `EditLinkMessage`'a yalnız
`kind?: 'created' | 'signin'` eklendi.

## Sonuç
**2026-10-17 · claude-G146 — durum: inceleme.** Dal `claude/g146-devam-sistemi` (taban main `a4344d9`). Yayın yok, main'e dokunulmadı.
Ayrıntılı tasarım: `docs/10_SITE_PLATFORMU.md` §3a.

### Yapılanlar
1. **Düğme adı:** satış sitesinde "My website" → **"Create your website"** (TR "Davetiye siteni oluştur", ES "Crea tu web", DE "Website
   erstellen", FR "Créez votre site"); mobil menüde "Create your website or continue editing", alt bilgide de. Rota `/my` aynı.
   360 px'de 5 dilde başlık taşmıyor (TR iki satıra sarıyor, 44 px).
2. **`/my` yeniden** ("Create your invitation website", mobil öncelikli, aynı BKE Studio görünümü): bu cihazdaki editörler (varsa) →
   "How it works" 3 adım (Etsy'den al — mağaza linki yalnız config'te gerçek Etsy URL'si varsa, şu an yer tutucu olduğu için satış
   sitesinin `/designs` sayfası; Etsy anında PDF verir; sipariş no + e-postayı gir) + sipariş numarasının yeri + "hesap/şifre yok, her
   cihazda aynı sipariş no + e-posta" → **tek form** → `POST /api/my/continue`. Site yoksa `/start?theme=…`'e (tema yoksa "Hangi tasarımı
   aldınız?" seçici) sipariş no + e-posta **sessionStorage** ile taşınır (URL'de yok). Katlı "Have your private edit link?" (yapıştır;
   `/my#link` açık gelir). "Email me a sign-in link" yalnız `getEditLinkMailer().enabled` iken. "Lost your edit link? Message the shop"
   ana yol olmaktan çıktı; altta küçük "Still stuck?" satırı.
3. **`/start` + kullanılmış sipariş:** aynı e-posta → `order_used` yerine cihaz anahtarıyla giriş (200 `existing`), editörde "This order
   already has a website — we opened it for you"; başka e-posta → 409, mesaj `/my`'ı gösterir + "Continue with your order number"
   linki. Claim-retry davranışı aynen (aynı token + aynı e-posta + 24 saat içinde taslak → yeni link).
4. **Cihaz anahtarları** (`lib/device-keys.ts`): `dv-` + 32 bayt, yalnız SHA-256; oluşturma zamanı + "iPhone · Safari" etiketi; en çok 10
   (en eskisi düşer). Site **belgesinde** (`devices`, `readSiteDoc/updateSiteDoc`; blob'da ETag koşullu) — site kaydının `updatedAt`'i
   oynamaz, açık paneller çakışma görmez. Anahtarın edit-key **kuşağına** bağlı olması + `reissueKeys`'te belge silme: admin "Yeni link",
   `scripts/reissue-edit-key.ts`, `/start` yeniden denemesi → tüm cihazlar anında düşer. **Tek kontrol:** `lib/sites.ts editAccess`
   (owner · shop · device) ← `editorAccess/authorizeEditor`; panel sayfası, panel API, foto/müzik, harita linki, Google Sheets, PDF indirme,
   RSVP liste/işlem/CSV/Excel, cihaz API'si hepsi buradan. Önizleme: panel jetonu `previewKeyHash`'ten (cihaz oturumunda da çalışır);
   paylaşılan önizleme linki değişmedi.
5. **Panel → Share → "Use on another device":** "<origin>/my'ı açın, sipariş no + e-posta girin", sipariş no, `<origin>/my` QR'ı
   (`lib/qr.ts`, sır yok), giriş yapılmış cihazlar ("This device" rozeti), **Sign out other devices** (kullanılan dışındaki cihaz
   anahtarları silinir; düzenleme linki değişmez; dükkânın G145 linki 403). Cihaz oturumunda "Your private edit link" altına not.
   Yardım metinleri ("I lost my edit link", "Can my partner edit too?") `/my` yolunu anlatıyor.
6. **Koordinatör eki:** geçersiz/eski edit link sayfası (`/edit/...` 404) → "Open your editor with your order number" kartı + iki düğme:
   **Continue with your order number** (`/my#continue`) ve **Paste your edit link** (`/my#link`) + kısa açıklama, 5 dilde. Panelin "This edit
   link no longer works" ekranı ve `/signin` de aynı yolu gösteriyor.
7. **Güvenlik:** `/api/my/continue` IP 10/15 dk + sipariş 6/saat (sipariş sayacı `/start` girişleriyle ortak; sayaç adı siparişin hash'i);
   `/api/my/signin-link` IP 5/saat + sipariş 3/saat. JSON-only, 1 KB, honeypot, `private, no-store`, `no-referrer`; e-posta karşılaştırması
   normalize + sabit zamanlı; uyuşmazlıkta tek genel mesaj (`no_match`). `/my` sayfasına `/edit` ile aynı güvenli başlıklar
   (frame-ancestors 'none', X-Frame-Options DENY, no-referrer). Anahtar/e-posta/tam sipariş no loglanmıyor (yalnız hata adı).
   `/my` artık tema listesi okuduğu için tema-okuyan rota listelerine eklendi (`next.config.ts`, `trace-check.cjs`).
8. **i18n:** 66 panel + 2 satış sitesi metni TR/ES/DE/FR; `I18N_STRICT=1` ile `npm test` yeşil; `g146.test.ts` G146 dosyalarının her
   metnini 4 dilde zorunlu tutuyor.

### Test
- `rm -rf .next && npx tsc --noEmit && I18N_STRICT=1 npm test && npm run build`: **1351 test, 1349 geçti, 0 kaldı, 2 atlandı** (build'e bağlı
  ikisi build sonrası ayrıca 10/10), typecheck ve build + trace-check yeşil.
- `tests/g146.test.ts` (16): iki adaptörde cihaz anahtarı (mint/bul/10 sınırı/yalnız hash/updatedAt oynamıyor/reissue sonrası ölü,
  ölü doğan anahtar), blob'da 8 eşzamanlı giriş kayıpsız, UA etiketleri, e-posta eşleşmesi, continue (eşleşme / site yok / uyuşmazlık /
  alanlar / honeypot / JSON / boyut / IP ve sipariş sınırı + `/start` ile ortak sayaç), cihaz anahtarıyla 15 panel rotası + önizleme
  jetonu + paylaşılan önizleme + yanlış anahtar 401, admin reissue / script → cihazlar düşer (dükkân linki düşürmez), `/start` kullanılmış
  sipariş girişi, sign-out-others (cihaz / ana anahtar / dükkân 403), e-posta giriş linki (503 / yalnız sahip adresine `signin` / hep
  aynı cevap / sınır), sessionStorage devirleri, 4 dil.
- Güncellenen testler: `claim.test.ts` (yayından/pencereden sonra aynı e-posta artık 200 giriş; paralel aynı e-posta), `blob-adapter.test.ts`
  (yarışta farklı e-postalar + aynı e-posta girişi), `g060-browser.ts` (yeni geçersiz-link metni; npm test'te koşmuyor).
- Tarayıcı (yerel `next start`, Playwright, scratch betiği, **22/22**): 360 px başlık 5 dilde; `/my` 360/390/430 taşma yok; yeni sipariş →
  seçici → `/start` önceden dolu (URL'de e-posta/sipariş yok) → site; ikinci cihaz (Android) `/my` → editör (`dv-` anahtar) → Share →
  cihaz listesi + `/my` QR'ı; `/start` aynı sipariş + e-posta → "we opened it for you"; Sign out other devices → diğer cihaz 401; uyuşmazlık
  → genel hata; geçersiz link sayfası (TR, 360) iki düğme; `/my#link`. Ekranlar `platform/previews/g146/`.

### Yapılmayanlar / notlar
- Canlı yayın ve gerçek telefon denemesi yok. E-posta gönderimi G147'de: sign-in link yolu sahte mailer'la test edildi.
- Dükkânın 72 saatlik linki (G145) alıcının anahtarını değiştirmediği için **cihazları düşürmüyor** (yorum: "reissue" değil; düşürse
  alıcı kendi telefonunda çıkış yapmış olurdu). İstenirse tek satır.
- Doğrulama kapalıyken sipariş no + e-postayı bilen girer (K46'nın bedeli). Ele geçirilmiş siparişte dükkân önce e-postayı düzeltmeli, sonra
  reissue (docs/10 §3a destek notu). Admin'de cihaz sayısı kartı yok (G147'nin admin kartlarıyla çakışmamak için).
- Aynı cihazdan tekrar tekrar giriş yeni anahtar üretir (10 sınırı + en eskisi düşer); "On this device" listesi tekrar girişi gereksiz kılar.
