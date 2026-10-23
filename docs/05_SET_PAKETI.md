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
| B1 | İlan metni | `listing/listing.md` → güncel metin `listing/listing_v3.md` (G091; docs/19 §4 iskeleti; onaylanınca `listing_kit.py` ona geçer) | §0 durum tablosu · başlık (≤ 140) · açıklama · 13 etiket (≤ 20) · kategori/nitelikler · görsel sırası + alt metin · video · SSS · alıcı mesajı · yayın öncesi kontrol listesi. Doğrulanmamış iddia `[VERIFY]`, ticari alan `[PLACEHOLDER]` |
| B2 | İlan görselleri | `listing/images/*.png` | ≥ 7, 2000 × 2000. Şu an 8: kapak, misafir sayfaları, What's included, How it works, editör, RSVP, Details, canlı demo QR (`listing/demo_qr.png`). Yalnız yerleşim + tipografi (K21); tema kendi GPT parçaları (kâğıt, köşe çiçekleri) ve gerçek ekran görüntüleri; çizilmiş dekor ve rakip görseli yok. Telefon çerçevesi GPT mockup'ı (Paket 3) gelene kadar çerçevesiz, yuvarlatılmış ekran. **Kapak** arama sonucu boyutunda (~300 px) okunmalı: tema adı + "Wedding Website · RSVP" (68 px) + üç etiket ("No Canva needed · RSVP built in · Live demo", 50 px), hepsi y = 250–1750 arasında (olası 4:3 orta kırpma); ilan PDF'inde kapağın 300 px ve 4:3 önizlemesi var. Yazılar telefonda okunur boyda (Etsy görseli ~390 px gösterir: alt yazı ≥ 40 px, not ≥ 38 px) |
| B3 | İlan videosu | `listing/video.mp4` | Temanın açılış kaydından: 1080 × 1080, H.264, sessiz, 5–15 s, ≤ 100 MB |
| B4 | İlan PDF'i | `listing/listing_<tema>.pdf` | B1'in tamamı + görsellerin küçükleri + video bilgisi (kare, süre, boyut, kural kontrolü) |
| B5 | Kaynak ekranlar | `shots/` | `capture.ts` çıktısı: 26 ekran (JPEG, 390 px, DPR 3), `opening.webm`, `capture.json` (ayarlar + kontroller), örnek CSV |

## C. Üretim — `tools/listing_kit.py`

```bash
cd platform && npm ci && npm run build && cd ..          # bir kez (yerel üretim build'i; yayın yok)
export NODE_PATH=/opt/node22/lib/node_modules PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers
python3 tools/listing_kit.py capture --theme <tema>      # gerçek ekranlar + açılış kaydı → package/shots/
python3 tools/listing_kit.py all --theme <tema>          # qr, strips, images, video, pdf, check
python3 tools/tests/test_listing_kit.py                  # araç testleri
```

- `capture` (`tools/listing_templates/capture.ts`): yerel `next start`, geçici veri klasörü. Temanın demo kaydı (kurgu isimler,
  PAKET 2 örnek fotoğrafları) + 3 örnek SSS + 1 RSVP sorusu yayında; 4 kurgu misafir yanıtı API'den. Misafir ekranları,
  `/start` → panel → foto → önizleme → yayın akışı, panelde yanıtlar, tema demosu ve açılış kaydı. `PLATFORM_PUBLIC_URL` = canlı
  taban adres (ekranlardaki adresler gerçek biçimde görünsün). Düzenleme anahtarı resimde maskelenir; yerel siteye giden QR
  yerine "QR code (hidden in this picture)" kutusu konur; alt sayfaların (kırpma, "Before you publish", yayın) arkasındaki
  karartma panelin düz zeminiyle değişir; parçacık katmanları (düşen yaprak) durağan resimlerde gizlenir. Her durağan ekran
  `clearEdges()` denetiminden geçer: üst kenarda kesik yazı/alan yok, arkası görünen menünün (tema 01) arkasında yazı ya da
  foto yok; temiz konum yoksa ekran menünün üst kenarından kısa kesilir (resim yanıltmaz, yalnız kısalır).
- Metinler (`START_HERE.md`, `listing.md`) elle yazılır; araç yalnız dosya üretir. `listing.md` içindeki
  `<!-- listing-kit:media -->` satırının yerine PDF'te görsel küçükleri ve video bilgisi gelir.
