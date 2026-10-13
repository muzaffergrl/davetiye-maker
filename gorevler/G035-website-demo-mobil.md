---
id: G035
baslik: Tasarım 03 — mobil öncelikli website demosu (GPT parçalarıyla açılış şovu) · PİLOT
rol: claude-kod
durum: bitti
alan: claude-kod-10
oncelik: 1
bagimli: [G030, G032]
yazar: [collections/03_Blush_Garden_Rose/website/]
---

## Amaç
K22: ürün yalnız website. Tasarım 03'ün GPT parçalarıyla (G030) **telefonda ilk açılışta etkileyen** tek
sayfa düğün websitesi demosu. Bu demo yeni website standardını belirler ve kullanıcıya teslim biçimi kararı
(Canva Website / kendi kodlu site) için gösterilir. Claude görsel çizmez; yalnız yerleşim, tipografi, hareket.

## Girdiler
- GPT parçaları: `collections/03_Blush_Garden_Rose/assets/gpt/parts/`, hedef görünüm: `.../comps/`
- `tools/parts_prep.py` (yeşil pencere → şeffaf + koordinat; ön cep kesimi)
- `collections/03_Blush_Garden_Rose/content.demo.json`, `palette.json`
- Örnek yapı (yalnız bölüm sırası/işaretler): `collections/02_Dusty_Blue/website/`

## Yapılacaklar
1. Önce 390 px telefon için tasarla; sonra 360/430/768/1280.
2. Açılış şovu: kapalı zarf + kurdele → dokununca kurdele kayar, zarf açılır, kart yükselir, çiçekler ve
   yapraklar ayrı katman hareket eder → siteye geçiş. "Skip" ve `prefers-reduced-motion` desteği.
3. Bölümler: hero (isimler, tarih, geri sayım), davet kartı, Our Story (kemerli altın çerçevelerde 3 foto),
   program, mekân/harita butonu, RSVP (şimdilik yer tutucu), kapanış. Kaydırmada nesneler ayrı girer.
4. Bütün metin HTML; görsellere metin pişirilmez. Fontlar Google Fonts linki.
5. Hafiflik: görseller WebP/AVIF + `srcset`; ilk açılış ≤ ~1,5 MB.
6. Önizleme: 390 px ekran kaydı (MP4/GIF) + 360/390/430/768/1280 tam sayfa görüntü → `website/previews/`.

## Bitti sayılması için
- [x] Telefonda yatay kayma yok, metin taşmıyor, açılış akıcı (Chromium ölçümü) — aşağıda "Test edildi"
- [x] Görseller yalnız GPT parçaları; kodla çizilmiş dekor yok (kod: yalnız kırpma/maske/bulanıklaştırma; CSS'te
      yalnız arayüz öğeleri — düğme, alt menü çubuğu, tarih bloğu ve program satırlarında 1 px altın çizgi)
- [ ] Önizlemeler kullanıcıya gösterildi — entegratör/koordinatör gösterecek (bu oturum kullanıcıya erişemez)

## Sonuç
Durum: `concept` demo (çalışan çok sayfalı site, yayınlanmadı). Koordinatörün ara kararları uygulandı:
K23 yapı (zarf sayfası → ayrı içerik sayfaları), foto alanları, K24 içerik katmanı.

**Dosyalar** (`collections/03_Blush_Garden_Rose/website/`)
- `index.html` zarf açılışı · `home.html` · `story.html` · `details.html` · `rsvp.html`
- `site.css` (palet token'ları, hareket ön ayarları, foto alanı bileşeni) · `site.js` (en üstte `MOTION` koreografi +
  `ENVELOPE_GEOMETRY`; ayrı `CONTENT` içerik nesnesi) · `img/` (43 WebP, 2 maske, `photos.css`, `manifest.json`)
