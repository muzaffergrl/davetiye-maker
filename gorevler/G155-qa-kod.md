---
id: G155
baslik: G090 QA kod düzeltmeleri — demo örnek fotoğrafları, basılı davetiye yeniden denetim, dokunma alanı + küçük yazı, K48 saklama/silme, ilan görseli 8
rol: claude-kod
durum: bitti
alan: claude-G155
oncelik: 1
bagimli: [G090, G149]
yazar: [platform/lib/claim/demo-photos.ts, platform/lib/claim/demo-photos.json, platform/lib/claim/demo-page.ts, platform/lib/photo-variants.ts, platform/scripts/build-demo-photos.ts, platform/scripts/seed.ts, platform/public/demo/, platform/lib/admin/view.ts, platform/app/admin/page.tsx, platform/components/admin/AdminSite.tsx, platform/components/admin/admin.module.css, platform/themes/*/site.css, platform/tests/g155-demo-photos.test.ts, platform/tests/g155-retention.test.ts, platform/tests/g155-themes.test.ts, tools/listing_templates/capture.ts, collections/*/package/listing/images_editorial/08_included.png, gorevler/G155-qa-kod.md]
---

## Amaç
G090 QA raporunun kodla kapanan bulguları: **P1-02** (canlı demolar boş, "YOUR PHOTO HERE"), **P1-01** (basılı davetiye:
G149 birleşmeden önce denetlenmişti → bu dalda yeniden), **P2-03** (dokunma alanı), **P2-02** (küçük yazı), **P2-01** (ilan
görseli 8) ve **K48** saklama/silme (admin). START HERE/ilan metni, satış sitesi metni, gizlilik sayfası ve
`lib/marketing/config.ts` politikaları G154'te — bu görev onlara dokunmadı.

## Girdiler
`AGENTS.md`, `gorevler/qa/G090-qa-raporu.md`, `docs/01_KULLANICI_KARARLARI.md` K48, `gorevler/G149-baski-tasma.md`.

## Bitti sayılması için
- [x] Satıştaki 21 tasarımın `/start/demo/<id>` sayfalarında yer tutucu yok; her tasarım **kendi** kurgu çiftinin fotoğrafı, srcset ile
- [x] `npm run seed -- --theme <id>` varsayılanı temanın kendi demo kaydı + kendi PAKET 2 fotoğrafları
- [x] Fotoğrafı olmayan tasarımlar listelendi; GPT_PROMPTS.md'de PAKET 2 istemleri var mı bakıldı
- [x] Basılı davetiye 5×7 + A5: 24 tasarım × (kendi demo, uzun EN, uzun DE) × ön/arka → metin dekorda 0
- [x] 20 tasarımda "Open … again" / "Replay …" ≥ 44 px, görünüm aynı (ölçüldü); 03 ve 21'de 360 px'te 12 px altı yazı yok
- [x] K48: admin Yapılacaklar 12 aydan uzun arşivdeki siteyi "Sil" ile listeler; sipariş no ile bul → sil akışı; testler
- [x] 01–20 ilan görseli 08 yeniden çekildi (yalnız `08_included.png`)
- [x] `npm ci && rm -rf .next && npx tsc --noEmit && I18N_STRICT=1 npm test && npm run build`, theme-check, `etsy_upload.py --check --strict`
- [ ] Vercel'de canlı deneme (bu görevde yayın yok)

## Sonuç

### 1. P1-02 — demolar artık örnek fotoğraflı
**Neden boştu:** `/start/demo/<id>` temanın demo kaydını (`content.demo.json` / paket kopyası) olduğu gibi basıyor; 20 tasarımın
kaydında `media` boş (`draftFromDemo` alıcıya da boş başlatır). Yalnız 21 Crimson kaydı tema içi fotoğraflara bağlıydı. Örnek
fotoğraflar (PAKET 2, kurgu çiftler) `collections/<NN>/assets/gpt/photos/<slot>.(jpg|png)` içinde duruyor ama demo onları hiç
kullanmıyordu; `npm run seed` de her temaya 03'ün kaydını ve 03'ün fotoğraflarını basıyordu.

**Çözüm (G127 harita pini gibi, yalnız demo sayfası ekler):**
- `scripts/build-demo-photos.ts` — her temanın kendi PAKET 2 fotoğrafını slotun `theme.json` oranına ortadan kırpar (panel yüklemesiyle
  aynı `centreCrop`), WebP q74, en çok 1280 px + 640 px varyant (`lib/photo-variants.ts` adlandırması) →
  `platform/public/demo/<tema>/<slot>-<W>w.webp` + `lib/claim/demo-photos.json`. `--check` dosyaları manifestle karşılaştırır.
  Başka tasarımın fotoğrafı asla kullanılmaz; kaydı kendi fotoğrafını koyan tema (21) olduğu gibi kalır.
