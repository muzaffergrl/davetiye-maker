---
id: G150
baslik: 477589f canlı yayın bulguları — PDF tarayıcısı ilk istekte 500, çeviri sayfalarında <html lang>, otomatik çeviri kalitesi
rol: claude-kod
durum: bitti
alan: claude-G150
oncelik: 1
bagimli: [G139, G144, G145]
yazar: [platform/lib/print/browser.ts, platform/lib/print/render.ts, platform/lib/print/api.ts, platform/lib/i18n/document-lang.ts, platform/lib/i18n/wedding-glossary.ts, platform/lib/i18n/auto-translate.ts, platform/components/i18n/, platform/app/layout.tsx, platform/app/edit/[slug]/page.tsx, platform/app/edit/[slug]/not-found.tsx, platform/app/my/page.tsx, platform/app/start/page.tsx, platform/app/start/not-found.tsx, platform/app/signin/page.tsx, platform/tests/g150-print-browser.test.ts, platform/tests/g150-i18n.test.ts, platform/tests/marketing-build.test.ts, gorevler/G150-canli-bulgular.md]
---

## Amaç
`477589f` yayınının (`dpl_BdTLgKpin8Pfse8cEzzDdapYxaS3`, docs/10 §2c) üç canlı bulgusu. Koordinatör:
session_01HP9ZrJ8mhZnigbvsvUQ4pR. Paralel G149 `lib/print/*` içindeki **yerleşim** verisine (tema başına metin kutuları) dokunuyor;
burada yalnız tarayıcı yaşam döngüsü ve render yeniden denemesi değişti (`layouts.ts`, `invitation.ts`, `site-pdf.ts`, `labels.ts`
dokunulmadı).

1. **Davetiye PDF'i ilk istekte 500** (`browserContext.newPage: Target page, context or browser has been closed`; yeniden deneyince iniyor).
2. **Çeviri satış sayfalarında `<html lang>` hep `en`** (`/tr`, `/de/designs` …).
3. **Otomatik çeviri kalitesi** (panel → Languages → "Translate automatically": MyMemory "Reception" → "Alım").

## Sonuç
**2026-10-17 · claude-G150 — durum: inceleme.** Dal `claude/g150-canli-bulgular` (`claude/zealous-fermi-hy1o40` üstüne). Yayın,
birleştirme, PR yok.

### 1. PDF tarayıcısı (`lib/print/browser.ts`, `render.ts`, `api.ts`)
- Neden: @sparticuz/chromium `--single-process` ile çalışır; donmuş/yeniden kullanılan örnekte önbellekteki Chromium ölür ama
  `browser.isConnected()` hâlâ `true` diyebilir → `newContext` geçer, `newPage` düşer.
- `withPrintBrowser(work)`: render "tarayıcı kapandı" sınıfı bir hatayla düşerse (`Target page, context or browser has been closed`,
  `Target closed`, `Page crashed`, `Browser closed` …; ya da hata sonrası `isConnected()` false) o tarayıcı atılır (paylaşılan
  önbellekten silinir, 3 sn sınırlı `close()`), yenisi açılır, render **bir kez** daha çalışır. İkinci düşüş → `PrintBrowserError`.
  Başka hatalar (gezinme zaman aşımı, eksik tema) yeniden denenmez, olduğu gibi geçer.
- `printBrowser()`: bağlı olmayan tarayıcı kullanılmaz; eşzamanlı istekler tek açılışı paylaşır; başarısız açılış önbellekte kalmaz.
- `renderPdfs`: her deneme kendi context'i; sayfa ve context `finally` içinde (5 sn sınırlı, hata yutan) kapanır — ölü context
  yeniden kullanılmaz.
