# Set paketi — platform modeli (K22–K24): alıcının aldığı ve Etsy ilan kiti

Her tasarım (tema) **tek ürün** olarak satılır: alıcının kendi panelinden düzenlediği, bizim platformumuzda
barındırılan mobil öncelikli düğün sitesi (`docs/10_SITE_PLATFORMU.md`). Etsy'de alıcının indirdiği tek dosya
**START HERE PDF**'idir; içindeki başlat linki (`/start?theme=<tema>`) siteyi açtırır. Bu belge her tema için
alıcı paketini, ilan kitini, bitti şartlarını ve dürüst iddia listesini tanımlar. Durum her koleksiyonun
`COLLECTION_STATUS.md`'sinde bu listeyle aynı sırada tutulur (entegratör).

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
| A6 | **START HERE PDF** (alıcının Etsy'den indirdiği tek dosya) | `collections/<NN_*>/package/customer/START_HERE.pdf` | Başlat linki tıklanabilir (PDF'te /URI) ve canlıda açılıyor; QR aynı URL'yi kodluyor (`make_qr` ayarları); adımlar **gerçek ekran görüntüleriyle**; SSS; ticari alanlar açık yer tutucu; ≤ 20 MB |

Pakette **yok**: basılı davetiye, video, özel alan adı, müzik, yazı tipi dosyası. Kişisel alanlar görsele pişirilmez
(AGENTS şart 7): bütün metin ve fotoğraflar içerik kaydında, tema görselleri isimsiz.

## B. Etsy ilan kiti (bizim için — `collections/<NN_*>/package/`)

| # | Parça | Dosya | Not |
|---|---|---|---|
| B1 | İlan metni | `listing/listing.md` | §0 durum tablosu · başlık (≤ 140) · açıklama · 13 etiket (≤ 20) · kategori/nitelikler · görsel sırası + alt metin · video · SSS · alıcı mesajı · yayın öncesi kontrol listesi. Doğrulanmamış iddia `[VERIFY]`, ticari alan `[PLACEHOLDER]` |
| B2 | İlan görselleri | `listing/images/*.png` | ≥ 7, 2000 × 2000. Şu an 8: kapak, misafir sayfaları, What's included, How it works, editör, RSVP, Details, canlı demo QR. Yalnız yerleşim + tipografi (K21); tema kendi GPT parçaları (kâğıt, köşe çiçekleri) ve gerçek ekran görüntüleri; çizilmiş dekor ve rakip görseli yok. Telefon çerçevesi GPT mockup'ı (Paket 3) gelene kadar çerçevesiz, yuvarlatılmış ekran |
| B3 | İlan videosu | `listing/video.mp4` | Temanın açılış kaydından: 1080 × 1080, H.264, sessiz, 5–15 s, ≤ 100 MB |
| B4 | İlan PDF'i | `listing/listing_<tema>.pdf` | B1'in tamamı + görsellerin küçükleri + video bilgisi (kare, süre, boyut, kural kontrolü) |
| B5 | Kaynak ekranlar | `shots/` | `capture.ts` çıktısı: 25 ekran (JPEG, 390 px, DPR 3), `opening.webm`, `capture.json` (ayarlar + kontroller), örnek CSV |

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
  bulanıklaştırılır; parçacık katmanları (düşen yaprak) durağan resimlerde gizlenir.
- Metinler (`START_HERE.md`, `listing.md`) elle yazılır; araç yalnız dosya üretir. `listing.md` içindeki
  `<!-- listing-kit:media -->` satırının yerine PDF'te görsel küçükleri ve video bilgisi gelir.
- Başlat linki tabanı `LISTING_BASE_URL` (varsayılan `https://davetiye-platform-five.vercel.app`). **Alan adı değişirse bütün
  START HERE PDF'leri ve 8. görsel yeniden üretilmeli** (linkler ve QR'lar adrese bağlı).
- `check`: başlık/etiket kuralları, görsel sayısı/ölçüsü, video kuralları (süre, boyut, ses yok, H.264), QR'ın başlat linkini
  modül modül kodladığı, PDF'te tıklanabilir başlat linki, PDF ≤ 20 MB.

## D. Bitti şartları (tema başına)