- `lib/claim/demo-photos.ts` `withDemoPhotos()` — demo sayfası boş fotoğraf slotlarını doldurur (kayıttaki fotoğraf korunur, liste
  boşluk bırakmaz). Demo kayıtları ve alıcının ilk taslağı **değişmedi** (test).
- `lib/photo-variants.ts` — `/demo/<tema>/<slot>-<W>w.<ext>` de varyant adlandırması sayılır → motor alıcı fotoğrafındaki gibi
  **srcset** yazar (`640w, 1024w/1280w` + şablonun `sizes`'ı).
- **Boyut/izleme:** dosyalar `public/` altında (CDN; hiçbir sunucu fonksiyonuna izlenmez, tema klasörlerinin 3 MB bütçesi aynı;
  `trace-check` geçti). 20 tasarım × 5 fotoğraf × 2 boy = 200 dosya, **19 MB** (repo; GPT fotoğraflarının greni sıkıştırmayı
  sınırlıyor — q60'ta bile yalnız ~%10 kazanç). Telefonda bir sayfa en çok 640/1024 px'lik dosyaları indirir.
- `scripts/seed.ts` — `--content`/`--photos` verilmezse temanın **kendi** demo kaydı (theme-check'in bulduğu sırayla) ve kendi PAKET 2
  fotoğrafları; fotoğrafı olmayan tema yer tutucu durumda (03'ün fotoğrafları değil). Adres: 03 için yine `clara-and-julian`,
  diğerlerinde demo isimlerinden (ör. `avery-and-jordan`). Araçlar (`capture*.ts`, testler) zaten açık argüman veriyor, değişmedi.
- Ölçüm: yerel üretim derlemesinde 21 tasarımın home/story/details demo sayfalarında `[data-photo]` 21/21 `user` (yer tutucu 0),
  her dosya diskte, `/demo/` fotoğraflarında 640w varyantlı srcset (`tests/g155-demo-photos.test.ts`, 21 tasarım × 3 sayfa).

**Örnek fotoğrafı olmayan tasarımlar** (hepsi `coming`, satışta değil; demo yer tutucuyla kalır, fotoğraflar gelince
`node scripts/build-demo-photos.ts --theme <id>` yeter): 22 Nocturne Lake Estate, 23 Velvet Jewel Box, 24 Grand Theatre Premiere,
25 Orient Express Voyage, 26 Kintsugi & Washi, 27 Riad Lantern Nights, 28 Maison Pâtisserie. Yedisinin de
`assets/gpt/GPT_PROMPTS.md` dosyasında **PAKET 2 örnek fotoğraf istemleri zaten var** (`photos/hero_portrait.jpg` … `venue.jpg`, tam
yol + boyut) → eklenecek istem yok; eksik olan GPT üretimi.

### 2. P1-01 — basılı davetiye (G149 sonrası, bu dalda)
G149'un testi (`tests/g149-print-layout.test.ts`, uzun içerik) + aynı ölçümün kopyası (scratch, repoda yok): **24 tasarım × 2 boyut
(5×7, A5) × 3 içerik (temanın kendi demo kaydı, uzun EN, uzun DE) × ön/arka = 288 yüz** — her metin satırı ve QR serbest alanda +
güvenli alanda, taşma/kesilme yok; sanat denetimi (serbest alanda dekor lekesi) 5×7 **ve** A5'te tüm tasarımlar: **0 sorun**.
G090'ın "belirgin" listesi (01, 02, 04, 05, 11, 12, 16, 19, 21) `print-sample.ts --invite 5x7` ile basılıp ön+arka gözle bakıldı:
dekor–metin çakışması yok. `lib/print/layouts.ts` değişmedi (gerek kalmadı). Bilinen sınır G149'daki gibi: 12 Tropical ve 11 Boho
ön yüzde yazı küçük (sanatın bıraktığı alan dar; yeni GPT kart parçası gerekir).

### 3. P2-03 dokunma alanı, P2-02 küçük yazı
**Dokunma alanı (01–20; G090 17 dedi, ölçüm 06/07/14'te de 18–21 px buldu):** home sonu "Open the envelope/folder/… again" ve RSVP
"Replay the envelope/opening" bağlantıları 17,6–23,8 px yüksekti (yalnız `::after` alanı 44 px'ti). docs/11 §6 `site.css ≤ 45 KB`
bütçesi çoğu temada 10–300 bayt boşluk bıraktığı için kurallar **yerinde** değişti, eklenen blok yok:
- 01, 02, 04–20: `.textlink::after` satırının hemen altına `:is(.foot,.closing,.reply-panel) .textlink{padding:14px 0;margin:-14px 0}`;
  `.foot .textlink` / `.reply-panel .textlink` kendi üst boşlukları 14 px azaldı (18 → 4, 20 → 6). Link kutusu 45,6–49 px; yazının yeri ve
  sayfa değişmez. `::after` satırındaki `/* ≥ 44 px touch target */` yorumu yerine `/* G155 */` (artık kutunun kendisi ≥ 44 px).
  Bütçeyi yine aşan 6 temada (02, 04, 05, 17, 19, 20) ve 03'te yalnız biçim: boş satırlar, gerekirse `/* G155 */` ve dokunulan 1–3 satırın
  boşlukları silindi (hepsi ≤ 46 080 B; tema testleri bütçeyi denetliyor).
- 03: alt çizgi bir border → dolgu yazının **üstüne** (`.foot .replay` 22 px, RSVP kapanış linki inline-block + 23 px), üst margin geri alır.
- 21 Crimson zaten 44 px (inline-flex, min-height).
- **Ölçüm** (yerel üretim derlemesi, 360/390/430 px; aynı sayfada eski link stili enjekte edilerek önce/sonra): 19 tasarım × 2 sayfa ×
  3 genişlik → yazı konumu ve sayfa yüksekliği farkı **0 px**; 03'te yazı 0 px, RSVP sayfası 1 px kısa (inline → inline-block). En küçük
  link kutusu 44,5 px. 21 tasarımın tüm demo sayfalarında 44 px altı bağımsız link/düğme: önce **40**, sonra **0**.

**Küçük yazı (03, 21; 360 px):** önce 03'te 8,2–11,5 px (kemer kartında şehir/tarih, davetiye kartı tarih bloğu, geri sayım,
kicker'lar, nav), 21'de 7,7–11 px (eyebrow'lar, tarih bloğu, bölüm no, geri sayım, takvim düğmeleri, nav). Şimdi hepsi **≥ 12 px**:
- 03: değerler yerinde 12 px'e (veya `max(12px, …cqw)`; kart büyüyünce eskisi gibi büyür). Kemer kartında satırlar sığsın diye harf
  aralığı .04em, metin %60,5'ten başlar (kartın boş kâğıdı %59'dan, `img/manifest.json`), en küçük kartta (≤ 160 px: kısa telefonda zarf
  kartı) şehir satırı gizlenir — tarih kalır, şehir hemen alttaki sayfada; davetiye kartında tarih bloğu %84 genişlik, yan sütunlar tek
  satır. Sığma ölçüldü (5 telefon boyu × index/home × demo/stres/aralık kaydı: metin kartın %76–90'ında biter).
- 21: `site.css` sonuna G155 bloğu (bütçede 20 KB yer var): bütün küçük etiketler 12 px, biraz daha az harf aralığı; hero "invite
  you…" kolonu 150 px (masaüstü 240).
- Kalan (bilerek): platformun **ortak harita bloğu** (`public/static/map.css`, 28 temada: "Google Maps/Apple Maps/Waze" 11 px, not
  11,8 px) değişmedi; 21'in zarftaki **minyatür kartı** (`aria-hidden`, yalnız açılış animasyonunda) 7 px kaldı — 360 px'te metin
  kolonu ~70 px, 12 px sığmıyor. Ölçümde görülen 11,7–11,9 px değerleri animasyon/rotate ölçeği (hesaplanan boy 12 px).
- Body ≥ 16 px kuralları (docs/11) değişmedi.

### 4. K48 saklama / silme (admin)
- `lib/admin/view.ts`: `RETENTION_AFTER_ARCHIVE_MONTHS = 12`, `retentionDates()` (arşiv günü = "Online until" + 1; silme = +12 ay,
  ay sonu kırpılır), `retentionDue()`; `adminDashboard` **Yapılacaklar**'a `retention` maddesi: "<gün> tarihinden beri arşivde (12
  aydan uzun) — saklama süresi doldu, siteyi silin". Yalnız arşivdeki (çevrimdışı, salt okunur) siteler; yayında/taslak/hiç yayınlanmamış
  sayılmaz.
- `/admin`: maddenin etiketi **"Sil"** (uyarı rengi) ve sitenin sayfasını **mevcut silme bloğunda** açar (`#delete`; adres yazılarak
  "Kalıcı olarak sil" — var olan `delete` eylemi: site, fotoğraflar, RSVP'ler, belgeler, sipariş indeksi). Site sayfasında arşivdeki site için
  saklama notu (doldu / ne zaman dolacak). "Satış sonrası nasıl işliyor?" yardımına **silme/gizlilik talebi** adımı: aramaya sipariş no →
  site → Siteyi sil → hazır "Delete my website and data" mesajı (30 gün sözü) ve saklama kuralı.
- Gizlilik akışı zaten vardı (hızlı arama sipariş no'yu `#` ile de bulur, `delete_data` mesaj şablonu var); yeni kod gerekmedi, testle
  doğrulandı.
- Test `tests/g155-retention.test.ts` (4): tarih hesabı (ay sonu, artık yıl), Yapılacaklar (12 ay+1 gün var, 12 ay−1 gün yok,
  yayında/taslak yok), gerçek yerel sitelerle: 400 gün önce arşivlenen listelenir, 30 gün önceki listelenmez; `#<sipariş>` ile bulunur,
  route'tan silinir → site, slug, sipariş no, RSVP, foto klasörü gitti; diğer site duruyor.

### 5. P2-01 — ilan görseli 8
01–20 (20 tasarım) için `tools/listing_templates/capture.ts` (yerel üretim derlemesi, `/opt/pw-browsers`) + `tools/listing_editorial.py --only
08_included` ile yeniden çekildi (çekimler scratch'te, her tasarımdan sonra silindi). Telefondaki demo ekranı artık örnek
fotoğraflı. Değişen yalnız `collections/<NN>/package/listing/images_editorial/08_included.png` (20 dosya); `listing_v3.md`, JSON,
PDF, diğer görseller dokunulmadı. `capture.ts`'te yalnız çekim etiketi ("sample names and photos"). Not: 01–20'nin
`listing_<id>.pdf`'i eski 08'in küçük resmini taşıyor (talimat gereği yeniden üretilmedi; `python3 tools/listing_kit.py pdf --theme
<id>` ile tazelenir). Ekrandaki geri sayım çekim gününe göre (aracın kendi davranışı).

### Kontroller
Dal iki kez tabana alındı (G153 paletler, G156 palet A, G159 statik tema dosyaları; son olarak taban dal `83183883` birleştirildi),
kontroller birleşmiş kodda:
- `platform/`: `npm ci && rm -rf .next && npx tsc --noEmit && I18N_STRICT=1 npm test && npm run build` → **1571 test: 1569 geçti, 0
  hata, 2 atlandı** (`.next` silindiği için "built output" testleri) · build + trace-check geçti (78 fonksiyon; `public/demo/` hiçbir
  fonksiyona izlenmiyor).
- Yeni testler: `tests/g155-demo-photos.test.ts` (27: 21 tasarım × home/story/details yer tutucu yok + srcset + dosya; manifest ↔ dosya;
  kayıt/taslak değişmiyor; seed varsayılanı), `tests/g155-retention.test.ts` (4), `tests/g155-themes.test.ts` (23: 21 tasarımın dokunma
  kuralları + 45 KB bütçe, 03'te 12 px altı font-size yok, 21'in bloğu).
- `node scripts/build-demo-photos.ts --check` temiz · `python3 tools/etsy_upload.py --check --strict` → 21 tasarım + 3 hizmet OK (çıkış 0).
- **theme-check** (`--stress --no-video`, yerel üretim derlemesi), değişen 21 tema: **19'u 0 hata**. Kalan ikisi **G155'ten değil** —
  taban dalın tema dosyalarıyla (`PLATFORM_THEMES_DIR`) aynı derlemede aynı hata çıkıyor: 03 `palette dusty-blue-blush (coming)`: home
  "Reply now" kontrastı 4,47 < 4,5 (G156 paleti; orijinal palet geçiyor) · 01 `home@390 (draft preview, no photos)`: davetiye kartı piksel testi "metin boyalı dekorda" (tabanda da var, her koşuda farklı satırlar: kart 720 px, resim 260 px — ölçüm/yükleme zamanlaması gibi görünüyor; G155 yalnız `.textlink` kurallarına dokundu). 08 Winter'daki palet kontrast hatası ve 06'daki
  yatay kısa telefon "replay" zemin hatası son birleşmeden sonra kayboldu (08 tabanda düzeltildi; 06 tekrar koşuda temiz).
- Ölçüm betikleri (scratch, repoda yok): dokunma alanı + küçük yazı (21 tasarım × 5 sayfa + açılmış zarf × 360/390/430), aynı görünüm
  (eski link stili enjekte edilerek; 20 tasarım × 2 sayfa × 3 genişlik → en büyük fark 1 px, en küçük kutu 44,5 px), 03 kart sığması,
  basılı davetiye 288 yüz.

### Yapılmadı / sınırlar (dürüst)
- Vercel'de canlı deneme yok (yayın yok); gerçek iPhone/Android yok (Chromium mobil emülasyon).
- Kısa telefonda 03'ün zarf kartında şehir gizlenir (yukarıda); 21'in zarf minyatür kartı 7 px; ortak harita bloğu 11 px.
- 19 MB demo fotoğrafı repoya eklendi (CDN'den; fonksiyon boyutunu etkilemez).
- `PROJECT_STATE.json` / `COLLECTION_STATUS.md` güncellenmedi (entegratörde).

## Günlük
- 2026-10-17 entegratör onayladı
