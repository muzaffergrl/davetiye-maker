---
id: G407
baslik: Tasarım 07 Burgundy Velvet Autumn — platform teması
rol: claude-kod
durum: bitti
alan: claude-G407
oncelik: 3
bagimli: [G207, G038, G046, G052]
yazar: [platform/themes/burgundy-velvet-autumn/, platform/tests/theme-burgundy-velvet-autumn.test.ts, platform/previews/g407/]
---

## Amaç
Tasarım 07'i platformda tema olarak kurmak (K24, `docs/10_SITE_PLATFORMU.md`): kapalı zarf açılış sayfası → home → story, details, rsvp; yalnız bu tasarımın GPT parçalarıyla (K21), kişisel metin HTML'de. **Kurallar `docs/11_TEMA_STANDARDI.md`'dedir; bu görev metniyle çelişirse docs/11 geçerlidir.**

## Girdiler
- Tema standardı: `docs/11_TEMA_STANDARDI.md` — bütünü; zarf tipi **kapaklı zarf** → §7.1 + §7.3; bitti tanımı §13, kontrol listesi §15
- Platform sözleşmesi: `platform/README.md` (işaretler, RSVP form sözleşmesi, `#site-data`); çalışan örnek `platform/themes/blush-garden-rose/` — **yalnız** işaret/RSVP/`#site-data`/oturum anahtarı kullanımı için; yerleşimi, aralıkları, süs konumları ve zamanlaması bu temaya taşınmaz (docs/11 §8). G035 kaynağı (`collections/03_Blush_Garden_Rose/website/`) örnek değildir
- GPT çıktıları (G207): `collections/07_Burgundy_Velvet/assets/gpt/comps/` (W1, yerleşim referansı, satılmaz; yalnız sade adlar — `_vN` denemedir), `parts/` (katmanlar), `photos/` (örnek fotoğraflar)
- İçerik `collections/07_Burgundy_Velvet/content.demo.json`, renk `collections/07_Burgundy_Velvet/palette.json`, özet `collections/07_Burgundy_Velvet/DESIGN_BRIEF.md`
- Araçlar: `tools/parts_prep.py` (geçici klasöre; docs/11 §5.3), `python3 tools/kit_check.py collections/07_Burgundy_Velvet --paket 5`, `node scripts/theme-check.cjs --theme <slug>` (G052)

- **G207 notu:** `velvet_swag` ek parça (story sayfasındaki kadife kordon); kapanış (kurdele) zarfı saran tip — kit_check notuna bak.

