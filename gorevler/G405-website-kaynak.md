---
id: G405
baslik: Tasarım 05 Mediterranean Lemon — platform teması
rol: claude-kod
durum: inceleme
alan: wf-tema05
oncelik: 2
bagimli: [G205, G038, G046, G052]
yazar: [platform/themes/mediterranean-lemon/, platform/tests/theme-mediterranean-lemon.test.ts, platform/previews/g405/]
---

## Amaç
Tasarım 05'i platformda tema olarak kurmak (K24, `docs/10_SITE_PLATFORMU.md`): kapalı zarf açılış sayfası → home → story, details, rsvp; yalnız bu tasarımın GPT parçalarıyla (K21), kişisel metin HTML'de. **Kurallar `docs/11_TEMA_STANDARDI.md`'dedir; bu görev metniyle çelişirse docs/11 geçerlidir.**

## Girdiler
- Tema standardı: `docs/11_TEMA_STANDARDI.md` — bütünü; zarf tipi **kapaklı zarf** → §7.1 + §7.3; bitti tanımı §13, kontrol listesi §15
- Platform sözleşmesi: `platform/README.md` (işaretler, RSVP form sözleşmesi, `#site-data`); çalışan örnek `platform/themes/blush-garden-rose/` — **yalnız** işaret/RSVP/`#site-data`/oturum anahtarı kullanımı için; yerleşimi, aralıkları, süs konumları ve zamanlaması bu temaya taşınmaz (docs/11 §8). G035 kaynağı (`collections/03_Blush_Garden_Rose/website/`) örnek değildir
- GPT çıktıları (G205): `collections/05_Lemon_Mediterranean/assets/gpt/comps/` (W1, yerleşim referansı, satılmaz; yalnız sade adlar — `_vN` denemedir), `parts/` (katmanlar), `photos/` (örnek fotoğraflar). **G205 açık kusurları (Sonuç):** iki çerçevenin yeşil penceresinde yarı saydam lekeler → pencere dikdörtgeni kodla tam saydam/tam maske yapılır (parts_prep `leke_doldur`); yatay çerçeve penceresi ≈ 1,87:1 (hedef 3:2) → mekân fotoğrafı bu orana `object-fit: cover` kırpılır, kırpım önizlemede kontrol edilir; zarf hizası ±%1 içinde
- İçerik `collections/05_Lemon_Mediterranean/content.demo.json`, renk `collections/05_Lemon_Mediterranean/palette.json`, özet `collections/05_Lemon_Mediterranean/DESIGN_BRIEF.md`
- Araçlar: `tools/parts_prep.py` (geçici klasöre; docs/11 §5.3), `python3 tools/kit_check.py collections/05_Lemon_Mediterranean --paket 5`, `node scripts/theme-check.cjs --theme <slug>` (G052)

