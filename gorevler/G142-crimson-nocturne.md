---
id: G142
baslik: 21 Crimson Rose Atelier tema standardına + 22 Nocturne Lake Estate platform teması
rol: claude-kod
durum: inceleme
alan: claude-G142
oncelik: 1
bagimli: [G133, G134]
yazar: [platform/themes/crimson-rose-atelier/, platform/themes/nocturne-lake-estate/, collections/21_Crimson_Rose_Atelier/, collections/22_Nocturne_Lake_Estate/, platform/tests/theme-crimson-rose-atelier.test.ts, platform/tests/theme-nocturne-lake-estate.test.ts, platform/tests/g142-crimson-nocturne.test.ts, platform/tests/g085-designs.test.ts, platform/tests/g093-designs.test.ts, platform/tests/g094-designs.test.ts, platform/tests/g097-designs.test.ts, platform/tests/g138-extras.test.ts, platform/lib/marketing/designs.ts, platform/lib/marketing/config.ts, platform/lib/audio/catalog.ts, platform/lib/claim/demo-map.ts, platform/scripts/seed.ts, platform/scripts/lib/theme-env.ts, platform/lib/marketing/assets.json, platform/public/marketing/designs/crimson-rose-atelier/, tools/listing_templates/capture.ts, tools/etsy_upload.py, tools/katalog.py, tools/tests/test_etsy_upload.py, gorevler/G142-crimson-nocturne.md]
---

## Amaç
Koordinatör (session_01HP9ZrJ8mhZnigbvsvUQ4pR) isteği: (1) 21 Crimson'da G134'te bulunan theme-check hatalarını kapatmak
(`--stress` 0 hata), satış durumunu değiştirmeden hazır olduğunu raporlamak; (2) `codex/nocturne-lake-estate` taslağını
(dalı birleştirmeden) tam platform teması yapmak, "coming" kaydı, demo pini, tema testi; zarfın tek görsel açılması
yerine ayrı hareket eden parçalar (K23/şart 4) — GPT'den gereken parçaların prompt'ları + geçici en iyi düzen.
Dal `claude/g142-crimson-nocturne` (taban `main` d5bbc39); main'e push/PR/Vercel yok.

## Sonuç (2026-10-17, claude-G142)

### 21 Crimson Rose Atelier
- **theme-check `--stress`: 112 geçti, 0 hata**, 25 uyarı (24'ü "Manrope yüklenmedi" — test makinesinin ağı; 1'i katalog kaydı
  yok → W1 comp yok). G134'te 36 / 109 / 35 idi. `final-smoke` 45/45, `g051-browser` 44/44 (FAQ "+/×" ve satır sonu
  düzeltmesinden sonra; ilk koşu 42/44).
- G134 kümeleri: (a) copy manifest yeniden üretildi (70 anahtar; `details_title` yerine details `<title>` `day_title`
  kullanıyor — standart dışı yeni anahtar açılmadı); (b) zarf sözleşmesi: `invite:opened/arrive:<slug>` anahtarları +
  `<head>` betikleri, `.replay` (gizli `[hidden]` yerine açık hâlde görünür), `a[data-enter]`, açılınca ipucu
  `display:none`, `.nojs-only` (noscript kalktı), speculation rule, `@view-transition` + kart `invite-card` → home oval
  portre, `from-envelope` ilk karede görünür; RSVP'de `#reply` düğmesi + "Replay the envelope"; G134'teki "açılış tıklaması
  zaman aşımı" aslında gizli `.replay`'e tıklamaydı; (c) home albüm şeridi telefonda basamaklı sütun, ≥ 700 px'te satır
  (yan kaydırma yok); (d) her iç sayfada `[data-scene]`/`[data-step]`, `[data-slot]` + `.ph-mark` + `img/ph_*`
  yer tutucular (kâğıt dokusundan, `build_images.py`), sayaç `data-target-utc`; (e) RSVP soru etiketi kendi `<span>`'inde
  — form.js'nin "(optional)" işareti etiketin yanına düşer; (f) zarf yazıları: koyu tasarım ölçümü
  (`img/manifest.json` `theme_check.backdrop`: dark_below 0, light_above 110 — 06/19 gibi) + kısa ekranda (≤ 700 px boy)
  gül küçülüp yukarı alındı; 375×553'te isim artık gülün üstünde değil (gözle bakıldı).
- Details'te ses düğmesi: platformun sabit düğmesi (sol üst, 6 px) — sayfa başında mekân satırıyla çakışmıyor; G134'teki
  görüntü tam sayfa ekran görüntüsünde sabit öğenin kaydırılmış konumuydu. Kaydırırken her temada olduğu gibi içeriğin
  üstünden geçer.
- Zarf kartı artık oval portre + "Our wedding" + isimler + tarih; teşekkür modunda başlık + foto ya da gül dalı.
  Ek: `thank-you.css`, `build_images.py`, README, sahne koreografisi (`MOTION.scenes`).