## Yapılacaklar
1. `theme.json`, 5 sayfa, `site.css`, `site.js`, `build_images.py`, `README.md` docs/11 §1–§4 düzeninde. 03'ten yalnız platform sözleşmesi alınır (motor işaretleri, RSVP formu, `#site-data`, slug'lı oturum anahtarları, `data-scene`/`data-step`/`data-a` kancaları); yerleşim, tipografi ve hiyerarşi bu tasarımın W1 comp'larından — tema `README.md`'sinde sayfa başına **comp öğe haritası** (her W1 öğesi → şablon öğesi ya da gerekçeli sapma; comp'u olmayan bölümler bu tasarımın parçaları ve tipografisiyle, docs/11 §8).
2. Parçalar: `python3 platform/themes/burgundy-velvet-autumn/build_images.py` → `parts_prep` **geçici klasöre** (`--prep-dir`; tema klasörüne, `img_src/`'ye ya da `assets/`'e asla — docs/11 §1, §5.3–§5.4), tip kesimleri (§7), maskeler, `free_zone`, yer tutucular, og; WebP + srcset genişlikleri (§5.1, §5.5). Yalnız bu tasarımın GPT parçaları; yeni şekil/dekor çizme (K21).
3. Zarf açılışı (`MOTION.envelope`, kapaklı zarf, docs/11 §7.1 + §7.3): On tap, the velvet bow unties and the ribbon slides off the envelope's sides, the rectangular flap lifts, and the card rises in warm candlelight while a single copper leaf drifts down. Katalog: Bordo kadife kurdeleyle bağlı krem zarf; kurdele çözülüp kayar, kapak açılır. Açılış cümlesindeki sıra, sayı ve yön bağlayıcıdır; kapanış elemanı, zarf/kapak ve kart ayrı katmanlar; kart home'daki karta dönüşür; `closure.png` zarfla aynı tuvalde çizilir, `envelope_closed` üstüne 1:1 oturur.
4. Sayfa koreografisi (`MOTION.scenes`): her sayfada öğeler sırayla girer. Story: Varak altın oval çerçeveler tek bir kadife kurdele girlandına bağlı, sallanır (three oval gold-leaf frames tied at different points along one long burgundy velvet ribbon swag that drapes in a gentle curve across a warm candlelit wall like a garland, each frame swaying slightly); telefonda foto penceresi ≥ 38vw (sığmazsa basamaklı/alt alta düzen, comp sapması olarak yazılır — docs/11 §9). Parçacıklar `MOTION.accents` (§8: tür başına dosya ve yol). Details/rsvp: kart, satırlar ve buton sırayla.
5. Foto alanları: `hero_portrait` (card_small penceresi), `story_1..3` (frame_portrait), `venue` (frame_landscape); kutu ve maske `windows.json`'dan (§5.6, §9). PAKET 2 fotoğrafı yoksa yer tutucu.
6. Tasarıma özel ek parçalar (comp'taki ilgili öğe bunlardan kurulur, kodla çizilmez — K21): `velvet_swag.png` — Story kurdele girlandı.
7. Fontlar: Pinyon Script + Cinzel (Google Fonts link'i; repoya font dosyası girmez). Tarih motor biçimiyle (`May 15, 2027`). Link blokları `data-if="urls.*"` ile linksiz kalkar — "link will be added soon" diyen ölü düğme yok (§4).
8. Testler ve önizleme (§13): `platform/tests/theme-burgundy-velvet-autumn.test.ts`; `theme-check --theme burgundy-velvet-autumn` (5 genişlik, kısa telefonlar, akışlar, ağırlık, MP4); `platform/previews/g407/` (W1 comp | tema karşılaştırmaları dahil).

## Bitti sayılması için
- [ ] docs/11 §15 kontrol listesi tamam (atlanan madde Sonuç'ta gerekçesiyle)
- [x] `npm test`, `npm run typecheck`, `npm run build` (trace-check) geçti; `tests/theme-burgundy-velvet-autumn.test.ts` (§13.2)
- [ ] `theme-check --theme burgundy-velvet-autumn` hatasız; `previews/g407/` + `compare_<sayfa>_390.jpg` qa-kontrol incelemesinden geçti
- [x] Sonuç dürüst: açılış ve story tarifi, comp sapmaları, denenmeyenler (gerçek iPhone/Safari, yayın), sorunlu GPT parçaları

## Sonuç
**2026-10-15 · claude-G407** — worktree dalı `worktree-agent-a4d10543e6448776e` (main'e / origin'e push yok; entegratör birleştirir).

**Yapılan (dosyalar):** `platform/themes/burgundy-velvet-autumn/` — `theme.json` (5 sayfa, 5 foto alanı = manifest `box_px`, 71
`copy` anahtarı), `index/home/story/details/rsvp.html`, `site.css` (45 801 B / 46 080), `site.js` (35 535 B / 35 840),
`thank-you.css`, `build_images.py` (tema_build + bu tasarımın kesimleri; deterministik: yeniden koşunca bütün görseller bayt bayt
aynı), `README.md` (görsel hattı, açılış, ilk ekranlar, **sayfa sayfa comp öğe haritası + sapmalar**, teşekkür/G068/G069, sınırlar),
`content.demo.json` (koleksiyon kaydıyla birebir), `img/` (tema klasörü 2,63 MB ≤ 3 MB). `platform/tests/theme-burgundy-velvet-autumn.test.ts`
(39 test: §13.2'nin 24 maddesi + zarf/kurdele kesimi ve hizası, açılış cümlesi, story girlandı, iç sayfa duvarı, 3 dilim kartlar,
fold birimleri, tılsım süsü, bütçeler, G075/G068/G069 bu temada, global Playwright ile ilk ekran ölçümleri — yoksa atlanır).
`platform/previews/g407/` (theme-check çıktıları, `compare_<sayfa>_390.jpg` ×5, `compare_closure.jpg`, `cuts_envelope.jpg`,
`closure_pieces.jpg`, `bow_from_closure.jpg`, `opening_390x844.mp4`, `final/`, kendi QA sayfalarım `qa_*.jpg`, `checks.json`).

**Açılış:** dokununca (ilk hareket 40 ms) kadife fiyonk çözülür — kurdele düğümden üç parçaya kesilmiştir (`cl_l`, `cl_c`, `cl_r`):
iki yarı hafifçe ayrılıp zarfın sol ve sağ kenarından kayarak çıkar, dikey bant düğüm ve altın meşe tılsımıyla alttan kayar
(1,15 s, yalnız kenarı geçerken söner); ardından dikdörtgen kapak menteşesinde kalkar (0,98 s), açık zarfın astarlı kapağı dikilir,
kart arkasında yanan sıcak mum ışığında (`.glow`, kenarsız ışık) cepten yükselirken tek bir bakır akçaağaç yaprağı kartın yanından
süzülür; kart öne gelir ve view transition ile home kartına uçar (MOTION go 4,38 s; theme-check ölçümü dokun → home 4 637 ms; Skip
her an; azaltılmış harekette doğrudan home).
**Story:** ≥ 720 px'te tek GPT kadife kurdele (`velvet_swag`) ve ona ölçülen üç noktada (%26/%50/%74, bağ üstü kurdelenin kalınlığına
oturur) bağlı üç oval altın çerçeve, ortadaki en alçakta; her çerçeve bağı üzerinde düşer (`hang`) ve süresiz hafifçe sallanır
(±1,2°). Telefonda çerçeveler alt alta, her birinin üstünde kendi kurdele parçası; foto penceresi 60 × 0,648 = 38,9vw.

**Comp'tan bilinçli sapmalar (gerekçeleri README'de):** geri sayımın bilet kutuları yerine düz Cinzel rakamlar (kutu GPT parçası
yok, K21); nav / ipucu / sayaç / dress code fleur'ü yerine closure'dan kırpılan altın meşe tılsımı; hapta altın kenar çizgisi yok;
telefonda story çerçeveleri alt alta (≥ 38vw kuralı) ve story'nin telefon ilk ekranı başlık sayfası (bir çerçeve birimi 390 px'te
~505 px; başlıkla sığmıyor); details telefonda program satırları üst üste (≥ 520 px kartta comp'un tek satırı); details'te kart ile
mekân çerçevesi arasındaki kadife bağ yok (arada takvim düğmeleri); story ortadaki çerçevenin böğürtlen süsü yok (frame_portrait'te
yok); üçüncü aile Cormorant Garamond (görevde Pinyon + Cinzel vardı; comp'un italik mekân/yer satırları ve gövde için — Cinzel'in
küçük harfi yok; ≤ 3 aile, latin-ext); home'daki davet kartı, teaser çerçeveleri, takvim, form ve kapanış comp'ta yok (tasarımın
parçalarıyla kuruldu).

**Komutlar (sayılar son koşudan):**
- `npm test` 621/621 · `npm run typecheck` exit 0 · `npm run build` + trace-check: exit 0 (16 rota, 7 tema; yeni temanın
  şablonları izleniyor) · tema testi 39/39.
- `theme-check --theme burgundy-velvet-autumn --stress` (PORT 3470): **128 geçti / 0 hata / 0 uyarı**. İlk görünüm (390×844, DPR 3):
  index 905 KB, home 1 018 KB (yer tutucu); örnek fotoğraflarla index 1 020 KB, home 1 293 KB (≤ 1,5 MB). MP4 `opening_390x844.mp4`
  (2,7 MB). Koşular: 1. 58/159/44 → 2. 123/6/0 → 3. 128/0/0 → 4. (son CSS) 128/0/0; düzeltilenler aşağıda (QA).
- `g051-browser --theme burgundy-velvet-autumn`: 44/44 · `final-smoke --theme burgundy-velvet-autumn`: 45/45 (`previews/g407/final/`).
- `kit_check --paket 5`: 24/24 geçti (+ hiza uyarısı "kapanış üst uç −%2,60" — build ölçüp düzeltiyor, aşağıda) · `--paket 2`: 5/5.
- `copy-manifest --theme burgundy-velvet-autumn --check`: 71 anahtar temiz.
- Kontrast (WCAG, düz duvar/kâğıt üstünde): mürekkep 8,5–14,3, bakır 4,7–8,0, şarap 5,7–9,7; hap yazısı 6,5–9,2.

**Kendi QA turum:** 360×640, 390×844, 430×932, 844×390 (+ 667×375, 1280×800) beş sayfanın ilk ekranları, 390 tam sayfalar, teşekkür
hâli (index/home/rsvp), zorlama kaydı ekranları (`stress_*`), açılış MP4 kareleri (`qa_opening_frames_6fps.jpg`) comp'larla
karşılaştırıldı. Bulup düzelttiklerim: kartın "We're getting married" satırı çerçevenin alt süsüne biniyordu (card_small free_zone
%73–97'ye alındı); mum ışığı ve sayfa sonu dalya kümesi ekran kenarını kırpılmadan aşıyordu (tam genişlik `overflow-x: clip`);
önizleme çubuğunda hero köşe kümesi düz çizgiyle kesiliyordu (`overflow: clip visible`); zorlama metinlerinde nav 360 px'e sığmıyordu
(nav `max` 04/05 değerlerine: 6/6/7/5, The Day 10; ≤ 400 px dar harf aralığı); zorlama kaydında home teaser'ının döndürülmüş uzun
program satırları ekran kenarını aşıyordu (`hang` yalnız çerçevede, metin `rise`); masaüstünde zarf sayfası isimleri iki satıra
kırılıyordu (medya sorgusu sırası); story başlığının Pinyon "y" kuyruğu alt başlığa değiyordu (aralık; masaüstünde
`svh`'ye bağlı — ilk sabit 18 px'lik aralık 1366×657'de girlandı ilk ekranın altına itti, tema testinin tarayıcı ölçümü yakaladı); "Tap to open" zemini tılsımla
birlikte ölçülüyordu (ipucu metni kendi `<p>`'sinde) ve bu duvar 03'ün yıkamasından koyu olduğu için `theme_check.backdrop.dark_below`
130'a ölçümle ayarlandı (düz duvarın %0,1'i, dalya kümelerinin %92'si < 130); Cinzel tek değişken yüz (`wght@400..500`; 44
"font yüklenmedi" uyarısı yanlış alarmdı). Kalan, kabul ettiğim: RSVP 360×640'ta imza katlanır, kartın altında ~130 px boş kâğıt;
430×932 RSVP'de form panelinin üst kenarı nav'ın hemen üstünde ince görünür; zorlama kaydında (10 satır) details kartının içinde
katlanan satırın önünde boşluk kalır (fold kuralı).
**qa-kontrol incelemesi yapılmadı:** alt-ajan başlatma aracım yok → docs/11 §13.4 kapısı için entegratör `compare_*_390.jpg` +
README comp haritasını qa-kontrol'e incelettirmeli.

**Denenmedi:** gerçek iPhone/Safari ve Android Chrome (yalnız Playwright Chromium), temanın Vercel'de yayını (bu görevin işi değil),
gerçek alıcı fotoğrafları (farklı oran/ışık; yalnız PAKET 2 örnekleri), yavaş ağ, view transition'sız tarayıcıda (Firefox) solma.

**Sorunlu GPT parçaları ve öneriler:**
- `closure.png`: dikey bant comp'tan ~%22 geniş (zarf genişliğinin 0,1107'si, W1.1'de 0,0904), yatay bant uçları zarf kenarına 3–7 px
  varmıyor, dikey bant üstten 41 / alttan 14 px taşıyor → build yatay ölçek (× 1,0133) + kenarda kırpma ile düzeltiyor (sonrası
  −1…−2 px), parça kullanılabilir. Önerilen prompt düzeltmesi (`tools/katalog.py` WEB[07] closure): "both ribbon bands end exactly at
  the envelope's edges and wrap behind them; the vertical band is about 9 % of the envelope's width".
- `envelope_open.png`: açık gövde kapalıdan ~%7 uzun → ölçülen ölçek + öteleme (sonrası 0 px). Prompt'a "same size and position as
  envelope_closed" vurgusu önerilir.
- Comp'taki geri sayım kutuları, küçük altın fleur ve details'teki kart–çerçeve kadife şeridi ayrı GPT parçası değil. İstenirse önerilen
  gpt-gorsel görevi: "07 ek parçalar — countdown_tile (krem bilet kutusu, ince altın kenar), fleur (küçük altın süs), ribbon_tab (kartı
  çerçeveye bağlayan kısa kadife şerit + fiyonk)"; gelirse tema bunlarla güncellenir.

**Entegratöre not (ortak dosyalar — dokunmadım, hiçbiri kırılmadı):**
- Tema listeleri 01–05'te: 07'yi eklemek önerilir — `platform/tests/g068-copy.test.ts:51` `THEMES` + `:53` `COLLECTION`
  (`'burgundy-velvet-autumn': '07_Burgundy_Velvet'`) + `:61` `DESIGN_KEYS` (`[]`); `platform/tests/g075-thank-you.test.ts:49` `THEMES`
  + `:50` `COLLECTION`; `platform/tests/g069-rsvp.test.ts:418` dizi; `platform/tests/g068-browser.ts:71`; `platform/tests/g069-browser.ts:93`
  (`{ id: 'burgundy-velvet-autumn', dir: '07_Burgundy_Velvet', tag: '07' }`); `platform/tests/g075-browser.ts:38` `ALL_THEMES` + `:47`
  (`collections/07_Burgundy_Velvet/assets/gpt/photos/story_2.jpg`). Bu temanın kendi testi aynı G068/G069/G075 denetimlerini yapıyor.
- `platform/README.md:1120` tasarım onay listesi ve `lib/marketing/*` yalnız onaydan sonra (G08x).
- `PROJECT_STATE.json` / `COLLECTION_STATUS.md` güncellemesi entegratörde; `gorevler/PANO.md` commit'lenmedi.

## Günlük
- 2026-10-13 blokaj: K22 (kullanıcı, 2026-10-13): videodan çıkıldı, ürün yalnız mobil öncelikli website. Yeni website standardı pilotla (G035) belirlenince yeniden tanımlanacak
- 2026-10-13 yeniden tanımlandı (K22–K24, G033)
- 2026-10-15 alindi: claude-G407
- 2026-10-15 bitti, incelemeye gönderildi
- 2026-10-15 entegratör onayladı
- 2026-10-15 entegratör: W1 karşılaştırmaları (index/home/story/rsvp 390) görsel olarak incelendi — tasarıma sadık; theme-check 128/0/0, final-smoke 45/45. Onaylandı → satış sitesine G093.
