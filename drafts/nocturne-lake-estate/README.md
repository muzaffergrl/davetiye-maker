# Nocturne Lake Estate

17 Ekim 2026 — ayrı ürün, yerel inceleme sürümü.

`Nocturne-Lake-Demo.html` dosyasını tarayıcıda açın. Sunucu gerektirmez; zarf, davetiye, galeri, detaylar ve RSVP sayfaları arasında üst araç çubuğundan veya davetiyenin menüsünden gezilebilir. Telefon/geniş görünüm düğmesi bulunur. Galeri fotoğrafları tıklanınca büyür; ok tuşlarıyla gezilir, Escape ile kapanır. RSVP doğrulama yapar, hiçbir cevap kaydetmez.

## Tasarım

Siyah, şampanya altını ve göl kenarında mum ışığı. Açılışta dokulu siyah zarf ve altın mühür; ana sayfada tam ekran göl, devamında ayrı çift portresi. Story sayfası asimetrik üç fotoğraflı galeri ve büyütme penceresidir. Program dikey zaman çizelgesidir. RSVP koyu kart üzerinde ince altın alanlarla düzenlenmiştir.

## Kaynak ve doğrulama

- `platform/themes/nocturne-lake-estate/`: beş bağımsız HTML sayfası, CSS, JS, manifest ve örnek içerik.
- `collections/22_Nocturne_Lake_Estate/assets/gpt/`: üç özgün üretim PNG'si ve üretim prompt'ları.
- `checks-contract.json`: güncel ortak motorla 35/35 içerik ve tema kontrolü.
- `checks-standalone-demo.json`: beş sayfanın gerçek demo rotasından üretimi, çevrimdışı görseller ve HTML yeniden okunduktan sonra JavaScript sözdizimi kontrolleri.
- Zarf, manzara ve çift fotoğrafı built-in imagegen ile üretildi. Kullanıcının referans kolajı siteye yapıştırılmadı. Müşteri metinleri ve fotoğrafları ayrı düzenlenebilir alanlardır. Örnek çift ve etkinlik kurgusaldır.

Ortak müzik/efekt, takvim, harita, teşekkür modu, isteğe bağlı bölümler, 10 RSVP sorusu ve 5 cevap türü bağlantıları korunur. Fotoğraflar için beş standart alan kullanılır. Özel edit bağlantısı, panel, şifre, QR, Excel/CSV/Sheets ve sipariş onayı platform katmanının işidir; bu dosya bunlar için bağımsız bir backend oluşturmaz.

Bu sürüm tarayıcıda görsel olarak ve gerçek telefonda henüz doğrulanmadı. Ortak kodla yapılan içerik kontrolleri görsel veya uçtan uca satış testi değildir. GitHub inceleme dalı: `codex/nocturne-lake-estate`. Depodaki konum: `drafts/nocturne-lake-estate/`. Bu klasör taşınabilir demo ve kaynak yedeğidir; tema henüz platform kataloğuna kaydedilmedi. Vercel ve Etsy yayını yapılmadı. Satış fiyatı ve ürün onayı bekler.


## Başka bilgisayarda açma

GitHub'da bu daldaki drafts/nocturne-lake-estate/Nocturne-Lake-Demo.html dosyasını açıp **Download raw file** ile indirin. İndirilen HTML dosyasını Chrome veya Edge ile açın. Görseller, müzik ve sayfalar tek dosyadadır; Node kurulumu ve yerel sunucu gerekmez. GitHub dosya görünümü HTML'i çalıştırmaz. RSVP gerçek cevap göndermez.
