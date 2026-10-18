---
id: G173
baslik: Mobil boyutta performans ve erişilebilirlik turu (satış sitesi, /start, demolar, panel) — gerçek sorunları düzelt, gerilemeyi önleyen hızlı denetim ekle
rol: claude-kod
durum: inceleme
alan: claude-G173
oncelik: 2
bagimli: [G141, G159]
yazar: [platform/components/panel/Setup.tsx, platform/themes/blush-garden-rose/site.css, platform/themes/blush-garden-rose/index.html, platform/themes/crimson-rose-atelier/index.html, platform/scripts/js-budget.cjs, platform/package.json, platform/tests/g173-browser.ts, platform/tests/g173-js-budget.test.ts, platform/tests/g159-static-themes.test.ts, platform/README.md, platform/previews/g173/, gorevler/G173-performans.md]
---

## Amaç
390 px, kısıtlı mobil koşulda (CPU 4×, yavaş 4G: 150 ms RTT, 1,6 Mbps) satış sitesini, `/start`'ı, 6 satılan + 2 "coming"
demoyu (açılış dahil) ve yeni bir yerel sitenin panelini ölçmek. Ölçülenler: LCP, CLS, INP/TBT, aktarım, rota başına JS,
görsel ağırlığı, axe (serious/critical), kontrast, odak sırası, dokunma hedefleri, reduced motion. Görsel tasarımı
değiştirmeden gerçek sorunları küçük değişiklikle düzeltmek ve gerilemeyi önleyen hızlı bir denetim eklemek.
Koordinatör: session_01HP9ZrJ8mhZnigbvsvUQ4pR.

## Sonuç
**2026-10-18 · claude-G173 — durum: inceleme.** Dal `claude/g173-performans` (taban `claude/zealous-fermi-hy1o40`,
son hâli merge edildi). Yayın yok, main'e dokunulmadı, PR yok. PROJECT_STATE.json / AGENTS.md / CLAUDE.md değişmedi.

**Ölçüm yolu.** Lighthouse kurulmadı. Ölçüm `next start` üretim build'i, Playwright + `/opt/pw-browsers` Chromium, CDP
kısıtlaması, PerformanceObserver (LCP, layout-shift, longtask, Event Timing) ve axe-core 4.13 ile yapıldı
(`tests/g173-browser.ts`). Değerler lab ölçümü; aynı makinede başka ajanlar çalıştığı için TBT ±%40 oynuyor.
Gerçek telefon ve canlı ağ denenmedi.

### Bulunan ve düzeltilenler
1. **Panel her görünümde temanın ilk görünümünü indiriyordu (~870 KB).** Sunucu her panel adresi için varsayılan
   rotayı (kurulum 1. adım) çiziyor. O adımdaki küçük önizleme iframe'inin `src`'si HTML'de olduğu için `#home`,
   `#edit`, `#guests`, `#share` gibi görünümler de olive-ivory demosunun görsellerini indiriyordu. Bu görseller panel
   JS'iyle aynı bant genişliğini paylaşıyordu. **Düzeltme** (`components/panel/Setup.tsx` `PreviewMini`): `src` yalnız
   hydration'dan sonra veriliyor. Başka bir görünüm açılıyorsa kurulum, iframe yüklenmeden kapanıyor. 1. adımda
   önizleme JS'ten sonra geliyor (doğrulandı: `#setup/1`'de iframe yükleniyor, `#share`'de tema/önizleme isteği 0).
2. **03 Blush Garden Rose: zarfın klavye odak halkası görünmüyordu.** Kural `outline: none` +
   `filter: drop-shadow(0 0 0 2px …)` idi. `drop-shadow()` spread almadığı için tarayıcı bu kuralı geçersiz sayıp
   atıyordu. **Düzeltme:** diğer temalardaki kural (`.stage:focus-visible { outline-offset: -4px; }`), `outline: none`
   kaldırıldı. `site.css` 46 080 → 46 054 B, bütçe içinde. Ekran: `previews/g173/blush_stage_focus_390.png`.
   Yeni kontrol 32 demonun hepsinde odaklanan zarfın görünür bir halka çizdiğini doğruluyor.
