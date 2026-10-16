# Tema: midnight-garden (tasarım 19 · Midnight Garden, G419)

Gece bahçesi, karanlık Hollanda natürmortu: siyah zemin; sol üst ve sağ alt köşede yağlı boya koyu kırmızı/lal güller, erik
moru şakayıklar, gece mavisi hezaren, koyu meyveler ve tozlu yapraklar; sağda kadife erik rengi bir kelebek ve bir gül
yaprağı, sol altta mum ışığı. Mat siyah zarf, kapağın ve cebin kenarlarında saç teli inceliğinde antik gümüş; V kapağın
ucunda ortası boş gümüş mühür. Playfair Display SC (isimler, başlıklar) + Cormorant SC (aralıklı küçük büyük harf satırları)
+ Cormorant Garamond (italik mekân, gövde metni). Kurallar `docs/11_TEMA_STANDARDI.md`; motor ve platform sözleşmesi
`platform/README.md`. Yerleşim, tipografi ve hiyerarşi bu tasarımın W1 comp'larından
(`collections/19_Midnight_Garden/assets/gpt/comps/web_1..5`); bütün görseller bu tasarımın GPT parçaları (K21). Platform
sözleşmesi ve çözülmüş ilk ekran sorunları 08 (winter-evergreen) temasının iskeletinden alındı (motor işaretleri, RSVP formu,
`#site-data`, slug'lı oturum anahtarları, `data-scene`/`data-step`/`data-a` kancaları, `fitNames` + `fold` + `folds`, yatay
telefon ızgarası, `devRender`, test iskeleti); görünüş, renkler, tipografi, süs konumları, açılış, story dizilişi, zamanlama ve
kartların metin yerleşimi bu tasarımın.

## Dosyalar
| Dosya | İş |
|---|---|
| `theme.json` | ad "Midnight Garden", 5 sayfa, 5 foto alanı (oranlar = `img/manifest.json` `photo_slots.*.box_px`), 71 copy anahtarı |
| `content.demo.json` | `collections/19_Midnight_Garden/content.demo.json`'ın birebir kopyası (servis edilmez) |
| `index.html` | kapalı zarf → dokun → gümüş mühür çatlar ve iki yarısı düşer, siyah kapak yavaşça açılır, içeriden sıcak altın mum ışığı taşar, kart karanlıktan ışığa yükselir, öne gelir → home (view transition) |
| `home.html` | hero (W1.2: kart + foto, isimler, gün · tarih, mekân, şehir/bölge, geri sayım, altın RSVP hapı), davet kartı (3 dilim; AY \| gün \| YIL), tek "Kindly reply by" satırı, takvime ekle, iki yaldızlı çerçeve (story_1 → Our Story · mekân → The Day + programın ilk 4 satırı), kapanış (mum ışığı + sağ alt küme) |
| `story.html` | W1.3: başlık + alt başlık + giriş cümlesi; üç barok yaldızlı çerçeve "salon" dizilişinde, her biri karanlıktan mum ışığıyla aydınlanır |
| `details.html` | W1.4: Order of the Day kartı (info_card, 3 dilim; saat · ETKİNLİK · yer, satır aralarında GPT gül dalı + iki ince çizgi), takvime ekle, mekân (GPT yatay çerçeve), dress code, harita / Travel & Stay / Registry (yalnız linkle), SSS |
| `rsvp.html` | W1.5: RSVP kartı (info_card, 3 dilim): başlık + gül dalı, son tarih, hap, bekleme satırı, "With love," + isimler, **kartın alt altın çizgisinde zarfın gümüş mührü** (monogramla); platform yanıt formu (G042 + G051 soruları + G069 misafir adları), kapanış |
| `site.css` | palet token'ları, giriş ön ayarları (`kindle`, `press` bu tasarımın), foto alanı + maske, zarf katman yüzdeleri, mum ışığı (`.env-glow`, `.env-spill`, çerçeve arkası), kart 3 dilim, sayfa yerleşimleri |
| `thank-you.css` | teşekkür hâli (yalnız düğünden sonra yüklenir) |
| `site.js` | `MOTION` (açılış, sahneler, `accents`), `ENVELOPE_GEOMETRY`, uzun isim + ilk ekranlar (`fitNames`, `fold`, `folds`, zarf sayfası `envFit`), dekor–metin (`decor`), kart kopyası (`fitCopy`), geri sayım, zarf, `DEV_CONTENT` + `devRender` |
| `build_images.py` | GPT parçaları → `img/` (servis edilmez); `tools/tema_build.py` + bu tasarımın kesimleri |
| `img/` | WebP katmanlar, `florals_*` 360/540/720, `night` / `night_wide` / `night_foot` zeminleri, `invitation_card_band`, `ph_*` yer tutucular, `mask_{card,portrait,landscape}.png`, `og-1200x630.jpg`, `favicon.png`, `manifest.json` (servis edilmez) |

