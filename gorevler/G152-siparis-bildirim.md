---
id: G152
baslik: G146/G147/G150 devamları — çok ürünlü Etsy siparişi, çifte RSVP e-postası, admin cihazlar, sunucuda <html lang>
rol: claude-kod
durum: bitti
alan: claude-G152
oncelik: 1
bagimli: [G146, G147, G150]
yazar: [platform/lib/claim/claim.ts, platform/lib/claim/continue.ts, platform/lib/claim/verify.ts, platform/lib/etsy/verify.ts, platform/lib/etsy/client.ts, platform/lib/etsy/listings.json, platform/lib/data/types.ts, platform/lib/data/blob/index.ts, platform/lib/data/local/index.ts, platform/lib/sites.ts, platform/lib/mail/index.ts, platform/lib/mail/templates.ts, platform/lib/rsvp/notify.ts, platform/lib/rsvp/guest.ts, platform/lib/panel/notify.ts, platform/lib/admin/api.ts, platform/lib/i18n/document-lang.ts, platform/lib/i18n/dict/panel/, platform/app/api/rsvp/[slug]/route.ts, platform/app/api/edit/[slug]/notify/, platform/app/admin/layout.tsx, platform/app/admin/site/[id]/page.tsx, platform/app/(marketing)/layout.tsx, platform/app/edit/layout.tsx, platform/app/my/layout.tsx, platform/app/signin/layout.tsx, platform/app/start/layout.tsx, platform/app/global-not-found.tsx, platform/app/layout.tsx, platform/next.config.ts, platform/components/i18n/, platform/components/my/MyWebsite.tsx, platform/components/panel/ReplyNoticeCard.tsx, platform/components/panel/guests.tsx, platform/components/panel/api.ts, platform/components/admin/AdminSite.tsx, platform/tests/g152.test.ts, platform/tests/g147-etsy-mail.test.ts, platform/tests/g150-i18n.test.ts, platform/tests/marketing-build.test.ts, docs/10_SITE_PLATFORMU.md, gorevler/G152-siparis-bildirim.md]
---

## Amaç
G146 (her cihazdan devam), G147 (Etsy doğrulama + SMTP) ve G150 (canlı bulgular) görev dosyalarının "Sonra / açık" maddeleri.
Koordinatör: session_01HP9ZrJ8mhZnigbvsvUQ4pR. `lib/print/*`, `themes/*`, `collections/*`, durum dosyalarına dokunulmadı.

## Sonuç
**2026-10-17 · claude-G152 — durum: inceleme.** Dal `claude/g152-siparis-bildirim`. Yayın, main'e birleştirme, PR yok.

### 1. Çok ürünlü Etsy siparişleri
- `lib/etsy/verify.ts designUnits`: makbuzun tasarım birimleri = satırların `quantity` toplamı (eksik/garip adet = 1); eşlenmiş
  ve eşlenmemiş satırlar tasarım sayılır; `listings.json` → yeni `services` eşlemesi (`listing_id → setup | custom_design |
  extra_revision`) **hiç sayılmaz**. En az 1, en çok `MAX_ORDER_SITES` = 10. `evaluateReceipt` `verified` / `pending` sonucuna
  `units` ekler (tasarım kontrolü aynen: eşlenmiş başka tasarım → `theme_mismatch`).
- `lib/claim/verify.ts orderUnits(check)`: `units` yalnız Etsy makbuzu okunduysa; `off`, `manual`, Etsy bağlı değil → **1** (eski kural).
- `lib/claim/claim.ts`: sipariş kilidi içinde sıra: doğrulama → siparişin siteleri → **claim-retry önce** (aynı token → aynı site, yeni
  link; birim harcamaz) → boş birim varsa yeni site (`orderSlot` = ilk boş birim) → hepsi doluysa G146 davranışı (aynı e-posta →
  cihaz anahtarıyla giriş, **başlatılan tasarımın sitesi** tercih edilir; başka e-posta → 409 `order_used`). Sipariş sayacı / IP
  sınırları / site sınırları aynen.
- Depolama garantisi: `NewSite.orderSlot` / `SiteRecord.orderSlot` (yalnız ≥ 2 iken yazılır; eski kayıtlar = birim 1). Blob
  adaptörü birim başına sipariş dizini: `orders/<no>.json` (birim 1, eski ad), `orders/<no>~<n>.json`; `allowOverwrite:false` ile
  iki örnek aynı birimi alamaz (`OrderRefTakenError`). Claim yarışı kaybederse siparişi yeniden okur, kaybettiği birimi bir kenara
  koyup **sonraki boş birimi** alır (listeleme gecikse bile döngü sınırlı); boş birim kalmadıysa giriş / `order_used`.
  `findSitesByOrderRef` birim 1'i doğrudan okur + `orders/<no>~` önekini listeler (aynı rakamlarla başlayan başka sipariş karışmaz);
  `deleteSite` kendi biriminin dizinini bırakır. Yerel adaptörde dizin yok (süreç içi kilit yeterli, değişmedi).
