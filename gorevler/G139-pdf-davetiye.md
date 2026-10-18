---
id: G139
baslik: Tek butonla tüm siteyi PDF indirme + her tasarıma özel klasik basılı davetiye (5×7 in / A5, taşma payı, kesim işaretleri)
rol: claude-kod
durum: bitti
alan: claude-G139
oncelik: 1
bagimli: []
yazar: [platform/lib/print/, platform/lib/slug.ts, platform/README.md, platform/tests/g055-share-tracing.test.ts, platform/app/api/edit/[slug]/download/, platform/components/panel/Downloads.tsx, platform/components/panel/downloads.module.css, platform/components/panel/views.tsx, platform/next.config.ts, platform/scripts/trace-check.cjs, platform/scripts/build-print-assets.ts, platform/scripts/print-sample.ts, platform/tests/g139-print.test.ts, platform/public/print/, platform/previews/g139/, platform/package.json, platform/package-lock.json, collections/*/assets/gpt/GPT_PROMPTS.md, gorevler/G139-pdf-davetiye.md]
---

## Amaç
K45 §5: alıcı panelden (Share → **Downloads**) tek butonla (1) yayındaki/taslaktaki sitesinin tamamını temanın görsel dilinde PDF
olarak, (2) kendi tasarımına özel klasik basılı davetiyeyi baskı dosyası olarak indirebilsin. Ölçü kararı: **5×7 in + A5**,
taşma payı (bleed) ve kesim payıyla.

## Girdiler
`AGENTS.md` (K21: görseller GPT'den; Claude yalnız metin katmanı + yerleşim), `docs/01_KULLANICI_KARARLARI.md` K45,
`docs/11_TEMA_STANDARDI.md` (no-js, tema yapısı), 01–20 `collections/<NN>/assets/gpt/parts/{invitation_card,info_card,bg_tile}.png`,
21 `decor/{rose-branch,seal}.png` + `textures/paper-background.png`.

## Yapılacaklar
1. Siteyi PDF indir (panel, tek buton) — yaklaşım + gerekçe.
2. Basılı davetiye 21 tasarım × (5×7, A5) × (bleed, kesim işareti, arka yüz).
3. Panelde açık yer, bekleme/hata durumları, site başına günlük sınır.
4. Testler: sayfa sayısı/ölçü, metinler, QR → doğru URL (jsQR).

## Bitti sayılması için
- [x] `POST /api/edit/<slug>/download` (`kind: site | invitation`), edit anahtarı Authorization başlığında
- [x] Website PDF: her site sayfası (home, story, details, rsvp — kapalı olanlar hariç) bir PDF sayfası, son sayfada QR + link
- [x] Davetiye 21 tasarımda; 5×7 (5.25 × 7.25 in bleed'li), A5 (154 × 216 mm bleed'li), kesim işaretleri bleed dışında
- [x] Panel kartı (Share sekmesi, link kartının hemen altında), "hazırlanıyor" satırı, hata bandı, çevrimdışı hâli
- [x] Günlük sınır 20 PDF / site (429 + etiketli mesaj)
- [x] `tests/g139-print.test.ts` 6/6; typecheck; `npm test`; `npm run build` (+ trace-check)
- [ ] Vercel'de gerçek çalıştırma (bu görevde yayın yok — aşağıda "Açık")

## Sonuç

### Yaklaşım ve gerekçe
**Sunucuda başsız Chromium** (`playwright-core` 1.56.1 + Vercel'de `@sparticuz/chromium` 141.0.0; ikisi aynı Chromium 141 sürümüne
sabit çift). Neden: PDF'in "temanın görsel dilinde" olması için temanın web yazı tipleri, GPT görselleri ve CSS düzeni gerekiyor;
bunu birebir yalnız tarayıcı dizebilir. pdf-lib ile elle dizgi (yazı tipi gömme, metin kaydırma, 21 düzen) hem daha çok kod hem
daha kötü görünüm demekti. Sayfa birleştirme `pdf-lib` ile.
- `lib/print/browser.ts`: Vercel/Lambda'da `@sparticuz/chromium`, yerelde Playwright Chromium (`PLAYWRIGHT_BROWSERS_PATH`) ya da
  `PRINT_CHROMIUM_PATH`. Süreç başına tek tarayıcı (sıcak örnekte davetiye ~1 sn, site ~5–10 sn; soğuk başlangıç + Chromium açma ~5 sn).
- `lib/print/render.ts`: belge özel bir adreste (`https://print.invalid`) açılır; bütün istekler sunucuda cevaplanır: tema dosyaları
  diskten (bu fonksiyonun paketinde yoksa — Vercel tema görsellerini yalnız varlık rotasına koyar — platformun herkese açık
  adresinden), `/media/<siteId>/…` yalnız yazdırılan sitenin fotoğrafları doğrudan adaptörden (taslak da basılır, önizleme anahtarı
  gerekmez), Google Fonts dışarıdan; başka her istek reddedilir.
- Fonksiyon: `maxDuration = 60`, `serverExternalPackages`, `outputFileTracingIncludes` ile `@sparticuz/chromium/bin/**` yalnız bu
  rotaya (~65 MB; Vercel 250 MB sınırının altında). trace-check'te rota `ROUTES` listesinde.

### Website PDF (`lib/print/site-pdf.ts`)
Temanın her sayfası misafirin gördüğü motorla (renderTemplate) üretilir, **script'siz** basılır (temalar no-js'te her şeyi gösterir:
zarf, reveal animasyonu, müzik yok). Baskı CSS'i form, düğme, geri sayım, takvim düğmeleri, "Replay the envelope", sabit çubukları
gizler; formu gizlenince yalnız başlığı kalan kart da gizlenir. **Bir site sayfası = bir PDF sayfası** (A4 genişliği 794 px'te dizilir,
sayfa içerik kadar uzun, en az A4). İlk deneme A4 sayfalar + `break-inside: avoid` idi: her tema sayfasının alt bilgisi neredeyse boş
sayfalara taştı (olive-ivory 9, art deco 12 sayfa, 4'ü boşa yakın) ve kartlar sayfa kenarında kesildi; uzun sayfa tasarımı misafirin
kaydırdığı gibi, kırılımsız korur. Ekran boyu yükseklikler (100vh hero) A4 görünümünde sabitlenir (baskıda vh = sayfa boyu olduğundan
aksi hâlde sayfa sonsuz büyür). Son sayfanın sonunda "Our wedding website" + gerçek QR (`lib/qr.ts`, link aynı zamanda tıklanır) +
adres. Örnek: `platform/previews/g139/website_pdf_4designs.jpg` (fotoğraflı seed: olive, crimson, art deco, midnight — 4'er sayfa).
Not: Basılırsa yazıcı uzun sayfayı ölçekler; ekranda okumak/saklamak için tasarlandı. Ölçülen boy baskıda kısa
kalırsa (tema farkı) sayfa %10 uzatılıp yeniden basılır (tek sayfa garantisi, en çok 4 deneme).

**Boyut (Vercel yanıt sınırı 4.5 MB):** ilk sürüm fotoğraflı olive-ivory sitesinde 15.9 MB idi. Nedenleri ve çözümler
(`lib/print/compact.ts`, `render.ts`): (1) CSS efektli öğeleri (drop-shadow `filter`, `mix-blend-mode`) Chromium 300 dpi kayıpsız
rasterleştiriyordu → baskı CSS'inde `filter/backdrop-filter/mix-blend-mode` kapalı (yalnız gölgeler kaybolur); (2) görseller tarayıcıya
verilmeden önce en çok 1600 px, saydamsız olanlar JPEG; (3) sayfa PDF'leri birleşince aynı dekor her sayfada ayrı saklanıyordu → özdeş
görsel akışları tekilleştirilir; (4) Chromium'un kayıpsız sakladığı 8 bit RGB görseller JPEG'e (q80) çevrilir, saydamlık maskesi kayıpsız
kalır. Sonuç (fotoğraflı seed siteleri): olive 1.95 MB, crimson 2.2, midnight 1.8, art deco 2.5, burgundy 2.1 MB; süre 4–6 sn
(sıcak tarayıcı). Davetiye de aynı yoldan q92 JPEG: 21 tasarımda A5 + bleed + kesim + arka yüz 0.7–1.4 MB (önce blush 5.8 MB).
Test: her iki PDF < 4.5 MB.

### Basılı davetiye (`lib/print/invitation.ts`, `lib/print/layouts.ts`)
- Ön yüz: tasarımın `invitation_card` GPT parçası, tasarımın kâğıt dokusu (`bg_tile`; 03'te `bg_scene`) üzerinde, kesim alanının içinde
  ≥ 0.2 in kâğıt payıyla ortalı. Metin katmanı (host line, isimler, davet cümlesi, tarih, saat, mekân, şehir, "Kindly reply by") temanın
  kendi web yazı tipleri ve renkleriyle, parçanın boş alanına (tasarım başına kutu, % olarak). Arka yüz yoksa önde site adresi.
- Arka yüz (varsayılan açık): `info_card` parçası; "The Details", tarih, mekân, program, dress code, QR + adres, cevap tarihi.
- 21 Crimson Rose Atelier'de kart parçası yok: geçici düzen kâğıt + gül dalı (sol üst, sağ alt) + mühür (GPT parçaları). Yeni kart
  parçaları için prompt yazıldı (aşağıda).
- Taşma payı: 5×7'de 1/8 in, A5'te 3 mm; doku bleed'e uzanır. Kesim işaretleri (yalnız bleed ile) bleed'in 1/16 in dışında başlayan
  0.25 pt çizgiler, 0.375 in'lik ek alanda (sayfa 6 × 8 in / A5 + 3 mm + 2 × 0.375 in). Bleed'siz = kesim ölçüsü (evde baskı).
- Metin sığdırma: blok kutuya sığana kadar küçülür, tek satırlık öğeler (isimler, tarih, adres) genişliğe sığar; kesilmez.
- 21 tasarımın hepsi 5×7 ve A5'te üretildi ve gözle kontrol edildi (üst satırın dekora değdiği 15 tasarımda kutu ayarlandı).
  Toplu görüntü: `platform/previews/g139/invitations_5x7_bleed_all21.jpg`.
- **Çözünürlük (dürüst):** bugünkü GPT parçaları 1024 × 1536 px → 5×7 kartta ~236 ppi, A5'te ~200 ppi; 300 ppi hedefinin altında.
  Büyütme (upscale) yapılmadı (detay eklemez, sorunu gizler). Doku karoları ≥ 300 ppi. Metin ve QR vektör.
  CMYK değil (RGB PDF; dijital baskı servisleri kabul eder).
- Baskı görselleri PDF'te q92 JPEG (renk) + kayıpsız saydamlık maskesi (dosya < 4.5 MB için; yukarıda "Boyut").
- Varlıklar: `node scripts/build-print-assets.ts [--theme <id>]` → `public/print/<id>/{card,back,paper}.webp` (tam boy, 16 MB toplam; tema klasörünün 3 MB site bütçesi dışında, CDN servis eder;
  `<parça>_print.png` varsa onu kullanır). Örnek PDF: `node scripts/print-sample.ts --theme <id> --site --invite 5x7|a5 [--bleed] [--marks] [--no-back]`.

### GPT için istenen parçalar (GPT_PROMPTS.md'ye "G139" bölümü eklendi)
- 01–20: `collections/<NN>/assets/gpt/parts/invitation_card_print.png` ve `info_card_print.png` — mevcut parçanın birebir 2048 × 3072
  sürümü (300 ppi için). Gelince `build-print-assets.ts --theme <id>`; yerleşim değişmez.
- 21: `collections/21_Crimson_Rose_Atelier/assets/gpt/parts/invitation_card.png` ve `info_card.png` (2048 × 3072, şeffaf, gül kümeli
  kart + arka yüz). Gelince `layouts.ts`'te kaynaklar `PARTS`'a çevrilip `composed` kaldırılır.

### Panel
Share sekmesinde link kartının hemen altında **Downloads** kartı (`components/panel/Downloads.tsx`, yeni dosya; `views.tsx`'e 2 satır):
"Download website as PDF" (birincil), "Printable invitation" grubu: boyut (5 × 7 in / A5), arka yüz, bleed, crop marks (bleed'siz
pasif), "Download printable invitation". Üretim sürerken düğmede bekleme göstergesi + "Preparing your PDF… this can take up to a
minute."; hata → kırmızı bant (sunucunun etiketli mesajı); çevrimdışı → düğmeler pasif + açıklama; yayında değilse QR'ın yayından
sonra açılacağı notu. Arşivlenmiş sitede kart yok. Her ikisi de kaydedilmiş taslağı kullanır.

### Panelde gerçek tarayıcı denemesi
`next build` + `next start`, seed'li olive-ivory sitesi (fotoğraflı), 390 × 844: Share → Downloads kartı görünür; A5 + bleed + crop
marks seçilip "Download printable invitation" → `g139-demo-invitation-a5-bleed-marks.pdf` (2 sayfa, 491 × 666 pt = A5 + 3 mm + kesim
alanı) ~1.9 sn; "Download website as PDF" → `g139-demo-website.pdf` (4 sayfa) ~8.5 sn (bu deneme boyut düzeltmesinden önceydi:
15.9 MB; düzeltmeden sonra aynı site doğrudan kütüphaneyle 1.95 MB).

### Kötüye kullanım sınırı
Site başına günde 20 PDF (site + davetiye birlikte), `getClaimRateLimiter()` — blob'da paylaşılan sayaç, yerelde bellek. Aşınca 429 +
`Retry-After` + "You have made 20 PDFs today. Please try again tomorrow."

### Alıcıya görünen etiketler (`lib/print/labels.ts`, 5 dil için tek yer; şimdilik `en`)
Panel: Downloads · Keep a copy of your website, or print classic invitations in your design. Both use your latest saved changes. ·
Download website as PDF · Every page of your website in your design, with a QR code to your link on the last page. · Printable
invitation · Size · 5 × 7 in · A5 (148 × 210 mm) · Add a back side with the details and a QR code · For a print shop: add bleed
(1/8 in / 3 mm) · Add crop marks · Download printable invitation · Preparing your PDF… this can take up to a minute. · Your PDF is
downloading. · The PDF could not be made. Please try again in a moment. · You are offline. Connect to download your PDF. · Your website
is not published yet: the QR code will open it once you publish. · You have made {count} PDFs today. Please try again tomorrow.
PDF içi: invite you to celebrate their wedding · invite you to celebrate with them (düğün dışı) · at {time} · Kindly reply by {date} ·
The Details · Dress code · Scan to visit our website and reply · Our wedding website.

### Testler
- `tests/g139-print.test.ts` 6/6: istek ayrıştırma, dosya adı, sayfa geometrisi; 21 tasarımın düzeni + parçaları diskte + HTML kaçışı;
  401 (anahtarsız/yanlış), 400, 429; 5×7 bleed'li = 5.25 × 7.25 in, 2 sayfa, isimler/mekân/"Kindly reply by" metinde, arka yüzde
  link açıklaması = site URL'si, **QR pdftoppm ile rasterleştirilip jsQR ile çözülüyor = site URL'si** (pdftoppm yoksa bu adım atlanır,
  link kontrolü kalır); A5 + 3 mm = 154 × 216 mm, kesim işaretli 6 × 8 in, bleed'siz 5 × 7 in; website PDF 4 sayfa, A4 genişlik, metinler,
  son sayfada site linki. Metin okuma `pdfjs-dist` (devDependency).
- Ölçü toleransı ±0.6 pt: Chromium sayfa boyunu CSS pikseline yuvarlar (A5 bleed'li 437.04 × 612 pt, hedef 436.54 × 612.28 pt).
- Toplu `npm test` ve `npm run build`: aşağıda "Kontroller".

### Kontroller
`npm run typecheck` temiz · `npm test` **1267/1267** (0 atlanan; g139 6/6) · `npm run build` + trace-check geçti (17 tema rotası;
PDF rotasının izinde `@sparticuz/chromium/bin/*.br` var) · 21 tasarımın davetiyesi 5×7 bleed'li ve A5 bleed + kesim işaretli üretilip
gözle kontrol edildi · site PDF'i 6 tasarımda (olive, crimson, midnight, art deco, burgundy, lavender) üretilip 4'ünde gözle bakıldı.

### Yan etki
- `print` ayrılmış slug oldu (`public/print/` adresiyle çakışmasın; marketing-slug testi bunu istiyor). Canlıda `print` adlı bir site
  varsa açılmaz olur — kayıtlar okunmadı, entegratör yayından önce `/admin`'de bakmalı (olasılık çok düşük).
- `tests/g055-share-tracing.test.ts`: PDF rotası tema şablonlarına ek olarak `@sparticuz/chromium/bin/**` taşıyabilir (tek satırlık izin).

### Açık
- **Vercel'de denenmedi** (bu görevde yayın/ortam değişkeni yok). `@sparticuz/chromium` Node 22 / al2023 ile çalışmalı; ilk yayında
  canlıda bir site + bir davetiye indirilip süre ve bellek (önerilen fonksiyon belleği ≥ 1 GB) kontrol edilmeli.
- Website PDF'i taslak içeriği kullanır; ileride "yalnız yayındaki" seçeneği istenirse `api.ts`'te tek satır.
- 300 ppi için GPT 2× parçaları (yukarıda) bekleniyor.

## Günlük
- 2026-10-17 entegratör onayladı