## Foto alanları
| Anahtar | İçerik yolu | Oran (px) | Yer |
|---|---|---|---|
| `hero_portrait` | `media.hero_portrait` | 475/622 | card_small penceresi (index kartı = home hero kartı) |
| `story_1..3` | `media.memory_photos.0..2` | 612/826 | frame_portrait (story; `story_1` home çerçevesinde de) |
| `venue` | `media.venue_image` | 702/458 | frame_landscape (details; home çerçevesinde de) |

Foto çerçevenin **altında**, kutusu pencere + 2 px, maske `mask_<şekil>.png` (CSS `border-radius` yok). `object-position` portre
50% 38%, mekân 50% 55%. Mekân penceresi ≈ 1,53:1 (3:2 fotoğraf neredeyse kırpılmadan girer). "Your photo here" yalnız
önizlemede; misafir nötr yer tutucuyu (bg_page'in sol altındaki mum ışığı parıltısından bulanık, gece rengine hafif tonlanmış
kırpım; kişi/yazı/gül yok — `build_images.py` gül kırmızısını ölçer, `manifest.ph_*.max_red`) görür.

## Görseller (`python3 platform/themes/midnight-garden/build_images.py [--prep-dir DIR] [--onizleme DIR]`)
- `tools/parts_prep.py` **geçici klasöre**. Entegratör notu (frame_portrait penceresinin sağ yarısında koyu leke): parts_prep
  leke dolgusu pencereyi tam şeffaf yapıyor; `foto_alani` her WebP'de tam pencerede görünür piksel kalmadığını denetliyor
  (`manifest.checks.windows_transparent`: hepsi 0).