- **Satış durumu değişmedi (`coming`).** Teknik olarak satışa açılmaya hazır görünüyor; karar koordinatörde. Açık kalanlar:
  gerçek telefon, Etsy ilan paketi/rehber (G133'te de yoktu), katalog kaydı (`tools/katalog.py`; W1 comp yok).

### 22 Nocturne Lake Estate
- Tema: `platform/themes/nocturne-lake-estate/` (README, `build_images.py`, `img/manifest.json`, `thank-you.css`, og
  `img/og-1200x630.jpg` + `img/favicon.png` doğru yerde), koleksiyon `collections/22_Nocturne_Lake_Estate/` (demo kaydı,
  taslağın 3 PNG'si + `PROMPTS.md`, yeni `GPT_PROMPTS.md`). Taslak dal birleştirilmedi; dosyalar oradan alındı.
- **theme-check `--stress`: 112 geçti, 0 hata**, 12 uyarı (11'i Cormorant Garamond zarf sayfasında yüklenmedi — orada yalnız
  "&" için kullanılıyor; 1'i katalog kaydı yok). `final-smoke` 45/45, `g051-browser` 44/44. İlk görünüm (DPR 3) index 320 KB,
  home 342 KB (fotoğraflı 409 / 635 KB); zarf → home 3,8 s; açılış MP4'ü üretildi (repoya konmadı).
- Kayıtlar: `config.ts` "coming" ([PRICE] yer tutucu), `designs.ts` metinleri + stiller (classic, destination),
  `audio/catalog.ts` (Evening Strings; seal 0 · paper 450 · slide 1700 · chime 3000 ms), demo pini Bellagio,
  `tests/theme-nocturne-lake-estate.test.ts` (7), ortak `tests/g142-crimson-nocturne.test.ts` (2 tema × 8), satışta
  olmayanları sayan 4 design testi Nocturne'ü içeriyor.
- Taslaktan değişenler: üst menü düğmesi yerine alt nav (ses düğmesi sol üstte; standart denetimler görünür nav ister);
  Google Fonts (Cinzel + Cormorant Garamond + Jost; taslak Georgia/Arial idi); CSS ile çizilmiş kart çerçevesi ve program
  noktaları kaldırıldı (K21); galeri oranları `theme.json` ile eşitlendi (4:5 / 4:3 / 4:3, mekân 16:9); demo çift Crimson
  ile aynıydı (Olivia & James, Rosewater Estate) → Eleanor & Luca, Villa Nocturne; galeri görüntüleyicide boş `<img>` hatası
  ve `shots.forEach` hatası düzeltildi.
- **Zarf (geçici):** taslakta yalnız tek kapalı zarf var. `build_images.py` onu keser: kapak (`kapak_kes` "v", renk
  yöntemi), cep = kapalı − kapak, mühür = kapalı görselden disk; mührün altı aynı zarfın hemen üstündeki / altındaki
  kâğıdıyla, çevre halkasının tonuna eşitlenerek dolduruldu (cepte hafif yuvarlak iz kalıyor); kapağın içi = aynalanmış,
  koyulaştırılmış kapak (90° el değiştirme); zarfın içi = gövdenin bulanık/koyu hâli; kart = kapağın düz kâğıdından kırpım,
  açılmış ton. Çizim yok. Açılış: mühür kalkıp düşer → kapak menteşede 90°'ye kalkar, içi devralır → kart cepten yükselir →
  öne gelir → home (VT). Parçalar ayrı hareket ediyor.
- **GPT'den istenen parçalar** (`collections/22_Nocturne_Lake_Estate/assets/gpt/GPT_PROMPTS.md`, İngilizce prompt + tam yol):
  `parts/envelope_closed.png` (mühürsüz), `parts/closure.png` (altın mühür), `parts/envelope_open.png`, `parts/card_small.png`
  (#00FF00 pencere), `parts/bg_page.png`, `parts/accent_1.png` (altın zeytin yaprağı), `parts/divider.png`, `parts/web_hero.png`
  (og kaynağı) + PAKET 2 `photos/hero_portrait.jpg`, `story_1.jpg`, `story_2.jpg`, `story_3.jpg`, `venue.jpg`. Gelince
  `build_images.py` geçici kesimden bunlara geçmeli (kapak tipi, docs/11 §7.3).

### Ortak / kapsam dışı küçük değişiklik
- `platform/scripts/seed.ts`: `--no-photos` artık demo kaydının medya alanlarını da boşaltıyor (belgelenen "placeholder
  state" anlamı). Crimson ve Nocturne demo kayıtları tema içi örnek fotoğraflara bağlı olduğu için theme-check'in
  fotoğrafsız sitesi aksi hâlde yer tutucu göremiyordu. Diğer temaların demo medyası zaten `null` (etki yok).

### Main ile birleşme (rebase `e849c4e`)
G138 (Details içerik bölümleri: `data-blocks`, `data-travel`, `data-menu`) main'de Crimson'un eski details.html'ine
eklenmişti; çakışmada bu üç blok yeni Crimson details'ine ve Nocturne details'ine aynı sözleşmeyle taşındı, copy
anahtarları (travel_*, menu_*, blocks_more) G138'in `max` değerleriyle manifeste geçti (Crimson 83, Nocturne 86 anahtar).
`tests/g138-extras.test.ts` tema sayısı 21 → 22. theme-check rebase'ten önce koşuldu (demo kaydında bu bloklar boş; yapı
`g138-extras` testinde iki tema için de geçiyor).

### Koordinatörün ek bulguları (2026-10-17, ikinci tur)
1. `designs.ts` / `config.ts`: 21 (ve 22) girdileri diğer 20'yle aynı TS biçiminde (tırnaksız anahtar, tek tırnak).
   `tools/tests/test_etsy_upload.py`'nin "coming" regex'i yeni biçime çevrildi; `test_etsy_upload`, `test_listing_kit`,
   `test_listing_editorial`, `test_build_customer_guides`, `test_tema_build` geçti.
2. `data-slot`: ilk turda eklenmişti (5 alan, index kartı dahil); motor `data-photo-state` yazıyor (theme-check foto durumu geçiyor).
3. Katalog: `tools/katalog.py` → `EK_TEMALAR` (21, 22) ve `theme-env.ts` bunu D ile birlikte okuyor. **D'ye eklenmedi:** D'deki
   kayıt `ayirt` (her çift ≥ 4 eksen), `WEB`, `STORY` denetimlerine ve `yaz`/`paket5`/`gorev5`/`ozet` üreteçlerine girer (21/22 için
   görev dosyası, DESIGN_BRIEF ve content.demo.json'u yeniden yazar — Crimson demo medyası silinirdi); tam katalog kaydı ayrı bir
   karar/görev. `katalog.py kontrol` değişmedi (20 tasarım). theme-check artık koleksiyonu buluyor: Crimson kendi PAKET 2
   fotoğraflarıyla koşuyor (`photos/couple-photo.png` → `hero_portrait.png`, aynı dosya `story_1.png` — git'te tek blob);
   Nocturne'de PAKET 2 henüz yok → 03 fotoğrafları (uyarı).
4. RSVP: `#reply` atlamasında form sabit ses düğmesinin altına düşmüyor (`scroll-margin-top: 64px`, iki tema; ölçüm: düğme 6–50 px,
   "Your name" ~150 px).
5. `COLLECTION_STATUS.md` + `DESIGN_BRIEF.md` 21 ve 22 için yazıldı (kısa, website dönemi).
Yeniden koşum: theme-check `--stress` Crimson 111/0/24, Nocturne 111/0/12 (video kapalı); `npm test` 1298/1298; typecheck, build ✓.

### Testler (Linux, Node 22)
`npm run typecheck` ✓; `npm run build` ✓ (trace-check 23 tema); `npm test` **1298/1298** (main `e849c4e` üstüne rebase sonrası), 0 hata, 0 atlandı;
theme-check `--stress` Crimson 112/0/25, Nocturne 112/0/12; final-smoke 45/45 + 45/45; g051-browser 44/44 + 44/44.
390 px görüntülere (zarf açılış kareleri, home/story/details/rsvp, 375×553 / 360×640) gözle bakıldı.

**Denenmedi:** gerçek iPhone/Safari ve Android Chrome, Vercel yayını (görev dışı), gerçek alıcı fotoğrafları, yavaş ağ,
qa-kontrol karşılaştırma kapısı (W1 comp yok). Fontlar test makinesinde kısmen yüklenmedi (ağ) — yedek fontla ölçüldü.

### Satışa açılış (kullanıcı, 2026-10-17)
Kullanıcı: "Crimson'u satışa aç, durumu live yap". `config.ts` → `live` (tasarım numarası sırasında, Coastal'dan sonra);
fiyat kararı yok → `[PRICE]` sitede görünür kalır (uydurulmadı). Canlı tasarım şartı olan gerçek ekranlar + açılış videosu:
`tools/listing_templates/capture.ts` ile güncel tema yerelde çekildi (30 ekran + opening.webm), `scripts/marketing-assets.ts
--designs crimson-rose-atelier --shots …` → `public/marketing/designs/crimson-rose-atelier/` (8 ekran × 3 genişlik, 10 s
açılış + poster), `assets.json`. Çekim aracında RSVP formu ekranı ad etiketini sabit ses düğmesinin altına koyuyordu → form
24 yerine 120 px yukarıdan çerçeveleniyor (tüm temalar için; mevcut çekimler yeniden üretilmedi). Testler: "coming" listeleri
(g085/093/094/097) yalnız Nocturne, Crimson tema testi `live` + üretimde `/start` açık, `test_etsy_upload` COMING boş.
`npm test` 1299/1299, typecheck, build ✓; tools testleri ✓. Yayın (Vercel) yapılmadı — main'e birleşip deploy edilince görünür.
Açık: fiyat, Etsy ilan URL'si; G137 ilan görselleri G142 öncesi temayı gösteriyor (albüm şeridi), yeniden çekilebilir.

## Günlük
- 2026-10-17 açıldı ve alındı: claude-G142 (koordinatör isteği)
- 2026-10-17 bitti, incelemeye gönderildi
