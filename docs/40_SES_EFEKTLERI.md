# 40 — Ses efektleri (G967–G969)

**Durum (2026-10-23):** 50 efekt üretildi, 49 temanın her biri kendi açılış ses listesini aldı, oynatıcı (`audio.js`)
iyileştirildi. Dosyalar ve testler `claude/adoring-gates-audio` dalında. **Henüz kimse kulakla dinlemedi** (ajanın ses
çıkışı yok); onay sahibin dinlemesine bağlı. Yeni oynatıcı gerçek telefonda (iOS Safari, Android Chrome) **denenmedi**.

Karar 8 (2026-10-23, sahip): "Ses efektleri çok daha fazla, her şablona uygun, daha kaliteli hissettirmeli; şu ankiler
çok amatör." Eski durum: 10 efekt; 49 temanın 29'u aynı kalıbı (kapanış · `paper` · `slide` · `chime`) çalıyordu, 12'si
başka bir temayla birebir aynı listeyi (22–32'nin eski ortak açılışı);
dosyalar tepe değerine göre ayarlandığı için ses yükseklikleri −16 ile −32 LUFS arasında dağınıktı (mühür ve klips
neredeyse duyulmuyor, kurdele bağırıyordu); mono, kuru (oda yok), düz filtrelenmiş gürültü.

## 1. Kaynak ve lisans

- CC0 / kamu malı kayıt kaynakları yine **erişilemedi** (2026-10-23: kenney.nl, opengameart.org, freesound.org,
  upload.wikimedia.org, archive.org, pixabay.com — bağlantı yok). npm'deki ses paketleri MIT (atıf ister) ya da kaynağı
  belirsiz → kullanılmadı (AGENTS.md şart 9).
- Bu yüzden bütün efektler **fiziğe dayalı foley sentezi**: `tools/audio_fx.py` (yalnız numpy). Dış kayıt, örnek, kütüphane
  yok; BKE Studio'nun kendi eseri, atıfsız. Kayıt: `platform/public/audio/LICENSES.md` (her dosya: tür, süre, boyut, kaynak,
  lisans, tarih).
- İleride erişilebilir bir CC0 kaynak olursa: yalnız CC0 / kamu malı, kaynak URL + lisans + indirme tarihiyle
  `LICENSES.md`'ye yazılarak, aynı ses yüksekliği standardına (aşağıda) getirilip eklenir.

## 2. Nasıl üretiliyor (kısa)

Her efekt, nesnenin ses çıkarma biçiminden kurulur (ayrıntı: `tools/audio_fx.py` başındaki not ve her `fx_*` işlevinin
açıklaması):

- **Kâğıt** (`paper*`, `fold*`, `slide*`, `page`, `book`, `tear`, `vellum`, `peel`, `flutter`): hareket hızını izleyen bant
  gürültüsü (hız artınca hem yükselir hem parlaklaşır), lif pürüzü, kâğıt büküldükçe çıkan mikro çıtırtılar (Poisson
  süreci, her biri 0,1–0,6 ms patlama + 1–2 sönümlü rezonans, Pareto dağılımlı şiddet), kapağın ittiği hava, yatarken
  yumuşak düşüş; kapak açılırken önce yapışkandan kurtulma çıtırtısı.
- **Kumaş / ip / deri** (`ribbon`, `bow`, `twine`, `cord`, `velvet`, `lace`, `curtain`, `strap`): sürtünme yatağı, dokuma
  ya da lif pürüzü, yapış-kay (stick-slip) darbe dizisinin rezonatör bankasından geçmesiyle gıcırtı (düğüm, deri, menteşe).
- **Mum, metal, ahşap, seramik** (`seal*`, `clasp`, `buckle`, `key`, `lock`, `brooch`, `porcelain`, `tile`, `lid`, `twig`):
  kısa uyarım → cismin uyumsuz modları (hafif vuru ile), kırılmada yoğun mikro-çatlak kümesi + kırıntılar, kutu kapağında
  menteşe gıcırtısı + keçe durağı, anahtarda cırcır tıkları + ahşap gövde.
- **Çan / cam / müzik** (`chime*`, `harp`, `sparkle`, `shimmer`, `stars`, `comb`): uyumsuz kısmi sesli vurmalı modeller
  (çelesta, vibrafon, cam), arp için tel modeli (koparma noktası, yüksek kısmi sesler önce söner), müzik kutusu tarağı
  (sabit-serbest çubuk oranları 1 : 6,27 : 17,55) + ahşap kutu rengi.
