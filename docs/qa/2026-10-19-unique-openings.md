# 11 özgün zarf açılışı — 2026-10-19

Kullanıcının yeni talebi: 11 modelin açılışta gösterdiği ortak Blush kartını ve ortak açılış hareketlerini değiştir; her modele özgü açılış yap; tamamlanan iç sayfaları koru; GitHub'a kaydet, Vercel'de yayınla ve canlıda doğrula.

## Değişiklik

| Model | Kapak mekanizması | Çıkan kart |
|---|---|---|
| Nocturne Lake Estate | Mektup kapağı menteşeyle kalkar, kart yana süzülür | Göl terası çerçevesi ve şampanya-altın kâğıt |
| Velvet Jewel Box | Mücevher kutusu kapağı geriye döner | İnci ovali, patlıcan moru ve saten |
| Grand Theatre Premiere | İki kapak perde gibi iki yana çekilir | Yaldızlı sahne çerçevesi ve oyun programı |
| Orient Express Voyage | Dış kılıf sağa, bilet kartı sola kayar | Pirinç tren penceresi ve yeşil seyahat kırtasiyesi |
| Kintsugi & Washi | İki washi katı çapraz yönlerde soyulur | Altın birleşimli washi fotoğrafı ve kâğıdı |
| Riad Lantern Nights | Çift kapı derinliğe doğru sırayla açılır | Fenerli kemer ve turkuaz kırtasiye |
| Maison Pâtisserie | Paket kapağı açılır, gövde aşağı çözülür | Fıstık yeşili porselen ovali ve pembe kurdele |
| Celestial Observatory | İki kapak merkez etrafında ters yöne döner | Usturlap fotoğraf çerçevesi ve gök haritası |
| Azulejo Mosaic | İki albüm kapağı sırayla akordeon gibi katlanır | Kobalt çini fotoğrafı ve davetiye kâğıdı |
| Sky Lantern Festival | Dış kapak yukarı yükselir, kart alttan süzülür | Fener fotoğrafı ve püsküllü kâğıt |
| Music Box Ballerina | Kutu kapağı geriye eğilir, kart kendi ekseninde döner | Çiçekli cameo ve pembe saten kâğıt |

Mevcut 22 özgün image_gen görseli yeniden kullanıldı; yeni dekor çizilmedi. Kapalı zarfın model görselleri korundu. Ortak Blush `card_small`/`mask_card`/pembe yaprak kartı yeni kapak şablonundan çıkarıldı. Fotoğraflar ve kişisel metinler sunucuda düzenlenebilir alanlar olarak kalıyor. `opening.css`, `opening.js` ve `opening-design.json` her modelde açılışı tanımlar. Ortak `site.js` yalnız bu sayfalarda eski açılış denetleyicisini atlar; diğer davranışları korunur. Sürüm 1.1.0. Yeni açılma oturum anahtarı eski Blush oturumlarıyla karışmaz.

Önceki 11 iç tasarımın home/story/details/rsvp dosyaları, iç CSS/animasyonları, demo kayıtları ve temel CSS değişmedi (88 dosyalı SHA koruma fixture'ı). Diğer 27 ürünün metinleri ve durumları değişmedi. Yalnız 11 açılış açıklaması, 33 kapak ekran görüntüsü ve 11 gerçek açılış videosu yenilendi. Etsy, fiyatlar, hesap ayarları ve diğer ürünler kapsam dışı kaldı.

## Yerel doğrulama

- 22 mevcut beş sayfa/boş fotoğraf/teşekkür modu testi ve 13 mevcut iç tasarım regresyon testi başarılı.
- 17 yeni açılış testi: özgün mekanizmalar, Blush kartının çıkarılması, düzenlenebilir isim/tarih/foto, boş fotoğraf ve teşekkür modu, 88 dosyanın korunması ve kâğıt üzerinde en az 4.5:1 metin kontrastı. Başarılı.
- 320×740, 390×844, 1280×900 ve 844×390 boyutlarında 44 gerçek açılış/ana sayfaya geçiş kontrolü: taşma, ekran dışında kart, kırık görsel veya JS hatası yok. Sky Lantern'ın alt süs güvenli alanı ayrıca düzeltilip dört boyutta tekrar doğrulandı.
- 11 azaltılmış hareket ve 11 Skip kontrolü başarılı. Uzun isimler, tekrar oynatma, geri dönüş/Enter, açılış sırasında Skip, çift tıklama ve hareket tercihini açılış sırasında değiştirme ayrıca tarayıcıda kontrol edilir; çalışma sonuçları work/unique-openings/extra-results.json içindedir.
- 11 açılış videosu gerçek Chrome screencast kareleri ve gerçek zaman damgalarıyla H.264 MP4 olarak yeniden üretildi; süre ve dosya boyutları katalog manifestinde güncellendi. İç sayfa ekran görüntüleri korunuyor.

Testler Windows Chrome emülasyonudur; gerçek iPhone/Android cihazı, gerçek ses çıkışı veya Etsy satın alması testi değildir. Üretim RSVP kayıtlarına sahte davetli yazılmadı. Tam GitHub CI, Vercel üretim sürümü ve canlı açılış kontrolü yayın aşamasında ayrıca doğrulanır.


İlk CI/derleme kontrolünde bulunan katalog opening-object başlangıç cümlesi ve eski/yeni oturum anahtarı sözleşmesi düzeltildi. İki regresyon testi eklendi: katalog/editleme paneli openingObject uyumu ve eski oturumun yeni kapakla bir kez kapalı başlaması, yeni oturumun açılmış kalması ve replay davranışı. Yeni işaret eski invite:opened anahtarına ek olarak tutulur; geriye uyumluluk korunur.

Canlı tema JS yanıtının public, max-age=3600 önbellek süresi nedeniyle kapak yeni opening-site.js adıyla paylaşılan davranışı yükler. Böylece önceki site.js önbelleği Blush denetleyicisini çalıştıramaz; diğer dört sayfanın kodu ve davranışı değişmez. Dosya ayrımı için regresyon testi eklendi. Video süreleri ayrıca gerçek, kodlanmış MP4 süreleriyle eşitlendi.

