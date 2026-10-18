# Tasarımlar 22–32: tamamlanma ve eşleşme denetimi

18 Ekim 2026. Kaynak: main `df519744e5288cfc50de064ac000d89ef62f2d91`.
Bu kayıt bütün ürünlerin tamamlandığına veya satışa açıldığına dair onay değildir.

## Kullanıcının hedefi

Yeni 11 ürün de eski ürünler gibi eksiksiz olmalı: iç sayfalar, ayrı hareket eden görsel katmanlar,
kişiselleştirme, fotoğraflar, RSVP, harita, takvim ve Etsy teslimi aynı ürünün parçaları olmalı.
Her tasarımın görsel kimliği korunmalı; yalnız katalog kapağının değiştirilmesi yeterli değildir.

## Canlıda doğrudan görülen durum

- Vercel projesi `davetiye-maker`, takım `team_Y9hcAxWqu4IIvOlSF2shzQgG`.
- Üretim dağıtımı `dpl_5aFK64U2wZx58VjbReoaYBn7PbwQ`, READY. Kaydı PR #31'deki kapak CSS düzeltmesiyle ilişkili.
- `https://xn--bkestudo-zkb.com/designs` 32 tasarım gösteriyor. 22–32 için “Coming soon on Etsy”.
- `https://bkestudio.com` bu oturumun tarayıcısında 502/connection refused verdi; bu alan adı proje alan adları arasında yok.
  Alan adı ve DNS bu değişiklikte değiştirilmedi. Kullanıcının istediği ASCII adresle canlı alan adı farklı.
- `https://www.etsy.com/shop/STUDIOBKE` halka açık mağaza sayfasında “All 0”, “No items listed at this time” gösteriyor.
  Bu gözlem özel taslakların olmadığını kanıtlamaz. Aktif ilanların 21 veya 32 olduğu doğrulanmadı; gözlenen aktif sayı 0.
- `lib/marketing/config.ts`: 21 tasarım `live`, 11 `preview`. `live` bir uygulama durumudur; Etsy yayını kanıtı değildir.
- Bütün tasarımların Etsy ilan URL'leri `[ETSY LISTING URL]`; `lib/etsy/listings.json` eşleştirmesi boş.

## Eski ürünlerdeki üretim yapısı

Model: `themes/blush-garden-rose/`, `themes/olive-ivory/`; sözleşme: `docs/11_TEMA_STANDARDI.md`.

1. Koleksiyonun `assets/gpt/parts/` ve `photos/` kaynakları özgün parçaları taşır. Kişisel yazı ve fotoğraflar resme pişirilmez.
2. `build_images.py`, `tools/tema_build.py` ve parça hazırlama araçları alfa temizliği, fotoğraf penceresi,
   kapalı/açık nesne hizası ve yerleşim ölçülerini üretir. Optimize çıktılar `themes/<id>/img/` altında,
   geometri/katman kaydı `img/manifest.json` içindedir.
3. `index.html`: kapanış elemanı, dış kapak, iç kapak, arka parça, ön cep ve kart ayrı katmanlardır.
   `site.js` MOTION zamanlarını, `site.css` hareket ve yerleşimi taşır. Kart Home'a geçer; Story/Details/RSVP ayrı sayfalardır.
4. Beş foto alanı `theme.json` üzerinden panel verilerine bağlanır. İsim, tarih, program, metin ve bağlantılar
   `data-field`, `data-copy`, `data-photo` ve ortak render motoruyla doldurulur.
5. Harita, takvim, ses, RSVP formu, teşekkür modu ve ek içerik blokları platform sözleşmelerini kullanır.
6. Gerçek tema ekran görüntüleri ve açılış kaydı pazarlama varlıklarına çevrilir; ilan görseli gerçek ürünü gösterir.
7. START HERE PDF, ilan metni/görselleri, gerçek Etsy ilan ID'si ve `/start?theme=<id>` bağlantısı aynı ürüne bağlanır.

## Yeni 11 üründeki gerçek durum

Hepsinde beş sayfa ve beş düzenlenebilir foto alanı var. Hepsinin görsel manifesti geçici üretim kullanıldığını söylüyor.
Koleksiyonlarında START HERE PDF ve `etsy_upload.json` bulunması, bunların canlıda doğrulandığını veya Etsy'ye yüklendiğini göstermez.