- `/my` (`lib/claim/continue.ts`): aynı e-postanın birden çok sitesi → `200 {next: "choose", sites: [{slug, names}]}` (anahtar yok,
  yalnız o e-postanın siteleri); sayfa küçük seçici gösterir ("Which website do you want to open?" — isimler + `/adres` + "Open
  editor"), seçilen `{slug}` ile tekrar POST → yalnız o site için cihaz anahtarı. Başkasının (aynı siparişte başka e-posta) sitesi
  `slug` ile istenirse 403 `no_match`. Her deneme aynı IP / sipariş sayaçlarına sayılır. "Email me a sign-in link": eşleşen her site
  için ayrı e-posta.
- Admin "Yeni sipariş" (`lib/admin/create.ts`) bilerek değişmedi: dükkânın elle açtığı site hâlâ siparişin tek sitesi olmalı.

### 2. Çifte RSVP bildirimi ("Email me when a guest replies")
- Panel → Guests → **Reply emails** kartı (`components/panel/ReplyNoticeCard.tsx`, Google Sheets kartının altında): anahtar
  varsayılan kapalı; kart yalnız sunucu "e-posta gönderilebilir" dediğinde görünür (`GET /api/edit/<slug>/notify` → `available`,
  SMTP ayarlıyken — G146'nın giriş linki gibi). Adres maskeli gösterilir ("av***@example.com").
- `POST /api/edit/<slug>/notify {enabled}` (`lib/panel/notify.ts`): sahip ve cihaz anahtarı değiştirir; dükkân linki görür ama
  değiştiremez (403); SMTP yokken açma 503; sitede sahip e-postası yoksa 409; JSON-only, 256 B.
- Gönderim (`lib/rsvp/notify.ts`): RSVP rotası yanıtı kaydettikten sonra `after()` ile; yalnız sayılan misafir yanıtı (tutulan /
  çiftin elle eklediği yanıt hiç gitmez). Alıcı = sitenin **kayıtlı** sahip e-postası. İçerik (İngilizce, G147 şablonlarıyla aynı
  görünüm, `rsvpReplyEmail`): misafir adı, Attending / Not attending, kişi sayısı, en çok 5 kısa cevap, kısa not, site adresi ve
  **anahtarsız** `<origin>/my` düğmesi ("Open your editor" → sipariş no + e-postayla girin, Guests). Misafir metni kaçışlı, konu tek
  satır.
- Sınır: site başına UTC günü başına **20 e-posta**; fazlası yalnız sayılır, bir sonraki e-posta "N more replies arrived since our
  last email (we send at most 20 reply emails a day)" der. Sayaç gönderimden **önce** site belgesinde (`rsvp-notify`, ETag koşullu)
  ayrılır → paralel yanıtlar sınırı aşamaz. Belge site kaydında değil (açık panel çakışma görmez); kapalı sitede yanıt başına yalnız
  bir okuma, yazma yok.
- Hata: SMTP hatası `{sent:false}`, log'da yalnız `[mail] rsvp notice: <kod>`; misafirin cevabı ve kaydı etkilenmez. İçerik, adres,
  link loglanmaz.

### 3. Admin: cihazlar
- Admin site sayfası → Destek işlemleri → **Giriş yapılan cihazlar**: sayı, etiket ("iPhone · Safari" / "Bilinmeyen cihaz"), tarih,
  nasıl girdiği (/my formu · başlatma sayfası · e-postadaki giriş linki); salt okunur, anahtar/hash yok (`AdminSiteDetail.devices`).
- **Tüm cihazlarda oturumu kapat (N)** (onaylı) → `POST /api/admin/sites/<id>/devices-signout` → tüm cihaz anahtarları silinir;
  alıcının özel düzenleme linki ve dükkân linki çalışmaya devam eder. Metinler Türkçe.

### 4. Sunucu HTML'inde `<html lang>` (alıcı ekranları)
- **Yapıldı, statik sayfalar statik kaldı.** `app/layout.tsx` kaldırıldı; kök layout'lar ayrıldı:
  satış sitesi `app/(marketing)/layout.tsx` (`<DocumentHtml scope="(marketing)">`, dil rotadan — build tablosunda yine ○/●),
  admin `app/admin/layout.tsx` (`<html lang="tr">`), alıcı ekranları `app/{edit,my,signin,start}/layout.tsx` →
  `components/i18n/RootDocument.tsx BuyerRootLayout` (`uiLocale()` ile aynı seçim: `bke_lang` çerezi, yoksa Accept-Language →
  `<DocumentHtml fallback={lang}>`). Sayfalardaki `<DocumentLang>` kaldı: tarayıcıda dil değişince `<html lang>` güncellenir.
  Ortak metadata/viewport/gövde `RootDocument.tsx`'te. Eşleşmeyen adresler: `app/global-not-found.tsx` (`<html lang="en">`,
  `experimental.globalNotFound: true`). Bedel: kök layout'lar arasında (ör. satış sitesi → `/my`) gezinme tam sayfa yüklemesi.

### Testler
- `tests/g152.test.ts` (15): tasarım birimleri (adet, servis ilanları, sınırlar, `evaluateReceipt`, `orderUnits`); iki adaptörde 2
  birimlik sipariş → 2 site, sonra aynı e-posta giriş (o tasarımın sitesi) / başka e-posta `order_used`, asla 3. site; off/manual tek
  site; claim-retry birim harcamaz; blob'da birim dizini (aynı birim iki örnekten reddedilir, silme birimi boşaltır, önek karışmaz);
  yarışı kaybeden claim sonraki birimi alır; `/my` seçici (yalnız o e-postanın siteleri, anahtarsız) → seçilen site açılır, yabancı
  site 403, tek site doğrudan; giriş linki site başına; `reserve()` günlük sınır + "N more"; e-posta şablonu (kaçış, tek satır konu,
  İngilizce); bildirim varsayılan kapalı / açık → kayıtlı adrese, anahtar yok / tutulan ve çiftin yanıtı yok / paralel 5 yanıtta sınır /
  kapat / SMTP hatası log'da veri yok / SMTP yok / adres yok; RSVP rotası (e-posta yanıttan sonra; hata yanıtı bozmuyor); panel
  rotası (503, sahip/cihaz, dükkân 403, 401, 400, 409); admin cihaz listesi + toplu çıkış (cihazlar 401, düzenleme linki 200); 4 dil.
- Güncellenen: `g147-etsy-mail.test.ts` (`units` alanı; iki tasarım satırı artık 2 birim), `g150-i18n.test.ts` (kök layout yapısı),
  `marketing-build.test.ts` (kaldırılan `app/layout.tsx` yolu).
- Komut sonuçları ve tarayıcı denetimi: aşağıda "Doğrulama".

### Doğrulama
- `platform/`: `npm ci && rm -rf .next && npx tsc --noEmit && I18N_STRICT=1 npm test && npm run build` → hepsi yeşil;
  `npm test` **1400 test: 1398 geçti, 0 kaldı, 2 atlandı** (atlanan 2 = `marketing-build`, `.next` silindiği için); build +
  `trace-check` yeşil; build tablosunda satış sayfaları yine statik (`/` ○, `/i18n/[lang]/…` ●), alıcı ekranları ƒ.
- Build sonrası `node --test tests/marketing-build.test.ts`: 1/2 — `<html lang>` testi geçti; diğeri
  `/es|de|fr/designs/crimson-rose-atelier: description 180–189` (meta açıklaması uzun). Bu satış kopyası (G142 / market sözlüğü),
  bu görevde dokunulmadı; içerik sahibine not.
- Yerel `next start` + Playwright (scratch betiği, repoda değil) **22/23**: sunucu HTML'inde `<html lang>` — `/start` çerez `tr` → tr,
  Accept-Language `de` → de, hiçbiri → en; `/my` fr / es; `/signin` de; `/edit/<slug>?k=…` es; `/` en (çerez tr olsa da), `/tr` tr,
  `/de/designs` de; `/admin` tr; `/a/b/c/d` 404 + en (global-not-found). `/my` 360 px: iki siteli sipariş → seçici iki siteyi
  gösteriyor, yatay kaydırma yok, seçilen site `dv-` anahtarıyla açılıyor, sayfa hatası yok. Panel (TR, 390 px, SMTP ayarlı): Guests
  → "Yanıt e-postaları" kartı kapalı başlıyor, anahtar açıyor, maskeli adres, yatay kaydırma yok; sunucu log'unda adres/anahtar yok.
  Ekranlar `platform/previews/g152/`.
- **Kalan 1/23:** geçersiz edit linki (`/edit/<slug>` → `notFound()`) sunucuda Next'in hata kabuğunu (`<html id="__next_error__">`,
  `lang` yok) akıtıyor; not-found içeriği istemcide çiziliyor ve hidrasyondan sonra `lang="tr"` (Playwright ile doğrulandı). Bu,
  dinamik sayfadan atılan `notFound()` için Next 16'nın davranışı; kök layout'tan bağımsız. Düzeltmek için sayfanın `notFound()`
  yerine 404 kartını kendisi çizmesi gerekir (HTTP durumu 200 olur) — yapılmadı. `/start` tasarım-incelemede 404'ü de aynı yol.

## Sonra
- Etsy ilanları yayınlanınca `platform/lib/etsy/listings.json`: `listings` (tasarım) ve `services` (kurulum / özel tasarım / ek
  revizyon). Doldurulmazsa servis satırı da bir site sayılır (zararı: fazladan bir boş birim).
- Birim tasarıma bağlı değil: 2 birimlik siparişte aynı tasarımdan iki site de açılabilir (eşlenmiş ilanlarda yalnız siparişteki
  tasarımlar). Tasarım başına sayım istenirse `designUnits` tasarım bazına çevrilir.
- `/my`'de "bu siparişle ikinci siteyi başlat" kısa yolu yok: ikinci tasarımın Etsy PDF'indeki `/start?theme=` linki (ya da
  seçicideki tasarım) kullanılır.
- RSVP e-postası gerçek SMTP ile gönderilmedi (sahte taşıyıcı); canlıda SMTP açılınca bir deneme yanıtıyla bakılmalı.

## Günlük
- 2026-10-17 entegratör onayladı