- **Hava / su / ateş / ışık** (`whoosh`, `wave`, `water`, `wings`, `petals`, `flash`, `lantern`, `film`, `brush`, `pen`):
  zamanla değişen spektral zarf (STFT), türbülans, Minnaert kabarcıkları, kanat çırpışları, film dişlisi tıkları, flaşın
  şarj ıslığı.
- Hepsine: stereo genişlik, sentetik **küçük oda** yankısı (frekansa bağlı sönüm; çanlarda biraz daha uzun), DC temizliği,
  32 Hz altı kesim, 2–5 kHz'te hafif yumuşatma (−1,5 dB, 3,3 kHz), tıksız giriş (1,5 ms) / çıkış, sessiz kuyruk kırpma.

## 3. Standart (her dosya)

| Ölçüt | Değer |
|---|---|
| Biçim | MP3 stereo 44,1 kHz, 112 kb/s (joint stereo) |
| Ses yüksekliği | ITU-R BS.1770 bütünleşik **−20 LUFS** (ana hareketler), −21…−24 (ince katmanlar: ışık, pırıltı, uç, tık) |
| Gerçek tepe | ≤ −1,5 dBTP üretimde; MP3 sonrası ölçüm en yüksek −1,9 dBTP |
| Boyut | dosya başı ≤ 56 KB (test); bugün 5–50 KB, toplam 963 KB |
| Belirlenimcilik | tohum = efekt adının CRC32'si; aynı ffmpeg ile bayt bayt aynı dosya |

Oynatıcıda efektler `FX_GAIN 0.5` ile çalar (≈ −26…−30 LUFS); Our Story müziği −17…−18 LUFS × 0,55 (≈ −23 LUFS):
efektler müziğin altında kalır.

## 4. Efektler (50)

Eski 10 ad (`seal`, `ribbon`, `clasp`, `paper`, `slide`, `page`, `tear`, `whoosh`, `chime`, `tap`) korunur; içerikleri
yenilendi.