- [ ] A1–A5 platformda; tema **canlıda yayında**, güncel platform sürümü (G051 takvim/SSS/sorular dahil) **yayında**
- [ ] `START_HERE.pdf`: link canlıda açılıyor, QR telefon kamerasıyla okutuldu, ekranlar güncel
- [ ] `listing.md`: §0 durum tablosu güncel; `[VERIFY]` kalmadı ya da cümle silindi; ticari alanlar dolduruldu
- [ ] `images/` ≥ 7, `video.mp4`, `listing_<tema>.pdf`; `listing_kit.py check` sorunsuz
- [ ] Alıcı yolculuğu gerçek bir iPhone (Safari) ve Android (Chrome) telefonda denendi
- [ ] Etsy kuralları ilan düzenleyicisinde yeniden kontrol edildi (aşağıda §F)

## E. Dürüst iddia listesi (2026-10-14)

| İddia | Durum | Kanıt | İlanda / kılavuzda |
|---|---|---|---|
| Canva hesabı gerekmez, uygulama kurulmaz | Doğru (ürün platformun kendisi, web) | Mimari | Yazılabilir |
| Telefondan düzenleme | Panel 390 px **Chromium mobil emülasyonunda** test edildi (G039 74 kontrol, `final-smoke`); **gerçek iPhone/Android denenmedi** | `platform/previews/g039`, `final` | "made for phone screens" + `[VERIFY]`; "tested on iPhone" yazılmaz |
| Misafir RSVP → panelde liste + CSV | Yerelde ve **canlıda** test edildi | G042 testleri, G044 canlı uçtan uca 30/30 | Yazılabilir |
| RSVP özel soruları, takvime ekle, SSS | Yerel üretim build'inde test edildi (G051, 44 kontrol); **canlı yayında yok** (2026-10-14 canlı demo eski sürüm) | `tests/g051-browser.ts` | `[VERIFY: live after redeploy]` |
| Fotoğraf yükleme + kırpma | Yerel + canlı (G044: sharp Vercel'de çalışıyor) | G039, G044 | Yazılabilir |
| Yayınla, link, QR | Yerel; QR ekran görüntüsünden `jsqr` ile çözüldü, **telefon kamerasıyla okutulmadı** | `panel-browser.ts` | Yazılabilir; "scan before you print" uyarısı kılavuzda |
| `/start` ile başlama | Yerel + canlı (G044: sahiplenme 201, aynı sipariş 409) | G045, G044 | Yazılabilir. **Tema 01 canlıda yok** (2026-10-14: "This start link is not valid") |
| Etsy siparişinin doğrulanması | **Yok** (yalnız biçim + sipariş başına bir site) | `lib/claim/verify.ts` | "we verify your order" yazılmaz; satış öncesi şart (docs/10 §3) |
| Düzenleme linkinin e-postayla gönderilmesi | **Yok** | `lib/claim/mailer.ts` | Kılavuz: "we cannot email it yet", "Email it to myself" = alıcının kendi posta uygulaması |
| Kayıp link yenileme | Operatör aracı yerelde test edildi; canlı depoda denenmedi; süreç karar bekliyor | `scripts/reissue-edit-key.ts` | `[LOST LINK POLICY]` yer tutucu |
| "Daha hızlı", "en iyi" | Ölçülmedi | — | Yazılmaz |
| Barındırma süresi, fiyat, iade, destek, gizlilik metni | **Karar yok** | — | `[HOSTING PERIOD]`, `[PRICE]`, `[REFUND POLICY]`, `[SUPPORT EMAIL]`, `[PRIVACY NOTICE LINK]` |
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

- Tema 01 (`olive-ivory`) ve G051/G055 platform sürümünün yayına alınması (yayın bu görevin kapsamı dışında).
- Ticari kararlar: mağaza/marka adı, fiyat, barındırma süresi, iade, destek e-postası ve yanıt süresi, kayıp link politikası,
  gizlilik metni. Karar gelince iki dosya güncellenir (`START_HERE.md`, `listing.md`) ve `listing_kit.py pdf` yeniden koşulur.
- Gerçek telefon testi (alıcı + misafir yolculuğu) ve QR'ın telefon kamerasıyla okutulması.
- Etsy'de link/QR içeren ilan görseli (8. görsel) politikası; gerekirse 8. görsel çıkarılır (≥ 7 şartı yine sağlanır).
- GPT telefon/laptop mockup'ı (Paket 3) gelirse görseller çerçeveli sürüme geçebilir.
