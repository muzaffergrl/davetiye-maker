---
id: G408
baslik: Tasarım 08 Winter Evergreen — platform teması
rol: claude-kod
durum: inceleme
alan: claude-G408
oncelik: 3
bagimli: [G208, G038, G046, G052]
yazar: [platform/themes/winter-evergreen/, platform/tests/theme-winter-evergreen.test.ts, platform/previews/g408/]
---

## Amaç
Tasarım 08'i platformda tema olarak kurmak (K24, `docs/10_SITE_PLATFORMU.md`): kapalı zarf açılış sayfası → home → story, details, rsvp; yalnız bu tasarımın GPT parçalarıyla (K21), kişisel metin HTML'de. **Kurallar `docs/11_TEMA_STANDARDI.md`'dedir; bu görev metniyle çelişirse docs/11 geçerlidir.**

## Girdiler
- Tema standardı: `docs/11_TEMA_STANDARDI.md` — bütünü; zarf tipi **kapaklı zarf** → §7.1 + §7.3; bitti tanımı §13, kontrol listesi §15
- Platform sözleşmesi: `platform/README.md` (işaretler, RSVP form sözleşmesi, `#site-data`); çalışan örnek `platform/themes/blush-garden-rose/` — **yalnız** işaret/RSVP/`#site-data`/oturum anahtarı kullanımı için; yerleşimi, aralıkları, süs konumları ve zamanlaması bu temaya taşınmaz (docs/11 §8). G035 kaynağı (`collections/03_Blush_Garden_Rose/website/`) örnek değildir
- GPT çıktıları (G208): `collections/08_Winter_Evergreen/assets/gpt/comps/` (W1, yerleşim referansı, satılmaz; yalnız sade adlar — `_vN` denemedir), `parts/` (katmanlar), `photos/` (örnek fotoğraflar)
- İçerik `collections/08_Winter_Evergreen/content.demo.json`, renk `collections/08_Winter_Evergreen/palette.json`, özet `collections/08_Winter_Evergreen/DESIGN_BRIEF.md`
- Araçlar: `tools/parts_prep.py` (geçici klasöre; docs/11 §5.3), `python3 tools/kit_check.py collections/08_Winter_Evergreen --paket 5`, `node scripts/theme-check.cjs --theme <slug>` (G052)

- **G208 açık kusuru:** yatay çerçeve penceresinde koyu leke → pencere kodla tam maske (parts_prep `leke_doldur`). `frost_overlay` ek parça (buz camı efekti; isteğe bağlı).

