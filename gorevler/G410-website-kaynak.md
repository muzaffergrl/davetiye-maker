---
id: G410
baslik: Tasarım 10 Tuscan Vineyard — platform teması
rol: claude-kod
durum: inceleme
alan: claude-local-G410
oncelik: 3
bagimli: [G210, G038, G046, G052]
yazar: [platform/themes/tuscan-vineyard/, platform/tests/theme-tuscan-vineyard.test.ts, platform/previews/g410/]
---

## Amaç
Tasarım 10'i platformda tema olarak kurmak (K24, `docs/10_SITE_PLATFORMU.md`): kapalı zarf açılış sayfası → home → story, details, rsvp; yalnız bu tasarımın GPT parçalarıyla (K21), kişisel metin HTML'de. **Kurallar `docs/11_TEMA_STANDARDI.md`'dedir; bu görev metniyle çelişirse docs/11 geçerlidir.**

## Girdiler
- Tema standardı: `docs/11_TEMA_STANDARDI.md` — bütünü; zarf tipi **kapaklı zarf** → §7.1 + §7.3; bitti tanımı §13, kontrol listesi §15
- Platform sözleşmesi: `platform/README.md` (işaretler, RSVP form sözleşmesi, `#site-data`); çalışan örnek `platform/themes/blush-garden-rose/` — **yalnız** işaret/RSVP/`#site-data`/oturum anahtarı kullanımı için; yerleşimi, aralıkları, süs konumları ve zamanlaması bu temaya taşınmaz (docs/11 §8). G035 kaynağı (`collections/03_Blush_Garden_Rose/website/`) örnek değildir
- GPT çıktıları (G210): `collections/10_Tuscan_Vineyard/assets/gpt/comps/` (W1, yerleşim referansı, satılmaz; yalnız sade adlar — `_vN` denemedir), `parts/` (katmanlar), `photos/` (örnek fotoğraflar)
- İçerik `collections/10_Tuscan_Vineyard/content.demo.json`, renk `collections/10_Tuscan_Vineyard/palette.json`, özet `collections/10_Tuscan_Vineyard/DESIGN_BRIEF.md`
- Araçlar: `tools/parts_prep.py` (geçici klasöre; docs/11 §5.3), `python3 tools/kit_check.py collections/10_Tuscan_Vineyard --paket 5`, `node scripts/theme-check.cjs --theme <slug>` (G052)

- **G210 açık kusurları:** iki çerçevenin yeşil penceresinde koyu/yarı saydam lekeler → pencere kodla tam maske (parts_prep `leke_doldur`); yatay pencere ≈ 1,59:1 → mekân fotoğrafı `object-fit: cover`; kapak/sicim hizası UYARI (alt -1,82%, sicim uçları -2/-3%) → manifest.stage.align. `oak_tile` tasarıma özel opak zemin.