## Yapılacaklar
1. `theme.json`, 5 sayfa, `site.css`, `site.js`, `build_images.py`, `README.md` docs/11 §1–§4 düzeninde. 03'ten yalnız platform sözleşmesi alınır (motor işaretleri, RSVP formu, `#site-data`, slug'lı oturum anahtarları, `data-scene`/`data-step`/`data-a` kancaları); yerleşim, tipografi ve hiyerarşi bu tasarımın W1 comp'larından — tema `README.md`'sinde sayfa başına **comp öğe haritası** (her W1 öğesi → şablon öğesi ya da gerekçeli sapma; comp'u olmayan bölümler bu tasarımın parçaları ve tipografisiyle, docs/11 §8).
2. Parçalar: `python3 platform/themes/mediterranean-lemon/build_images.py` → `parts_prep` **geçici klasöre** (`--prep-dir`; tema klasörüne, `img_src/`'ye ya da `assets/`'e asla — docs/11 §1, §5.3–§5.4), tip kesimleri (§7), maskeler, `free_zone`, yer tutucular, og; WebP + srcset genişlikleri (§5.1, §5.5). Yalnız bu tasarımın GPT parçaları; yeni şekil/dekor çizme (K21).
3. Zarf açılışı (`MOTION.envelope`, kapaklı zarf, docs/11 §7.1 + §7.3): On tap, the lemon tie slips loose and rolls away, the white flap opens upward to reveal the blue-and-white tile liner, and the card rises while a lemon branch sways in from the top corner and a blossom drifts down. Katalog: Çini desenli astarlı beyaz zarf; kapak açılırken limon dalı içeri doğru sallanır. Açılış cümlesindeki sıra, sayı ve yön bağlayıcıdır; kapanış elemanı, zarf/kapak ve kart ayrı katmanlar; kart home'daki karta dönüşür; `closure.png` kare tuvalde büyük çizilir; yeri kesim geometrisine bağlanır (`manifest.closure`, docs/11 §7.1).
4. Sayfa koreografisi (`MOTION.scenes`): her sayfada öğeler sırayla girer. Story: Fiyonk dilimli (scalloped) kenarlı çerçeveler, çini panolar gibi döner (three scalloped tile-framed portraits standing perfectly straight in a gentle staggered column down the page (left, right, left) like painted tile panels set into a sunlit white plaster wall, not overlapping); telefonda foto penceresi ≥ 38vw (sığmazsa basamaklı/alt alta düzen, comp sapması olarak yazılır — docs/11 §9). Parçacıklar `MOTION.accents` (§8: tür başına dosya ve yol). Details/rsvp: kart, satırlar ve buton sırayla.
5. Foto alanları: `hero_portrait` (card_small penceresi), `story_1..3` (frame_portrait), `venue` (frame_landscape); kutu ve maske `windows.json`'dan (§5.6, §9). PAKET 2 fotoğrafı yoksa yer tutucu.
6. Fontlar: Allura + Playfair Display (Google Fonts link'i; repoya font dosyası girmez). Tarih motor biçimiyle (`May 15, 2027`). Link blokları `data-if="urls.*"` ile linksiz kalkar — "link will be added soon" diyen ölü düğme yok (§4).
7. Testler ve önizleme (§13): `platform/tests/theme-mediterranean-lemon.test.ts`; `theme-check --theme mediterranean-lemon` (5 genişlik, kısa telefonlar, akışlar, ağırlık, MP4); `platform/previews/g405/` (W1 comp | tema karşılaştırmaları dahil).

## Bitti sayılması için
- [ ] docs/11 §15 kontrol listesi tamam (atlanan madde Sonuç'ta gerekçesiyle)
- [x] `npm test`, `npm run typecheck`, `npm run build` (trace-check) geçti; `tests/theme-mediterranean-lemon.test.ts` (§13.2)
- [ ] `theme-check --theme mediterranean-lemon` hatasız; `previews/g405/` + `compare_<sayfa>_390.jpg` qa-kontrol incelemesinden geçti
- [x] Sonuç dürüst: açılış ve story tarifi, comp sapmaları, denenmeyenler (gerçek iPhone/Safari, yayın), sorunlu GPT parçaları

## Sonuç
**2026-10-14 · wf-tema05 (claude-kod) — durum: inceleme.** Ayrıntı ve comp öğe haritası: `platform/themes/mediterranean-lemon/README.md`.

**Ne yapıldı**
- `platform/themes/mediterranean-lemon/`: `theme.json` (5 sayfa, 5 foto anahtarı; oranlar manifest `box_px`), `content.demo.json`
  (koleksiyon kaydının birebir kopyası), `index/home/story/details/rsvp.html`, `site.css` (45,5 KB), `site.js` (`MOTION`,
  `ENVELOPE_GEOMETRY`, `fitNames`/`fold`/`fitCopy`, `DEV_CONTENT`), `build_images.py`, `README.md`, `img/` (WebP + maskeler + og +
  favicon + `manifest.json`). Klasör 2,05 MB (≤ 3 MB); kaynak PNG / `img_src` / önizleme yok.
- `platform/tests/theme-mediterranean-lemon.test.ts` (30 test: §13.2'nin 23 maddesi bu temaya uyarlanmış + kapanışın kapaktan ayrı
  oluşu, zarf/landing/replay, telefon zemini + yer tutucular + yeşil denetimi, story pano düzeni, home, tasarım aralığı, rotalar,
  gizlilik). `platform/previews/g405/`: theme-check çıktıları (5 genişlik, kısa telefonlar, yatay, aralık, zorlama, yer tutucu,
  değişen içerik, yanıt gönderildi), `compare_<sayfa>_390.jpg` (W1 | tema), `opening_390x844.mp4`, `compare_closure.jpg`,
  `cuts_envelope.jpg`.
- **Açılış** (kapaklı zarf, §7.1 + §7.3; katalog cümlesindeki sıra): dokununca limon bağı gevşer ve V'nin ucundan düşüp sağa
  **yuvarlanarak** gider (kapaktan ayrı katman, 0–1,3 s) → beyaz fisto kapak menteşede kalkar (560 ms'de), 90°'de çini astarlı açık
  kapağa el değiştirir ve yukarı açılır → kart cepten yükselirken sol üst köşedeki limon dalı içeri sallanır (dal sahnenin kendi
  `decor_tl` katmanı) ve tek limon çiçeği (accent_2 × 1, `drift`) kartın yanından süzülür → kart öne gelir (× 1,04) → VT ile home
  kartına. Dokun → home 4,12 s; Skip her an; reduced motion'da dokunuş animasyonsuz doğrudan home'a geçer.
- **Story:** üç çini çerçeveli portre basamaklı sütunda (sol, sağ, sol), dimdik, üst üste binmeden; her biri görünüme girince dış
  kenarı üzerinde 72°'den dönerek duvara oturur (`turn-l`/`turn-r`), sonra başlık ve duvardaki yaprak/çiçek. Telefonda pano 64vw,
  pencere **38,7vw**; ≥ 720 px comp'un iki sütunlu basamağı.

**GPT parçaları (G205) — sorunlar ve kodla çözüm (çizim yok)**
1. frame_portrait / frame_landscape pencerelerinde yarı saydam koyu lekeler → `leke_doldur`; `manifest.checks.windows_transparent` hepsi 0.
2. Pencere çevresinde pembe/kırmızı ayrıştırma saçağı, yatay çerçevede pencereye taşan dal ucunda kırmızı saçak → çerçeve/yaprak
   renginden temizlik (README "GPT kusurları").
3. Yatay çerçeve penceresi ≈ 1,86:1 (hedef 3:2) → `object-fit: cover`; örnek `venue.jpg` ile önizlemede kontrol edildi (villa, teras, deniz görünüyor).
4. Kapak kesimi: `tema_build.kapak_kes("v")` beyaz→mavi düşüşünü bulup kobalt fisto çizgisinin **üstünden** keserdi → bu temada
   en alt kobalt pikseline göre kesim (sıçrama ≤ 24 px, eksik sütun ≤ %3 sert denetim). Ön cep: `cep_kes("v")` sivri V buldu, parça
   trapez → `trapez_cep_kes` (astarın en alt renkli pikseli, alt zarf doğruları).
5. Açık zarf kapalıdan ~%1 geniş, ~%3 uzun → ölçülen ölçek + öteleme (`manifest.stage.align_fix`); kit_check hiza sol −0,20 ·
   sağ +0,49 · alt +0,85 % (±%1 içinde).
6. `tema_build.yesil_gorunur` canlı limon yapraklarını "görünür #00FF00" sayıyor → tema içi `kroma_yesil` (parlak kroma yeşili her
   WebP'de 0); tema_build sayıları manifest'te açık yazılı. **Sapma**, gerekçe README'de.
7. frame_portrait'in altında başlık boşluğu yok (W1.3'te başlık çerçevenin içinde) → başlık panonun altında, duvarda.
- **Önerilen prompt düzeltmeleri (gpt-gorsel, G205 revizyonu ya da sonraki 05 turu):** frame_landscape penceresi tam 3:2;
  pencere kenarında #00FF00/pembe saçak ve yarı saydam leke bırakmamak; W1.2 gezinme ortasındaki ve W1.4 dress code üstündeki küçük
  çini çiçeği için ayrı `tile_flower` parçası; W1.3 köşelerindeki limon + çiçek demeti için `accent_bouquet`; açık ve kapalı zarf
  aynı tuval ölçüsünde (açık gövde ~%3 uzun geliyor).

**Comp sapmaları** (README haritası): geri sayım kutuları yerine sade Didone rakam (kutular CSS çerçeve olurdu, K21); gezinme ve
dress code'daki çini çiçeği yok (parça yok); details satır arası dalın iki yanındaki çizgiler yok; story başlığı panonun altında ve
telefonda tek sütun basamaklı; telefon zemini bg_page'in çiçeksiz kırpımlarından (2:3 tuval telefonda kümeleri keserdi); home'da
comp'u olmayan bölümler (davet kartı, takvim, iki çini pano, kapanış) bu tasarımın parçalarıyla.

**Kontroller (bu worktree, 2026-10-14)**
- `kit_check --paket 5` 23/23, `--paket 2` 5/5 (hiza sol −0,20 · sağ +0,49 · alt +0,85 %).
- `build_images.py`: pencere şeffaflığı: bütün çerçeve/kart WebP'lerinin penceresinde 0 görünür piksel, parlak kroma yeşili 0, kapak kesimi sıçrama 23 px
  (≤ 24), cep kenarının > 3 px altında 1 astar noktası, yer tutucular en koyu ≥ 175 / sarı-yeşil ≤ 24.
- `npm test` 329/329 (temanın 30 testi dahil), `npm run typecheck` temiz, `npm run build` + trace-check geçti (birleştirme öncesi).
- `theme-check --theme mediterranean-lemon --stress`: **114 geçti, 0 hata, 0 uyarı** (360/390/430/768/1280; 360×640, 375×553,
  844×390, 667×375; tasarım aralığı + §12 zorlama kaydı; yer tutucu, değişen içerik, taslak, yanıt akışı; MP4). Bir önceki koşuda
  story köşe limonları 360–430 px'te kenardan 2–3 px taşıyordu → panolar 1,5vw içeri alındı, yeniden koşuldu.
- `tests/g051-browser.ts --theme mediterranean-lemon` 44/44; `tests/final-smoke.ts --theme mediterranean-lemon` 42/42
  (`previews/g405/final/`).
- İlk görünüm (390×844, DPR 3): index 937 KB · home 1007 KB (yer tutucu; ≤ 1,5 MB); örnek fotoğraflarla index 1031 KB · home 1263 KB.
  `opening_390x844.mp4` ilk karesi beyaz değil (ortalama 218, 217, 205).
- Kontrast (kendi ölçümüm; metnin arkasındaki oluşmuş piksellerin medyanı ve en kötü %10'u, 390 / 844×390 / 1280): görünen her metin
  ≥ 4,5:1 (büyük el yazısı ≥ 3:1); beyaz yazı / kobalt hap 5,5–7,9:1.
- Aksanlı isimler: "Zoë Łucja Ağır & Matías Søren Çelik" Allura + Playfair Display latin-ext alt kümeleriyle çiziliyor (elle
  denendi; theme-check kayıtlarında aksanlı ad yok).

- **origin/main ile birleştirme sonrası (G060 panel v2, G061 pazarlama dahil):** `npm ci`, `npm test` 378/378 (G404 de
  birleşince 408/408), `npm run typecheck` temiz, `npm run build` + trace-check (5 tema; bu tema dahil) geçti; `g051-browser` 44/44, `final-smoke` 44/44 (`previews/g405/final/`
  yeni panel ekranlarıyla yenilendi). `theme-check --stress --no-video` (çıktı geçici klasöre): 107 geçti, **1 hata "content
  change"** — G064 Sonuç'ta belgelenen ortak sorun: kontrol yayınlanmış demo sitenin isim ve tarihini değiştirip yeniden yayınlıyor,
  G060'ın kimlik koruması `publishSite`'ta `IdentityMismatchError` ile reddediyor (temadan bağımsız; `scripts/theme-check.cjs`
  yazma alanımda değil). Birleştirme öncesi aynı akış geçiyordu (114/0).

**qa-kontrol:** ayrı `qa-kontrol` alt ajanı çalıştırılmadı (bu oturumda alt ajan başlatma aracı yoktu). `compare_*_390.jpg`'leri
kendim W1 ile karşılaştırdım (yerleşim, tipografi, süs konumları tutuyor; sapmalar yukarıda). Bitti şartındaki "qa-kontrol
incelemesinden geçti" maddesi bu yüzden **açık**; inceleme aşamasında yapılmalı.

**Denenmedi:** gerçek iPhone/Safari ve Android Chrome (`svh`, `mask`, `:has`, belgeler arası view transition), Vercel yayını,
gerçek alıcı fotoğrafları (farklı oran/ışık), yavaş ağ.

**Önerilen yeni görevler**
- claude-kod (theme-check, G052 hattı): "home first screen" akışı ilk ekranın altındaki sahneleri açmadan (revealAll yok) kart
  piksel testini yapıyor; opaklıkla giren kartta kartın değil zeminin pikselleri ölçülüyor → sahte "card text over painted decor".
  Bu tema kartları hep opak girerek atlattı; düzeltme: pageChecks'ten önce revealAll ya da `.in` beklemek.
- claude-kod: stres/aralık kayıtlarına aksanlı isim (latin-ext) eklemek; §15'teki "aksanlı isim fontu" maddesi şimdilik elle
  kontrol ediliyor (bu temada "Zoë Łucja Ağır & Matías Søren Çelik" Allura + Playfair latin-ext ile çiziliyor).
- gpt-gorsel: yukarıdaki prompt düzeltmeleri.

## Günlük
- 2026-10-13 blokaj: K22 (kullanıcı, 2026-10-13): videodan çıkıldı, ürün yalnız mobil öncelikli website. Yeni website standardı pilotla (G035) belirlenince yeniden tanımlanacak
- 2026-10-13 yeniden tanımlandı (K22–K24, G033)
- 2026-10-14 alindi: wf-tema05
- 2026-10-14 bitti, incelemeye gönderildi
