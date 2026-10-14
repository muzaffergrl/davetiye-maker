---
id: G059
baslik: Platform modeline göre set paketi (docs/05) + tasarım 01 ve 03 için Etsy ilan kiti ve alıcı START HERE PDF'i
rol: claude-metin
durum: alindi
alan: wf-ilan
oncelik: 1
bagimli: [G401, G038]
yazar: [docs/05_SET_PAKETI.md, collections/01_Olive_Ivory/package/, collections/03_Blush_Garden_Rose/package/, tools/listing_templates/, tools/listing_kit.py, tools/tests/test_listing_kit.py]
---

## Amaç
docs/05 hâlâ Canva dönemini anlatıyor. K22–K24'e göre yeniden yaz ve ilk iki tema (01, 03) için satış kitini üret.
Kalıcı talep 5: her set için ilan görselleri, video ve Etsy alanlarını içeren PDF `package/listing/` içinde.

## Yapılacaklar
1. **docs/05_SET_PAKETI.md**: alıcının aldığı = indirilebilir START HERE PDF (başlat linki `/start?theme=<tema>`, adımlar, SSS);
   ürün = platformda düzenlenen site. Etsy ilan kiti listesi ve bitti şartları; dürüst iddia listesi (test edilen/edilmeyen).
2. **START HERE PDF** (her tema): `tools/md_to_pdf.py` ile; başlat linki tıklanabilir ve QR (`tools/make_qr.py` mantığı, gerçek URL);
   adımlar ekran görüntüleriyle (platform/previews/final, g401). Marka, destek e-postası, barındırma süresi, fiyat: açık yer tutucu.
3. **İlan metni** (her tema, İngilizce): başlık (≤140), açıklama, 13 etiket, malzeme/özellik alanları, SSS — yalnız test edilmiş
   özellikler; "Canva gerekmez", "telefondan düzenle", "RSVP yanıtları panelinde" gibi iddialar doğrulanmış olmalı (docs/13 §7).
4. **İlan görselleri** (2000×2000, `tools/listing_templates/` + `tools/listing_kit.py`): kapak (zarf ekranı), telefon ekran dizisi,
   "What's included", "How it works" (3 adım), panel ekranı, RSVP/takvim özellikleri. Görseller tema önizlemelerinden ve
   HTML/CSS yerleşimden; dekor çizimi yok, rakip görseli yok. Telefon çerçevesi gerekiyorsa GPT mockup'ı (Paket 3) gelene kadar
   çerçevesiz, yuvarlatılmış ekran görüntüsü.
5. **İlan videosu**: temanın açılış kaydından Etsy kurallarına uygun kısa, sessiz MP4 (süre/boyut kuralını Etsy yardım sayfasından
   doğrula; doğrulayamazsan Sonuç'a yaz).
6. **Etsy ilan PDF'i** (`package/listing/listing_<tema>.pdf`): tüm alanlar + görsellerin küçükleri + video bilgisi.

## Bitti sayılması için
- [ ] İki tema için START HERE PDF, ilan metni, ≥7 ilan görseli, video, ilan PDF'i; linkler/QR gerçek ve çalışıyor
- [ ] İddialar dürüst; ticari alanlar yer tutucu

## Sonuç
_(görevi yapan ajan doldurur)_

## Günlük
- 2026-10-14 alindi: wf-ilan
