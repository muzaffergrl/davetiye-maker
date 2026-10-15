# Elle test planı (K34, 2026-10-15)

Lansmandan önce **kendimiz** baştan sona deneyeceğiz. Otomatik testler (npm test, tarayıcı testleri) geçiyor; bu liste
otomatik testlerin göremediğini yakalamak için: gerçek telefon, gerçek kişi, gerçek akış. Her satırı deneyen kişi
`[x]` koyar, sorun varsa altına not düşer (ekran görüntüsü `docs/10_canli_test/elle/` altına).

Ortam: canlı site (Vercel). Test siparişlerinde sipariş no `2026101X`, e-posta kendi adresimiz; bitince admin'den silinir.
Cihazlar: en az bir iPhone (Safari), bir Android (Chrome), bir bilgisayar (Chrome/Safari). Bir kişi alıcı, bir kişi misafir, biri dükkân.

## 1. Alıcı — satın aldıktan sonra
- [ ] Etsy indirmesindeki START HERE PDF'ini telefonda aç; link `/start`'a gidiyor, tasarım doğru seçili.
- [ ] Sipariş no + e-posta + isimlerle siteyi başlat; düzenleme linki ekranı anlaşılır, "Copy link" / "Email it to myself" çalışıyor.
- [ ] Sipariş onayı açıkken panelde "Confirming your order" kartı görünüyor; Publish beklemede, düzenleme serbest.
- [ ] Kurulum (3 adım): isimler, tarih/saat, mekân, fotoğraf yükleme (iPhone HEIC dahil), örnek metinleri değiştirme.
- [ ] Her sayfa (Us, Day & place, Photos, Our Story, Details, RSVP) — değişiklik önizlemede hemen görünüyor, kendiliğinden kaydediliyor.
- [ ] Bağlantı kopunca (uçak modu) değişiklik kaybolmuyor; geri gelince kaydediliyor.
- [ ] Satış sitesinde **My website** → aynı telefonda tek dokunuşla panele dönüyor; başka cihazda linki yapıştırınca açılıyor.
- [ ] Linki kaybetme senaryosu: dükkândan yeni link isteniyor (bkz. §3), eski link artık açılmıyor.

## 2. Dükkân — admin
- [ ] `/admin` girişi (yanlış şifre mesajı, doğru şifre), 12 saat sonra yeniden giriş.
- [ ] Özet: yeni sipariş Yapılacaklar'da; sayılar doğru.
- [ ] Siparişi onayla → "Sipariş onaylandı" mesajını kopyala → Etsy'de gönderildiğini varsay → alıcı panelini yenileyince Publish açılıyor.
- [ ] Yeni sipariş (alıcı adına site aç) → link + mesaj; link alıcı telefonunda paneli açıyor.
- [ ] Yeni düzenleme linki; isim/tarih hakkı ekle; yayında kalma süresi; yayından kaldır → alıcı yeniden yayınlayabiliyor.
- [ ] Dükkân notu alıcı panelinde **görünmüyor**.
- [ ] Misafir yanıtları listesi, CSV (Excel'de Türkçe karakterler doğru), seçip silme.
- [ ] Müşteriler, Tasarımlar sayfaları; Siparişler CSV.
- [ ] Siteyi sil → adres artık açılmıyor.

## 3. Alıcı — yayından sonra
- [ ] Publish → site adresi misafir gibi (gizli sekme) açılıyor; zarf açılışı, sayfalar, fotoğraflar.
- [ ] İsim/tarih değişikliği hakkı: yazım düzeltmesi ücretsiz, gerçek değişiklik 1 hak; geri alma.
- [ ] Misafir şifresi aç/kapat; misafir şifreyle giriyor.
- [ ] Paylaşım: link, QR (telefon kamerasıyla okunuyor), WhatsApp önizlemesi.

## 4. Misafir
- [ ] iPhone + Android: zarf açılışı akıcı, metin taşmıyor, uzun isimler sığıyor; yatay telefon.
- [ ] RSVP: katılıyor/katılmıyor, kişi sayısı + misafir adları, özel sorular; gönderince teşekkür; çift panelde görüyor.
- [ ] Takvime ekle (Apple/Outlook .ics, Google).
- [ ] Yaşlı bir misafir (yardımsız) RSVP yapabiliyor mu? — gözlem notu.

## 5. 20 tasarımın her biri
Her tasarım için (`/designs/<id>` → demo → /start ile test sitesi): açılış, 5 sayfa, foto değiştirme, RSVP, teşekkür modu.
- [ ] 01 Olive & Ivory · [ ] 02 Dusty Blue & Champagne · [ ] 03 Blush Garden Rose · [ ] 04 Mediterranean Lemon · [ ] 05 Vintage Airmail
- [ ] 06 Art Deco Black-Tie · [ ] 07 Burgundy Velvet Autumn · [ ] 08 Winter Evergreen · [ ] 09 Lavender Provence · [ ] 10 Tuscan Vineyard
- [ ] 11 Boho Pampas Terracotta · [ ] 12 Tropical Destination · [ ] 13 Enchanted Forest · [ ] 14 Ivory Lace & Pearls · [ ] 15 Cherry Blossom
- [ ] 16 Sunflower Rustic · [ ] 17 Emerald & Gold · [ ] 18 Wildflower Vellum · [ ] 19 Midnight Garden · [ ] 20 Coastal Seaside

## 6. Satış sitesi
- [ ] Ana sayfa, tasarımlar, SSS, fiyat, iletişim — telefon ve bilgisayar; bütün linkler; "My website" ve "Shop login".
- [ ] Yer tutucu kalmadı mı (fiyat, Etsy linki, yanıt süresi — kararlar verilince).

## Bulgu kaydı
| Tarih | Kim | Cihaz | Adım | Sorun | Ekran görüntüsü | Durum |
|---|---|---|---|---|---|---|
