# Güncel durum — 20 Ekim 2026

Ürün (K22/K24): Etsy alıcısının **bizim platformumuzda panelden düzenlediği website**. Kararlar: `docs/01_KULLANICI_KARARLARI.md` ·
görevler: `gorevler/PANO.md` · platform: `docs/10_SITE_PLATFORMU.md` · **lansman: `docs/29_LANSMAN_LISTESI.md`**.

## 1. Canlıda
- **bkestudio.com** birincil adres (0dedaed2, 19 Ekim); eski `xn--bkestudo-zkb.com` linkleri 308 ile oraya gidiyor (bulut
  oturumundan 20 Ekim'de görüldü). Siteyi sunan Vercel projesi bulut oturumunun Vercel bağlantısında görünmüyor: hangi commit'in
  canlı olduğu docs/10 §2c'de kayıtlı değil (son kayıt 17 Ekim `477589f`). Sayfanın kendisi bulut ağından açılamadı.
- Satış sitesi `launched: false` (noindex). 21 tasarım satışa açık durumda (01–21, 1.460 TL), Etsy linkleri yer tutucu.

## 2. Hazır olanlar
- 01–21: tema, satış sayfası, START HERE MD + PDF + QR, `listing_v3.md`, `etsy_upload.json`, 9 ilan görseli + video, ilan PDF'i.
  Hepsi bkestudio.com'u gösteriyor (G190).
- Etsy dükkânı kurulu (docs/20), ilan yok (K41). Gizlilik metni hazır (docs/28), ad + adres bekliyor.
- Testler (20 Ekim): `npm test` 1654/1657 (3 atlanan, 0 hata), typecheck yeşil.

## 3. 22–38 ve paletler (lansmanı beklemez)
- 22–32: 18–19 Ekim'de imagegen sanatıyla yeniden kuruldu (yeni kapak/zarf, fildişi + çiçek zemin, iç sayfalar). Eski PAKET 5
  website parçaları artık istenmiyor; `build_images.py` emekli (img/'yi silerdi). GPT ilan sahneleri ve baskı zeminleri geldi; baskı bağlandı (20 Ekim), ilan görselleri
  henüz çekilmedi. Paletleri yeni sanattan yeniden yapılmalı (`test_recolor_parts` g177 11 hata bundan).
- 33–38: parçaların çoğu geldi; 19 ret teknik işlemle düzeltildi (20 Ekim), 14 parça ChatGPT'de yeniden üretilecek (docs/27), sonra tema build.
- GPT: 351 görsel geldi (20 Ekim); kontrol 317 geçti, 34 ret; 19u teknik düzeltildi, `docs/27` kalan 15i listeliyor (14 + isteğe bağlı palet).
  22–32 baskı zeminleri bağlandı. Rapor: `docs/qa/2026-10-20-generated-visuals/CLAUDE_KONTROL.md`.

## 4. Lansmanı bekleten (ayrıntı docs/29)
Yayın + canlı kontrol, Vercel ortam değişkenleri (`CLAIM_ORDER_VERIFICATION=manual`, ≥ 12 karakter `ADMIN_PASSWORD`), gerçek
telefon testi, gizlilik adı/adresi, ilan yenileme kararı, 21 ilanın Etsy'ye yüklenmesi → linkler `tools/ilan_baglantilari.py`
ile bağlanır → `verified.*` + `launched: true`.