| Ad | Ne | Süre | Boyut |
|---|---|---|---|
| `paper` | Zarf kapağı kalkar — orta gramaj kâğıt | 1,0 s | 14 KB |
| `paper-soft` | Zarf kapağı — kalın pamuklu / el yapımı kâğıt (yumuşak, alçak) | 1,1 s | 15 KB |
| `paper-crisp` | Zarf kapağı — sert karton / kraft (parlak çıtırtı) | 0,9 s | 13 KB |
| `fold` | Washi / ince kâğıt kanadı açılır | 0,7 s | 11 KB |
| `fold-2` | Aynı kanadın biraz daha alçak çeşidi (arka arkaya kanatlar için) | 0,8 s | 11 KB |
| `slide` | Kart cebinden kayarak çıkar (≈ 1,3 s) | 1,4 s | 20 KB |
| `slide-quick` | Kart / bilet hızlı kayar (≈ 0,8 s) | 0,9 s | 14 KB |
| `page` | Sayfa çevrilir (sağdan sola, yere iner) | 1,0 s | 15 KB |
| `book` | Masal kitabının kapağı açılır (sırt gıcırtısı, tok iniş) | 1,3 s | 19 KB |
| `tear` | Delikli şerit yırtılır (soldan sağa) | 1,0 s | 15 KB |
| `vellum` | Buzlu aydınger kılıf kayar | 1,4 s | 20 KB |
| `peel` | Etiket soyulur | 1,0 s | 15 KB |
| `flutter` | Kesme kâğıt bayraklar sırayla havalanır | 1,1 s | 17 KB |
| `tap` | Sayfa geçişinde yumuşak kâğıt tıkı | 0,3 s | 5 KB |
| `ribbon` | İpek kurdele kayıp çıkar, ucu savrulur | 1,1 s | 15 KB |
| `bow` | İpek fiyonk ilmek ilmek çözülür | 1,6 s | 23 KB |
| `twine` | Jüt sicim çözülür (lif takılmaları) | 1,0 s | 15 KB |
| `cord` | İpek kordon düğmeden kayar, düşer | 1,3 s | 18 KB |
| `velvet` | Kadife / yün / keten — boğuk fırçalama | 1,2 s | 17 KB |
| `lace` | Dantel duvak gibi kalkar | 1,4 s | 20 KB |
| `curtain` | Ağır kadife sahne perdesi açılır | 1,7 s | 24 KB |
| `strap` | Deri kayış tokadan çekilir (deri gıcırtısı) | 1,6 s | 23 KB |
| `seal` | Mum mühür kırılır (çatlak, kırıntı, gövde) | 0,5 s | 7 KB |
| `seal-lift` | Mum mühür bütün olarak kalkar | 0,5 s | 8 KB |
| `clasp` | Pirinç klips açılır | 0,5 s | 7 KB |
| `buckle` | Kemer tokası açılır | 0,7 s | 11 KB |
| `key` | Müzik kutusu anahtarı iki tur kurulur | 1,9 s | 27 KB |
| `lock` | Döner kilit / konço döner, yerine oturur | 0,6 s | 9 KB |
| `brooch` | Broş / inci klips iğnesinden çıkar | 1,0 s | 15 KB |
| `porcelain` | Porselen düğme döner, kalkar (ince çınlama) | 1,4 s | 19 KB |
| `tile` | Sırlı çini döner, yerine vurur | 0,9 s | 14 KB |
| `lid` | Lake kutu kapağı menteşesinde açılır | 1,8 s | 26 KB |
| `twig` | Kuru dal / çam demeti gevşer, hışırdar | 0,9 s | 14 KB |
| `chime` | Kart öne gelir: çelesta arpeji (La majör) | 3,0 s | 42 KB |
| `chime-warm` | Kart öne gelir: daha sıcak, alçak çan arpeji (Mi majör) | 3,5 s | 49 KB |
| `harp` | Kart öne gelir: kısa arp glissandosu | 3,2 s | 44 KB |
| `sparkle` | Pırıltı: elmas / hilal / inci ışığı yakalar | 1,0 s | 14 KB |
| `shimmer` | Işık süpürmesi (soldan sağa camsı parıltı) | 1,6 s | 23 KB |
| `stars` | Yıldızlar / ateşböcekleri / ışıklar tek tek yanar | 2,1 s | 30 KB |
| `comb` | Müzik kutusu tarağı: kısa ezgi | 3,4 s | 47 KB |
| `whoosh` | Yumuşak hava geçişi (soldan sağa) | 1,2 s | 18 KB |
| `wave` | Suluboya dalga ekranı geçer, köpük | 1,9 s | 27 KB |
| `water` | Su: hafif çalkantı, kabarcıklar | 1,1 s | 16 KB |
| `wings` | Üç güvercin havalanır | 1,6 s | 23 KB |
| `petals` | Çiçek kümesi patlar / yapraklar dökülür | 1,3 s | 18 KB |
| `flash` | Eski flaş: deklanşör, ampul patlaması, şarj ıslığı | 0,9 s | 13 KB |
| `lantern` | Fener / kandil yanar, alev titrer | 1,7 s | 25 KB |
| `film` | Negatif şeridi ekrandan akar (dişli tıkları) | 1,7 s | 24 KB |
| `brush` | Dört geniş fırça darbesi (ıslak suluboya) | 1,4 s | 20 KB |
| `pen` | Baş harfler mürekkeple yazılır (uç cızırtısı) | 0,7 s | 11 KB |

Tekrarlanan anlar için çeşitlemeler: kapak `paper` / `paper-soft` / `paper-crisp`; kat `fold` / `fold-2`; kart `slide` /
`slide-quick`; çan `chime` / `chime-warm` / `harp` / `stars`; mühür `seal` (kırılır) / `seal-lift` (bütün kalkar). Aynı
dosya iki kez çalıyorsa (perdeler, flaşlar, çiniler) stereo konumu ayrıdır.

## 5. Tema eşlemesi (49 tema)

Her ipucu `[ms, efekt]` ya da `[ms, efekt, pan]`; ms = temanın `site.js` `MOTION.envelope` adımının başlangıcı (test
eder). Kaynak: `platform/lib/audio/catalog.ts` `DESIGN_SOUND` (yorum satırı hangi adım olduğunu söyler). Müzik = çiftin
seçmediği durumda Our Story'deki varsayılan parça.