- `build_images.py` — GPT parçaları → `img/` (parts_prep çalıştırır; ara çıktı `img_src/` git'e girmez)
- `make_previews.cjs` — kendi yerel sunucusu + bütün kontroller + önizlemeler · `README.md` (yapı, yeni tasarıma uyarlama)

**Açılış (index.html):** painted bg_scene üstünde kapalı zarf + ipek fiyonk, isimler, "Tap to open" ve "Skip".
Dokununca: fiyonk hafif sıkışır, sağ alta kayarak çözülür → kapalı zarf açık gövdeye (astar + ön cep) erir, kapak
menteşesinde 3D döner → kart (hero_portrait fotoğraflı) ön cebin **arkasından** yükselir, tamamen çıkınca öne geçip
yerleşir → petaller düşer → `home.html`. Cross-document View Transition ile kart home'daki hero kartına "uçar"
(desteklemeyen tarayıcıda solma). Katman sırası zarf gövdesi → kart → ön cep; yalnız transform/opacity.
Geri tuşu açılışı zorla tekrar oynatmaz: açık zarf + "Enter" + "Replay the opening" (sessionStorage, try/catch).
`prefers-reduced-motion`: animasyonsuz doğrudan home. Sayfalar doğrudan açılınca da çalışır.

**Sayfalar:** home = hero (kart + isimler + tarih + mekân + canlı geri sayım), davet kartı (comp 4 tipografisi),
Story/The Day/RSVP tanıtımları · story = 3 kemerli altın çerçeve · details = Order of the Day kartı + dress code,
mekân fotoğrafı + harita, Travel & Stay, Registry · rsvp = RSVP yer tutucu + fiyonklu kapanış. Mobil alt menü
(≥960 px üstte). Her sayfada öğeler sırayla girer (`MOTION.scenes`; ör. kart yükselir → isimler yazılır → tarih).

**Foto alanları** (aynı bileşen: `.photo-slot[data-slot]` > `img[data-photo]` + "Your photo here" işareti):
`hero_portrait` 0.953:1 (kart penceresi 563×591, index + home) · `story_1..3` 0.720:1 (çerçeve penceresi 622×864;
story_1 home tanıtımında da) · `venue` 3:2 (kemerli üst, GPT çiçek kümeleriyle çerçeveli). Kemer maskeleri
pencerenin kendisinden (`img/mask_card.png`, `img/mask_arch.png`). G036 fotoğrafları geldi ve kullanıldı;
gelmeyen anahtara bg_scene'den yumuşak yer tutucu yazılır (önizleme: `*_390px_placeholder.png`).

**İçerik (K24):** HTML'de kişisel metin yok; her değer `data-field="content.demo.json yolu"` (+ `data-format`),
`<a data-field="urls.*">`, `<img data-field="media.*">`; tek kaynak `site.js` → `CONTENT` (= content.demo.json,
kontrol ediliyor). İsteğe bağlı bölümler `data-optional` ile işaretli (gizleme yok — platform işi).

**Önizlemeler** (`website/previews/`): `website_html_<index|home|story|details|rsvp>_390px.png`,
`website_html_<index|home>_<360|430|768|1280>px.png`, `website_html_<home|story|details>_390px_placeholder.png`,
`website_html_opening_390x844.mp4` (31 s: dokunma → açılış → home → kaydırma → Story sayfası), `checks.json`.

**Test edildi** (Playwright 1.56 Chromium, yerel HTTP; `make_previews.cjs`: 0 hata, 0 uyarı):
- 360/390/430/768/1280: yatay kayma yok, ekran kenarını aşan öğe yok, metin ekran dışında değil, bütün görseller
  yüklü, Google Fonts yüklü.
- Kart metinleri (davet, program, RSVP, küçük kart) GPT görselinin düz kağıt bölgesinde: her metin satırı
  `manifest.json` free_zone haritasına karşı ölçüldü (boyalı çiçeğe/altın çizgiye değmiyor).
- Her data-field = content.demo.json (Node'da bağımsız biçimlendirilerek); ham HTML'de kişisel metin yok.
- Zarf → home 4,4 s, kart geçiş işareti; geri dönüş/replay; Skip; reduced motion (≈0,3 s, hepsi görünür).
- Geri sayım hedefi 2027-05-15 16:00 America/New_York = 20:00 UTC; saat taklidiyle "today"/"after" mesajları.
- RSVP: form yok, tıklama hiçbir istek göndermiyor, başarı mesajı yok ("Preview only… nothing was sent").
  Dış istek yalnız Google Fonts. URL'ler null → bütün linkler `#`.
- İlk açılış (390×844, DPR 3): index 1012 KB, home 773 KB (≤ 1,5 MB).
- Açılış kare süresi (headless Chromium, GPU yok, DPR 3): 59,7 fps, p95 16,7 ms, 1 kare 33 ms.

**Test edilmedi:** gerçek iPhone/Safari ve Android cihaz; Firefox (view transition yok → solma yolu yalnız kodda);
yavaş ağ; ekran okuyucu; JS kapalı görünüm (isimler JS ile doluyor → görünmez); yayın/hosting; RSVP veri akışı (yok).

**Zayıf noktalar (dürüst):**
- Kapalı zarfın kendi kapağı fiziksel kalkmıyor, açık gövdeye eriyor; ayrı "kapalı kapak" parçası olsa gerçek dönüş yapılır.
- Kartın home'a uçması yalnız Chromium 126+ / Safari 18.2+'da; diğerlerinde solma.
- `content.demo.json` `optional_blocks.countdown: false`, görev ise geri sayım istiyor → gösterildi; entegratör kaydı düzeltmeli.
- `CONTENT.story` (intro + 3 başlık) content.demo.json'da yok — **önerilen alan**; entegratör kayda eklemeli.
- Kişisel metin istemci tarafında doluyor: `<title>` genel, paylaşım (OG) önizlemesi yok → platformda sunucu doldurması gerekir.
- Mekân fotoğrafının çerçevesi GPT çerçeve parçası değil (CSS kemer kırpma + GPT çiçek kümeleri).
- Masaüstü düzen çalışıyor ama boş alan fazla; öncelik telefon.

**Önerilen görevler:** gpt-gorsel — yatay (3:2) altın çerçeve parçası (mekân fotoğrafı için, pencere #00FF00) ve
kapalı zarfın ayrı kapak parçası · entegratör — content.demo.json'a `story` alanları, `countdown: true` ·
claude-qa — gerçek telefon (iOS Safari + Android Chrome) testi.

## Günlük
- 2026-10-13 alindi: claude-kod-10
- 2026-10-13 bitti, incelemeye gönderildi
- 2026-10-13 entegratör onayladı