- **Kapak kesimi** (`env_cflap`): `tema_build.kapak_kes("v")`, `method: renk` — gümüş kenar çizgisinden siyah gövdeye geçiş.
- **Ön cep yukarıdan taranır** (`cep_alttan`; adı 08'den): açık zarfın ön yüzü iki yan kanat + üstü **düz** kesik alt kanat.
  `cep_kes("v")`/parts_prep tek V uydurdu: alt kanadın düz üstünü kesiyor, yan kanatların üstünde astar şeritleri cebe
  giriyordu. Her sütunda menteşeden aşağı: astar (bordo/erik, kırmızı gül, bronz yaprak) bitip 8 satır siyah kâğıt görülen ilk
  satır kenar; üstündeki gümüş çizgi (≤ 4 satır) cebe dahil; 21 sütun medyanı (astarın koyu yapraklarında erken duran sütunlar),
  yan kenarlardaki parlak gümüş şerit nedeniyle uçtaki 16 sütun komşudan. Cebin içinde astar pikseli (örneklenen): 0.
- **Hiza**: `kit_check` geçiyor (sol 0,00 · sağ −0,10 · alt +0,13 %) — dönüşüm yok.
- **Kapanış** (`closure.png`, gümüş mühür, kapakla **taşınmaz**): çapa = V kapağın ucu (`kapak_kes` `tip`); W1.1 comp'ta ölçülen
  mühür genişliği / zarf genişliği (0,1492) ve merkezin uca göre kayması (+0,0013, −0,0478 × zarf genişliği) — ölçüm
  `build_images.py` COMP yorumunda; `previews/g419/compare_closure.jpg` (önizleme klasörüne `--onizleme` ile): tema | comp.
- **Mühür monogramı**: closure.png'nin ortası boş çizildi → `<span class="seal-mono" data-field="initials">` mührün içinde
  (index'te iki yarıda birer kopya, çatlakla birlikte bölünür; rsvp kartının mührü). Panelde Monogram alanını açar.
- **Zeminler**: telefon `night` = bg_page'in iki kümesiz kırpımı: düz gece karası (x 190–880, y 440–1080; dikeyde × 2 ölçekli —
  dokusuz siyah, ölçek görünmez) + sol alttaki mum ışığının alt yarısı (x 0–540, y 1270–1536), 110 px yumuşak geçiş. Böylece
  telefonda mum ışığı ekranın alt dörtte birinde kalır ve "Tap to open" W1.1'deki gibi karanlıkta durur. Geniş ekran
  `night_wide`; uzun sayfaların sonu `night_foot` (≥ 768 px'te `night_wide`). Çiçek kümeleri hep ayrı katman
  (`florals_tl` / `florals_br`), düz çizgiyle kesilmez.
- **Davet kartı 3 dilim**: köşe çiçekleri ve çerçevenin yan kıvrımları arasında tek temiz bant %48,2–50,4 (32 px). Bu kadar
  kısa bant esnetilirse kâğıt dokusu çizgilenir → bant ayrı dosya (`invitation_card_band`) olarak **kendi boyunda tekrarlanır**
  (`repeat-y`); bandı `temiz_bant()` bulur (yalnız dikey altın çizgilerin olduğu satırlar). Bilgi kartı %25–80 (esnetilir).
- **Ağırlık**: kümeler alfa kalitesi 60 (q 76): 720 px 75–81 KB. `invitation_card-960` 197 KB (yalnız ekran altı, lazy).
- og: `web_hero` alt hizalı 1.91:1; favicon: closure. Tema klasörü ~1,9 MB (≤ 3 MB).

## Açılış ve koreografi (`site.js` `MOTION`)
- **Açılış** (katalog: "On tap, the silver seal cracks and falls away, the black flap opens slowly, warm golden candlelight
  spills out from inside, and the card rises out of the darkness into the glow."): dokununca (90 ms) mühür hafifçe bastırılıp
  **çatlar** — aynı GPT mührünün iki kopyası tek düz çizgiyle (`clip-path`) ayrılır, çatlak çizilmez — iki yarı hafifçe
  açılır, sonra ayrı yönlere dönerek **düşer** ve ekranın altından çıkar (zarfın üstünde sönmez; 1,24 s'de biter). 960 ms'de
  **siyah kapak yavaşça** menteşesinde izleyiciye doğru kalkar (1,18 s; 82°'den sonra söner), altında kapalı gövde açık gövdeye
  (bordo güllü astar + ön cep) geçer, astarlı açık kapak −90°'den dikilir. 1,32 s'den itibaren **mum ışığı taşar**: cebin
  ağzında, kartın arkasında sıcak altın ışık (`.env-glow`) ve zarfın üstüne/çevresine yayılan kenarsız ışık (`.env-spill`,
  `mix-blend-mode: screen`) — CSS ışığı, çizim değil (§5.7). 2,38 s'de **kart karanlıktan ışığa yükselir** (cepten kalkarken
  parlaklığı %18'den %100'e), öne gelir (× 1,04, büyüyen gölge) ve view transition ile home kartına uçar. Dokun → home 4,52 s
  (`go`; theme-check ölçümü 4762 ms, Skip her an). Açılış cümlesinde parçacık yok → `accents.open = []`.
- **Story:** her çerçeve kendi sahnesi: görünüme girince çerçevenin arkasında duvardaki mum ışığı (`.glow`) ısınır, çerçeve ve
  fotoğrafı neredeyse siyahtan aydınlanır (`kindle`: opaklık .14 + `brightness(.12)` → 1, 1,7 s), sonra başlık belirir.
  Telefonda çerçeve 64vw (foto penceresi 64 × 0,6435 = **41,2vw** ≥ 38vw), comp'un "salon" düzeni korunur: alt alta ama
  dönüşümlü sola ve sağa yaslı, hafif bindirmeli; ≥ 720 px comp'un iki sütunlu salonu (1 solda yüksek, 2 sağda aşağıda, 3
  birin altında).
- **Parçacıklar** (`MOTION.accents`, GPT gül yaprağı accent_1): açılışta yok (cümlede yok) · home'a varış 3 yaprak (hero'nun
  içinde, metnin arkasında, yazı sütununun yanındaki şeritlerde) · RSVP kapanışı 4 yaprak (yalnız `.closing` kutusunda).
- **Boyalı kartlar** (davet, Order of the Day, RSVP): `set` girişi, hep opak. RSVP kartının mührü `press` ile karta basılır.
- Süreler (docs/11 §8): her sahnenin son adımı ≤ 3000 ms, tek giriş 600–1800 ms.

## İlk ekranlar ve yatay telefon
08'in çözülmüş adımları korunur: `fitNames` (isimler en çok %24 küçülür → `.is-tight` + isimler **32 px tabanı** → `.is-long`
(sayaç hapın altına) → hero kaydırılır), ardından `fold`. Kısa yatay (`min-aspect-ratio: 1/1` ve yükseklik ≤ 620 px) ızgara: kart
solda, isimler · tarih · mekân · şehir · sayaç · hap sağda. **İç sayfalar** (`folds`): her ilk ekran öğesi ya nav'ın üstünde
biter ya da ilk ekranın tamamen altında başlar (details'te program satırları birim **değil**: boyalı kartın içinde itilen
satır yazısız bir delik bırakıyordu — qa-kontrol; nav çizgisindeki satır docs/11 §11'in kabul edilen davranışı; story'de her çerçeve ayrı birim; masaüstü ızgarasında yayılan öğe yok, itilen
çerçeve yalnız arkasından gelenleri iter). **Zarf sayfası** (`envFit`): sahnenin boş üstü (`.68288 × --w`) ölçülen başlığın
altına girer; "Tap to open" ilk ekranda bitmiyorsa sahne küçülür (`--ok`, en az 0,6). Kısa telefonlarda (360×640, 375×553) mum
ışığı ipucuna yaklaşabildiği için ipucunun arkasında kenarsız koyu bir okunabilirlik hâlesi var (`.env-hint::before`, §5.7).

## Dekor ve metin (`site.js` `decor`)
- Köşe kümeleri **hep bütün** GPT parçası; yalnız ekran kenarı keser. Hero'nun sağ alt kümesi ilk ekranda nav'ın üstünde biter.
- `decor` her kümenin 16 × 16 doluluk haritasını (WebP alfasından, `MAP`) yazı kutularıyla karşılaştırır; çakışırsa küme %6
  adımlarla küçülür (en çok %45), yine çakışırsa gizlenir. Yazıya, karta, çerçeveye ya da kapalı zarfa değen süzülen parça gizlenir.

## Comp öğe haritası (docs/11 §8)

### index ← W1.1 `web_1_envelope.png`
| W1 öğesi | Şablon | Not |
|---|---|---|
| siyah zemin, sol altta mum ışığı | `.scene-bg` `night` (telefon) / `night_wide` (geniş) | bg_page 2:3 telefonda kümeleri keserdi: zemin kümesiz kırpımlardan |
| çiçek kümeleri sol üst, sağ alt | `florals_tl` / `florals_br` ayrı katman | ekranda bütün |
| sağda kelebek ve gül yaprağı, altta erik | `.float` (accent_3, accent_1, accent_2) | yavaş "nefes"; zarfa/yazıya değerse gizlenir |
| "YOU ARE INVITED" | `.env-head .kicker` | Cormorant SC |
| isimler (yüksek kontrastlı küçük büyük harf) | `h1.names` (+ `.amp` italik Cormorant) | uzun isimde `site.js` küçültür |
| gümüş kenarlı siyah zarf | `.env-closed` + `.env-cflap` | |
| V ucunda gümüş mühür | `.closure` (iki `.seal-half` + `.seal-mono`) | ölçü ve yer comp'tan (manifest.closure); **ek:** monogram (comp'ta boş) |
| "— TAP TO OPEN —" | `.env-hint p.rule` (iki 1 px çizgi) | |
| — | `a.skip`, "Enter / Replay the opening" | platform gereği |