| No | Tasarım | Tema | Müzik | Açılış sesleri (ms · efekt) | Not |
|---|---|---|---|---|---|
| 01 | Olive & Ivory | `olive-ivory` | first-light | 0 `seal-lift` · 260 `paper-soft` · 1620 `slide` · 3000 `chime` | 1. dalga |
| 02 | Dusty Blue & Champagne | `dusty-blue-champagne` | first-light | 0 `seal` · 520 `paper` · 1680 `slide` · 3100 `chime-warm` | 1. dalga |
| 03 | Blush Garden Rose | `blush-garden-rose` | first-light | 200 `bow` (sağ 0,30) · 880 `paper-soft` · 1430 `petals` · 1800 `slide` · 3140 `harp` | 1. dalga |
| 04 | Vintage Airmail | `vintage-airmail-love-letter` | music-box | 0 `seal` · 360 `tear` · 1180 `slide` · 2560 `chime` | 1. dalga |
| 05 | Mediterranean Lemon | `mediterranean-lemon` | garden-waltz | 0 `twine` · 680 `paper-crisp` · 1800 `slide` · 3220 `chime` | 1. dalga |
| 06 | Art Deco Black Tie | `art-deco-black-tie` | evening-strings | 0 `clasp` · 700 `paper-crisp` · 1900 `slide` · 1950 `shimmer` · 3250 `chime-warm` | 1. dalga |
| 07 | Burgundy Velvet Autumn | `burgundy-velvet-autumn` | evening-strings | 40 `bow` · 980 `paper-soft` · 2060 `slide` · 3480 `chime-warm` | 1. dalga |
| 08 | Winter Evergreen | `winter-evergreen` | evening-strings | 0 `shimmer` · 120 `twig` · 1240 `paper` · 2320 `slide` · 3740 `chime` | 1. dalga |
| 09 | Lavender Provence | `lavender-provence` | first-light | 80 `twine` · 300 `twig` · 760 `velvet` · 1300 `slide` · 2700 `harp` | 1. dalga |
| 10 | Tuscan Vineyard | `tuscan-vineyard` | garden-waltz | 0 `twine` · 760 `paper-soft` · 2040 `slide` · 3300 `chime-warm` | 1. dalga |
| 11 | Boho Pampas | `boho-pampas-terracotta` | garden-waltz | 0 `twig` · 500 `paper-soft` · 1680 `slide` · 3540 `harp` | 1. dalga |
| 12 | Tropical Destination | `tropical-destination` | garden-waltz | 0 `clasp` · 760 `paper-crisp` · 1840 `slide` · 3300 `chime` | 1. dalga |
| 13 | Enchanted Forest Storybook | `enchanted-forest-storybook` | music-box | 90 `clasp` · 880 `book` · 2260 `page` · 3240 `slide-quick` · 3240 `stars` | 1. dalga |
| 14 | Ivory Lace & Pearls | `ivory-lace-pearls` | first-light | 80 `brooch` · 650 `lace` · 2300 `slide` · 2350 `sparkle` · 3500 `harp` | 1. dalga |
| 15 | Cherry Blossom Spring | `cherry-blossom-spring` | music-box | 90 `twig` · 1150 `paper` · 2230 `slide` · 2230 `petals` · 3680 `chime` | 1. dalga |
| 16 | Sunflower Rustic Barn | `sunflower-rustic-barn` | garden-waltz | 0 `bow` · 380 `ribbon` (sağ 0,35) · 1160 `paper-crisp` · 2140 `slide` · 3440 `chime-warm` | 1. dalga |
| 17 | Emerald & Gold Estate | `emerald-gold-estate` | first-light | 40 `sparkle` · 140 `seal-lift` · 960 `paper` · 1880 `shimmer` · 2380 `slide` · 3740 `chime` | 1. dalga |
| 18 | Wildflower Meadow Vellum | `wildflower-meadow-vellum` | first-light | 80 `peel` · 980 `vellum` · 1760 `slide-quick` · 3020 `harp` | 1. dalga |
| 19 | Midnight Garden | `midnight-garden` | evening-strings | 90 `seal` · 960 `paper-soft` · 1320 `lantern` · 2380 `slide` · 3860 `stars` | 1. dalga |
| 20 | Coastal Seaside | `coastal-seaside` | garden-waltz | 60 `wave` · 1150 `paper` · 2240 `slide` · 3660 `chime` | 1. dalga |
| 21 | Crimson Rose Atelier | `crimson-rose-atelier` | **rose-nocturne** (kendi) | **kendi paketi** `fx/crimson-rose-atelier/`: 0 `crack` · 480 `flap` · 1150 `draw` · 2250 `reveal` · 3150 `bloom`; sayfa ipuçları: home `petal`, story `page`, rsvp `fold` + `stamp` | K59 yeniden tasarım (§5a) |
| 22 | Nocturne Lake Estate | `nocturne-lake-estate` | evening-strings | 0 `sparkle` · 800 `vellum` · 1500 `paper` · 2000 `shimmer` · 2500 `slide-quick` · 3250 `stars` | yeniden tasarım (G422–G432) |
| 23 | Velvet Jewel Box | `velvet-jewel-box` | music-box | 0 `sparkle` · 180 `brooch` · 700 `ribbon` · 1250 `velvet` · 1850 `slide-quick` · 2500 `chime` | yeniden tasarım (G422–G432) |
| 24 | Grand Theatre Premiere | `grand-theatre-premiere` | evening-strings | 0 `slide-quick` · 650 `tear` · 1100 `cord` · 1600 `curtain` (sol 0,45) · 1740 `curtain` (sağ 0,45) · 2900 `slide-quick` · 3600 `chime-warm` | yeniden tasarım (G422–G432) |
| 25 | Orient Express Voyage | `orient-express-voyage` | evening-strings | 0 `strap` · 450 `lock` · 1000 `paper-crisp` (sağ 0,30) · 1750 `slide` (sağ 0,30) · 2300 `whoosh` · 3050 `chime-warm` | yeniden tasarım (G422–G432) |
| 26 | Kintsugi & Washi | `kintsugi-washi` | first-light | 0 `porcelain` · 200 `cord` (sağ 0,30) · 950 `fold` · 1170 `fold-2` (sağ 0,35) · 1390 `fold` · 1610 `fold-2` (sol 0,35) · 2250 `slide-quick` · 2950 `chime` | yeniden tasarım (G422–G432) |
| 27 | Riad Lantern Nights | `riad-lantern-nights` | evening-strings | 0 `lantern` · 600 `cord` · 1450 `paper-soft` · 2250 `slide-quick` · 2600 `stars` · 3150 `chime-warm` | yeniden tasarım (G422–G432) |
| 28 | Maison Pâtisserie | `maison-patisserie` | garden-waltz | 0 `petals` · 700 `bow` · 1200 `ribbon` (sağ 0,40) · 1950 `paper-crisp` · 2500 `slide-quick` · 3200 `harp` | yeniden tasarım (G422–G432) |
| 29 | Celestial Observatory | `celestial-observatory` | evening-strings | 0 `lock` · 500 `sparkle` · 1150 `whoosh` · 1650 `paper` · 2150 `stars` · 2300 `slide-quick` · 3000 `chime` | yeniden tasarım (G422–G432) |
| 30 | Azulejo Mosaic | `azulejo-mosaic` | garden-waltz | 0 `twine` · 900 `tile` · 1750 `paper-crisp` · 2050 `tile` (sağ 0,30) · 2400 `slide-quick` · 3150 `chime` | yeniden tasarım (G422–G432) |
| 31 | Sky Lantern Festival | `sky-lantern-festival` | first-light | 0 `lantern` · 600 `ribbon` · 800 `whoosh` · 1700 `paper-soft` · 2300 `slide-quick` · 3000 `stars` | yeniden tasarım (G422–G432) |
| 32 | Music Box Ballerina | `music-box-ballerina` | music-box | 0 `key` · 1150 `lid` · 1900 `slide-quick` · 2550 `comb` · 3500 `slide` | yeniden tasarım (G422–G432) |
| 33 | Marigold & Mehndi | `marigold-mehndi` | evening-strings | 0 `cord` · 300 `slide` (sağ 0,40) · 1250 `paper-crisp` · 1600 `petals` · 1800 `lantern` · 2500 `slide-quick` · 3150 `chime-warm` | |
| 34 | Red Lacquer & Double Happiness | `red-lacquer-double-happiness` | first-light | 0 `cord` · 900 `paper` · 1500 `slide-quick` · 2150 `fold` · 2550 `fold-2` · 3150 `chime-warm` | |
| 35 | Highland Tartan & Thistle | `highland-tartan-thistle` | evening-strings | 0 `whoosh` · 150 `buckle` · 600 `strap` · 1300 `velvet` · 2500 `slide-quick` · 3150 `chime-warm` | |
| 36 | Victorian Glasshouse | `victorian-glasshouse` | garden-waltz | 0 `clasp` · 300 `twine` · 900 `paper-crisp` · 1700 `slide` · 2600 `velvet` · 3600 `chime` | |
| 37 | Art Nouveau Lily | `art-nouveau-lily` | garden-waltz | 100 `shimmer` · 800 `seal-lift` · 1100 `fold` · 1500 `fold-2` · 2400 `slide-quick` · 3050 `harp` | |
| 38 | Papel Picado Fiesta | `papel-picado-fiesta` | garden-waltz | 250 `fold` · 700 `flutter` · 1500 `paper-crisp` · 1900 `stars` · 2500 `slide-quick` · 3100 `chime` | |
| 39 | Silver Photo Booth | `silver-photo-booth` | evening-strings | 0 `flash` · 180 `slide-quick` (sol 0,30) · 1150 `paper` · 1700 `slide-quick` · 2200 `flash` (sağ 0,20) | |
| 40 | Swan Chantilly Lace | `swan-chantilly-lace` | evening-strings | 0 `seal-lift` · 250 `ribbon` · 700 `lace` · 1500 `paper-soft` · 2100 `slide-quick` · 2750 `harp` | |
| 41 | Painted Lily Pond | `painted-lily-pond` | garden-waltz | 0 `seal-lift` · 500 `paper` · 1100 `brush` · 2000 `slide-quick` · 2200 `water` · 2800 `chime` | |
| 42 | Espresso Pastoral | `espresso-pastoral` | first-light | 0 `twig` · 400 `lace` · 1000 `paper` · 1600 `whoosh` · 2400 `slide-quick` · 3200 `chime-warm` | |
| 43 | Chartreuse Garden Party | `chartreuse-garden-party` | garden-waltz | 0 `twig` · 500 `paper-crisp` · 1000 `petals` · 1500 `slide-quick` · 2300 `chime` | |
| 44 | Blue Toile Pavilion | `blue-toile-pavilion` | garden-waltz | 0 `brooch` · 500 `paper` · 900 `wings` · 1500 `slide-quick` · 2150 `chime` | |
| 45 | Suede Ranch Lace | `suede-ranch-lace` | garden-waltz | 0 `lock` · 400 `strap` · 900 `velvet` · 1300 `shimmer` · 1700 `slide-quick` · 2350 `chime-warm` | |
| 46 | Bordeaux Silk Bow | `bordeaux-silk-bow` | evening-strings | 0 `bow` · 1000 `ribbon` · 1500 `paper-soft` · 2100 `slide-quick` · 2750 `chime-warm` | |
| 47 | Monochrome Darkroom | `monochrome-darkroom` | first-light | 0 `film` · 800 `paper-crisp` · 1700 `slide-quick` · 2300 `water` | |
| 48 | Navy Ivory Crest | `navy-ivory-crest` | evening-strings | 0 `shimmer` · 700 `seal-lift` · 1300 `paper-crisp` · 1700 `slide-quick` · 2500 `chime-warm` · 2900 `pen` | |
| 49 | Ivory Pearl Atelier | `ivory-pearl-atelier` | first-light | 0 `porcelain` · 120 `bow` · 1100 `paper` · 1950 `slide` · 3300 `harp` | |