3. **Zarf LCP önceliği (03 ve 20).** Çoğu temada kapalı zarf `fetchpriority="high"` taşıyor. 03'te (yalnız arka plan
   vardı) ve 20 Crimson Rose Atelier'de (hiç yoktu) bu öznitelik eksikti; ikisine de eklendi. Ölçülen etki:
   03 5,6 → 5,1 s, 20 2,7 → 1,5–1,8 s.
4. **Gerilemeyi önleyen denetim:** `scripts/js-budget.cjs` artık `postbuild`'de trace-check'ten sonra koşuyor. Her sayfa
   rotasının ilk yük JS'ini (runtime + rotanın `entryJSFiles`'ı, gzip, nomodule polyfill hariç) grup bütçesiyle
   karşılaştırıyor: `/edit` ≤ 270, `/admin` ≤ 175, `/start` ≤ 160, satış/`/my`/`/signin` ≤ 155 KB. Bütçe aşılırsa
   build exit 1 veriyor. Birim testi `tests/g173-js-budget.test.ts` sahte bir `.next` ile çalışıyor, yani build
   gerektirmiyor. axe denetimi `npm test`'e girmedi, çünkü DOM/tarayıcı gerekiyor. Onun yerine `tests/g173-browser.ts`
   bütün sayfalarda axe serious/critical = 0 koşulunu denetliyor (G141'in `g141-browser.ts`'i gibi build sonrası elle
   çalıştırılıyor).

### Önce → sonra (390 px, CPU 4×, yavaş 4G, önbelleksiz)
Kaynak: `previews/g173/before.json`, `after.json`. INP, tek bir gerçek dokunuşun Event Timing süresidir (satışta
menü, panelde ilk düğme). Satış sayfalarında kod değişmedi; farklar ölçüm gürültüsüdür.

