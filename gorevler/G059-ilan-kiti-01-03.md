---
id: G059
baslik: Platform modeline göre set paketi (docs/05) + tasarım 01 ve 03 için Etsy ilan kiti ve alıcı START HERE PDF'i
rol: claude-metin
durum: inceleme
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
2026-10-14, wf-ilan. Yayın (deploy), PR, görsel üretimi yok; çizilmiş dekor yok (K21).

**Yazılan dosyalar**
- `docs/05_SET_PAKETI.md` — platform modeline göre baştan: alıcının aldığı (A1–A6, tek indirilen dosya = START HERE PDF),
  Etsy ilan kiti (B1–B5), üretim komutları, tema başına bitti şartları, **dürüst iddia listesi** (test edilen/edilmeyen, kanıt,
  ilanda nasıl yazılır), Etsy kuralları (kaynak + doğrulanmadı notu), açık konular. Canva dönemi listesi: `git show 76f68f9:docs/05_SET_PAKETI.md`.
- `tools/listing_kit.py` — adımlar: `capture` (gerçek ekranlar), `qr`, `strips` (kılavuz resimleri), `images` (2000×2000 PNG),
  `video`, `pdf` (START HERE + ilan PDF'i, `tools/md_to_pdf.py`), `check` (başlık/etiket kuralları, görsel sayısı/ölçüsü, video
  kuralları, QR'ın başlat linkini modül modül kodlaması, PDF'te tıklanabilir başlat linki, PDF ≤ 20 MB). `all` = qr…check.
- `tools/listing_templates/capture.ts` — yerel üretim build'i (`next start`, geçici veri, local adaptör): temanın demo kaydı +
  PAKET 2 örnek fotoğrafları + 3 örnek SSS + 1 RSVP sorusu; 4 kurgu misafir yanıtı RSVP API'sinden; misafir ekranları, `/start` →
  panel → foto kırpma → önizleme → "Before you publish" → yayın, paneldeki yanıtlar/CSV/sorular, tema demosu, açılış kaydı.
  390 px, isMobile, DPR 3; `PLATFORM_PUBLIC_URL` = canlı taban adres (ekranlardaki adresler gerçek biçimde). Düzenleme anahtarı
  resimde maskeli; yerel siteye giden QR bulanık; düşen yaprak/yaprak parçacıkları durağan resimlerde gizli (videoda var).
- `tools/listing_templates/platform/` — `kit.css` + 8 ilan şablonu + `video_bg.html`. Yalnız yerleşim/tipografi; zemin ve köşe
  çiçekleri temanın kendi GPT parçaları (01: `bg_tile.png`, `decor_tl/br`; 03: `florals_tl/br`), ekranlar gerçek. Eski Canva
  şablonlarına (`whats_included.html` vb., `mockup_compose.py render` kullanıyor) dokunulmadı.
- `tools/tests/test_listing_kit.py` — 8 test (alan ayrıştırma + Etsy kuralları, iki gerçek ilan, QR, şablon doldurma, şerit,
  video kuralları, Playwright ile bir şablon render'ı, kurulu kitlerin tam `check`'i). `python3 tools/tests/test_listing_kit.py` → ok.
- Her tema (`collections/01_Olive_Ivory/package/`, `collections/03_Blush_Garden_Rose/package/`):
  `customer/START_HERE.md` + `.pdf` (8 sayfa, ~1,4 MB; tıklanabilir başlat linki + QR + 7 adım gerçek ekranlarla + "What your
  guests see" + SSS/sorun giderme + yardım), `customer/img/` (QR PNG/SVG, kılavuz resimleri), `listing/listing.md` (§0 durum
  tablosu, başlık 121/122 karakter, açıklama, 13 etiket, kategori/nitelikler, 8 görsel + alt metin, video, SSS, alıcı mesajı,
  yayın öncesi kontrol listesi), `listing/images/01…08_*.png` (8 × 2000×2000), `listing/video.mp4` (1080×1080, H.264, sessiz,
  14,5 s, ~2,2 MB), `listing/listing_<tema>.pdf` (tüm alanlar + görsel küçükleri + video bilgisi ve 3 kare), `shots/` (25 ekran,
  `opening.webm`, `capture.json`, örnek CSV).
- Görevdeki "platform/previews/final, g401" yerine ekranlar `capture.ts` ile yeniden çekildi: önizlemelerde `127.0.0.1` adresleri
  ve maskesiz anahtar vardı; ayrıca G051 (takvim, SSS, sorular) ve tema demosu ekranları gerekiyordu.

