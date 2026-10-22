# Ivory Pearl Atelier

22 Ekim 2026 — Kullanıcının doğrudan yeni tasarım ve tam ürün isteği. Durum: platform teması ve Etsy yükleme paketi hazır; yayın doğrulaması ayrıca kaydedilir.

Tek tasarım: fildişi pamuk kâğıt, şampanya ipek, ince altın kenar, sedef mühür. Sade görünüm ve gösterişli malzeme ayrıntısı birlikte hedeflendi. Çalışma adı marka kararı değildir.

## Dosyalar

- assets/gpt/comps/W1_opening.png — örnek açılış yerleşimi; isim ve tarih kurgusal ve yalnız önizlemede bulunur.
- assets/gpt/parts/envelope_closed.png — yazısız kapalı zarf, şeffaf PNG.
- assets/gpt/parts/envelope_open.png — yazısız açık zarf, şeffaf PNG.
- assets/gpt/parts/closure.png — ayrı sedef mühür, şeffaf PNG.
- assets/gpt/parts/accent_bow.png — ayrı şampanya kurdele, şeffaf PNG.
- assets/gpt/parts/invitation_card.png — boş kart, şeffaf PNG.
- assets/gpt/textures/bg_page.png — yazısız ipek zemin.
- assets/gpt/GPT_PROMPTS.md — kullanılan İngilizce istemler ve tam hedef yolları.
- assets/gpt/manifest.json — ölçüler, alfa kontrolü ve entegrasyon sınırları.

## Pazar dayanağı ve sınırı

Bu oturumda Etsy'ye canlı bağlantı kurulamadı; güncel en çok satan veya en çok aranan model doğrulanmadı. Dayanak: docs/13_ETSY_ARASTIRMA.md, 13 Ekim 2026 kayıtlı gözlem (91 tekil ilan, 30 ilan ayrıntısı). Krem palet, zarf açılışı, kurdele ve mühür gözlemleri özgün sanat yönüne dönüştürüldü. Bu gözlemler tekil ürün satış sıralaması veya arama hacmi değildir.

## Kontrol ve montaj notu

7 PNG kaydedildi. 5 parçada gerçek alfa kanalı, zemin ve önizlemede RGB doğrulandı. Üretim parçalarında kişisel metin yok. Tüm parçalar tek tek imagegen ile üretildi; piksel boyama veya kodla tasarım yapılmadı.

İlk görsel kaynaklardaki açık/kapalı zarf farkı teknik montajda çözüldü: bütün katmanlar kapalı gövdenin aynı koordinatlarına alındı; gövde değişmiyor. İnci mühür dönerek yay çiziyor, ipek fiyonk iki yana ayrılıyor, kapak menteşeden açılıyor ve kart hafifçe eğilerek yükseliyor. İç fotoğraflar ışık geçişiyle açılıyor; RSVP sonrası tek bir sedef ışığı geçiyor. Diğer tasarımların flaş, parçacık veya fotoğraf şeridi hareketleri kullanılmadı.

`platform/themes/ivory-pearl-atelier/` içinde beş sayfa, düzenlenebilir metin/fotoğraf alanları, müzik, harita, takvim, RSVP ve baskı indirmesi mevcut. Kullanılan Clara & Julian fotoğrafları bize ait mevcut kurgu örnek kütüphanesinden alındı; yeni çekim olarak sunulmaz. Türkçe, Almanca, İspanyolca ve Fransızca yeni ürün metinleri eklendi.

Alıcı başlangıcı → fotoğraf yükleme → yayın → QR → misafir yanıtı → panel akışında 45/45 kontrol geçti. Ek katalog/tema/dil/fotoğraf kontrolleri 78/78 geçti. Gerçek kayıtlar `package/shots/`, kontrol sonuçları `package/qa/` içinde. Bu kontroller Chromium telefon emülasyonudur.

Etsy paketi: 9 adet 2000×2000 görsel, sessiz kare video, İngilizce ilan metni, 13 etiket, yükleme JSON'u ve 10 sayfalık START HERE PDF. Mevcut ürün fiyatı 1.460 TRY korundu. Etsy taslağı isteği yetkili; bu oturumda satıcı tarayıcısı bağlantısı olmadığından mağazaya yükleme henüz yapılmadı. İlan yenileme seçimi diğer bekleyen ürünlerdeki gibi kararsız; taslak hazırlamayı engellemez.