- Başlat linki tabanı `LISTING_BASE_URL` / `GUIDE_BASE_URL` (varsayılan `https://bkestudio.com`, G189 2026-10-18: kullanıcının aldığı
  bkestudıo.com; START HERE, QR'lar ve ilan metinleri bununla yeniden üretildi). Önceki not: **alan adı ilk satıştan önce
  kesinleşmeli** (ya da bu adresten kalıcı yönlendirme taahhüt edilmeli; K26: alan adı şimdilik alınmıyor, yani ilk satışlar bu
  adresle olursa ileride alan adına geçerken bu adresten kalıcı yönlendirme şart): satılmış START HERE PDF'leri ve özellikle alıcıların
  kendi davetiyelerine bastırdığı QR'lar (kılavuz adım 6) `davetiye-platform-five.vercel.app/<adres>`'e bağlı; satıştan sonra alan
  adı değişirse yönlendirme olmadan hepsi kırılır. Adreste Türkçe "davetiye" ve markasız `vercel.app` var (alıcı güveni zayıf).
  Alan adı değişince bütün START HERE PDF'leri, QR'lar ve 4./5./8. görseller yeniden üretilir. `check`, taban `*.vercel.app`
  iken uyarı yazar.
- `check`: başlık/etiket kuralları, görsel sayısı/ölçüsü, video kuralları (süre, boyut, ses yok, H.264), QR'ın başlat linkini
  modül modül kodladığı, PDF'te tıklanabilir başlat linki (linksiz PDF de hata), PDF ≤ 20 MB.
- `check --prepublish` (ilan yüklenmeden önce): canlı başlat linki ve demo 200 + sayfada tema adı; 8. görselin demo QR'ı
  (`listing/demo_qr.png`) demo linkini kodluyor; `listing.md`, `START_HERE.md` ve iki PDF'te `[VERIFY …]` ya da köşeli
  parantezli ticari yer tutucu (`[SHOP NAME]`, `[PRICE]` …) kalmamış. Bu ortamda vercel.app'e proxy izin vermediği için canlı
  kısım burada "could not connect" ile düşer; canlı kontrol Vercel bağlayıcısıyla yapılıp §E'ye yazıldı.

## D. Bitti şartları (tema başına)

- [x] A1–A5 platformda; tema **canlıda yayında**, güncel platform sürümü (G051 takvim/SSS/sorular dahil) **yayında** — 01 ve 03,
  2026-10-14 (Vercel bağlayıcısı; canlı = main `59b1291`, platform ağacı bu kitinkiyle aynı). SSS ve RSVP soruları canlıda
  uçtan uca denenmedi (§E).
- [ ] `START_HERE.pdf`: link canlıda açılıyor, QR telefon kamerasıyla okutuldu, ekranlar güncel
- [ ] `listing.md`: §0 durum tablosu güncel; `[VERIFY]` kalmadı ya da cümle silindi; ticari alanlar dolduruldu
- [ ] `images/` ≥ 7, `video.mp4`, `listing_<tema>.pdf`; `listing_kit.py check` sorunsuz
- [ ] Alıcı yolculuğu gerçek bir iPhone (Safari) ve Android (Chrome) telefonda denendi
- [ ] Etsy kuralları ilan düzenleyicisinde yeniden kontrol edildi (aşağıda §F)
- [x] **Son alan adı ilk satıştan önce seçildi** (bkestudıo.com, G189 2026-10-18); START HERE PDF'leri ve QR'lar onunla yeniden
  üretildi (§C). Açık: başlatma linki bu adreste telefondan 200 dönüyor mu (canlı doğrulama), eski Vercel adresinden 308 yönlendirme
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
| Diller | **G144'ten beri (G090'da 5 sitede denendi):** site ve misafir metinleri EN/TR/ES/DE/FR (Us → Languages; dil düğmesi, `?lang=`); alıcının kendi metni "Translate automatically" ile taslak (tarayıcı çevirmeni ya da MyMemory) + onay; ilan ve START HERE G154'te buna göre ("manual check" önerilir). Aşağısı G144 öncesi: Site arayüzü (başlıklar, düğmeler, RSVP formu, takvim metni) yalnız İngilizce; tarih stili en-US/GB/CA/AU. Alıcının kendi metinleri: aksanlı Latin ve Kiril tema fontlarıyla çıkıyor; Yunanca script alanlarda düz yedek fonta düşüyor, Çince/Arapça/Korece yedek fontla (yerel Chromium, 2026-10-14, iki tema) | `components/panel/sections.tsx` LOCALES | İlanda PLEASE NOTE + SSS "Is it available in other languages?" |
| iPhone HEIC fotoğrafları | Panel HEIC'i kabul ediyor; çözme tarayıcıya bağlı; **gerçek iPhone'da denenmedi** | `PhotosSection.tsx`, platform/README | Kılavuz yalnız "açılmazsa JPEG/PNG kopyasını seçin" der; "only in Safari" yazılmaz |
| Süre ("20–30 dakika") | Ölçülmedi | — | Yazılmaz |
| Fotoğraf yükleme + kırpma | Yerel + canlı (G044: sharp Vercel'de çalışıyor) | G039, G044 | Yazılabilir |
| Yayınla, link, QR | Yerel; QR ekran görüntüsünden `jsqr` ile çözüldü, **telefon kamerasıyla okutulmadı** | `panel-browser.ts` | Yazılabilir; "scan before you print" uyarısı kılavuzda |
| `/start` ile başlama | Yerel + canlı (G044: sahiplenme 201, aynı sipariş 409) | G045, G044 | Yazılabilir. İki temanın başlat sayfası canlıda (2026-10-14 07:39 UTC, Vercel bağlayıcısı; 01 aynı günün ilk kontrolünde yoktu, G049 yayınıyla geldi) |
| Etsy siparişinin doğrulanması | **Yok** (yalnız biçim + sipariş başına bir site; `FormatOnlyVerifier`) | `lib/claim/verify.ts` | "we verify your order" yazılmaz; başlat linki herkes için aynı adres olduğundan "personal start link" de yazılmaz. docs/10 §3 kararı: ilk sürüm biçim kontrolü + kayıt, Etsy API doğrulaması sonra |
| Düzenleme linkinin e-postayla gönderilmesi | **Yok** | `lib/claim/mailer.ts` | Kılavuz: "we cannot email it yet", "Email it to myself" = alıcının kendi posta uygulaması |
| Kayıp link yenileme | Operatör aracı yerelde test edildi; canlı depoda denenmedi. Süreç (G091): alıcı Etsy'de sipariş numarasıyla yazar → dükkân yeni link üretir (eski link hemen ölür) → `new_edit_link` şablonu (docs/19 §4.5); panel açıkken link Share → Your private edit link'ten yeniden kopyalanır | `scripts/reissue-edit-key.ts`, `views.tsx` | Süreç yazılabilir; süre vaadi yazılmaz (yanıt süresi 24 saat, kullanıcı 2026-10-15) |
| "Daha hızlı", "en iyi" | Ölçülmedi | — | Yazılmaz |
| Barındırma süresi, dükkân adı, destek e-postası | **Karar var:** düğünden 12 ay sonrasına kadar (K25; panelde Home → Dates → "Online until"); dükkân adı **BKE Studio**, destek **bkestudio01@gmail.com** (K33, 2026-10-15) | `lib/panel/rights.ts`, `lib/marketing/config.ts` | Yazılabilir |
| Fiyat, uzatma, silme süreci, gizlilik metni | **Karar var (2026-10-17):** fiyat 1.460 TL (K42); **K48** koordinatör varsayılanları (kullanıcı istediğinde değiştirir): sipariş onayı "usually within 24 hours" (Etsy doğrulaması açılınca anında); kayıp link = `/my` (sipariş no + e-posta); uzatma "Online until"dan önce Etsy'den yazana yapılabilir, ücret sözü yok; silme Etsy'den sipariş no ile, site + fotoğraflar + misafir yanıtları 30 gün içinde; site çevrimdışı olduktan sonra 12 ay arşiv, sonra silinir; Etsy dükkân linki `https://www.etsy.com/shop/STUDIOBKE`; gizlilik sayfası koddan yeniden yazıldı (G154), `[PRIVACY REVIEW]` sayfada yok, hukuki okuma önerisi yalnız belgelerde (`verified.privacyText` false kalır). **Açık:** alan adı, barındırma planı | `lib/marketing/config.ts` `policies`, `components/marketing/pages/PrivacyPage.tsx`, docs/19 Ek A, docs/01 K48 | G154: START HERE (21), `listing_v3.md` (21) ve satış sitesi bu metinlerle; yer tutucu kalmadı. §4.5 mesaj şablonları (admin kopyası) G155'te |
| İade, yanıt süresi | **Karar var** (kullanıcı, 2026-10-15) | `platform/lib/marketing/config.ts`, docs/19, docs/20 §4 | İade yok (digital, instant access), "çalışmazsa düzeltiriz"; yanıt süresi 24 saat. Etsy'de iptal politikası "not accepted" yayında (docs/20 §7) |
| Sipariş onayı (manuel) | `CLAIM_ORDER_VERIFICATION=manual`: taslak hemen açılır, dükkân onaylayana kadar Publish kapalı; onay alıcıya otomatik bildirilmez | `scripts/verify-order.ts`, `Setup.tsx` | Kod + test; canlıda açık olduğu entegratör bildirimi (2026-10-15) → ilanda `[VERIFY: manual order check on in production]`; dükkân `order_confirmed` şablonunu gönderir (docs/19 §4.5). **G154:** ilan cümlesi her modda doğru olacak biçimde koşullu ("If your editor says it is confirming your Etsy order … usually within 24 hours"), VERIFY kalktı; canlıdaki mod ilanın §11 kutusunda |
| Misafir şifresi, teşekkür modu | Kodda ve yerelde test edildi (G076, G075); şifre ayrı geçici canlı sitede denendi (G078) | `GuestPassword.tsx`, `ThankYou.tsx` | Yazılabilir (G079 canlı yayınından sonra) |
| Özel alan adı, müzik, renk/yazı tipi değiştirme | Özel alan adı ve renk/font değişikliği yok. **Müzik var** (G126); **basılabilir davetiye + site PDF'i var** (G139, Share → Downloads; G090: 6 tasarımda indi ve açıldı, yerleşim sorunu P1-01 G155'te) | `lib/marketing/facts.ts` | G154: satış sitesinde müzik, 5 dil ve Downloads "Included"; "Not included" yalnız özel alan adı, renk/font/yerleşim, e-postayla davet gönderme, liste içe aktarma, 5 dil dışı sabit metin, baskı/kargo, save the date |
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

