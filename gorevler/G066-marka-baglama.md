---
id: G066
baslik: Satış sitesi + panel BKE Studio marka tasarımına geçer (GM04/GM05 comp'ları, ad, logo, favicon, renk/yazı)
rol: claude-kod
durum: alindi
alan: claude-G066
oncelik: 1
bagimli: [GM02, GM04, GM05, G060, G061]
yazar: [platform/lib/marketing/, platform/components/marketing/, platform/components/panel/, platform/app/(marketing)/, platform/app/layout.tsx, platform/app/edit/, platform/public/brand/, platform/tests/, platform/previews/g066/, docs/16_PANEL_V2.md]
---

## Amaç
K26/K27: ad **BKE Studio**, kimlik GM01 yön C. GM02 kiti hazır (`brand/`, `platform/public/brand/`). Satış sitesi (G061) ve
platform hâlâ `[BRAND]` yer tutucusu ve geçici favicon kullanıyor.

## Kapsam genişledi (2026-10-14)
Kullanıcı: "BKE Studio'yu da ekleyelim; logo, isim, marka tasarımına uygun bir website ve panel tasarımı yapalım." GPT comp'ları:
satış sitesi `brand/ui/site/` (GM04), panel `brand/ui/panel/` (GM05). Bu görev ikisini de comp'lara göre yeniden giydirir:
renk/yazı token'ları (`brand/tokens.json`; Archivo / Montserrat / DM Sans, Google Fonts — repoya font yok), başlık hiyerarşisi,
kartlar, düğmeler, çipler, alt menü, masaüstü düzeni. **İşlev kaybı yok:** bütün mevcut testler (panel, g060, claim, rsvp, final-smoke,
satış sitesi) geçer; erişilebilirlik (kontrast ≥ 4.5:1, dokunma ≥ 44 px) korunur. Comp'taki metin değil, ürünün gerçek metni/linki
kullanılır (alan adı yok — `bkestudio.com` yalnız comp'ta; link `config`'ten). Önizleme: 390 + 1280 px önce/sonra.

## Yapılacaklar (GM02 Sonuç'undaki bağlama listesi + giydirme)
1. `platform/lib/marketing/config.ts`: `brand.name = 'BKE Studio'`, logo yolu. Alan adı, fiyat, destek e-postası **yer tutucu kalır**.
2. `components/marketing/Shell.tsx`: başlıkta `bke-logo-horizontal-anchor.svg`, altbilgide `-reverse` (SVG'leri `public/brand/`'a kopyala).
3. `app/(marketing)/layout.tsx` ve kök `app/layout.tsx`: `/brand/icon.svg`, `/brand/favicon.ico`, `/brand/apple-touch-icon.png`; istenirse manifest (192/512).
4. Satış sitesi renk/yazı token'ları `brand/tokens.json` ile uyumlu mu bak; uyumsuzsa yalnız token düzeyinde hizala.
5. "Made with BKE Studio" rozeti misafir sayfalarına **bu görevde eklenmez** (hedef link kararı yok; docs/15 P1).
6. Testler, build, satış sitesi 390/1280 önizlemesi (`platform/previews/g066/`).

## Sıra (2026-10-14, entegratör)
İki aşama: **A — satış sitesi** (hemen; panel koduna dokunmaz) → **B — panel** (G069 RSVP v2 ve G076 site şifresi main'e
girdikten sonra; aynı bileşenlere dokundukları için). Aynı görev, iki ayrı ajan turu; Sonuç'a iki bölüm.

## Bitti sayılması için
- [x] Satış sitesinde ad, logo ve favicon BKE Studio; testler ve build geçti; önizleme görüntüleri (Kısım A)
- [x] Panel BKE Studio görünümünde ve K29 ile sadeleşti; testler, build ve panel tarayıcı testleri geçti; önizleme (Kısım B)

## Sonuç

### Kısım A (satış sitesi) — 2026-10-14, claude-G066

**Durum:** satış sitesi BKE Studio comp'larına (`brand/ui/site/u1_*`) göre yeniden giydirildi, yerelde test edildi.
**Yayınlanmadı.** `launched: false` ve bütün yayın kapıları aynen duruyor. Panel (Kısım B) bekliyor; `components/panel/` ve
`app/edit/` açılmadı.

**Ne değişti**
- Ad ve logo: `lib/marketing/config.ts` → `brand.name = 'BKE Studio'`, `brand.logo = '/brand/icon-512.png'` (JSON-LD
  Organization). Alan adı, fiyat, destek e-postası, yanıt süresi, Etsy linkleri ve dükkân adı **yer tutucu kaldı**.
- `public/brand/`: başlık için `bke-logo-horizontal-anchor.svg`, koyu altbilgi için `-reverse.svg` (`brand/svg/`'den
  aynen), GPT'nin `pattern_tile.png`'si (değiştirilmeden), `site.webmanifest` (192/512). Logolar `<img>` ile SVG'den gelir,
  fontla yeniden yazılmaz. Marka dosya yolları ve renkler tek yerde: `lib/marketing/brand.ts`.
- Favicon: kök `app/layout.tsx` artık `favicon.ico` + `icon.svg` + `apple-touch-icon.png` + manifest veriyor (satış sitesi,
  `/start`, panel dahil); varsayılan başlık "BKE Studio". Pazarlama layout'undaki geçici lucide ikonu kaldırıldı.
  `public/marketing/favicon.svg` artık kullanılmıyor (yazar dışı, silinmedi).
- Giydirme (`components/marketing/marketing.module.css` baştan, `Shell`, `Demo`/HeroDemo, `DesignCard`, `ui`, sayfalar):
  `tokens.json` renkleri (patlıcan başlık/düğme, kâğıt zemin, ink metin; altın ve lavanta yalnız çizgi, çip çerçevesi,
  işaret), Archivo 800 başlık, Montserrat 300 etiket/giriş, DM Sans gövde (`next/font`, repoya font yok). Başlık (logo +
  menü / nav + See designs), hero (telefonda metin → poster → çipler → tam genişlik düğme → gerçek bilgi şeridi), altın kıl
  çizgi ayraçlar, "How the opening works" (gerçek zarf → gerçek açılış videosu → gerçek ana sayfa), 4 sayfa 2×2 kart,
  "Made to edit", RSVP sayı kutuları, numaralı adımlar, altın çerçeveli tasarım kartları ("Live demo"), tasarım sayfası
  (breadcrumb, poster, 4 küçük sayfa ekranı, What you can edit, telefonda yapışkan eylem çubuğu), koyu final CTA ve
  altbilgi. Ürün görselleri yine yalnız gerçek tema/panel ekranları ve gerçek açılış kaydı.
- Test sırasında bulunan hata: ad gerçek olunca rehberlerin Article JSON-LD'sinde yazar Organization'ın `@id`'si yoktu →
  `lib/marketing/schema.ts` düzeltildi.

**Comp'tan bilerek ayrılanlar**
- Masaüstü hero'daki açılı renk düzlemleri çizilmedi (K21). Yerine posterin arkasında GPT'nin `pattern_tile.png`'si,
  yuvarlak köşeli düz bir blokta zemin görseli olarak (yalnız ≥ 1024 px).
- Comp metni kullanılmadı. Comp'taki 24/6/30 yerine panel demo ekranındaki gerçek demo toplamları (4 / 1 / 5),
  "Example totals from the demo panel (fictional guests)" etiketiyle (`facts.ts` `DEMO_REPLY_TOTALS`; G069 panel ekranını
  değiştirirse güncellenmeli). 4 sayfa kartı için kısa açıklamalar `facts.ts`'e eklendi (`SITE_PAGES.short`).
- Tasarımlar sayfasında stil filtresi yok (2 canlı tasarım; filtre 6'dan sonra, docs/14 §6.2). Comp'taki 6 tasarım değil,
  canlı olan 2 tasarım listelenir.
- Telefonda "How it works" adımları dikey (açıklamalar 4 sütuna sığmıyor); ≥ 700 px'te comp gibi yatay ve altın çizgili.
  "Made to edit" telefonda önce liste, sonra panel ekranı (gerçek maddeler uzun); ≥ 600 px yan yana.
- Kartta stil satırı yalnız geniş kartta (≥ 300 px); renk noktaları karttan kalktı (tasarım sayfasında duruyor).
  Menüde Guides kaldı (comp'ta yok; iç link kuralı).

**Testler (yerel production build)**
- `npm test` 458/458 (build testleri dahil, atlanan yok); origin/main birleştirmesinden (G076 vb.) sonra 481/481;
  `npm run typecheck`; `npm run build` + trace-check temiz.
- `tests/marketing-browser.ts` 283/283. Eski 170 kontrolün hepsi + yeni: her sayfa 320 px'te yatay kaydırma/kesilme yok;
  390 px'te her sayfada axe-core 4.13.0 serious/critical ihlal 0 (kontrast dahil) ve dokunma hedefi ≥ 44 px (metin içi
  linkler hariç); logo, favicon ve manifest kontrolleri. Sonuç: `platform/previews/g066/after/checks.json`.
- Performans (aynı oturum, önce = main 72183a4; `platform/previews/g066/perf_before_after.json`):
  - docs/14 §9.8 lab (CDP, CPU 4×, yavaş 4G): LCP ana sayfa 1800 → 1516 ms, tasarım sayfası 1760 → 1528, rehber
    1088 → 1216; CLS 0; aktarılan 300 → 357 / 300 → 389 / 198 → 234 KB (bütçe 600). Font 37 → 67 KB.
  - Lighthouse 13.5.0 (mobil, 2 koşu; geçici kurulum, repoya girmedi): performans ana sayfa 97–98 → 90, tasarım 91–96 →
    88–97, rehber 98 → 87–88, SSS 97–98 → 93; erişilebilirlik hepsinde 100. Düşüşün ana kaynağı Lighthouse'un ölçtüğü
    ~1,2 s ilk boyama (önce ~0,15 s). Aynı Chromium ile Playwright'ta ilk boyama 0,14–0,43 s; yeniden üretilemedi. Font
    ön yüklemesini kapatmak ve `display: optional` denendi, değişmedi. **Açık iş.**
  - §9.8'deki "2 aile, ≤ 4 dosya" font bütçesi aşıldı: 3 aile (marka kararı), Latin için 3 dosya.

**Önizleme:** `platform/previews/g066/before/` ve `after/`: home, designs, blush-garden-rose, how-it-works, pricing, faq ×
390 / 1280 (tam sayfa). `after/`'da ayrıca ilk ekran PNG'leri ve yapışkan çubuk.

**Yapılmayanlar / açık**
- Yayın yok. Bu commit main'e gidiyor; main otomatik yayınlanıyorsa vercel.app adresinde "BKE Studio" adı görünür
  (sayfalar `noindex`). Adın kesin onayı (K26) hâlâ açık.
- `docs/14_SATIS_SITESI.md` yazar dışı, güncellenmedi: §9.6 font notu (Cormorant/Inter yerine Archivo/Montserrat/DM Sans)
  ve §14 durum tablosu entegratörde.
- Panel tarayıcı testleri (g060-browser vb.) koşulmadı; kök layout'a yalnız ikon, manifest ve başlık eklendi.
- Gerçek telefonda deneme yok.

### B — panel (2026-10-14, claude-G066)

**Durum:** panel (`/edit/<slug>`) BKE Studio görünümünde (GM05 comp'ları `brand/ui/panel/u2_*`) ve K29 kararıyla sadeleşti.
Yerelde production build ile test edildi. **Yayınlanmadı** (deploy entegratörde). Sunucu, içerik şeması, doğrulama, yayın anlamı
ve düzenleme hakkı kuralları değişmedi; değişen yalnız panelin görünümü ve bilgi mimarisi.

**1. Marka giydirmesi** (`components/panel/`, ilk commit)
- Token'lar `panel.module.css`'in başında: patlıcan #2B1526 (başlık, birincil düğme, tek vurgu), kâğıt #FAF7F0 / #EDE5D7 zemin,
  ink #202020 metin, ikincil metin #5C5560 (her zeminde ≥ 5,7:1), kontrol çerçevesi #8C7F8A (≥ 3:1). Altın ve lavanta yalnız
  logoda; açık zeminde metin rengi olarak hiç yok.
- Yazı: Archivo 800 başlık, Montserrat 300 geniş etiket, DM Sans gövde — `components/panel/fonts.ts` (`next/font/google`,
  repoya font dosyası yok); sheet, bildirim ve 404 de aynı sınıfı alır.
- Logo: `components/panel/Brand.tsx` → `/brand/bke-logo-horizontal-anchor.svg` (dar ekranda ve değişiklik çubuğu varken
  monogram `public/brand/bke-monogram-small-anchor.svg`, `brand/svg/`'den aynen kopya). Logo `<img>`, fontla çizilmedi.
- Kartlar çerçevesiz, yumuşak gölge; alt menü kâğıt şerit + aktif sekmede patlıcan alt çizgi; rozetler sadeleşti ("New" koyu,
  Coming/Not coming nokta); ≥ 960 px iki sütun.

**2. K29 sadeleştirme** (ayrıntı `docs/16_PANEL_V2.md` §0b; saf mantık `components/panel/pages.ts` +
`tests/g066-panel-pages.test.ts`)
- Kurulum 3 adım: isimler + tarih (tam adlar isteğe bağlı açılır bölümde; hak kuralı isimlerin altında bir kez) → fotoğraf
  (kapak yeri; diğerleri "More photos" açılır bölümünde, isteğe bağlı) → yayınla. Son adımda örnek metin listesi/sayısı yok,
  tek sakin satır. Eski `#setup/4…6` adresleri 2/3'e düşer.
- Edit 6 sayfa: Us · Day & place · Photos · Our Story · Details · RSVP. Satırlarda örnek/kilit rozeti yok, yalnız hata sayısı.
  Eski bölüm adresleri (`#edit/venue`, `#edit/faq` …) ilgili sayfayı açıp o bölüme kaydırır. İsim/tarih hakkı yalnız Us ve
  Day & place editörlerinde (`data-rights-card`); Home'daki hak kartı kalktı. Alan içindeki "Sample" işareti sessiz griye döndü.
- Yayımlanmamış değişiklik varken yapışkan çubuk "Unpublished changes: n · Review · Publish"; Review yayındaki kopya ile
  taslağı karşılaştırıp değişen sayfaları listeler (`app/edit/[slug]/page.tsx` artık `site.publishedContent`'i panele verir).
  İlk yayın eskisi gibi kurallar + notlar sheet'iyle; sonrakiler doğrudan.
- Home: "Your website is N% ready" + ilerleme çubuğu + yalnız sıradaki 3 iş (tek dokunuşla doğru editöre); örnek metin
  hatırlatmaları burada.
- Share: önce link + QR (gerçek `QrCode`); "Guest password" (G076, varsayılan Off) ve "Your private edit link" açılır bölüm.
- Guests (G069) yalnız görsel dil. Masaüstü: solda düzenleme, sağda sabit canlı önizleme (≥ 1280'de ray kalktı).
- İşlev kaybı yok: haklar ve sunucu zorlaması, arşiv kapıları, önizleme token'ı, misafir şifresi, RSVP v2, CSV/yazdırma,
  fotoğraf kırpma, çevrimdışı yedek aynen; ilgili tarayıcı testleri yeni akışta koşuyor.

**3. Satış sitesindeki panel ekranları** (entegratör notu)
- `public/marketing/panel/` yeniden çekildi: `panel`, `crop`, `preview`, `share`, `replies`, `questions` (G059 çekimiyle aynı
  ayar: 390 × 844, DPR 3, kurgusal Elena & Marco / Clara & Julian verisi, QR bulanık; 320/480/640 WebP, `assets.json`'daki
  640 × 1385 ölçüsü aynı, `node scripts/marketing-assets.ts --check` ok). Artık BKE Studio panelini ve G069 Guests ekranını
  gösteriyorlar.
- Demo toplamları değişti: Guests ekranı "9 Guests coming · 1 Not coming · 5 Replies" → `lib/marketing/facts.ts`
  `DEMO_REPLY_TOTALS = { coming: 9, notComing: 1, replies: 5 }` (eskisi 4/1/5, yanıt sayısıydı) ve yorumu.
- `start` ve `editLink` (/start ve kayıt sonrası ekran) çekilmedi: panel değil, kodları bu görevde değişmedi (hâlâ eski yeşil
  görünüm; aşağıda açık iş).
- `tests/marketing-browser.ts` 283/283; pazarlama birim testleri `npm test` içinde geçti.

**Testler** (yerel production build, son kod)
- `npm test` 500/500 (yeni `tests/g066-panel-pages.test.ts` 5 test dahil, atlanan yok); `npm run typecheck`; `npm run build`
  + trace-check temiz.
- Tarayıcı (hepsi son build'de, 0 hata): panel-browser 77/77, g060 151/151, g069 60/60, g076 51/51, final-smoke olive-ivory
  45/45 ve blush-garden-rose 45/45, g051 44/44, g055 138/138, claim 50/50, rsvp 25/25, marketing 283/283.
- Test uyarlamaları kontrol azaltmadı: g060 yeni akışı baştan sona yürüyor (3 adım, açılır bölümler, sakin satır, hazırlık
  kartı, 6 sayfa, hak yeri, değişiklik çubuğu + Review, eski `#setup/6` adresi, Share açılır bölümleri, arşivde hak, iki sütun);
  panel-browser (değişiklik çubuğu + Review, yavaş yayında "Publishing…"), g076 (şifre bölümü kapalı başlar, Off → On), g051
  (sorular Details sayfasında), g055 (reload öncesi sheet'in kapanmasını bekler).
- 320 / 360 px'te yatay taşma yok (ayrı ölçüm); kontrast değerleri hesapla kontrol edildi (bkz. 1).

**Önizleme:** `platform/previews/g066/panel/` — `before_*` (main, K29 öncesi panel) ve `after_*`, 390 ve 1280 px: kurulum
adımları (önce 6, sonra 3), home, edit listesi, bir editör (Day & place), değişiklik çubuğu + Review (`after_changes_review_*`),
share kapalı ve açık (`after_share_open_*`), guests.

**Açık / yapılmayanlar**
- Gerçek telefonda deneme yok; ekran okuyucu ile elle deneme yok (yalnız aria yapısı ve otomatik kontroller).
- GPT comp'u olmayan ekranları aynı dilde ben tasarladım: değişiklik çubuğu + Review sheet'i, Home hazırlık kartı, Day & place'in
  üç bölümlü sayfası, Share açılır bölümleri, sihirbazın 3. adımı. İstenirse GM05'e ek comp turu.
- Kurulum 3. adımı hâlâ uzun (örnek tarih kapısı + önizleme + kurallar kutusu); işlev gereği kaldı, comp'la kısaltılabilir.
- `platform/README.md`'deki panel font/bilgi mimarisi notları ve `app/signin` (panel CSS'ini kullanıyor, marka font sınıfı yok;
  sistem fontuna düşüyor) yazar dışı, güncellenmedi.
- **Pazarlama görsellerinin kaynağı:** `scripts/marketing-assets.ts` panel WebP'lerini
  `collections/03_Blush_Garden_Rose/package/shots/{b04_panel_top,b06_panel_crop,b08_panel_preview,b10_live_qr,p01_panel_replies,p03_panel_questions}.jpg`'den
  üretiyor; bu JPG'ler yazar dışı, güncellenmedi. Betik tam koşulursa eski panel ekranları geri gelir — önce G059 çekimi
  (`tools/listing_templates/capture.ts`) yenilenmeli ya da bu çekimin JPG'leri oraya konmalı (entegratör).
- Satış sitesindeki alt metinler yazar dışı: ana sayfa "a Download all replies (CSV) button" diyor, düğme artık
  "Download list" (CSV indirir) ve 390 × 844 karede alttaki yapışkan çubukta. /start ve kayıt sonrası ekran (`app/start`)
  hâlâ eski yeşil görünümde; ne üründe ne görselde değişti.
- `tests/g055-browser.ts`'teki `page.reload` yarışı main'de de vardı (ERR_ABORTED); test sheet'in kapanmasını bekleyecek
  şekilde düzeltildi, kontrol azaltılmadı.

## Günlük
- 2026-10-14 açıldı (entegratör): GM02 onayı sonrası; G061 düzeltme turu bitince başlar
- 2026-10-14 alindi: claude-G066
- 2026-10-14 Kısım A (satış sitesi) bitti (claude-G066): BKE Studio giydirmesi, testler 458/458 + tarayıcı 283/283; durum alindi (Kısım B panel bekliyor)
- 2026-10-14 Kısım B (panel) bitti (claude-G066): BKE Studio giydirmesi + K29 sadeleştirme, npm test 500/500, tarayıcı 769/769 (11 paket), satış sitesi panel görselleri yeniden çekildi; durum alindi (bitir entegratörde)
