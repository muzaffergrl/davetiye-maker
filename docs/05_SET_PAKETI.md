# Set paketi — platform modeli (K22–K24): alıcının aldığı ve Etsy ilan kiti

Her tasarım (tema) **tek ürün** olarak satılır: alıcının kendi panelinden düzenlediği, bizim platformumuzda
barındırılan mobil öncelikli düğün sitesi (`docs/10_SITE_PLATFORMU.md`). Etsy'de alıcının indirdiği tek dosya
**START HERE PDF**'idir; içindeki başlat linki (`/start?theme=<tema>`) siteyi açtırır. Bu belge her tema için
alıcı paketini, ilan kitini, bitti şartlarını ve dürüst iddia listesini tanımlar. Durum her koleksiyonun
`COLLECTION_STATUS.md`'sinde bu listeyle aynı sırada tutulur (entegratör).

**Alıcı yolculuğu** (ilan → satın alma → satış sonrası), soru envanteri, ilan iskeleti, Etsy'nin otomatik mesajları, satış sonrası
mesaj şablonları (admin paneli) ve START HERE ortak kaynağı: `docs/19_ALICI_YOLCULUGU.md` (G091, K32).

Canva dönemi listesi (video, Canva website + Form, 5×7 PDF, story/kare, template linkleri) K22–K24 ile askıda;
eski hâli: `git show 76f68f9:docs/05_SET_PAKETI.md`.

## A. Alıcının aldığı

