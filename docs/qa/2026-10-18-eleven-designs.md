# 11 model — Blush Garden Rose yapısına geçiş

Tarih: 18 Ekim 2026. Kaynak ana dal: 1039dea59a30702107b3a9b42cd24484a558a770. Kullanıcı 11 modelin kapak ve bütün iç bölümlerini Blush Garden Rose ile eşitlemeyi ve testten sonra yayımlamayı açıkça istedi.

## Değişiklik

11 model aynı güncel beş sayfa iskeletini, düzenlenebilir fotoğraf/metin alanlarını, isteğe bağlı blokları, takvimi, klavyeyle açılışı, yeniden oynatmayı, azaltılmış hareketi, RSVP formunu ve teşekkür modunu kullanıyor. Her model için imagegen ile ayrı dekorlu arka plan ve mevcut kapağa uyan açık zarf üretildi. Zarf, kapak, cep ve kart ayrı katmanlar. Görseller WebP olarak paketlendi. Boş demo fotoğrafları mevcut üretilmiş kurgusal Blush örnekleriyle dolduruldu; Nocturne'un mevcut örnek fotoğrafları korundu. Alıcıların kendi kayıtları ve görselleri değiştirilmedi.

Katalogdaki kapaklar ve yedi iç ekran gerçek render kayıtlarıdır. 11 açılış videosu gerçek tarayıcı kaydıdır. Ana sayfanın galerisi yayımlanmış demo tasarımlarını da gösterir. Etsy fiyatı ve ilan bağlantısı belirlenmemiş bu ürünler önizleme statüsünde kalır; satışa hazır oldukları iddia edilmez.

## Yerel doğrulama

- 22 şablon/içerik testi: beş sayfa, fotoğraf kaynakları, kırık görsel referansları, gizli hikâye, boş alıcı fotoğrafları ve teşekkür modu.
- 11 RSVP entegrasyon testi: yerel veri adaptöründe site oluşturma/yayımlama, kabul/ret yanıtı kaydetme, hatalı giriş reddi, yinelenen yanıtın tek kez saklanması.
- 110 tarayıcı sayfa kontrolü: 11 model × 5 sayfa × 390/1280 px. Taşma, kırık resim ve sayfa JavaScript hatası yok.
- Ek 22 davetiye/form ekranı kontrolü: hata yok.
- Klavye ile 33 açılış, 2 süreli animasyon kontrolü; 11 gerçek açılış videosu.
- Yerel tarayıcı denetimi render motorunu ve dosyaları istek yakalama ile doğrudan çalıştırdı. Dış Google fontları ve gerçek ses çıkışı bu yerel turda ölçülmedi; örnek görüntüler font yedeğiyle alındı. Bu kayıt gerçek telefon veya canlı alıcı siparişi testi değildir.

Bu dosya yerel sonuçları kaydeder; Vercel derlemesi ve canlı alan adı kontrolleri yayın sonrası ayrıca doğrulanır.

## Modeller

- Nocturne Lake Estate — nocturne-lake-estate
- Velvet Jewel Box — velvet-jewel-box
- Grand Theatre Premiere — grand-theatre-premiere
- Orient Express Voyage — orient-express-voyage
- Kintsugi & Washi — kintsugi-washi
- Riad Lantern Nights — riad-lantern-nights
- Maison Pâtisserie — maison-patisserie
- Celestial Observatory — celestial-observatory
- Azulejo Mosaic — azulejo-mosaic
- Sky Lantern Festival — sky-lantern-festival
- Music Box Ballerina — music-box-ballerina

230 superseded, unreferenced compiled image assets are removed from these eleven theme folders. Original per-model favicons and the Nocturne demo photographs are retained. The prior interim image-build scripts are historical; the generated release parts and geometry are authoritative.

## Canlı doğrulama

- Vercel üretim sürümü `e430c6ce3305ca39f2514dafa947dce30712414d`, dağıtım `dpl_8dZQqSBHL5bgrfo7uPfDQPMDsfFm`: READY; `xn--bkestudo-zkb.com` alan adı bu sürüme bağlandı.
- Alan adı üzerinde 55 demo sayfası + 11 ürün sayfası: 66/66 HTTP 200; 266 başvurulan görsel/stil/script kaynağı ve 66 ek katalog görseli/video isteği hatasız.
- Gerçek Chrome ile canlı sitede 77 sayfa/görünüm: 55 mobil + 22 bilgisayar. Gerçek web fontları yüklendi; yatay taşma, kırık resim ve JavaScript hatası yok. 22 klavye açılışı ve 1 gerçek süreli açılış geçti.
- Canlı RSVP formuna gerçek davetli cevabı gönderilmedi; kayıt/yanıt/tekrar koruması 11 yerel entegrasyon testiyle doğrulandı. Gerçek telefon ve Etsy satın alma testi yapılmadı.
- İlk yayın denemesindeki ikon manifesti, palet kanal varsayılanları ve CSS boyut bütçesi sorunları giderildi. Tarihsel taslak beklentileri yeni tam ekran kayıtları ve Blush katman yapısıyla eşitlendi. Paylaşılan kurgusal demo fotoğrafları açıkça tanımlı bir izin listesiyle doğrulanır; başka yol veya eksik dosya reddedilir.