### home ← W1.2 `web_2_home.png`
| W1 öğesi | Şablon | Not |
|---|---|---|
| siyah kart, ince yaldızlı barok çerçeveli portre, "WE'RE GETTING MARRIED", "NOVEMBER 6, 2027 · NEW ORLEANS" | `.hero-card` (card_small + `hero_portrait`) | kasaba = `venue.city` (comp yalnız kasabayı yazar; docs/11 §3.2 `city_region` der — **sapma**, comp'a uyuldu, 08 ile aynı); dar kartta tarih ve kasaba iki satır (`fitCopy`) |
| isimler | `h1.names` | |
| "SATURDAY · NOVEMBER 6, 2027" | `.hero-date` | |
| "The Midnight Conservatory", "New Orleans, Louisiana" (italik) | `.hero-venue`, `.hero-city` | |
| dört altın çizgili kutulu geri sayım | `.countdown` sade rakam + etiket | **sapma:** kutular CSS çerçeve olurdu (K21, §5.7) |
| antik altın RSVP hapı, siyah yazı | `.hero-cta .btn` | arayüz hapı (altın degrade); comp'taki hapın uçlarındaki küçük süs çizilmedi |
| alt gezinme (üstte ince çizgi, noktalar, geçerli sayfa altın + altı çizili) | `.site-nav` | |
| köşe kümeleri, kelebek, yaprak, mum ışığı | `florals_*`, `.float`, `night` | |
| — (comp yok) | davet kartı (`invitation_card` 3 dilim: köşe çiçekleri, altın çerçeve; AY \| gün \| YIL iki 1 px ayraçla), "Kindly reply by" + RSVP, takvime ekle, iki yaldızlı çerçeve (arkasında mum ışığı; `frame_portrait` + story_1 → Our Story, `frame_landscape` + mekân → The Day + programın ilk 4 satırı, docs/11 §3.2), "With love" + isimler + "Open the envelope again" (mum ışığı + `florals_br`) | bu tasarımın parçaları |

### story ← W1.3 `web_3_story.png`
| W1 öğesi | Şablon | Not |
|---|---|---|
| "OUR STORY", "MOMENTS WE HOLD DEAR" | `h1.page-title`, `.page-head .kicker` | |
| — | `.lede` (story.intro + tarih) | standart zorunlu |
| üç barok yaldızlı çerçeve salon dizilişinde, her birinin arkasında duvarda mum ışığı | `.salon .pane` (`.glow` + foto + frame_portrait) | **sapma:** telefonda comp'un iki sütunu ~25vw pencere olurdu (< 38vw, docs/11 §9) → alt alta, dönüşümlü sola/sağa (salon hissi), 64vw; ≥ 720 px comp'un iki sütunu |
| çerçeve diplerinde küçük gül/yaprak demetleri | — | **sapma:** comp'ta çerçevelere iliştirilmiş çiçekler tek parça olarak yok (frame_portrait çiçeksiz); yerine köşe kümeleri |
| başlıklar çerçevenin altında (aralıklı büyük harf) | `figcaption.kicker` | |
| köşe kümeleri, kelebek, yaprak | `.page-bg` ilk ekranda; `florals_br` + mum ışığı sayfa sonunda | |

### details ← W1.4 `web_4_details.png`
| W1 öğesi | Şablon | Not |
|---|---|---|
| siyah "Order of the Day" kartı, ince altın çerçeve, üstte gül goncası ve meyveler | `.day-card` (info_card 3 dilim) + `h1.card-title` | kart içerikle uzar (1–10 satır); comp'ta başlık tek satır, telefonda iki satıra sarar |
| saat / ETKİNLİK / yer (italik), ortalı | `.sched-row` | |
| satır arası gül dalı + iki yanında ince çizgi | `.row-orn` (GPT divider + iki 1 px çizgi; ilk satırda yok) | 6+ satırda yalnız boşluk |
| — | `.page-kicker` gün · tarih | standart zorunlu başlık tarihi |
| mekân fotoğrafı yatay yaldızlı çerçevede | `.venue-photo` (frame_landscape + `venue`) | **sapma:** GPT `frame_landscape` comp'takinden daha kare (pencere 1,53:1; comp ~2,4:1) |
| "THE MIDNIGHT CONSERVATORY", "New Orleans, Louisiana" | `.venue-name`, `.venue-place` (`city_region_country`, + adres, tören cümlesi) | |
| "DRESS CODE · Black tie" | `.dress` | |
| — | takvime ekle, harita, Travel & Stay, Registry, SSS, RSVP | yalnız içerik/link varsa |

### rsvp ← W1.5 `web_5_rsvp.png`
| W1 öğesi | Şablon | Not |
|---|---|---|
| ince altın çerçeveli siyah kart, üstte gül goncası | `.rsvp-card` (info_card 3 dilim) | |
| "WILL YOU JOIN US?" | `h1.card-title` | telefonda iki satır |
| başlığın altında çizgi + küçük süs | `.title-orn` (GPT gül dalı + iki 1 px çizgi) | comp'taki elmas süs GPT parçası değil; aynı yerde tasarımın dalı |
| "Kindly reply by" (italik), "SEPTEMBER 25, 2027" | `.by`, `.deadline` | `data-if="rsvp.deadline"` |
| altın RSVP hapı | `a.btn[href="#reply"]` | forma kaydırır |
| "We can't wait to celebrate with you" (italik) | `.wait` | |
| "With love," + isimler | `.sig-unit` (`.love` + `.sign`) | uzun isimde sarar; ilk ekrana sığmazsa önce küçülür (`--sg` ≥ 0,72) |
| kartın alt kenarında gümüş mühür | `.card-seal` (closure + monogram) | kart öğesinin dışında (kart metni sayılmasın), kartın alt altın çizgisine ortalı |
| — | yanıt formu, kapanış ("Thank you"; yanıttan sonra gizlenir) | platform sözleşmesi |

## Teşekkür hâli (G075 kuralı)
- **Zarf:** açılış aynen; üst satır "With love and thanks" (`ty_kicker`); kartta teşekkür başlığı (`thank_you_title`, küçük büyük
  harf, dengeli sarar; `fitCopy` sığmazsa küçültür, en son tarih satırı düşer) + tarih. Kart penceresinde teşekkür fotoğrafı;
  yoksa **gece zemini üstünde zarfın gümüş mührü** — asla yer tutucu.
- **Home:** hero kartı zarfla aynı; isimler, tarih, mekân kalır; geri sayım ve RSVP hapı yok. Davet kartının yerine aynı
  `invitation_card` kâğıdında (3 dilim) teşekkür kartı: başlık, mesaj (`white-space: pre-line`), "With love,", isimler, tarih.
- **Details:** "The Day"; takvim, dress code, Travel & Stay, SSS ve RSVP linki yok; tören cümlesi geçmiş zaman. Çift gizlerse 404.
- **RSVP:** kartta "Replies are closed" + teşekkür başlığı + Home hapı + imza + mühür; form yok.
- **Nav:** Details etiketi "The Day", RSVP yok. Stiller `thank-you.css`'te.

## Düzenlenebilir metinler (G068) ve misafir adları (G069)
Görünür her sabit metin `data-copy` taşır (71 standart anahtar; `node scripts/copy-manifest.ts --theme midnight-garden --check`
temiz). `max` değerleri `theme-check --stress` ile 360/390'da (teşekkür hâli dahil) doğrulandı. Formda "Number of guests"in
hemen altında `<template data-rsvp-party>`.

## Bilinen sınırlar
- Program en çok 10 satır (şema); Order of the Day kartı uzar (3 dilim).
- `story.items` 3'ten fazlaysa ilk 3 başlık; anların `text`'i gösterilmez.
- Monogram mühürde ~60 px'lik alana sığar: "C&D", "A & M" gibi kısa monogramlar için (11 px altına inmez); uzun monogram
  taşar (şema uzunluk sınırı yok).
- Cormorant SC küçük büyük harf fontudur: aralıklı satırlar `text-transform: lowercase` ile eşit boy küçük büyük harf görünür
  (comp'taki gibi); tarayıcı fontu yükleyemezse yedek serif'te küçük harf görünür.
- `favicon.png` şeffaf; `apple-touch-icon` yazılmaz.
- Denenmedi: gerçek iPhone/Safari ve Android Chrome (`svh`, `mask`, `:has`, `mix-blend-mode`, kesişen belge view transition),
  Vercel yayını, gerçek alıcı fotoğrafları (farklı oran/ışık), yavaş ağ.

## Ölçümler
2026-10-15, dal `claude/g419-tema`, Chromium (Playwright, `/opt/pw-browsers`).

| Ölçüm | Sonuç |
|---|---|
| `theme-check --theme midnight-garden --stress` | 128 geçti, 0 hata, 0 uyarı (`previews/g419/checks.json`) |
| `g051-browser --theme midnight-garden` | 44/44 |
| `final-smoke --theme midnight-garden` | 45/45 (`previews/g419/final/`) |
| `npm test` / `typecheck` / `build` | 994/994 · temiz · temiz (trace-check 16 tema) |
| zarf → home | 4762 ms (MOTION `go` 4520 + view transition) |
| azaltılmış hareket | 201 ms, doğrudan home, her şey görünür |
| ilk görünüm 390×844 DPR 3 | index 718 KB, home 949 KB (yer tutucu); örnek fotoğrafla 808 / 1423 KB (sınır 1,5 MB) |
| açılış kaydı | `previews/g419/opening_390x844.mp4` (dokun → açılış → home → story → details) |
| dosya boyları | site.js 35 550 B (≤ 35 KiB), site.css 46 041 B (≤ 45 KiB), thank-you.css 2285 B; tema klasörü ~1,9 MB |
| kit uyumu (`kit_check`) | paket 5 23/23 (hiza sol +0,00, sağ −0,10, alt +0,13 %), paket 2 5/5 |
| qa-kontrol (§13.4) | oturum içi inceleme "KABUL" dedi (rapor repoda yok, doğrulanamadı); 2026-10-16 qa-kontrol bulguları (home yatay taşma) düzeltildi — G419 Sonuç |