- **İlk satış dalgası 01–20** (karar 6): bu 20 temanın listeleri birbirinden ayrı; kapanış sesleri tasarımın nesnesine göre
  (mühür kalkar/kırılır, fiyonk, sicim, klips, dal, broş, etiket, dalga …).
- **22–32** (karar 5): ses listeleri `origin/claude/modest-brown-pwe1sm`'deki **yeni** açılışların `MOTION` adımlarına göre
  yazıldı (ör. 24'te bilet → yırtık → kordon → sol perde → sağ perde; 32'de anahtar iki tur → kapak → balerin → tarak).
  Bu dalda henüz eski 22–32 `site.js` durduğu için `g126-audio` hizalama testi bu 11 temayı yalnız eski ortak adım
  dizisini (`0,200,360,880,1280,1430,1800,3140`) görürse atlar ve tanı notu yazar; yeniden tasarım birleşince test bu temalar
  için de katılaşır (ben hizalamayı yeniden tasarım dalının `site.js`'lerine karşı ayrıca denetledim: 49/49 uyumlu). **Birleştiriciye not:** yeniden tasarım dalı da `catalog.ts`'te 22–32 satırlarını
  değiştirdi → çakışmada bu dalın (`claude/adoring-gates-audio`) `catalog.ts`'i alınmalı; o dalın efekt adları
  (`tap`/`whoosh`/`chime` …) burada da var, ama yeni listeler daha zengin.

## 5a. Tasarıma özel ses paketi (K59, 21'den başlayarak)

K59: 21 ve sonrası her tasarım kendi bileşenleri, animasyonu **ve kendi sesleriyle** gelir. Model ortak sistemin içindedir
(tek katalog tipi, tek oynatıcı):

- `catalog.ts` `DESIGN_SOUND[<tema>].pack = '<tema>'` → o tasarımın efektleri `public/audio/fx/<tema>/<ad>.mp3`'ten gelir
  (ortak efektlerin yerine; `tap` ve `chime` dahil). `opening` aynı biçimde (`[ms, ad]` / `[ms, ad, pan]`), adlar paketin
  dosyalarıdır; ms yine `MOTION.envelope` adımlarının başlangıcı (test).
- `cues: { home?, story?, details?, rsvp? }` → temanın kendi anları (sayfa çevrilir, yanıt mühürlenir): `site.js`
  `document.dispatchEvent(new CustomEvent('invite:sfx', {detail: {name}}))`; oynatıcı yalnız listedeki adları çalar, boşta
  önceden çözer. Sayfa ipuçları yalnız paketli tasarımda (test).
- Kendi müziği: `MUSIC_TRACKS[]` satırı `theme: '<tema>'` ile → panel o tasarımda önce onu önerir (`tracksFor`), varsayılan
  `DESIGN_SOUND[<tema>].music`.
- Üretim: `tools/audio_packs.py --pack <tema>` (numpy + scipy + ffmpeg). Ses yüksekliği ortak kütüphaneyle aynı ölçekte
  (efekt −20…−24 LUFS, ≤ −1,5 dBTP; müzik −17,5 LUFS), böylece `FX_GAIN 0.5` / `MUSIC_VOL 0.55` her tasarımda aynı dengeyi
  verir (2026-10-23 birleştirmede paket bu ölçeğe getirildi; önceki tepe normalizasyonunda −15…−28 LUFS dağınıktı).

## 6. Oynatıcı (`platform/public/audio/audio.js`, G969)

- **Ön yükleme:** sayfa boşta iken açılışın bütün efektleri ve `tap` indirilir **ve çözülür** (`OfflineAudioContext`:
  dokunuş gerekmez, tarayıcı uyarısı yok). Dokunuşta çözme beklenmez → telefonda ilk ses gecikmez.
- **Zamanlama:** dokunuşta bütün ipuçları ses saatine (`AudioContext.currentTime`) yerleştirilir; animasyon ana iş
  parçacığını meşgul etse de sesler örnek doğruluğunda çalar (eskiden `setTimeout`).
- **iOS:** ilk dokunuşta bağlam açılır, içinde 1 örneklik sessiz tampon çalınır (eski iOS kilidi); `touchend`'de saat önceden
  uyandırılır. Saat geç uyanırsa ipuçları dokunuşun zaman çizgisinde kalır; adımından 350 ms'den geç kalacak olan atlanır.
- **Pan:** üçüncü sayı varsa `StereoPannerNode` (yoksa ortada).
- **Paket ve sayfa ipuçları (K59):** `fx` taban adresi paketi gösterir; `invite:sfx` olayı listedeki adı ortak `play()` ile
  çalar (aynı kazanç, aynı sessiz/gecikme kuralları); ipucu olan sayfada iOS saati de ilk `touchend`'de uyandırılır.
- **Sessiz / Skip / gizli sekme / Replay:** açılışın kendi kazanç düğümü 25 ms'de söner; Replay baştan başlatır.
- **Azaltılmış hareket:** yalnız ilk ipucu (kapanış sesi).
- **Seviye:** `FX_GAIN 0.5` (eski 0.32; dosyalar artık tutarlı −20 LUFS çevresinde), müzik `MUSIC_VOL 0.55` aynı.
- Sessize alınmış ziyaretçi için ön yükleme yapılmaz.

## 7. Kulaksız kalite denetimi (2026-10-23)

Her efekt için spektrogram + zarf (log frekans, 2/5 kHz kılavuz çizgileri) ve sayılar (ffmpeg `ebur128`, gerçek tepe, DC,
kırpılma, ilk/son örnek, saldırı, −40 dB sönüm, spektral ağırlık merkezi, 2–5 kHz enerji oranı, üçte-bir oktav tepe, L/R
ilintisi) çıkarıldı ve tek tek incelendi. Bulunup düzeltilenler:

- sıfır fazlı süzgecin önceki çınlaması düşüş seslerinin başında geniş bantlı tık yapıyordu → nedensel alçak geçiren;
- çanlar dizinin sonunda kesiliyordu (dikey çizgi) → çanlarda 0,9 s yumuşak söndürme;
- porselen, broş, kilit, yıldız ve vibrafon kısmi sesleri 2–5 kHz'te sivri tepe yapıyordu → temel frekanslar 2 kHz'in altına,
  o banttaki kısmi sesler kısa ve kısık;
- kâğıt sesleri fazla "hışırtı gürültüsü" idi → yatak kısıldı, kıvrım çıtırtıları ve kurtulma anı belirginleştirildi;
- su kabarcıkları 8 kat yükseliyordu → %50.

Sonuç (MP3 üzerinde, ffmpeg `ebur128`): bütünleşik −20,2…−24,3 LUFS (`tap` 0,33 s — 400 ms bloktan kısa, ffmpeg ölçemez;
kendi BS.1770 ölçerimizle −24); gerçek tepe −1,9…−14,2 dBTP; DC < 0,0005; kırpılma 0; ilk ve son örnek 0.
Dinleme dosyaları (repoya girmez, oturumun scratch klasöründe): `demo_reel.mp3` (49 açılış art arda, zaman–tema listesi
`demo_reel.txt`), `fx_catalog.mp3` (50 efekt, `fx_catalog.txt`).

## 8. Yeniden üretim ve değişiklik

```bash
python3 tools/audio_synth.py --only fx                 # 50 efektin hepsi (≈ 15 s)
python3 tools/audio_synth.py --only fx seal chime      # yalnız bunlar
python3 tools/audio_synth.py --list                    # bu belgedeki efekt tablosu (Markdown)
python3 -m pytest tools/tests/test_audio_fx.py -q      # ölçer, belirlenimcilik, seviye, tıksız uçlar
cd platform && node --test tests/g126-audio.test.ts tests/g967-sound-effects.test.ts
```

- **Yeni efekt:** `tools/audio_fx.py`'de `fx_<ad>` + `EFFECTS` kaydı (hedef LUFS, oda, TR/EN açıklama) →
  `catalog.ts` `EFFECT_NAMES` → üret → `LICENSES.md` satırı → bu belge §4 → en az bir temada kullan (test ister).
- **Yeni tema:** `DESIGN_SOUND`'a satır; her ipucu bir `MOTION.envelope` adımının başlangıcı; 3–8 ipucu, ilki ≤ 250 ms;
  başka bir temayla birebir aynı liste olmaz (test).
- Gereken: numpy, ffmpeg (libmp3lame). Müzik yeniden üretilecekse ayrıca scipy (`--only music`).

## 9. Açık işler

- **Sahip dinlemeli** (`demo_reel.mp3` / `fx_catalog.mp3` ya da sitede açılış). Beğenilmeyen efektin parametresi
  `tools/audio_fx.py`'de değişir; bir tema için başka efekt seçmek `catalog.ts`'te tek satır.
- Yeni oynatıcının gerçek cihaz testi (iOS Safari sessiz anahtarı dahil, Android Chrome) yapılmadı.
- 22–32 yeniden tasarımı birleşince `g126-audio` hizalama testi bu temalar için kendiliğinden katılaşır; birleştirmeden
  sonra tam `npm test` koşulmalı.