**Test edilen**
- `listing_kit.py check --theme all`: iki tema 0 sorun. Testler: `test_listing_kit` ok, `test_mockup_compose` ve `test_md_to_pdf`
  hâlâ ok, `gorev.py kontrol` temiz. `capture.json`: iki temada 13/13 kontrol (yanıtların saklanması, sayfalar 200, misafir yanıtı,
  linkin canlı taban adresi kullanması, panelde yanıtlar, CSV'de "Meal choice" sütunu, demo 200, kayıt).
- QR'lar bağımsız okuyucuyla (`jsqr`) çözüldü: START_HERE.pdf'in 150 dpi render'ındaki QR ve `start_qr.png` → doğru `/start?theme=…`;
  8. görseldeki QR → doğru `/start/demo/<tema>`. PDF'lerde /URI = başlat linki (pypdf).
- Canlı (2026-10-14, Vercel bağlayıcısıyla, telefonla değil): `/start?theme=blush-garden-rose` 200 + form; `/start/demo/blush-garden-rose`
  200. **`/start?theme=olive-ivory` → "This start link is not valid": tema 01 canlıda yok** — 01'in başlat linki, QR'ı ve 8. görsel
  QR'ı ancak 01 yayınlanınca çalışır (listing.md §0'da yazıyor). Canlı yayın G051/G055'ten eski: canlı demoda takvime ekle/SSS/
  RSVP soruları yok → ilanda bu üç madde `[VERIFY: live after redeploy]`.
- Her ilan görseli, kılavuz ve ilan PDF sayfaları ve video kareleri tek tek açılıp bakıldı; düzeltilenler: köşe çiçeğinin yazıya
  binmesi, kesik RSVP düğmeli kart kırpımı, 5'li dizide taşan telefonlar, numara rozetinin ekran metnini örtmesi, uzun tema adının
  köşeye binmesi, URL'nin harf ortasından kırılması, kılavuzda dev QR ve boş sayfalar, videoda gri kutu (Playwright kaydı CSS
  pikselinde: DPR 2 + 780×1688 yalnız gri dolgu ekliyordu → 390×844 kayıt, 1,14× ölçek), videonun yarım yazılmış kartla bitmesi.

**Test edilmeyen / doğrulanamayan**
- **Etsy kuralları doğrudan doğrulanamadı**: `help.etsy.com`/`etsy.com` bu ortamdan açılmıyor (DNS/proxy reddi). Video kuralı
  web araması alıntılarından: 5–15 s (bir sayfa 3–15 s), ≤ 100 MB, ≥ 500 px, ses çalınmaz, ≤ 2 video; video buna göre 1080×1080,
  sessiz, 14,5 s, ~2 MB → **UNVERIFIED**, ilan düzenleyicisinde kontrol edilmeli. Başlık/etiket/fotoğraf/dijital dosya değerleri de aynı kaynaktan.
- Gerçek iPhone/Android (alıcı ve misafir yolculuğu), QR'ın telefon kamerasıyla okutulması, Etsy'ye yükleme (görsel ~2–4,5 MB PNG,
  video, PDF), Etsy satın alma → indirme akışı, Etsy'nin link/QR içeren görsel (8. görsel) ve AI beyanı kuralları.
- E-posta ile link gönderimi ve Etsy sipariş doğrulaması **yok** (kılavuz/ilan bunu iddia etmiyor; "we cannot email it yet").
- `capture` 03'te headless Chromium'un renderer'ı ara sıra çöküyor ("Target crashed", 8 koşuda 3, farklı adımlarda); araç 3 kez dener.

**Ticari alanlar** yer tutucu: `[SHOP NAME]`, `[PRICE]`, `[HOSTING PERIOD]`, `[SUPPORT EMAIL]`, `[SUPPORT RESPONSE TIME]`,
`[REFUND POLICY]`, `[LOST LINK POLICY]`, `[PRIVACY NOTICE LINK]`, `[QUANTITY]`, `[SHOP SECTION]`, `[AUTO RENEW]`.

**Önerilen görevler (entegratör açar)**
- Yayın: tema 01 + güncel platform (G051/G055) → sonra iki temanın başlat linki/demo/QR'ı gerçek telefonda denensin ve listing.md §0 güncellensin.
- claude-qa: kitin denetimi (görseller, iddialar, kılavuz adımları gerçek arayüzle).
- Gerçek telefon testi (iPhone Safari, Android Chrome) — `[VERIFY]` işaretlerinin kaldırılması buna bağlı.
- `tools/listing_templates/{whats_included,how_it_works,edit_in_canva}.html` hâlâ Canva dönemi metni taşıyor (`mockup_compose.py
  render`); `mockup_compose.py` bu görevin yazma alanında olmadığından dokunulmadı — kaldırılması/güncellenmesi ayrı iş.
- Alan adı/marka seçilince `LISTING_BASE_URL` ile START HERE PDF'leri ve 8. görsel yeniden üretilmeli.

## Günlük
- 2026-10-14 alindi: wf-ilan
- 2026-10-14 bitti, incelemeye gönderildi