| Sayfa | LCP ms | CLS | TBT ms | INP ms | Aktarım KB | JS KB | Görsel KB | axe s/c |
|---|---|---|---|---|---|---|---|---|
| `/` | 1340 → 1296 | 0 | 250 → 375 | 88 → 104 | 398 | 147 | 135 | 0 |
| `/designs` | 908 → 972 | 0 | 182 → 239 | 88 | 442 | 146 | 187 | 0 |
| `/designs/olive-ivory` | 1384 → 1536 | 0 | 282 → 276 | 80 → 88 | 457 | 146 | 200 | 0 |
| `/designs/coastal-seaside` | 1300 → 1304 | 0 | 286 → 309 | 96 → 104 | 412 | 146 | 154 | 0 |
| `/my` | 936 → 884 | 0 | 338 → 181 | 72 | 230 | 147 | 5 | 0 |
| `/pricing` | 848 → 836 | 0 | 245 → 200 | 56 | 384 | 144 | 139 | 0 |
| `/faq` | 820 → 784 | 0 | 207 → 172 | 80 → 64 | 251 | 144 | 3 | 0 |
| `/tr` | 1524 → 1408 | 0 | 468 → 513 | 72 → 120 | 462 | 147 | 135 | 0 |
| `/de/designs` | 912 → 968 | 0 | 352 → 246 | 72 | 394 | 146 | 139 | 0 |
| `/start?theme=olive-ivory` | 856 → 836 | 0 | 232 → 322 | 104 → 88 | 1350 | 167 | 906 (demo iframe'i) | 0 |
| panel `#setup/1` | 944 → 1056 | 0 | 513 → 536 | 80 → 64 | 1408 → 1298 | 277 | 863 → 753 | 0 |
| panel `#home` | 908 → 1056 | 0 | 662 → 433 | 56 → 48 | **1428 → 367** | 277 → 259 | **868 → 10** | 0 |
| panel `#edit` | 1108 → 1060 | 0 | 500 → 375 | – | **1412 → 351** | 277 → 259 | **868 → 10** | 0 |
| panel `#edit/photos` | **7576 → 2824** | 0 | 485 → 433 | 96 → 104 | **1363 → 351** | 277 → 259 | **868 → 10** | 0 |
| panel `#guests` | 936 → 1032 | 0 | 365 → 338 | 48 → 56 | **1412 → 351** | 277 → 259 | **868 → 10** | 0 |
| panel `#share` | **8088 → 2760** | 0 | 569 → 368 | 48 → 56 | **1412 → 352** | 277 → 259 | **868 → 10** | 0 |

Demolarda zarf yüklenirken alınan LCP (dokunmadan önce, 6 s pencere; `previews/g173/demo_lcp_sweep_*.txt`, 32 tasarım).
`before.json`'daki demo LCP'leri kullanılmadı: ilk betik LCP'yi dokunuştan sonra okuyordu ve açılış yeni bir sayfa
açtığı için (K23) 0 ya da erken değer veriyordu. Bu hata düzeltildi.

| Demo | LCP ms önce → sonra | Aktarım KB | CLS (sonra) | LCP öğesi |
|---|---|---|---|---|
| 01 olive-ivory | 3420 → 3484 | 994 | 0,002 | kapalı zarf 880w |
| 03 blush-garden-rose | **5628 → 5100** | 1060 | 0,002 | kapalı zarf 880w |
| mediterranean-lemon | 1380 → 1336 | 745 | 0,001 | kapalı zarf |
| coastal-seaside | 2824 → 2640 | 875 | **0,158** (font değişimi, aşağıda) | kapalı zarf |
| art-deco-black-tie | 2288 → 1956 | 738 | 0,007 | kapı |
| 20 crimson-rose-atelier | **2676 → 1500** | 776 | 0,001 | kapalı zarf |
| nocturne-lake-estate (coming) | 1016 → 1084 | 378 | 0,001 | zarf cebi |
| music-box-ballerina (coming) | 948 → 952 | 255 | 0,005 | kutu |

Açılış dokunuşunun kendisi (INP) 8 demoda 16 ms eşiğinin altında kaldı ve demo sayfalarında TBT 0–15 ms.

**Erişilebilirlik (390 px, hepsi `after.json`'da):** axe serious/critical 24 sayfada 0. Kontrast axe'in
`color-contrast` kuralıyla ölçüldü. Demolarda yalnız `region` (moderate) bulgusu var: zarf sahnesi bir landmark içinde
değil. Bu bulgu bilerek değiştirilmedi. 390 px'te yatay taşma yok. Dokunma hedefi (< 24 px, WCAG 2.5.8) yok: ilk
ölçümdeki bulgular yanlış pozitifti (kapalı menü linkleri, `tabindex=-1` honeypot, label'lı 1 px dosya girişleri,
44–54 px label'ların içindeki kutular). Reduced motion açıkken hiçbir sayfada 0,1 s'den uzun çalışan CSS animasyonu
yok. Odak sırası mantıklı: satışta Skip → logo → CTA → Menü → içerik, panelde Skip → Önizleme → Yayınla → sekmeler.
"Halkasız" sayılan duraklar gerçek eksik değil:
- `/start`'ta odak demo iframe'inin içine giriyor; iframe'in içindeki öğe halka çiziyor.
- Panelde tarih alanının ikinci durağı Chromium'un tarih alt alanı.

### Açık kalanlar (düzeltilmedi, gerekçeli)
- **Zarf demolarında yavaş 4G'de LCP > 2,5 s** (sonra: 03 5,1 s; sunflower, tuscan, enchanted ~4,7–5 s; olive,
  lavender, winter, boho, vintage, emerald ~3,1–3,7 s). Neden ağırlık: DPR 2'de ilk görünüm 0,8–1,1 MB. Bunun
  çoğunu açılışta görünecek parçalar (kapak, gövde, cep, kart) ve köşe çiçekleri oluşturuyor; hepsi ekranda olduğu
  için Chrome hepsini High önceliğe yükseltiyor. Bu ağırlık docs/11 §6 bütçesinin (≤ 1,5 MB, DPR 3) içinde.
  Deneme (tuscan, 03): kapalı zarfa `high`, gizli parçalara `fetchpriority="low"` verildiğinde LCP yalnız
  0,4–1,1 s düşüyor. Hedefe inmek için tema ilk görünüm bütçesini küçültmek ya da açılış parçalarını ilk boyamadan
  sonra yüklemek gerekir. Bu bir tema standardı kararı.
- **Font değişiminden gelen CLS (6 tasarımda > 0,1):** coastal 0,158, vintage-airmail 0,147, tuscan 0,139, enchanted
  0,131, ivory-lace 0,128, dusty-blue 0,119; burgundy 0,096, emerald 0,084. Kapalı zarfın üstündeki isim başlığı
  Google Fonts el yazısı (`display=swap`) geç gelince 2 satırdan 1 satıra iniyor (coastal: Allison 2,6 s'de geliyor,
  başlık 179 → 111 px). İlk ölçümde coastal'da 0,0005 görünmesinin nedeni fontların o çalıştırmada erken gelmesi
  (proxy gecikmesi değişken). Önerilen düzeltme tema standardında yapılmalı: el yazısı fontu için `size-adjust`'lu
  yedek `@font-face` ya da isim başlığına sabit yükseklik. Yaklaşık 20 temanın CSS'ine dokunuyor (01/03 bütçe sınırında)
  ve her tema için görsel kontrol gerekiyor; bu yüzden bu görevde yapılmadı.
- **Satış sitesi ilk yük JS'i ~144 KB gzip** (§9.8 hedefi 130 KB). Bunun ~125 KB'ı Next 16 + React 19 runtime;
  uygulama kodu ~12 KB. TBT 170–510 ms. Profil: JS'in kendi süresi küçük; zamanın çoğu HTML + RSC yükünün (ana sayfa
  316 KB ham / 35 KB gzip) ayrıştırılması, stil ve yerleşim. MotionRoot'taki okuma/yazma karışımı denendi ama
  doğrudan ölçümde yalnız ~3 ms kazandırdı, bu yüzden geri alındı. INP 56–120 ms, iyi.
- **Panel JS'i 259 KB** (tek client modülü ~366 KB ham, bütün görünümler içinde). Görünüm başına `next/dynamic`
  bölmesi ayrı bir iş. `#share` / `#edit/photos` doğrudan açıldığında LCP ~2,8 s: sunucu hash'i göremediği için bu
  görünümler hydration'dan sonra çiziliyor. Uygulama içi gezinmede LCP söz konusu değil.
- `/start` sayfası 1,35 MB: demo iframe'i ilk ekranda ve bilerek tam yükleniyor (alıcı tasarımını görüyor).
- Lighthouse skorları alınmadı (paket kurulmadı). Gerçek telefonda ve canlıda ölçülmedi.

**Testler**
- `rm -rf .next && npx tsc --noEmit && I18N_STRICT=1 npm test && npm run build`: merge sonrası **yeşil**. 1647 test,
  1645 geçti, 2 atlandı (build'siz). trace-check ve js-budget geçti (36 rota, en büyük `/edit/[slug]` 255,7/270 KB).
- `tests/g159-static-themes.test.ts`: `postbuild` beklentisi "trace-check önce" olarak gevşetildi.
  `tests/g173-js-budget.test.ts` tam komutu ayrıca denetliyor.
- `tests/g173-browser.ts`: 91/97. Kalan 6 FAIL yukarıdaki açık maddeler: 3 demo LCP > 2,5 s, coastal CLS
  > 0,1, panel `#edit/photos` / `#share` doğrudan açılış LCP'si ~2,8 s.

GPT'den görsel gerekmedi; yeni dekor çizilmedi (K21).

## Günlük
- 2026-10-18 claude-G173: ölçüldü, düzeltildi, merge + testler yeşil → inceleme
