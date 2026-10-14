# Güncel durum — 15 Ekim 2026

Bu dosya K22–K29 kararları ile güncel kaynak kodunu özetler. Eski Canva/video kayıtları geçmiş içindir; tamamlanma, katalog onayı ve canlı yayın ayrı değerlendirilir.

## Tamamlanan temel
- BKE Studio marka kiti, satış sitesi, 3 adımlı kurulum ve 6 sayfalık editör.
- Taslak/yayın ayrımı, fotoğraf kırpma, düzenleme hakkı/arşiv, takvim, RSVP yönetimi/CSV, şifre ve teşekkür modu.
- Katalog onaylı: 01 Olive & Ivory, 02 Dusty Blue, 03 Blush Garden Rose, 05 Mediterranean Lemon.
- 04 Vintage Airmail tema kodu var; kabul/G081/G084 kapanışı bekliyor. 06–20 tema üretimi tamam değil.
- G085: RSVP, veri adaptöründe ortak sayaç varsa bunu kullanıyor. Yerel bellek ve test override davranışı korunuyor. G085 testleri iki ayrı Blob adaptörü, paralel istek ve süreç belleği sıfırlanmasını kapsıyor.
- 01/03 START_HERE.md yeni panelin gerçek Us / Day & place / Photos / Our Story / Details / RSVP sayfaları, Guests ve Download list, Review, QR düğmeleri, şifre/teşekkür modu ile eşitlendi. Eski panel ekran görüntüleri bu kaynak rehberlerden çıkarıldı.

## Bu turdaki doğrulama
- Yerel tam Node paketi: 570 test, 559 geçti, 0 hata, 11 atlandı (production build öncesi; Python/tarayıcı/build önkoşulları).
- Hedef RSVP/claim paketi: 45/45.
- TypeScript typecheck temiz.
- Yerel Webpack production derlemesi geçti; derlenmiş satış sayfaları 2/2.
- Varsayılan Turbopack derlemesi Windows korumalı ortamda gerçek yol çözümleme erişimi nedeniyle çalışmadı. Webpack çıktısı trace-check'te 16 dosya-paketleme hatası verdi; bu çıktı canlıya gönderilmeyecek. Yerel ortamın fs.realpath/mkdir hataları için yalnız çalışma alanında uyumluluk yardımcısı kullanıldı; ürün kaynaklarına eklenmedi.
- GitHub Actions eklendi: Node 22, npm ci, tüm testler, varsayılan npm run build + trace-check, typecheck, derlenmiş satış sayfaları. Uzak sonuç ayrıca kontrol edilir; iş akışının varlığı başarılı koşu demek değildir.

## Canlı durum
Son doğrulanmış görev kaydı G078: 2dc812b. 15 Ekim ilk incelemede canlı ana sayfa iki temayı (01/03) gösteriyordu; kaynak katalog dört temayı içeriyor. G079 sonuç kaydı boş. Güncel sürümün Vercel'de başarılı yayını ve canlı kontrolü henüz bu turda tamamlanmadı.

## Devam eden işler ve bağımlılıklar
| İş | Sonraki somut adım |
|---|---|
| G079 güncel yayın | Uzak build/trace-check yeşil; doğru Vercel ekip/proje erişimi; test yayını + live-check/blob-smoke |
| G065 ilan/teslim | Güncel panel çekimleri + rehber PDF'lerini yeniden üret, QR/link/görsel kontrolü; yenilenmiş Markdown eski PDF'yi güncellemiş sayılmaz |
| G404/G081/G084 04 | Mevcut tema QA kapanışı, teşekkür/düzenlenebilir metinler/misafir adları; ardından katalog onayı |
| 06–20 | Önce alınmış/incelemedeki GPT parçalarının kabulü; sonra tasarıma özgü tema montajı ve QA |
| Gerçek sipariş | Manuel doğrulama canlıda sınanmalı veya Etsy API ile gerçek doğrulama tamamlanmalı; varsayılan yalnız biçim kontrolü |
| E-posta/destek | Destek adresi ve SLA kararı; sağlayıcı hesabı ve gönderim yetkisi; link teslimi/kurtarma uçtan uca |
| Ticari alanlar | Fiyat, Etsy mağaza/ilan URL'leri, destek, politikalar gerçek değerlerle doldurulmalı; uydurulmaz |
| Cihaz/işletim | Gerçek iPhone/Safari ve Android, yedekleme/geri yükleme, yük/maliyet; otomatik testlerle aynı değildir |
| 120 ürün | 20 ana tasarım kapanışı (G090) sonrası ek 5 renk; henüz tamamlanmış 120 ürün yok |

Vercel eklentisi kurulu olarak doğrulandı. Bu oturumda hesap yönetim araçları henüz sunulmadı; tarayıcıdaki Vercel proje adresi giriş ekranına yönlendi. Kullanıcının başka tarayıcıda giriş yapması bu oturumda erişim olduğunu kanıtlamaz. Hesap bilgisi/anahtarlar GitHub'a yazılmaz.