## Yapılacaklar
1. `theme.json`, 5 sayfa, `site.css`, `site.js`, `build_images.py`, `README.md` docs/11 §1–§4 düzeninde. 03'ten yalnız platform sözleşmesi alınır (motor işaretleri, RSVP formu, `#site-data`, slug'lı oturum anahtarları, `data-scene`/`data-step`/`data-a` kancaları); yerleşim, tipografi ve hiyerarşi bu tasarımın W1 comp'larından — tema `README.md`'sinde sayfa başına **comp öğe haritası** (her W1 öğesi → şablon öğesi ya da gerekçeli sapma; comp'u olmayan bölümler bu tasarımın parçaları ve tipografisiyle, docs/11 §8).
2. Parçalar: `python3 platform/themes/winter-evergreen/build_images.py` → `parts_prep` **geçici klasöre** (`--prep-dir`; tema klasörüne, `img_src/`'ye ya da `assets/`'e asla — docs/11 §1, §5.3–§5.4), tip kesimleri (§7), maskeler, `free_zone`, yer tutucular, og; WebP + srcset genişlikleri (§5.1, §5.5). Yalnız bu tasarımın GPT parçaları; yeni şekil/dekor çizme (K21).
3. Zarf açılışı (`MOTION.envelope`, kapaklı zarf, docs/11 §7.1 + §7.3): On tap, soft snow begins to fall, the pine-and-berry bundle loosens and slides away, the green flap opens upward, and the snowy white card rises as snowflakes drift across the screen. Katalog: Orman yeşili zarf, çam dalı ve kırmızı kurdeleyle mühürlü; kar yağarken açılır. Açılış cümlesindeki sıra, sayı ve yön bağlayıcıdır; kapanış elemanı, zarf/kapak ve kart ayrı katmanlar; kart home'daki karta dönüşür; `closure.png` kare tuvalde büyük çizilir; yeri kesim geometrisine bağlanır (`manifest.closure`, docs/11 §7.1).
4. Sayfa koreografisi (`MOTION.scenes`): her sayfada öğeler sırayla girer. Story: Buğulu pencere camı çerçeveleri, buğu silinerek görünür (three frosted wooden window frames in a row like the windows of a snowy mountain lodge, frost still clinging to their corners as if just wiped clear, a little snow on each sill); telefonda foto penceresi ≥ 38vw (sığmazsa basamaklı/alt alta düzen, comp sapması olarak yazılır — docs/11 §9). Parçacıklar `MOTION.accents` (§8: tür başına dosya ve yol). Details/rsvp: kart, satırlar ve buton sırayla.
5. Foto alanları: `hero_portrait` (card_small penceresi), `story_1..3` (frame_portrait), `venue` (frame_landscape); kutu ve maske `windows.json`'dan (§5.6, §9). PAKET 2 fotoğrafı yoksa yer tutucu.
6. Tasarıma özel ek parçalar (comp'taki ilgili öğe bunlardan kurulur, kodla çizilmez — K21): `frost_overlay.png` — Buğu katmanı (story fotoğraflarının üstü, silinerek açılır).
7. Fontlar: Parisienne + Libre Baskerville (Google Fonts link'i; repoya font dosyası girmez). Tarih motor biçimiyle (`May 15, 2027`). Link blokları `data-if="urls.*"` ile linksiz kalkar — "link will be added soon" diyen ölü düğme yok (§4).
8. Testler ve önizleme (§13): `platform/tests/theme-winter-evergreen.test.ts`; `theme-check --theme winter-evergreen` (5 genişlik, kısa telefonlar, akışlar, ağırlık, MP4); `platform/previews/g408/` (W1 comp | tema karşılaştırmaları dahil).

## Bitti sayılması için
- [x] docs/11 §15 kontrol listesi tamam (atlanan madde Sonuç'ta gerekçesiyle)
- [x] `npm test`, `npm run typecheck`, `npm run build` (trace-check) geçti; `tests/theme-winter-evergreen.test.ts` (§13.2)
- [ ] `theme-check --theme winter-evergreen` hatasız; `previews/g408/` + `compare_<sayfa>_390.jpg` qa-kontrol incelemesinden geçti
- [x] Sonuç dürüst: açılış ve story tarifi, comp sapmaları, denenmeyenler (gerçek iPhone/Safari, yayın), sorunlu GPT parçaları

## Sonuç
2026-10-15 · claude-G408 · dal `worktree-agent-a489a0b0127280e51` (main'e push edilmedi; entegratör birleştirir).

**Ne yapıldı.** `platform/themes/winter-evergreen/`: `theme.json` (5 sayfa, 5 foto anahtarı, aspect = manifest `box_px`, 71
standart `copy` anahtarı; `copy-manifest --check` temiz), `index/home/story/details/rsvp.html`, `site.css` (45 583 B),
`site.js` (35 741 B), `thank-you.css`, `build_images.py` (`tools/tema_build.py` + geçici `parts_prep`; `frame_landscape` lekesi
`leke_doldur` ile kapandı, 17 972 px), `img/` (WebP + srcset, `manifest.json`, og 1200×630, favicon; klasör 2,35 MB),
`content.demo.json` (koleksiyon kaydı, bayt bayt), `README.md` (dosyalar, foto alanları, görsel hattı, açılış/koreografi, sayfa
başına **comp öğe haritası** + sapmalar, teşekkür hâli, G068/G069, sınırlar, ölçümler). `platform/tests/theme-winter-evergreen.test.ts`
(38 test: §13.2 maddeleri + G068 copy + G075 teşekkür + tarayıcı ilk ekran testleri). `platform/previews/g408/`.

**Açılış (tek cümle).** Dokununca zarfın arkasında kar yağmaya başlar, çam-kozalak-kırmızı kurdele demeti sallanıp gevşer ve
zarfın önünden aşağı kayıp ekrandan çıkar, yeşil kapak yukarı açılır (90° el değiştirmeyle astarlı iç kapak dikilir), karlı beyaz
kart cepten yükselirken 4 büyük kar tanesi ön cebin önünden yatay süzülür, kart öne gelir ve view transition ile home kartına uçar
(dokun → home 4,56 s, ölçülen 4855 ms; Skip her an; azaltılmış harekette 231 ms).
**Story (tek cümle).** Her ahşap pencere görünüme girince yükselip yerine oturur, 760 ms sonra camındaki GPT buğu katmanı
ortadan dışa silinir (köşelerde kırağı kalır), sonra başlığı yazılır; telefonda pencereler alt alta (foto penceresi 42,9vw ≥ 38vw),
≥ 720 px'te comp'taki üçlü sıra.

**Comp'tan bilinçli sapmalar** (gerekçeleri README'de): (1) home geri sayımı buzlu kutular yerine sade serif rakam — kutular CSS
çerçeve olurdu (K21, §5.7); (2) RSVP hapının üstündeki kar çizilmedi (GPT parçası yok); (3) story telefonda yan yana değil alt
alta (yan yana ~22vw < 38vw, §9); (4) iki pencere arasındaki dal parçaları ikisi de accent_3; (5) RSVP kartında info_card'ın
üstündeki küçük çam dalı da görünür (W1.5'te yok; tek GPT parçası iki sayfada); (6) kart kopyasında kasaba `venue.city` (05 gibi).

**Komutlar** (PORT 3480): `npm run build` exit 0 (trace-check 7 tema, winter-evergreen dahil) · `npm run typecheck` exit 0 ·
`npm test` 620/620 · `theme-check --theme winter-evergreen --stress` **128 geçti, 0 hata, 0 uyarı** · `g051-browser --theme
winter-evergreen` **44/44** · `final-smoke --theme winter-evergreen` **45/45** (konsol/sayfa hatası yok) · `kit_check --paket 5`
24/24 (hiza sol +0,00, sağ +0,00, alt +0,13 %), `--paket 2` 5/5. İlk görünüm 390×844 DPR 3: index 1003 KB, home 962 KB (yer
tutucu); örnek fotoğrafla 1074 / 1350 KB. MP4 `previews/g408/opening_390x844.mp4` (2884 KB) kare kare incelendi: açılış sırası
cümleyle aynı.

**Kendi QA turum.** 360/375×553/390/430/768/1280 + yatay 844×390 ve 667×375 ekran görüntüleri ve W1 karşılaştırmaları
(`compare_<sayfa>_390.jpg`, `compare_closure.jpg`, `cuts_envelope.jpg`, `stage_closed/open.jpg`); 228 ilk ekranlık tarama
(4 sayfa × 19 boy × demo/aralık/zorlama): nav çizgisinin kestiği parça 0; kontrast en düşük "Click to open" 5,68:1 (gerekli 4,5);
teşekkür hâli (index/home/details/rsvp) ve zorlama kaydı 360/390; aksanlı isimler (Zoë, Józef, Łucja Dvořák, Ştefan Øster) —
Parisienne latin-ext yükleniyor, glifler doğru. Turda düzeltilenler: kart kopyası sığdırma (`fitCopy` 6 basamak), davet kartı
serbest bölgesi (metin çelengin altına inmiyor), açılış karı zarfın arkasına alındı (sis üstünde görünmüyordu), süzülen kar kartın
foto penceresinden ön cebin önüne alındı.

**Denenmedi:** gerçek iPhone/Safari ve Android Chrome (`svh`, `mask`, `:has`, `@property`, belge view transition); `@property`
desteklemeyen tarayıcıda buğu animasyonsuz açılır (kodda yedek var, gerçek tarayıcıda görülmedi); temanın Vercel'de yayını;
gerçek alıcı fotoğrafları (farklı oran/ışık); yavaş ağ. **qa-kontrol incelemesi yapılmadı** (bitti şartındaki
`compare_*` onayı ayrı kapı; durum `inceleme`).

**Sorunlu GPT parçaları ve önerilen prompt düzeltmeleri** (`tools/katalog.py` `WEB[08]`):
- `frame_landscape`: penceresinde koyu leke (kodla kapandı) ve pencere 1,90:1 (3:2 değil) → 3:2 fotoğraf üstten/alttan kırpılır.
  Prompt'a "clean, evenly transparent/flat window opening, exactly 3:2, no stains" eklenmeli.
- Zarf ön cebi V değil düz/düzensiz kenarlı; `tema_build` cep kesimi astar kamalarını cebe kattı → `build_images.py`'de özel
  `cep_alttan` taraması. Prompt'a "front pocket with one clean straight top edge, separate from the liner" eklenebilir.
- `info_card` üstünde W1.4'e ait küçük çam dalı var; RSVP kartında (W1.5) olmamalıydı → ayrı `rsvp_card` parçası ya da dalsız
  `info_card` önerilir.
- RSVP/home hapının üstündeki kar için GPT parçası yok (`pill_snow` ek parça önerisi; şimdilik çizilmedi).

**Entegratöre notlar (ortak dosyalar; değiştirilmedi):** yeni tema kendi testinde G068/G075/G069 denetimlerini taşıyor, ama ortak
listeler 5 tema sayıyor; eklenmesi önerilir:
- `platform/tests/g068-copy.test.ts:51` `THEMES`'e `'winter-evergreen'`, `:57` civarı `COLLECTION`'a `'winter-evergreen':
  '08_Winter_Evergreen'`, `:65` civarı `DESIGN_KEYS`'e `'winter-evergreen': []`.
- `platform/tests/g068-browser.ts:71` tema dizisine `'winter-evergreen'`.
- `platform/tests/g069-browser.ts:93-94` sonrasına `{ id: 'winter-evergreen', dir: '08_Winter_Evergreen', tag: '08' }`;
  `platform/tests/g069-rsvp.test.ts:418` dizisine `'winter-evergreen'`.
- `platform/tests/g075-browser.ts:38` `ALL_THEMES`'e ve `:47-48` foto haritasına
  `'winter-evergreen': path.join(REPO, 'collections/08_Winter_Evergreen/assets/gpt/photos/story_2.jpg')`;
  `platform/tests/g075-thank-you.test.ts:49` `THEMES` + `:54-55` koleksiyon haritası.
- Satış sitesine alma (G080/G082 tipi onay + `marketing-assets --designs winter-evergreen`) bu görevin işi değil.

**Önerilen görevler:** gpt-gorsel — `frame_landscape` 3:2 temiz pencere, dalsız RSVP kartı, hap karı (yukarıdaki maddeler);
claude-qa — G408 `compare_*` ve MP4 incelemesi; claude-kod — ortak test listelerine winter-evergreen (yukarıdaki satırlar).

## Günlük
- 2026-10-13 blokaj: K22 (kullanıcı, 2026-10-13): videodan çıkıldı, ürün yalnız mobil öncelikli website. Yeni website standardı pilotla (G035) belirlenince yeniden tanımlanacak
- 2026-10-13 yeniden tanımlandı (K22–K24, G033)
- 2026-10-15 alindi: claude-G408
- 2026-10-15 bitti, incelemeye gönderildi
