# Güncel durum — 23 Ekim 2026

Ürün (K22/K24): Etsy alıcısının **bizim platformumuzda panelden düzenlediği düğün websitesi**. Kararlar:
`docs/01_KULLANICI_KARARLARI.md` (bugün K50–K58) · görevler: `gorevler/PANO.md` · platform: `docs/10_SITE_PLATFORMU.md` ·
**lansman: `docs/29_LANSMAN_LISTESI.md`** · makinece: `PROJECT_STATE.json`.

## 1. Canlıda (bkestudio.com)
- Vercel ekibi `bkestudio` (Pro), proje `davetiye-maker`, **Git bağlı: main'e push = production** (docs/10 §2c, 20 Ekim).
  origin/main `4a9fff921` için Vercel'in GitHub durumu "success" (23 Ekim 14:46Z). Production'a gittiği bu bulut oturumundan
  teyit edilemedi (GitHub deployments API 403, Vercel bağlantısı yalnız eski ekibi görüyor); bkestudio.com buradan açılmıyor (vekil 403).
- Canlıda sipariş kontrolü **`trust`** (G191, 22 Ekim): site hemen açılır, dükkân sonra kontrol eder. Etsy API bağlı değil;
  Gmail/IMAP sipariş okuyucu kodda var ama ayarları girilmedi. SMTP, Google Sheets ve Gemini anahtarı kurulu değil
  (K51: hepsi bkestudio01@gmail.com hesabıyla, `docs/37`).
- Satış sitesi `launched: false` (noindex). **Main'de** 01–21 ve 49 hâlâ "live"; ilk dalga düzeltmesi (yalnız 01–20) bu
  entegrasyonda, yayında değil.
- Eski Vercel projesi `davetiye-platform` (daimonflora ekibi, son yayın 17 Ekim `477589f`) READY duruyor; duraklatma kararı açık (K58).

