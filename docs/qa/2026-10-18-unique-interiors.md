# 11 modelin özgün iç tasarımı ve hareketi

Tarih: 2026-10-18. Kaynak: e9d7d4836d303187c83b82b5bf4cbae1a6aba74c. Kullanıcı yalnız 11 modelin içlerini, her kapağa uygun ayrı görsel düzen ve ayrı animasyonlarla yeniden tasarlamayı, GitHub'a kaydetmeyi ve Vercel'de yayımlamayı açıkça istedi.

## Kapsam

- Mevcut kapak HTML'i, site.css, site.js, demo kayıtları ve eski görsel dosyaları değiştirilmedi. Yeni interior.css ve interior-motion.js yalnız home/story/details/rsvp sayfalarında yüklenir. Eski Blush data-step animasyon işaretleri bu dört sayfadan çıkarıldı; kapakta korundu.
- Built-in image_gen ile 22 ayrı parça üretildi: her modele bir fotoğraf çerçevesi ve bir boş kırtasiye paneli. Fotoğraflar ve kişisel metinler görsele gömülmedi. Gerçek alfa maskeleri ve WebP boyutları teknik olarak türetildi.
- 11 farklı yerleşim ve 11 farklı hareket profili kullanılır. Azaltılmış hareket, yazdırma, JavaScript yüklenememesi ve font bekleme durumu için görünür içerik yedekleri vardır.
- RSVP, takvim, harita, isteğe bağlı bloklar, düzenlenebilir metin/fotoğraf ve teşekkür modu mevcut sözleşmelerini korur. Örnek fotoğraflar kurgusal demo verileridir; alıcı kayıtlarına yazılmadı.
- Katalogda yalnız bu modellerin 66 iç ekranı ve 11 gerçek açılış videosu yenilendi. Kapak ekranlarına dokunulmadı. Video süreleri gerçek CDP kare zamanlarından hesaplandı.
- Diğer 27 modelin açıklamaları ve satışa açık tasarım listesi eski modülle bire bir karşılaştırıldı: aynı. Etsy ilanları, fiyatlar, satış durumu, hesaplar ve Vercel ayarları değiştirilmedi.

## Modeller

| Model | İç düzen | Hareket |
|---|---|---|
| Nocturne Lake Estate | terrace | terrace-pan |
| Velvet Jewel Box | jewel | jewel-unfold |
| Grand Theatre Premiere | theatre | curtain-reveal |
| Orient Express Voyage | voyage | carriage-slide |
| Kintsugi & Washi | washi | paper-unfurl |
| Riad Lantern Nights | riad | lantern-light |
| Maison Pâtisserie | patisserie | ribbon-sweep |
| Celestial Observatory | observatory | orbit-reveal |
| Azulejo Mosaic | mosaic | tile-stagger |
| Sky Lantern Festival | lantern | lantern-rise |
| Music Box Ballerina | ballet | music-box-turn |

## Yerel doğrulama

- 33 mevcut tema/RSVP testi: 11 modelde beş sayfalı akış, fotoğraf kaynakları, isteğe bağlı hikâye, boş alıcı fotoğrafları, teşekkür modu; yerel adaptörde yanıt kaydı, kabul/ret, doğrulama ve tekrar koruması. Başarılı.
- 13 yeni regresyon testi: 630 mevcut dosyanın değişmemesi, kapakta yeni iç CSS/JS olmaması, 11 ayrı düzen/hareket/çerçeve, gerçek alfa maskesi, ölçülen fotoğraf pencereleri, görünür metin/tema copy sözleşmesi ve RSVP işaretleri. Başarılı. Yerel ikon fixture'ları GitHub'daki orijinallerle eşitlendi; üretim ikonları değiştirilmedi.
- 165 sayfa kontrolü: 320/390/1280 px'de dört iç sayfa (132), ayrıca uzun isimler ve 10 satırlık programla 33 stres kontrolü. Taşma, kırık resim, boş fotoğraf alanı ve JavaScript hatası yok.
- 844×390 yatay telefon görünümünde 44 ek sayfa: hata yok.
- 11 hareket profili gerçek tarayıcıda başlatıldı; davetiye içeriği animasyon sonunda ve azaltılmış harekete geçişte görünür kaldı. Son dosya yollarıyla 22 sayfalık ek kontrol: hata yok.
- 33 katalog kapak dosyasının SHA-256 değeri korundu. Fotoğraf penceresi maskeleri RGBA olarak doğrulandı. Gereksiz çift kâğıt kopyaları tutulmadı.

Kontroller Windows Chrome masaüstü tarayıcı emülasyonuyla yapıldı. Gerçek iPhone/Android cihazı, gerçek ses çıkışı veya Etsy satın alma testi değildir. Canlı RSVP'ye sahte davetli yazılmadı. Üretim derlemesi/CI ve alan adı doğrulaması yayın aşamasında ayrıca kontrol edilir.

## Görsel kaynaklar

Tam promptlar: [unique-interiors-prompts](2026-10-18-unique-interiors-prompts.md). Çalışma kaynağı: C:/Users/muzaf/Documents/Codex/2026-10-15/github-app-connector-76869538009648d5b282a4bb21c3d157/work/unique-interiors/art/. Dağıtım görselleri ilgili modelin img/ klasöründeki interior-frame, ph_interior ve interior-photo-mask dosyalarıdır. Yerleşim ve ölçüleri interior-design.json ile img/interior-geometry.json içinde bulunur. Tarihsel build_images.py bu yeni iç tasarımın üreticisi değildir.