## Yapılacaklar
1. `theme.json`, 5 sayfa, `site.css`, `site.js`, `build_images.py`, `README.md` docs/11 §1–§4 düzeninde. 03'ten yalnız platform sözleşmesi alınır (motor işaretleri, RSVP formu, `#site-data`, slug'lı oturum anahtarları, `data-scene`/`data-step`/`data-a` kancaları); yerleşim, tipografi ve hiyerarşi bu tasarımın W1 comp'larından — tema `README.md`'sinde sayfa başına **comp öğe haritası** (her W1 öğesi → şablon öğesi ya da gerekçeli sapma; comp'u olmayan bölümler bu tasarımın parçaları ve tipografisiyle, docs/11 §8).
2. Parçalar: `python3 platform/themes/tuscan-vineyard/build_images.py` → `parts_prep` **geçici klasöre** (`--prep-dir`; tema klasörüne, `img_src/`'ye ya da `assets/`'e asla — docs/11 §1, §5.3–§5.4), tip kesimleri (§7), maskeler, `free_zone`, yer tutucular, og; WebP + srcset genişlikleri (§5.1, §5.5). Yalnız bu tasarımın GPT parçaları; yeni şekil/dekor çizme (K21).
3. Zarf açılışı (`MOTION.envelope`, kapaklı zarf, docs/11 §7.1 + §7.3): On tap, the twine unwinds upward off the flap tip with its cork and olive leaves, the kraft flap opens to reveal the wine-colored grape liner, and the card rises as a vine tendril curls in from the corner. Katalog: Kraft zarf, sicim ve kurutulmuş zeytin yaprağıyla bağlı; sicim çözülür, kapak açılır. Açılış cümlesindeki sıra, sayı ve yön bağlayıcıdır; kapanış elemanı, zarf/kapak ve kart ayrı katmanlar; kart home'daki karta dönüşür; `closure.png` zarfla aynı tuvalde çizilir, `envelope_closed` üstüne 1:1 oturur.
4. Sayfa koreografisi (`MOTION.scenes`): her sayfada öğeler sırayla girer. Story: Eski şarap etiketi biçimli (adsız) kartlar, ahşap masaya dizilir (three wine-label shaped frames lined up side by side on a rustic oak table, not overlapping, a few grapes and a silvery olive leaf resting beside them); telefonda foto penceresi ≥ 38vw (sığmazsa basamaklı/alt alta düzen, comp sapması olarak yazılır — docs/11 §9). Parçacıklar `MOTION.accents` (§8: tür başına dosya ve yol). Details/rsvp: kart, satırlar ve buton sırayla.
5. Foto alanları: `hero_portrait` (card_small penceresi), `story_1..3` (frame_portrait), `venue` (frame_landscape); kutu ve maske `windows.json`'dan (§5.6, §9). PAKET 2 fotoğrafı yoksa yer tutucu.
6. Tasarıma özel ek parçalar (comp'taki ilgili öğe bunlardan kurulur, kodla çizilmez — K21): `oak_tile.png` — Story masası dokusu (meşe, dikişsiz).
7. Fontlar: Italianno + Marcellus (Google Fonts link'i; repoya font dosyası girmez). Tarih motor biçimiyle (`May 15, 2027`). Link blokları `data-if="urls.*"` ile linksiz kalkar — "link will be added soon" diyen ölü düğme yok (§4).
8. Testler ve önizleme (§13): `platform/tests/theme-tuscan-vineyard.test.ts`; `theme-check --theme tuscan-vineyard` (5 genişlik, kısa telefonlar, akışlar, ağırlık, MP4); `platform/previews/g410/` (W1 comp | tema karşılaştırmaları dahil).

## Bitti sayılması için
- [ ] docs/11 §15 kontrol listesi tamam (atlanan madde Sonuç'ta gerekçesiyle)
- [ ] `npm test`, `npm run typecheck`, `npm run build` (trace-check) geçti; `tests/theme-tuscan-vineyard.test.ts` (§13.2)
- [ ] `theme-check --theme tuscan-vineyard` hatasız; `previews/g410/` + `compare_<sayfa>_390.jpg` qa-kontrol incelemesinden geçti
- [ ] Sonuç dürüst: açılış ve story tarifi, comp sapmaları, denenmeyenler (gerçek iPhone/Safari, yayın), sorunlu GPT parçaları

## Sonuç
**Yapıldı (claude-local-G410, 2026-10-15).** `platform/themes/tuscan-vineyard/` (theme.json 5 sayfa + 5 foto alanı + 75 copy
anahtarı, content.demo.json = koleksiyon kaydı birebir, 5 şablon, site.css 43,9 KB, site.js 35,6 KB, thank-you.css,
build_images.py, README.md, img/ 48 WebP + 3 maske + og + favicon + manifest; klasör 2,7 MB), `platform/tests/theme-tuscan-vineyard.test.ts`
(29 test: §13.2'nin 24 maddesi + zarf/kart/story/bütçe/G068/G075 eşdeğerleri — g068/g075 ortak testleri temayı artık
`tests/design-themes.ts` ile kendiliğinden de sayıyor), `platform/previews/g410/` (theme-check çıktıları, `compare_*_390.jpg`,
`compare_closure.jpg`, `story_1280_static.png`).

- **Açılış:** dokununca jüt sicim mantarı ve iki zeytin yaprağıyla kapağın ucundan yukarı çözülür (alt tel düğüme toplanır,
  teller zarfın kenarından arkaya kayar; ilk hareket 0 ms), kraft kapak 0→90° açılır, şarap rengi üzüm astarlı iç yüz −90→0°
  devralır, kart cepten yükselirken sağ üst köşeden bir asma dalı (accent_2 × 1, tasarıma özel `curl` yolu) kıvrılarak gelir,
  kart öne çıkıp home kartına uçar (VT). `go` 3,95 s; theme-check ölçümü dokun → home 4405 ms.
- **Story:** isimsiz şarap etiketi çerçeveleri meşe masaya (`oak_tile`) tek tek bırakılır (`place`), caption'lar yazılır,
  yanlarına üzüm salkımı, gümüşi zeytin yaprağı ve asma yaprağı konar; telefonda basamaklı sütun (pencere 52,6vw ≥ 38vw),
  ≥ 720 px yan yana.
- **Kesimler (tasarıma özel, build_images.py):** kapak kenarı `kapak_kes`'in bulduğu bordür sapı yerine gerçek kenardan
  (kanat boyunca medyan düşüş skoru 94,7 / 101,5); ön cep iki çapraz + düz alt kanat (renk sınıflayıcı kraft ↔ şarap astar);
  açık zarf ölçülen dönüşümle kapalıya oturtuldu (× 0,9989 / 1,0077, öteleme 1,1 / 17,6 px → `manifest.stage.align`);
  sarılı kapanışın taşan sicim uçları zarf alfasıyla kırpıldı (4 552 px). Çerçeve pencere lekeleri `parts_prep leke_doldur`
  ile şeffaf (her WebP'de denetlendi). Telefon zemini `bg_page`'in kümesiz gökyüzü+tepeler kırpımı + ayrı köşe kümeleri;
  yatayda aynı kırpımın yumuşak hâli.
- **Comp sapmaları (README haritasında):** geri sayım kutuları → sade rakam (K21); Marcellus'ta italik yok → dik
  (`font-synthesis: none`); story caption'ları etiketin altında masada (GPT çerçevesinde pencere altında kâğıt yok);
  telefonda üç etiket basamaklı; story başlığı ile masa arası tepe yok; masa örtüsü / zeytin taneleri / hap içi süsler yok
  (parça yok); "Tap to open" altındaki minik süs yok; kısa telefonda (≤ 600 px yükseklik) kart isimlerin yanında.
  Monogram yok (mantar diski "no branding", W1.1'de harf yok → panelde Monogram alanı bu temada çıkmaz).

**Testler (Windows 10, Node 22.23, Python 3.13):**
- `kit_check --paket 5` 24/24 (hiza UYARI: alt −1,82 %, sicim uçları −2,02 / −3,12 % → tema düzeltti), `--paket 2` 5/5.
- `node --test tests/theme-tuscan-vineyard.test.ts` 29/29. **`npm test` 906 test: 893 geçti, 0 hata, 13 atlandı** (rebase
  sonrası; symlink shim'iyle), `npm run typecheck` geçti, `npm run build` + trace-check geçti (14 tema).
- `copy-manifest.ts --check` temiz (75 anahtar, işaretsiz metin yok).
- `theme-check --theme tuscan-vineyard --stress --no-video` (kurulu Chrome 155 + geçici `playwright-core` shim'i, tarayıcı
  indirilmedi): **111 geçti / 0 uyarı / 0 hata** (5 genişlik, kısa telefonlar 360×640 · 375×553 · 390×690 · 390×844, akışlar,
  zorlama kaydı + teşekkür hâli, G068 `max`'lar, VT, oturum anahtarları, reduced motion, dış istek yalnız Google Fonts).
  İlk görünüm (390×844 DPR 3): index 1237 KB / home 939 KB (yer tutucu), 1331 / 1201 KB (tohumlanmış PAKET 2 fotoğrafları).
  `tests/g051-browser.ts --theme tuscan-vineyard`: 44/44.
- Ara turlarda düzeltildi: home satır girişleri kenarı aşıyordu, nav 360 px'te (Marcellus geniş harfler; nav `max` 6/7),
  teşekkür kartı başlığı salkımın üstüne biniyordu, 375×553'te hero nav'ın altına iniyordu, font geç gelince ölçüm yenilenmiyordu.
- **qa-kontrol (§13.4 kapısı): GEÇTİ** — ret sebebi yok; küçük notlardan RSVP kartındaki sicim kâğıt kenarına çekildi, README'ye
  home bölüm sırası ve "Tap to open" süsü gerekçesi eklendi; hero kartında yer satırının virgülde kırılması (`fitCopy`) açık kaldı.

**Test edilmedi / sınırlar:**
- Açılış MP4'ü (`opening_390x844.mp4`): makinede ffmpeg yok, `--no-video` koşuldu. Gerçek iPhone/Safari ve Android Chrome,
  Vercel'de yayın, gerçek alıcı fotoğrafları (farklı oran/ışık), yavaş ağ denenmedi.
- theme-check'in "content change" adımı Windows'ta `C:\` yolunu ESM'e verdiği için koşmuyordu; yerel bir yükleme kancasıyla
  (scratchpad, repo değişmedi) koşturuldu ve geçti — script'in Windows uyumu ayrı iş. "Taslak önizlemede RSVP" adımı yük altında
  iki turda zaman aşımına uğradı; aynı tekrar senaryosunda onaylı 01 teması da aynı davrandı (9,8 s / panel yok) → ortam kaynaklı;
  son turda geçti.
- Story ≥ 720 px yalnız statik önizlemede (`story_1280_static.png`, DEV_CONTENT) görüldü; theme-check story'yi geniş ekranda çekmiyor.

**Sorunlu GPT parçaları / önerilen prompt düzeltmeleri (`tools/katalog.py` `WEB[10]`):**
- `frame_portrait`: pencere görselin %92,7'sine iniyor, caption için kâğıt payı yok → "leave a plain paper band below the window
  (about 18 % of the frame height) for a caption".
- `envelope_open`: gövde kapalıdan ~23 px yukarıda (alt −1,82 %); `closure`: sicim uçları zarf hattını 30–48 px aşıyor — prompt
  zaten istiyor, GPT tutmadı; tema ölçülen düzeltmeyle çözdü.
- `frame_landscape` penceresi ≈ 1,59:1 (prompt 3:2) ve iki çerçevede pencere lekesi (parts_prep doldurdu).
- W1.2'deki geri sayım kutuları, W1.3'teki masa örtüsü için parça yok → istenirse `countdown_tile`, `linen_cloth` (katalog + G2NN).

**Önerilen görevler:** (1) claude-kod: `scripts/theme-check.cjs` `editAndPublish` ve `tests/*-browser.ts` satır içi ESM
importlarını `pathToFileURL` ile Windows uyumlu yapmak. (2) gpt-gorsel (isteğe bağlı): yukarıdaki `frame_portrait` caption payı.

## Günlük
- 2026-10-13 blokaj: K22 (kullanıcı, 2026-10-13): videodan çıkıldı, ürün yalnız mobil öncelikli website. Yeni website standardı pilotla (G035) belirlenince yeniden tanımlanacak
- 2026-10-13 yeniden tanımlandı (K22–K24, G033)
- 2026-10-15 alindi: claude-local-G410
- 2026-10-15 bitti, incelemeye gönderildi