| # | Parça | Nerede | Bitti sayılması için |
|---|---|---|---|
| A1 | **Düğün sitesi** (tema): kapalı zarf → Home → Our Story → Details → RSVP | `platform/themes/<tema>/` (G4NN), canlıda `/<adres>` | `npm test`, `theme-check`, `final-smoke`, `g051-browser` geçti; tema **canlıda yayında** (`/start/demo/<tema>` 200) |
| A2 | **Düzenleme paneli**: isimler, tarih/saat/saat dilimi, mekân, program (≤ 10), hikâye, Details linkleri, SSS (≤ 12), RSVP (son tarih, ≤ 3 özel soru), isteğe bağlı bölümler, 5 fotoğraf (kırpma), önizleme, yayınla | platform (`/edit/<adres>?k=…`, G039) | Platform geneli; tema başına yalnız `final-smoke --theme` |
| A3 | **RSVP**: misafir formu, panelde liste + sayılar, CSV, özel sorular | platform (G042, G051) | Tema formu standarda uygun (docs/11 §3.3) |
| A4 | **Takvime ekle** (.ics + Google), **SSS**, geri sayım | platform + tema (G051) | Tema işaretleri var (docs/11 §3.5) |
| A5 | **Paylaşım**: site linki + QR (PNG/SVG) | panel | QR gerçek URL'den (`lib/qr.ts`) |
| A6 | **START HERE PDF** (alıcının Etsy'den indirdiği tek dosya) | `collections/<NN_*>/package/customer/START_HERE.pdf` (kaynak: docs/19 Ek A; G091'de 01–05) | Başlat linki tıklanabilir (PDF'te /URI) ve canlıda açılıyor; QR aynı URL'yi kodluyor (`make_qr` ayarları); adımlar **gerçek paneldeki adlarla** (düğme/başlık adları kaynaktan birebir); "Save your edit link", sık sorulanlar, sorun giderme; karar bekleyen alanlar açık yer tutucu; ≤ 20 MB. Ekran görüntüleri G079 canlı yayınından sonra eklenebilir (bugünkü ekranlar yerel adres ya da K29 öncesi panel) |

Pakette **yok**: basılı davetiye, video, özel alan adı, müzik, yazı tipi dosyası. Kişisel alanlar görsele pişirilmez
(AGENTS şart 7): bütün metin ve fotoğraflar içerik kaydında, tema görselleri isimsiz.

## B. Etsy ilan kiti (bizim için — `collections/<NN_*>/package/`)

| # | Parça | Dosya | Not |
|---|---|---|---|
| B1 | İlan metni | `listing/listing_v3.md` (G091; docs/19 §4 iskeleti; `listing_kit.py` G065'ten beri bunu okur; `listing.md` eski kayıt) | §0 durum tablosu · başlık (≤ 140) · açıklama · 13 etiket (≤ 20) · kategori/nitelikler · görsel sırası + alt metin · video · SSS · alıcı mesajı · yayın öncesi kontrol listesi. Doğrulanmamış iddia `[VERIFY]`, ticari alan `[PLACEHOLDER]` |
| B2 | İlan görselleri | `listing/images/01..07*.png` (kopyası + önizleme `listing_v2/`) | **7 görsel, 2000 × 2000, BKE Studio GM03 düzeni** (G067 + G065): 01 kapak (LC1), 02 sayfalar (LC2), 03 How it works (LC3), 04 editör (LC4), 05 RSVP (LC5: laptopta Guests görünümü + telefonda misafir RSVP), 06 What's included (LC6), 07 canlı demo (LC7). Sahneler tasarımın PAKET 3 GPT fotoğrafları; ekranlar yerel production build'den gerçek ekran (misafir sayfaları + güncel editör, kurgu isimler/yanıtlar). **Hiçbir görselde QR ya da web adresi yok** (docs/15 §1): 07 "Open the demo link in the description" der, demo linki açıklamada (`TRY THE LIVE DEMO`). Yazılar yalnız yerleşim + tipografi (K21); `gm03/build.py` denetimi: ölçü, yeşil kalıntı yok, metin birebir, yazı ekrana/çerçeveye binmez, yazılar birbirine binmez, kapak başlığı 4:3 kırpımın içinde. İlan PDF'inde kapağın 300 px ve 4:3 önizlemesi var |
| B3 | İlan videosu | `listing/video.mp4` | Temanın açılış kaydından: 1080 × 1080, H.264, sessiz, 5–15 s, ≤ 100 MB |
| B4 | İlan PDF'i | `listing/listing_<tema>.pdf` | B1'in tamamı + görsellerin küçükleri + video bilgisi (kare, süre, boyut, kural kontrolü) |
| B5 | Kaynak ekranlar | `shots/` | `capture.ts` çıktısı: 26 ekran (JPEG, 390 px, DPR 3), `opening.webm`, `capture.json` (ayarlar + kontroller), örnek CSV |

## C. Üretim — `tools/listing_kit.py`

```bash
cd platform && npm ci && npm run build && cd ..          # bir kez (yerel üretim build'i; yayın yok)
export NODE_PATH=/opt/node22/lib/node_modules PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers
python3 tools/listing_kit.py capture --theme <tema>      # gerçek ekranlar + açılış kaydı → package/shots/
python3 tools/listing_kit.py all --theme <tema>          # qr, images, video, pdf, check
python3 tools/tests/test_listing_kit.py                  # araç testleri
```

- `capture` (`tools/listing_templates/capture.ts`): yerel `next start`, geçici veri klasörü. Temanın demo kaydı (kurgu isimler,
  PAKET 2 örnek fotoğrafları) + 3 örnek SSS + 1 RSVP sorusu yayında; 4 kurgu misafir yanıtı API'den. Misafir ekranları, tema demosu
  ve açılış kaydı (kılavuz kapağı `g01`, ilan videosu `opening.webm`). G059'un alıcı/panel ekranları (`b01`–`b10`, `p01`–`p03`)
  G065'te çıkarıldı (panel v2'de kırılıyordu); `shots/` içindeki eski kopyaları yalnız satış sitesi (`platform/lib/marketing/designs.ts`)
  kullanıyor. Parçacık katmanları durağan resimlerde gizlenir; her durağan ekran `clearEdges()` denetiminden geçer.
- `images` (`tools/listing_templates/gm03/build.py`, G065): G067'nin `tools/listing_v2/build.py`'sini (01/02/03/07) çalıştırır,
  04/05/06'yı kendisi kurar; editör ve Guests ekranlarını `gm03/capture.ts` panel v2'den çeker (hash görünümleri, 5 kurgu yanıt +
  "Meal choice" sorusu). `--skip-capture` önbellekteki ekranları kullanır.
- Metinler (`START_HERE.md`, `listing_v3.md`) elle yazılır; araç yalnız dosya üretir. `listing_v3.md` içindeki
  `<!-- listing-kit:media -->` satırının yerine PDF'te görsel küçükleri ve video bilgisi gelir.
- Başlat linki tabanı `LISTING_BASE_URL` (varsayılan `https://davetiye-platform-five.vercel.app`). **Alan adı ilk satıştan önce
  kesinleşmeli** (ya da bu adresten kalıcı yönlendirme taahhüt edilmeli; K26: alan adı şimdilik alınmıyor, yani ilk satışlar bu
  adresle olursa ileride alan adına geçerken bu adresten kalıcı yönlendirme şart): satılmış START HERE PDF'leri ve özellikle alıcıların
  kendi davetiyelerine bastırdığı QR'lar (kılavuz adım 6) `davetiye-platform-five.vercel.app/<adres>`'e bağlı; satıştan sonra alan
  adı değişirse yönlendirme olmadan hepsi kırılır. Adreste Türkçe "davetiye" ve markasız `vercel.app` var (alıcı güveni zayıf).
  Alan adı değişince bütün START HERE PDF'leri ve QR'lar yeniden üretilir (ilan görsellerinde adres yok). `check`, taban `*.vercel.app`
  iken uyarı yazar.
- `check`: başlık/etiket kuralları, görsel sayısı/ölçüsü, video kuralları (süre, boyut, ses yok, H.264), QR'ın başlat linkini
  modül modül kodladığı, PDF'te tıklanabilir başlat linki (linksiz PDF de hata), PDF ≤ 20 MB.
- `check` ayrıca: görseller tam olarak 7 GM03 dosyası; `package/listing/` altında `*qr*` dosyası yok (G065).
- `check --prepublish` (ilan yüklenmeden önce): canlı başlat linki ve demo 200 + sayfada tema adı; `listing_v3.md`,
  `START_HERE.md` ve iki PDF'te `[VERIFY …]` ya da köşeli
  parantezli ticari yer tutucu (`[SHOP NAME]`, `[PRICE]` …) kalmamış. Bu ortamda vercel.app'e proxy izin vermediği için canlı
  kısım burada "could not connect" ile düşer; canlı kontrol Vercel bağlayıcısıyla yapılıp §E'ye yazıldı.

## D. Bitti şartları (tema başına)

- [x] A1–A5 platformda; tema **canlıda yayında**, güncel platform sürümü (G051 takvim/SSS/sorular dahil) **yayında** — 01 ve 03,
  2026-10-14 (Vercel bağlayıcısı; canlı = main `59b1291`, platform ağacı bu kitinkiyle aynı). SSS ve RSVP soruları canlıda
  uçtan uca denenmedi (§E).
- [ ] `START_HERE.pdf`: link canlıda açılıyor, QR telefon kamerasıyla okutuldu, ekranlar güncel
- [ ] `listing.md`: §0 durum tablosu güncel; `[VERIFY]` kalmadı ya da cümle silindi; ticari alanlar dolduruldu
- [ ] `images/` 7 GM03 görseli (QR yok), `video.mp4`, `listing_<tema>.pdf`; `listing_kit.py check` sorunsuz
- [ ] Alıcı yolculuğu gerçek bir iPhone (Safari) ve Android (Chrome) telefonda denendi
- [ ] Etsy kuralları ilan düzenleyicisinde yeniden kontrol edildi (aşağıda §F)
- [ ] **Son alan adı ilk satıştan önce seçildi** (ya da `davetiye-platform-five.vercel.app`'ten kalıcı yönlendirme taahhüt edildi);
  START HERE PDF'leri, QR'lar ve görseller onunla yeniden üretildi (§C)
- [ ] **Ticari barındırma planı kararlaştırıldı** (Vercel Hobby ticari değil, docs/10 §3)
- [ ] **Etsy politika uygunluğu** kontrol edildi: barındırılan bir siteye erişimi, süreli barındırmayla ([HOSTING PERIOD]) ve PDF
  içindeki linkle satmak (docs/13 §1)
- [ ] **`python3 tools/listing_kit.py check --theme <tema> --prepublish` geçti.** Bu geçmeden kit `sale_ready` sayılmaz ve ilan
  yüklenmez.

## E. Dürüst iddia listesi (2026-10-14)

| İddia | Durum | Kanıt | İlanda / kılavuzda |
|---|---|---|---|
| Canva hesabı gerekmez, uygulama kurulmaz | Doğru (ürün platformun kendisi, web) | Mimari | Yazılabilir |
| Telefondan düzenleme | Panel 390 px **Chromium mobil emülasyonunda** test edildi (G039 74 kontrol, `final-smoke`); **gerçek iPhone/Android denenmedi** | `platform/previews/g039`, `final` | "made for phone screens" + `[VERIFY]`; "tested on iPhone" yazılmaz |
| Misafir RSVP → panelde liste + CSV | Yerelde ve **canlıda** test edildi | G042 testleri, G044 canlı uçtan uca 30/30 | Yazılabilir |
| Takvime ekle | Yerel (G051) + **canlıda**: canlı demo sayfalarında Apple / Outlook ve Google düğmeleri (2026-10-14 07:40 UTC, Vercel bağlayıcısı; telefonla değil) | `tests/g051-browser.ts`, canlı demo | Yazılabilir |
| RSVP özel soruları, SSS | Yerel üretim build'inde test edildi (G051, 44 kontrol); kod canlıda (canlı = main `59b1291`, platform ağacı aynı), ama **canlıda uçtan uca denenmedi** (canlı demo kaydında yok; `live-check.mjs` kapsamıyor) | `tests/g051-browser.ts` | `[VERIFY: try on the live site]` |
| "Bütün yazıyı değiştirirsiniz" | **Kısmen doğru (G068, 2026-10-14'ten beri):** tasarımın başlık, etiket, düğme ve menü metinleri her editör sayfasının sonundaki "Headings & labels on this page" ile değişir (5 temada copy manifesti, 71–79 anahtar). Sabit kalanlar: boyalı tasarım, renkler, fontlar, yerleşim, zarf animasyonu ve platform mesajları (RSVP form hata metinleri, takvim metni, önizleme bildirimi) | `lib/theme/copy.ts`, `components/panel/CopyFields.tsx`, `themes/*/theme.json` `copy` | "The design's headings, labels and buttons, in your own words" yazılır; sabit kalanlar ayrıca sayılır (G091 `listing_v3.md`). "Every text" yazılmaz |
| Diller | Site arayüzü (başlıklar, düğmeler, RSVP formu, takvim metni) yalnız İngilizce; tarih stili en-US/GB/CA/AU. Alıcının kendi metinleri: aksanlı Latin ve Kiril tema fontlarıyla çıkıyor; Yunanca script alanlarda düz yedek fonta düşüyor, Çince/Arapça/Korece yedek fontla (yerel Chromium, 2026-10-14, iki tema) | `components/panel/sections.tsx` LOCALES | İlanda PLEASE NOTE + SSS "Is it available in other languages?" |
| iPhone HEIC fotoğrafları | Panel HEIC'i kabul ediyor; çözme tarayıcıya bağlı; **gerçek iPhone'da denenmedi** | `PhotosSection.tsx`, platform/README | Kılavuz yalnız "açılmazsa JPEG/PNG kopyasını seçin" der; "only in Safari" yazılmaz |
| Süre ("20–30 dakika") | Ölçülmedi | — | Yazılmaz |
| Fotoğraf yükleme + kırpma | Yerel + canlı (G044: sharp Vercel'de çalışıyor) | G039, G044 | Yazılabilir |
| Yayınla, link, QR | Yerel; QR ekran görüntüsünden `jsqr` ile çözüldü, **telefon kamerasıyla okutulmadı** | `panel-browser.ts` | Yazılabilir; "scan before you print" uyarısı kılavuzda |
| `/start` ile başlama | Yerel + canlı (G044: sahiplenme 201, aynı sipariş 409) | G045, G044 | Yazılabilir. İki temanın başlat sayfası canlıda (2026-10-14 07:39 UTC, Vercel bağlayıcısı; 01 aynı günün ilk kontrolünde yoktu, G049 yayınıyla geldi) |
| Etsy siparişinin doğrulanması | **Yok** (yalnız biçim + sipariş başına bir site; `FormatOnlyVerifier`) | `lib/claim/verify.ts` | "we verify your order" yazılmaz; başlat linki herkes için aynı adres olduğundan "personal start link" de yazılmaz. docs/10 §3 kararı: ilk sürüm biçim kontrolü + kayıt, Etsy API doğrulaması sonra |
| Düzenleme linkinin e-postayla gönderilmesi | **Yok** | `lib/claim/mailer.ts` | Kılavuz: "we cannot email it yet", "Email it to myself" = alıcının kendi posta uygulaması |
| Kayıp link yenileme | Operatör aracı yerelde test edildi; canlı depoda denenmedi. Süreç (G091): alıcı Etsy'de sipariş numarasıyla yazar → dükkân yeni link üretir (eski link hemen ölür) → `new_edit_link` şablonu (docs/19 §4.5); panel açıkken link Share → Your private edit link'ten yeniden kopyalanır | `scripts/reissue-edit-key.ts`, `views.tsx` | Süreç yazılabilir; süre vaadi yazılmaz (yanıt süresi `[RESPONSE TIME]`) |
| "Daha hızlı", "en iyi" | Ölçülmedi | — | Yazılmaz |
| Barındırma süresi, dükkân adı, destek e-postası | **Karar var:** düğünden 12 ay sonrasına kadar (K25; panelde Home → Dates → "Online until"); dükkân adı **BKE Studio**, destek **bkestudio@gmail.com** (K33, 2026-10-15) | `lib/panel/rights.ts`, `lib/marketing/config.ts` | Yazılabilir |
| Fiyat, iade, yanıt süresi, uzatma, silme süreci, gizlilik metni | **Karar yok** | — | `[PRICE]`, `[REFUND POLICY]`, `[RESPONSE TIME]`, `[EXTENSION POLICY]`, `[DELETION PROCESS]`; sipariş onay süresi `[ORDER CHECK TIME]` |
| Sipariş onayı (manuel) | `CLAIM_ORDER_VERIFICATION=manual`: taslak hemen açılır, dükkân onaylayana kadar Publish kapalı; onay alıcıya otomatik bildirilmez | `scripts/verify-order.ts`, `Setup.tsx` | Kod + test; canlıda açık olduğu entegratör bildirimi (2026-10-15) → ilanda `[VERIFY: manual order check on in production]`; dükkân `order_confirmed` şablonunu gönderir (docs/19 §4.5) |
| Misafir şifresi, teşekkür modu | Kodda ve yerelde test edildi (G076, G075); şifre ayrı geçici canlı sitede denendi (G078) | `GuestPassword.tsx`, `ThankYou.tsx` | Yazılabilir (G079 canlı yayınından sonra) |
| Özel alan adı, müzik, renk/yazı tipi değiştirme | Yok | — | "not included" olarak yazılır |
| AI ile üretilmiş tasarım parçaları ve örnek fotoğraflar | Doğru (K21: GPT) | — | Açıklamada beyan; Etsy AI/Creativity kuralı `[VERIFY]` |

Ekran görüntüleri gerçek platform ekranlarıdır (yerel üretim build'i, canlı taban adres yapılandırılmış); isimler, fotoğraflar,
sipariş numarası ve misafir yanıtları kurgudur.

## F. Etsy kuralları (kaynak ve durum)

`help.etsy.com` ve `etsy.com` bu ortamdan açılamadı (2026-10-14, DNS/proxy reddi). Değerler Etsy'nin kendi yardım sayfalarının
web araması alıntılarından ("How to Create a Listing", "How to Add Listing Videos", "Requirements and Best Practices for
Images", "How to Manage Your Digital Listings"); **doğrulanmadı** — yayından önce ilan düzenleyicisinde kontrol edilir.
`tools/listing_kit.py` `ETSY` sözlüğünde aynı değerler var.

| Kural | Değer | Not |
|---|---|---|
| Başlık | ≤ 140 karakter; `% : & +` en çok birer kez; 3'ten fazla tamamen büyük harfli kelime yok | |
| Etiket | 13 adet, her biri ≤ 20 karakter | |
| Fotoğraf | ≤ 20; en kısa kenar ≥ 2000 px önerilir | Büyük dosyada yükleme yavaşlayabilir; Etsy sıkıştırır |
| Video | ≤ 2 adet; 5–15 s (bir sayfa 3–15 s diyor); ≤ 100 MB; ≥ 500 px; ses çalınmaz | Kitte 1080 × 1080, sessiz |
| Dijital dosya | ≤ 5 dosya, her biri ≤ 20 MB | Kitte 1 dosya: `START_HERE.pdf` |

## G. Açık konular (kullanıcı / entegratör)

- Ticari kararlar: **alan adı**, **barındırma planı** (Vercel Hobby ticari değil), fiyat, iade, yanıt süresi, uzatma, kayıp link
  süresi, gizlilik metni. (Barındırma süresi K25, dükkân adı + destek e-postası K33 ile verildi.) Karar gelince iki dosya güncellenir (`START_HERE.md`,
  `listing.md`) ve `listing_kit.py pdf` (alan adı değiştiyse `qr`, `images`, `pdf`) yeniden koşulur.
- Etsy'nin dijital ürün kuralları açısından barındırılan site + süreli erişim + PDF'teki link modelinin uygunluğu (docs/13 §1).
- Tema 01'in alt menüsü (`.site-nav`) yarı saydam ve bulanıklıksız: arkadaki yazı menü harflerinin arasından okunuyor (gerçek
  sitede de). İlan ekranlarında `clearEdges()` bunu atlatıyor; tema düzeltmesi (opaklık ≥ .97 + `backdrop-filter: blur`) tema
  sahibinin ayrı işi.
- Panel v2 (G060) yayına girince panel ekranları değişir: `capture` ve `all` yeniden koşulur.
- Gerçek telefon testi (alıcı + misafir yolculuğu) ve QR'ın telefon kamerasıyla okutulması.
- Etsy'de link/QR içeren ilan görseli (8. görsel) politikası; gerekirse 8. görsel çıkarılır (≥ 7 şartı yine sağlanır).
- GPT telefon/laptop mockup'ı (Paket 3) gelirse görseller çerçeveli sürüme geçebilir.