| # | Tasarım | Mevcut açılış / geçici parça kaynağı | Açık kalan üretim |
|---|---|---|---|
| 22 | Nocturne Lake Estate | Tek kapalı zarf resminden kesilen kapak/cep/mühür; yeniden kullanılan çift/göl/teras resimleri | Ayrı özgün zarf içi, kart ve dekor parçaları; özgün foto seti; gerçek ekran/ilan eşleşmesi |
| 23 | Velvet Jewel Box | 17/14/01 dokularından geçici kutu, saten ve kâğıt | Gerçek kutu katmanları; beş örnek fotoğraf; kapak ve demo tutarlılığı |
| 24 | Grand Theatre Premiere | 06 kadife ve 21 kâğıdından geçici perde/sahne | Özgün perde/sahne/program parçaları ve fotoğraflar |
| 25 | Orient Express Voyage | Geçici cüzdan, kayış ve bilet yüzeyleri | Deri/pirinç parçaları, pencere çerçeveleri ve fotoğraflar |
| 26 | Kintsugi & Washi | Başka tasarımların tonlanmış kâğıtları | Özgün katlar, kintsugi/mürekkep parçaları ve fotoğraflar |
| 27 | Riad Lantern Nights | 10 ahşap ve 05 sıva/çini parçalarından geçici kapı | Özgün kapı, fener, çini, kemer ve fotoğraflar |
| 28 | Maison Pâtisserie | Başka tasarımların kâğıt/saten dikdörtgenleri ve fiyonk | Özgün kutu, raf, pasta/dekor ve fotoğraflar |
| 29 | Celestial Observatory | Başka tasarımlardan tonlanmış gök/kâğıt/pirinç | Özgün kubbe, gök haritası, yıldız parçaları ve fotoğraflar |
| 30 | Azulejo Mosaic | 05'in çini bordürü ve 05/18 dokuları | Özgün mozaik/çini, pencere/dekor ve fotoğraflar |
| 31 | Sky Lantern Festival | 02 suluboya ve 18 kâğıt parçaları | Özgün fener/gökyüzü/paralaks parçaları ve fotoğraflar |
| 32 | Music Box Ballerina | Kâğıt/saten dikdörtgenleri; 14 oval çerçeve ve 17 disk | Özgün kutu, ayna, balerin/anahtar parçaları ve fotoğraflar |

23–32'nin `content.demo.json` medya alanları boş ve `lib/claim/demo-photos.json` içinde kendi foto setleri yok.
22 kendi üç kaynak resmini kullanıyor; bu tamamlanmış beşli fotoğraf setiyle eşdeğer değil.
`lib/marketing/assets.json` yalnız 21 tasarımın gerçek ekran/klip kaydını içeriyor: yeni 11 üründe iç sayfa ekranları eksik.
`InvitationCover.tsx` yeni 11 ürünü ayrı, statik zarf kapaklarıyla sunuyor; örneğin Velvet demosu hâlâ kutu açıyor.
Bu, satın alınacak ürünle kapak arasında çözülmesi gereken farktır. Sadece PR #31 CSS'ini almak bunu çözmez.

## Bu değişiklikte yapılan kod düzeltmeleri

- Maison demo haritası Savannah'dan içerikte yazan Newport, Rhode Island'a alındı. Kullanıcının kendi harita pini korunur.
- 11 temada odaklanan/bağlantıyla kaydırılan içerik sabit alt menünün ve cihaz güvenli alanının üstünde kalacak kaydırma payı eklendi.
- Ortak dil seçicinin özet/link/kapatma hedefleri 44 px yapıldı.
- `tests/new-design-content-parity.test.ts`: 11 gerçek temanın 55 sayfası alıcı isimleri ve kendi beş fotoğrafıyla render edilir;
  örnek çiftin sızmadığı, foto alanları, takvimler, RSVP ve açılış/Home bağlantısı kontrol edilir.

## Doğrulama

- `npm run typecheck`: geçti.
- `node --test tests/new-design-content-parity.test.ts`: 12/12 geçti; 11 tasarım × 5 gerçek şablon ve harita koruma kontrolü.
- `git diff --check`: geçti.
- Bunlar sunucu render testleridir. Gerçek cihaz/animasyon/görsel kalite testi olarak sayılmaz.
- Bu turda tam üretim build'i, tüm repo testleri, gerçek iPhone/Android, canlı Google Sheets, alıcı siparişi,
  Etsy ilan yüklemesi veya bu değişikliklerin üretime dağıtımı yapılmadı.

## Tamamlandı saymak için kalan işler

1. Her koleksiyonun mevcut `assets/gpt/GPT_PROMPTS.md` tariflerindeki özgün parçaları ve aynı kurgusal çifte ait foto setini üret/yerleştir.
   Geçici katmanları yalnız yeniden boyamak tamamlanma değildir.
2. Her `build_images.py` hattını gerçek parçalarla çalıştır; alfa, foto penceresi, kapak eklemi ve katman geometrisini gözle doğrula.
   Baskı zeminleri için mevcut PAKET 6 ölçüm adımlarını ayrıca uygula.
3. Her temayı mobil uzun isim/fotoğraf, reduced motion, açılış/replay, dört iç sayfa, RSVP, harita/takvim ve teşekkür moduyla dene.
4. Gerçek ekranları ve açılışları yakala; katalog ve Etsy görsellerini aynı gerçek ürün kaydından üret.
5. Doğrulanmış yayın alan adıyla START HERE/QR ve ilan bağlantılarını yeniden oluştur ve açarak test et.
6. Hazır ürünleri Etsy'de taslaklara yükle; gerçek ilan ID/URL'lerini site ve `lib/etsy/listings.json` ile eşleştir.
   Etkin ilan sayısını dışarıdan yeniden doğrula. Bu oturum Etsy hesabında oturum açmış değil; açık mağazaya yalnız okuma yapıldı.
7. Ancak bu doğrulamalardan sonra 22–32'yi satışa hazır kabul et. `preview` → `live` tek başına bunların yerine geçmez.