## 2. Bugünkü entegrasyon — dal `claude/adoring-gates-10grne` (push edilmedi, yayında değil)
| Ne | Kaynak |
|---|---|
| SEO/GEO/AEO rehberleri (G980–G992), sosyal medya planı (G970–G971), G192 Gmail notu | merge-1 |
| **22–32 yeni tasarım** (K54, G422–G432): her biri kendi zarfıyla açılıyor; katalog kartları ve klipler yeniden çekildi | merge-2 (modest-brown) |
| **START HERE yeni görünüm** (PR #37); 01–49 rehberleri yeniden üretildi, hizmet daveti ve "Canva" cümlesi yok | merge-3 |
| K50–K58 kararları; `docs/37` (e-posta + Gmail + Sheets kurulumu), `docs/38` (Etsy ilk dalga); saatlik canlı kontrol (G966) | docs dalı |
| **Kullanım Koşulları `/terms` + KVKK aydınlatma `/kvkk`** (5 dil; KVKK'nın Türkçe aslı `/tr/kvkk`), gizlilik ekleri, /start'ta tek satır; hizmetler alıcıya gösterilmiyor (`onSale: false`) | legal dalı (G961, docs/39) |
| **Bir siparişte birden çok tasarım** (G951, K53): /start seçim ekranı (aç / bir site daha), makbuz birimleriyle sınır, trust'ta anında admin To-do; PDF kilidi (G952); RSVP sayaç dayanıklılığı (G953); **ilk dalga 01–20** — 21 ve 49 `preview` (G954); blob yedek betiği (G955); Next.js 16.4.3 + CI `npm audit` | code dalı |
| 01–20 misafir sitesi görsel cilası (şifre sayfası, satır kırılımları, kontrast, yatay telefon); panel üst çubuğu, satış sitesi başlığı, 5 dil eksikleri, 404 sayfaları | vis dalı (docs/41) |
| **Ses efektleri** (K57, G967–G969): 10 → 50 efekt (koddan, fiziksel modelle; kendi işimiz), 49 temanın her birine kendi açılış listesi (3–8 ses, animasyon adımlarına oturuyor), ses saatine göre zamanlayan oynatıcı | audio dalı (docs/40) |
| Entegratör: katalog satıştakileri önce gösteriyor; 22–32 ses testleri yeni açılışlara; 21/49 `etsy_upload.json` `preview`; /start seçim kutusu cilası; /terms-/kvkk meta açıklamaları es/de/fr | bu dal |

Yayına çıkması: bu dal main'e alınınca (push = production). Sonra `docs/38` adım 0 kontrolleri ve canlı kontrol.

## 3. Satış durumu
| Tasarım | Platform (`config.ts`) | Fiyat | Etsy |
|---|---|---|---|
| **01–20** | `live` — **ilk satış dalgası** (K55) | 1.190 TL (K49) | Taslak; 19 görsel + video + PDF; sahibin "yayınla"sıyla tek tek (docs/38) |
| 21 Crimson Rose Atelier | `preview` ("Coming soon on Etsy") | 1.190 TL | Taslak kalır |
| 22–32 | `preview` (yeni tasarım) | `[PRICE]` | Taslak; görseller/video **eski tasarımı** gösteriyor (K54: yeniden çekilecek) |
| 33–48 | `coming` (gizli) | `[PRICE]` | Taslak |
| 49 Ivory Pearl Atelier | `preview` | 1.190 TL | Taslak kalır |
| Hizmetler (kurulum 990, özel tasarım 4.490, ek revizyon 690 TL) | alıcıya gösterilmiyor (`onSale: false`) | — | Taslak |

Etsy: **52 taslak, 0 aktif** (docs/20 §7.13). Bütün tasarım taslaklarındaki START HERE PDF'i eski görünümlü (hizmet daveti ve
"Canva" cümlesi var); yeni PDF'ler repoda, yüklemesi `docs/38` adım 1.

## 4. Testler (23 Ekim, bu dal, Next.js 16.4.3 ile `npm ci` sonrası)
- `npm test` **1946/1946** (0 hata, 0 atlanan; build varken), typecheck yeşil, build yeşil (trace-check ve JS bütçeleri dahil).
- Tarayıcı (build ile, Chromium 390 px): `final-smoke` 45/45 × 3 (01 Olive & Ivory, 06 Art Deco, 19 Midnight Garden),
  `g087-browser` 68/68, `claim-browser` 57/57 (iki tasarımlı sipariş: seçim ekranı, "Aç", "bir site daha"), `marketing-build` 2/2.
- Python araç testleri 113/113; `etsy_upload.py --check` 52/52; 49 `content.demo.json` doğrulaması temiz; görev denetimi temiz.
**Koşulmayanlar:** gerçek telefon (bugünkü değişikliklerden sonra), seslerin kulakla dinlenmesi, canlı sitede herhangi bir şey,
gerçek Etsy makbuzu / satış e-postasıyla G951, blob yedeğinin gerçek depoda çalışması.

## 5. Sahipten beklenenler (uydurulmadı)
1. Veri sorumlusunun yasal adı + posta adresi; satıcının yasal/vergi statüsü; uygulanacak hukuk (K58; docs/39 §4 — 14 madde).
2. Gemini ücretli katman kararı + API anahtarı (K58).
3. Eski `davetiye-platform` Vercel projesinin duraklatılması (K58).
4. bkestudio01 için Gmail uygulama şifreleri + Google Cloud OAuth — yerel oturum `docs/37` ile yapar.
5. 01–20 için ilan ilan "yayınla" (K55, `docs/38`).
6. Etsy ilan yenileme: otomatik mi elle mi (her `etsy_upload.json`'da tek açık madde).
7. "Tested on iPhone and Android phones" cümlesi: denemede iki tür telefon da var mıydı? Yoksa `verified.realDevices` geri alınır.
8. 21'in yeniden tasarımı (`claude/kind-johnson-6eetik`, başka oturum) birleşsin mi; o dal `lib/audio/catalog.ts`'e de dokunuyor.
9. Blob yedeklerinin yeri ve haftalık çalıştırma; Black Friday indirimi.

## 6. Bilinen kalanlar
- Sesler kimse tarafından dinlenmedi (ölçüm ve spektrogramla denetlendi); yeni oynatıcı telefonda denenmedi. Beğenilmeyen efekt
  `tools/audio_fx.py`'de, tema eşlemesi `platform/lib/audio/catalog.ts`'te tek satır (docs/40 §8).
- 22–32: Etsy medyası yeniden çekilecek; paletler yeni parçalardan üretilmedi; gerçek telefon testi yok.
- Satış sitesi "editing tour" panel görselinde eski `davetiye-platform-five.vercel.app` adresi görünüyor (docs/41 §6.3/4).
- `uuid` orta seviye uyarısı (`exceljs` üzerinden; düzeltilmiş sürüm yok); CI yalnız high ve üstünde düşer.
- Blob yedeği betiği hazır, gerçek depoda hiç çalışmadı.
- Açık PR'lar: #11, #16, #31, #32 (22–32 içerik eşitliği; büyük kısmı merge-2 ile geçersiz).