- `api.ts`: `PrintBrowserError` → **503** `{code: 'pdf_unavailable', message: panel_failed}` + `Retry-After: 30` (panel aynı
  "biraz sonra tekrar deneyin" metnini gösterir; iç hata metni alıcıya gitmez). Günlük kota anlamı aynı: istek başına **bir** sayaç
  (`pdf:site:<id>`, render'dan önce); içerideki yeniden deneme sayılmaz.

### 2. `<html lang>` (`app/layout.tsx`, `components/i18n/DocumentLang.tsx`, `lib/i18n/document-lang.ts`)
- Kök layout `<html>`'i istemci bileşeni `DocumentHtml` ile çiziyor: dil `useSelectedLayoutSegments()`'ten —
  `(marketing)/i18n/<lang>/…` → o dil, `(marketing)/(en)/…` → `en`, `admin` → `tr`. Ön-render sırasında bilindiği için statik HTML
  doğrudan `<html lang="de">` taşıyor (sayfalar statik kaldı: build tablosunda `/i18n/[lang]` ●, `/` ○); dil değiştirince de güncelleniyor.
- Alıcı ekranları (panel, `/start`, `/my`, `/signin`, iki not-found): dil istek başına sunucuda seçiliyor (çerez / Accept-Language);
  kök layout bunu her sayfayı dinamik yapmadan okuyamaz → sayfa `<DocumentLang lang={lang} />` ile bildiriyor, tarayıcıda hidrasyondan
  sonra `<html lang>` o dil oluyor (sunucu HTML'inde `en`; bu sayfalar noindex). Sayfadan çıkınca sıfırlanıyor.
- Misafir siteleri (`/<slug>?lang=`) aynı sorunu taşımıyor: tema motoru `<html lang>`'i zaten yazıyor (G144; şifre sayfası da).

### 3. Düğün sözlüğü (`lib/i18n/wedding-glossary.ts`, `auto-translate.ts`)
- 153 satır, her biri en/tr/es/de/fr; elle, düğün diline uygun (ör. Reception → Resepsiyon / Recepción / Feier / Réception;
  Cocktail hour → Kokteyl / Cóctel / Sektempfang / Vin d'honneur; Black tie → Smokin ve gece elbisesi / Etiqueta rigurosa / Black Tie
  (Smoking) / Tenue de soirée). Kapsam: program etiketleri, kıyafet kuralları (tasarımların demo değerleri dahil), ulaşım/konaklama,
  hediye, LCV, menü ve diyet, çocuklar, demo SSS soruları/yanıtları, ev sahibi satırı. Site sözlüğüyle ("Tören", "Kıyafet kuralı",
  "Trauung" …) uyumlu.
- Sıra: tüm metin tek terim (büyük/küçük harf, boşluk, noktalama, `&`/`and` yok sayılır; BÜYÜK HARF ve sondaki `:`/`!`/`.` korunur;
  RSVP/FAQ gibi kısaltmalar bağırılmaz) → sözlük; terimlerin `:`/`·`/`|`/`/`/`&`/`,`/`and` ile birleşimi ("Dress code: Black tie") →
  parça parça; çok satırlı metinde sözlük satırları sözlükten, kalanlar makineden; diğer her şey (cümle) → mevcut çevirmen.
  Kaynak dil beş dilden herhangi biri olabilir (Türkçe yazılmış site → Almanca).
- Cümle içindeki terimler korunmuyor: cihaz çevirmeninde de MyMemory'de de "çevirme" işareti yok; yer tutucular bozuluyor. Sonuç
  yine taslak; çift onaylıyor.
- Sözlük vuruşu ağa gitmez (MyMemory kotası da harcanmaz).

### Testler
- `tests/g150-print-browser.test.ts` (8): sahte tarayıcı — "bağlı" görünen ölü tarayıcı atılır + yenisiyle PDF; context/sayfa
  kapanır, sonraki render yeni context ile aynı tarayıcıda; kopmuş tarayıcı yeniden kullanılmaz; iki düşüş → `PrintBrowserError`
  (üçüncü deneme yok); zaman aşımı yeniden denenmez; başarısız açılış önbelleğe girmez; route: ölü tarayıcı sonrası 200 + tek kota;
  iki düşüş → 503 + `Retry-After` + temiz mesaj + tek kota.
- `tests/g150-i18n.test.ts` (12): `routeLang`, alıcı dili deposu, layout/sayfa bağlantısı; sözlük: "Reception" 4 dilde, harf/noktalama,
  ters yön, birleşik etiketler, çok satır, `openTranslator` (servis ve cihaz) sözlüğü önce kullanıyor ve sözlük metni için istek
  atmıyor, **tüm tasarımların demo etiket/kıyafet/ev sahibi/SSS/form metinleri 4 dilde sözlükte**, tablo bütünlüğü.
- `tests/marketing-build.test.ts`: her yerleşik satış sayfasında `<html lang>` = sayfa dili (önceden `en` bekliyordu).

### Doğrulama
- `platform/`: `rm -rf .next && npx tsc --noEmit && I18N_STRICT=1 npm test && npm run build` → hepsi yeşil; `npm test`
  **1385 test: 1383 geçti, 0 kaldı, 2 atlandı** (atlanan 2 = `marketing-build`, `.next` silindiği için). Build sonrası
  `node --test tests/marketing-build.test.ts` → **2/2** (her sayfada `<html lang>` = sayfa dili).
- Yerel `next start` + Playwright (390 px): `/tr` → `tr`, `/de/designs` → `de`, dil seçiciyle `/fr/designs` → `fr`, `/` → `en`,
  `bke_lang=tr` çereziyle `/start` ve `/signin` → hidrasyondan sonra `tr`; konsolda hata/hidrasyon uyarısı yok.
- Gerçek Chromium'lu G139 testleri (davetiye 5×7/A5, site PDF'i) yeni render yolu ile geçti. Vercel'deki `--single-process`
  ölümünü burada yeniden üretmek mümkün değil; o yol sahte tarayıcıyla test edildi — canlı doğrulama yayından sonra (aşağıda).

## Sonra
- Yayından sonra canlıda: ilk davetiye isteği (soğuk + sıcak örnek) 200 mü; Vercel günlüğünde `[print] browser closed during render`
  satırı görülürse yeniden denemenin işlediği anlaşılır.
- `/tr`, `/de/designs` kaynağında `<html lang>`; panelde TR ile `document.documentElement.lang`.

## Günlük
- 2026-10-17 entegratör onayladı