- Ticari kararlar: **alan adı**, **barındırma planı** (Vercel Hobby ticari değil), ~~fiyat, iade, yanıt süresi, uzatma, kayıp link
  süresi, gizlilik metni~~ (fiyat K42; iade + yanıt süresi 2026-10-15; uzatma, kayıp link, silme, arşiv, sipariş onay süresi ve
  Etsy dükkân linki K48 — G154'te START HERE, ilan ve satış sitesine işlendi; gizlilik metninin hukuki okuması açık). (Barındırma süresi K25, dükkân adı + destek e-postası K33 ile verildi.) Karar gelince iki dosya güncellenir (`START_HERE.md`,
  `listing.md`) ve `listing_kit.py pdf` (alan adı değiştiyse `qr`, `images`, `pdf`) yeniden koşulur.
- Etsy'nin dijital ürün kuralları açısından barındırılan site + süreli erişim + PDF'teki link modelinin uygunluğu (docs/13 §1).
- Tema 01'in alt menüsü (`.site-nav`) yarı saydam ve bulanıklıksız: arkadaki yazı menü harflerinin arasından okunuyor (gerçek
  sitede de). İlan ekranlarında `clearEdges()` bunu atlatıyor; tema düzeltmesi (opaklık ≥ .97 + `backdrop-filter: blur`) tema
  sahibinin ayrı işi.
- Panel v2 (G060) yayına girince panel ekranları değişir: `capture` ve `all` yeniden koşulur.
- Gerçek telefon testi (alıcı + misafir yolculuğu) ve QR'ın telefon kamerasıyla okutulması.
- Etsy'de link/QR içeren ilan görseli (8. görsel) politikası; gerekirse 8. görsel çıkarılır (≥ 7 şartı yine sağlanır).
- GPT telefon/laptop mockup'ı (Paket 3) gelirse görseller çerçeveli sürüme geçebilir.
