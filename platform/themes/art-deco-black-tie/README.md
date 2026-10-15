# Tema: art-deco-black-tie (tasarım 06 · Art Deco Black-Tie, G406)

1920'ler balo salonu: gece laciverti kadife zemin, üst ortadan yelpaze gibi açılan ince altın ışınlar, sol üst ve sağ alt
köşede altın deco kümeleri (yelpaze, inci, kristal), sağ üstte şampanya kadehi, yıldız parıltısı ve küçük yelpaze; kapanış
elemanı ortadaki dikişin üstüne takılı incili altın deco madalyon olan, iki kapılı (gatefold) lacivert dosya. Italiana (uzun,
ince deco büyük harfler: isimler, başlıklar, rakamlar) + Josefin Sans (geniş aralıklı geometrik büyük harf satırları, gövde).
Kurallar `docs/11_TEMA_STANDARDI.md`; motor ve platform sözleşmesi `platform/README.md`. Yerleşim, tipografi ve hiyerarşi bu
tasarımın W1 comp'larından (`collections/06_Art_Deco_Noir/assets/gpt/comps/web_1..5`, yalnız sade adlar; `web_3_story_v1/v2`
denemedir); bütün görseller bu tasarımın GPT parçaları (K21). 04 (vintage-airmail) ve 05 (mediterranean-lemon) temalarından
yalnız platform sözleşmesi ve çözülmüş sorunlar alındı (motor işaretleri, RSVP formu + G051 soruları + G069 misafir adları,
`#site-data`, slug'lı oturum anahtarları, `data-scene`/`data-step`/`data-a` kancaları, `fitNames` + `fold` + `folds` ilk ekran
adımları, yatay telefon ızgarası, `devRender`, teşekkür hâli, data-copy manifesti); görünüş, aralıklar, süs konumları, zamanlama,
kart oranları, bölüm sırası ve zarf tipi (ilk **kapı / gatefold** teması) bu tasarımın.

## Dosyalar
| Dosya | İş |
|---|---|
| `theme.json` | ad "Art Deco Black-Tie", 5 sayfa, 5 foto alanı (oranlar = `img/manifest.json` `photo_slots.*.box_px`), 71 copy anahtarı |
| `content.demo.json` | `collections/06_Art_Deco_Noir/content.demo.json`'ın birebir kopyası (`/start?theme=art-deco-black-tie` ve tema demosu; servis edilmez) |
| `index.html` | kapalı gatefold dosya → dokun → madalyon döner ve kalkıp gider, iki kapı balo salonu kapıları gibi yanlara açılır, kart orta cepten yükselirken ekranı ince bir altın ışık bandı geçer, kart öne gelir → home (view transition) |
| `home.html` | hero (W1.2: kart + foto, "We're getting married", tarih · şehir; isimler, altın ayırıcı, gün · tarih, mekân, şehir/bölge, geri sayım, lacivert-altın RSVP hapı), davet kartı (invitation_card 3 dilim, deco tarih bloğu) + tek "Kindly reply by" satırı, takvime ekle, iki altın kapı (frame_portrait + story_1 → Our Story, frame_landscape + mekân → The Day + programın ilk 4 satırı), kapanış |
| `story.html` | W1.3: başlık + alt başlık + ayırıcı + giriş cümlesi; üç basamaklı deco kemer çerçeve (telefonda merdiven gibi sol–orta–sağ, ortadaki en büyük; ≥ 900 px'te comp'un sırası, ortadaki uzun), her biri görünüme girerken karanlıktan ışığa döner ve üstünden altın ışık bandı geçer; başlık + küçük ayırıcı |
| `details.html` | W1.4: gün · tarih, Order of the Day kartı (info_card 3 dilim; saat \| ETKİNLİK / yer, satır aralarında GPT ayırıcı), takvime ekle, mekân (GPT yatay deco çerçeve), mekân adı + yer, ayırıcı + dress code, harita / Travel & Stay / Registry (yalnız linkle), SSS, RSVP |
| `rsvp.html` | W1.5: ışınlar altında RSVP kartı (info_card 3 dilim) + kartın alt kenarında altın madalyon (closure); platform yanıt formu (G042 + G051 soruları + G069 misafir adları), kapanış |
| `site.css` | palet token'ları, giriş ön ayarları (`glide-tl/br`, `sweep`, `turn-in`, `set` bu tasarımın), foto alanı + maske, gatefold katman yüzdeleri, kart 3 dilim, sayfa yerleşimleri |
| `thank-you.css` | teşekkür hâli (G075): kart penceresinde teşekkür fotoğrafı ya da lacivert kadife + ışınlar + madalyon, teşekkür kartı |
| `site.js` | `MOTION` (açılış, sahneler, `accents`), `ENVELOPE_GEOMETRY`, `OPEN_FRAC`, uzun isim + ilk ekranlar (`fitNames`, `fold`, `folds`, `tiles`, zarf sayfası `envFit`), dekor–metin (`decor`), kart kopyası (`fitCopy`), geri sayım, gatefold açılışı, `DEV_CONTENT` + `devRender` |
| `build_images.py` | GPT parçaları → `img/` (servis edilmez); `tools/tema_build.py` + bu tasarımın kesimleri |
| `img/` | WebP katmanlar (`door_l/r`, `door_l/r_in`, `center`, `pocket`, `closure`, kartlar, çerçeveler), `decor_*` 320/480/720, `rays`, `bg_tile`, `ph_*` yer tutucular, `mask_{card,portrait,landscape}.png`, `og-1200x630.jpg`, `favicon.png`, `manifest.json` (servis edilmez) |

## Foto alanları
| Anahtar | İçerik yolu | Oran (px) | Yer |
|---|---|---|---|
| `hero_portrait` | `media.hero_portrait` | 555/568 | card_small'un basamaklı kemer penceresi (index kartı = home hero kartı) |
| `story_1..3` | `media.memory_photos.0..2` | 531/1014 | frame_portrait (story; `story_1` home kapısında da) |
| `venue` | `media.venue_image` | 1280/654 | frame_landscape (details; home kapısında da) |

Foto çerçevenin **altında**, kutusu pencere + 2 px, maske `mask_<şekil>.png` (CSS `border-radius` yok). `object-position` kart
50% 38%, kemer 50% 40%, mekân 50% 55%. Kemer penceresi dar ve uzun (≈ 0,52:1, G206 `pencere` "about 3:4" tutmadı): 2:3 portre
fotoğraf yanlardan kırpılır; yüz ortada kalır (PAKET 2 fotoğraflarıyla kontrol edildi). Mekân penceresi ≈ 1,96:1: 3:2 fotoğraf
üstten/alttan ~%13 kırpılır. "Your photo here" yalnız önizlemede (`html[data-preview="true"]`); misafir nötr yer tutucuyu
(bg_page'in ışın ve küme dışındaki sade lacivert kadifesinden bulanık, fildişine %16 tonlanmış kırpım) görür. `build_images.py`
her yer tutucuda altın fazlasını (R − B, p99,9 ≤ 18) ölçer (`manifest.ph_*.max_gold`; aşarsa çıkış ≠ 0).

## Görseller (`python3 platform/themes/art-deco-black-tie/build_images.py [--prep-dir DIR] [--onizleme DIR]`)
- `tools/parts_prep.py` **geçici klasöre** (alfa kırpma, #00FF00 pencereleri + leke dolgusu, `windows.json`). G206'nın açık kusuru
  (frame_portrait ve frame_landscape pencerelerinde yarı saydam koyu lekeler; yatay çerçevede pencerenin ortasında tam saydam bir
  delik): `leke_doldur` pencereyi tam şeffaf yapar (`leke_px` 92 306 / 475 013); `foto_alani` her WebP'de tam pencerede görünür
  piksel kalmadığını denetler (`manifest.checks.windows_transparent`: hepsi 0). Pencere çevresi 3 px halkada kalan ayrıştırma
  saçağı çerçeve renginden; dış hatta yarı saydam hâle temizlenir; WebP kenar saçağı için şeffaf piksellere komşu renk taşınır.
- **Dikiş** (kapalı dosya): iki kapının kalın altın kenar şeritleri arasında koyu bir boşluk var. `tema_build.dikis_bul` (kat_bul:
  "iki yanından koyu ince çizgi") sol kapının ince ışın çizgileri arasındaki koyu bir sütunu buluyordu (x 752). Burada kutu
  ortasının ± %4'ünde 9 px yumuşatılmış sütun parlaklığının en koyu bandının ortası: **x 768** (kutu ortası 769;
  `manifest.stage.cuts.seam`, karşılaştırma için `seam_tema_build`).
- **Katlanma çizgileri** (açık dosya): `tema_build.kat_bul` orta panelin çift altın çerçeve çizgisinin arasındaki koyu şeridi
  katlanma sanıyordu (x 465 / 1070 → `kit_check`'in "sol kat +1,43 · sağ kat −1,60 %" UYARI'sı buradan). Gerçek katlanma, kapı ile
  orta panelin birleştiği sütun: orta panelin basamaklı tepesinin yanında kapı ile panel arasında saydam bir boşluk var; o
  satırlarda soldaki ilk opak koşunun bittiği / sağdaki son koşunun başladığı sütunların medyanı: **454 / 1083** (≥ 10 satır).
  Gerçek hiza: üst −0,29 · alt −0,49 · sol kat +0,72 · sağ kat −0,78 % → **tamam** (±%1,5; `manifest.align`, tema_build
  ölçümü `kenarlar_tema_build`'de).
- **Ölçülen dönüşüm** (`manifest.stage.align_fix`): açık görsel × (1,0366, 1,0022) + (−28, 3) px → katlanma çizgileri kapalı
  dosyanın sol/sağ kenarına, üst/alt alfa kenarı kapalınınkine oturur (sonrası: sol −0,4 · sağ −0,4 · üst 0 · alt 0 px) — 90°'de
  her kapı aynı menteşede el değiştirir. Not: açık görselde kapı içleri (349 px) kapalı kapı yarısından (326 px) ~%7 geniş
  (GPT); el değiştirme kenardan görünürken (90°) olduğu için fark okunmaz, açılmış kapılar biraz geniş durur.
- **Kesimler** (docs/11 §7.4): kapalı → `door_l` / `door_r` (dikişten, 1 px yumuşak); açık → `door_l_in` / `center` /
  `door_r_in` (katlanma çizgilerinden), `pocket` = orta panelin lacivert cebi (`tema_build.cep_kes("duz")`, `method: renk`,
  düz üst kenar y 666, altın kenar çizgisi cepte). Kesilen parçalar kaynakla örtüşüyor (alfa farkı kapalı / açık
  `manifest.checks.*_overlap_diff` ≤ 0,01).
- **Kapanış** (`closure.png` = basamaklı ışınlı altın deco madalyon + inci, kare tuvalde büyük çizildi; kapılarla **taşınmaz**):
  yeri kesim geometrisine bağlı — çapa = dikiş sütunu, yükseklik W1.1'de ölçülen "a little above the middle": comp'ta dosya x
  222–802 (580), y 435 (dikişteki basamaklı tepe) – 1249, madalyon kolları x 435–588 (153), incinin merkezi (511,5, 818) →
  madalyon genişliği / dosya genişliği **0,2638**, incinin merkezi dosya yüksekliğinin **0,4705**'inde. Madalyonun merkezi
  incinin merkezi (parlak, doygunluğu düşük en büyük bölge). `previews/g406/compare_closure.jpg`: tema | comp.
- **Kart** (card_small) dosya genişliğinin 0,80'i, orta cebin arkasında; cepte beklerken yalnız kartın üst %8,5'i (altın çerçeve
  bandı) cebin düz kenarının üstünde (foto penceresi kartın %11,2'sinden başlar: yüzler cep kenarıyla kesilmez). `out` = alt köşeler
  cebin kenarını kartın %4'ü aşmış; `front` = olduğu yerde %2,5 aşağı + × 1,06 + büyüyen gölge → home kartına yukarı uçar
  (`stage.card_path`).
- **Sahne kutusu** = kapalı + hizalanmış açık + kart yolu + kapanış alfa kutularının birleşimi (1344 × 1067 tuval px, oran 1,259).
  Kapalı dosya sahne genişliğinin 0,485'i: telefonda sahne ekrandan geniştir (açılınca yanlara gidecek kapı içleri), `.env-page`
  `overflow-x: clip` ile kesilir (yatay kaydırma yok). Açılışta sahne `--os` = min(1, 0,94 × 100vw / sahne genişliği) ile kapalı
  dosyanın merkezi etrafında küçülür (docs/11 §7.1; açık nesne = sahne genişliği, `open_obj.frac_w` 1): 390 px'te × 0,70.
- **Işınlar** (W1.1–W1.5'in üst ortasındaki altın ışın yelpazesi): bg_page'in sağ yarısındaki ışınlar (x 512–1024, y 0–420; yelpaze
  x 511,5'te simetrik — ölçüldü) aynalanıp tam yelpaze yapılır, zemin yüksek geçirgen süzgeçle düşer, kalan ışık alfaya çevrilir
  (RGBA) → her lacivert zeminde aynı görünür. bg_page'in köşe kümeleri telefonda cover ile kesilirdi: zemin `bg_tile` (bg_page'in
  ışınların altındaki sade bölgesinin rengine, #0A1729, çekildi; GPT'nin karosu dikişsiz değildi — sol kenar sağdan, üst alttan
  açık, yatay ekranda 640 px'te çizgi: ikinci derece eğim düşülür, kenarlar yarım kaydırılmış kopyadan alınır, `manifest.bg_tile.seam`), kümeler ayrı katman (`decor_tl` / `decor_br`), ekranda bütün.
- Kartlar: `free_zone` + 3 dilim (`slices`: davet kartı %20–85, info kartı %12–90). og: `web_hero` alt hizalı 1.91:1 (dosya
  sağ ortada, merkez ≈ %60); favicon: closure. Tema klasörü ~1,8 MB (≤ 3 MB).

## Açılış ve koreografi (`site.js` `MOTION`)
- **Açılış** (katalog: "On tap, the gold medallion clasp turns and lifts away, the two navy doors swing open to the sides like
  ballroom doors, and the card rises from the center pocket as a thin band of gold light sweeps across the screen."): dokununca
  "Tap to open" ve ayırıcısı söner, dosya hafifçe bastırılır; **madalyon** incisi etrafında −62° döner (0–414 ms), sonra büyüyerek
  (× 1,3, gölgesi genişler: izleyiciye doğru kalkar) ekranın üst kenarının ötesine çıkar (1,15 s; ekranın dışına çıktıktan sonra
  söner). 700 ms'de **kapılar** menteşelerinde (dış kenarlar) izleyiciye doğru açılır: sol kapı 0 → −90°, sağ kapı 100 ms sonra
  0 → 90° (balo salonu kapıları gibi, dönerken ışıktan uzaklaşıp kararır); 90°'de kenardan görünürken kapı içleri (yelpaze desenli
  astar) −/+90° → 0° devralır (1,26 s); aynı sürede sahne açık dosyayı ekrana sığdıracak kadar küçülür (`--os`). **Kart** orta
  cepten yükselir (1,9 s) ve **aynı anda ince bir altın ışık bandı** (kenarsız, eğik, yumuşak degrade; `mix-blend-mode: screen`)
  ekranı soldan sağa geçer (1,95–3,3 s); kart olduğu yerde öne gelir (3,25 s, × 1,06, büyüyen gölge) ve view transition ile home
  kartına uçar. Dokun → home 4,15 s (theme-check ölçümü 4375 ms; Skip her an). Açılışta parçacık yok: cümle tür/sayı söylemiyor
  (docs/11 §8), ışık CSS.
- **Story:** her kemer kendi sahnesi: görünüme girince çerçeve ve fotoğraf karanlıktan ışığa döner (`brightness .3 → 1`, 1,6 s)
  ve üstünden eğik bir altın ışık bandı geçer (W1.3 "a faint diagonal sweep of gold light crossing them"; `[data-a="sweep"]::after`,
  adımla aynı anda başlar, `--d`; bant `background-position` ile kayar — transform sayfanın taşma genişliğini büyütüyordu — ve
  kemerin kendi biçimiyle maskelidir: çerçeve parçası + foto penceresi, kadifede ışıklı dikdörtgen yok; mekân çerçevesinde de); sonra başlık yazılır, küçük ayırıcı açılır. Telefonda kemerler **merdiven gibi** sol, orta,
  sağ (52vw; ortadaki 56vw — en büyük), pencere ≥ 43vw (≥ 38vw); ≥ 900 px'te comp'un **yan yana sırası** (ortadaki × 1,12 uzun,
  altlar hizalı) = tek fold birimi: `tiles` sıra nav'ın üstünde bitene kadar kemerleri 6 px adımlarla küçültür (en az 140 px).
- **Parçacıklar** (`MOTION.accents`): home'a varış 3 yıldız parıltısı (accent_3, `twinkle`: yerinde belirip dönerek söner) ·
  RSVP kapanışı 4 parıltı; katman bölümün içinde ve metnin arkasında (`host`), yollar yazı sütununun yanındaki şeritlerde
  (`avoid`); şerit yoksa parıltı doğmaz.
- **Boyalı kartlar** (davet, Order of the Day, RSVP): `set` girişi — kart konur gibi kayar, **hep opak** (theme-check'in kart
  piksel testi gerçek kartı ölçer); metinleri sırayla girer. Köşe kümeleri köşelerinden büyüyerek (`glide-*`: × 0,9 → 1, köşe
  merkezli — ekran kenarını asla aşmaz) girer.
- Süreler (docs/11 §8): her sahnenin son adımı ≤ 3000 ms (`rsvp-card` `clasp` 2880), tek giriş 600–1800 ms.

## İlk ekranlar ve yatay telefon
04/05'in çözülmüş adımları korunur: `fitNames` (isimler en çok %24 küçülür → `.is-tight` → `.is-long` (sayaç hapın altına) →
hero kaydırılır; isimler ≥ 32 px = `manifest.theme_check.first_screen.names_min_px`), ardından `fold` (nav'ın altında yarım parça
yok). Kısa yatay (`min-aspect-ratio: 1/1` ve yükseklik ≤ 620 px) ızgara: kart solda, isimler · ayırıcı · tarih · mekân · şehir ·
sayaç · hap sağda. Kart ≥ 150 px; kopyası `fitCopy`: tarih · şehir tek satır, sığmazsa iki satır (tarih de sarabilir), sonra şehir,
sonra "We're getting married" + ayırıcı düşer (yazı ≥ 11 px).

**İç sayfalar** (`folds`): her ilk ekran birimi ya nav'ın üstünde biter ya da ilk ekranın tamamen altında başlar. Birimler
`[data-fold]`: story'de alt başlık, giriş, her kemer (masaüstü sırada üçü birlikte `.tiles`); details'te gün · tarih, kart başlığı,
her program satırı, takvim, mekân fotoğrafı, mekân yazısı, dress code, harita; rsvp'de başlık, "Kindly reply by" + tarih, hap,
bekleme satırı, imza birimi ("With love," + isimler + madalyon; önce `--sg` 1 → 0,72 küçülür), form başlığı ve her form satırı,
kapanış satırları. İlk katlanan birim için sayfa başı en çok 40 px yükselir.

**Zarf sayfası** (`envFit`): "Tap to open" (açıkken Replay) ilk ekranda bitmiyorsa sahne küçülür (`--ok`, en az 0,6); ışınlar
başlığın ilk satırının (kicker) 6 px üstünde söner (`--re`, W1.1: yazı düz kadifede). Yatayda isim sütunu köşe kümelerinin
arasında; açık hâlde dosya ile Enter / Replay yan yana.

**Gezinme:** etiket satırı opak (`rgba(10, 23, 41, .97–.98)` + `backdrop-filter: blur(8px)`), üst kenar 12 px'te yumuşak belirir;
etiketlerin üstünde W1'deki altın ayırıcı (GPT `divider`). Sayfalar arası geçişte nav bütün gelir
(`::view-transition-new(site-nav):only-child { animation: none }`); zarfa dönüşte eski nav çizilmez
(`html:has(.page-envelope)::view-transition-group(site-nav) { display: none }`).

## Dekor ve metin (`site.js` `decor`)
- Köşe kümeleri **hep bütün** GPT parçası (maske/kırpma yok); yazıya ya da boyalı karta (`.paper`) değecekse 16 × 16 alfa haritasıyla (`MAP`) ölçülüp %6
  adımlarla küçülür (en çok %45), yine değiyorsa gizlenir. Sağ üstteki üç parça (kadeh, parıltı, yelpaze — W1.1–W1.4) yazıya,
  karta, çerçeveye ya da kapalı dosyaya değerse gizlenir.

## Comp öğe haritası (docs/11 §8)

### index ← W1.1 `web_1_envelope.png`
| W1 öğesi | Şablon | Not |
|---|---|---|
| lacivert kadife zemin, üst ortada altın ışınlar | `body` `bg_tile` + `.scene-bg .rays` | ışınlar bg_page'in ışınlarının aynalanmış kırpımı; başlığın üstünde söner |
| köşe kümeleri sol üst, sağ alt | `.corner-tl` / `.corner-br` (decor_tl / decor_br) | ekranda bütün |
| kadeh, yıldız parıltısı, küçük yelpaze (sağ üst) | `.f-coupe` / `.f-star` / `.f-fan` (accent_1/3/2) | yazıya değerse gizlenir |
| "YOU ARE INVITED" | `.env-head .kicker` | |
| isimler (deco büyük harf) | `h1.names` (Italiana, `text-transform: uppercase`) | uzun isimde `fitNames` küçültür |
| basamaklı tepeli iki kapılı lacivert dosya | `.door-l` + `.door-r` (kapalı görselin dikişten kesimi) | |
| dikişin üstünde altın madalyon | `.closure` (kapılardan ayrı) | ölçü ve yer comp'tan (manifest.closure) |
| "TAP TO OPEN" + küçük ayırıcı | `.env-hint` + `.hint-orn` (divider) | masaüstünde "Click to open" |
| — | `a.skip`, "Enter / Replay the opening" | platform gereği |

### home ← W1.2 `web_2_home.png`
| W1 öğesi | Şablon | Not |
|---|---|---|
| fildişi kart, basamaklı kemer pencere, "We're Getting Married", ayırıcı, "DECEMBER 18, 2027 · CHICAGO" | `.hero-card` (card_small + `hero_portrait`, `.card-line`, `.card-orn`, kicker) | kart yazısı `venue.city` (comp gibi yalnız şehir; docs/11 §3.2 `venue.city_region` der — **sapma**, comp'a uyuldu); dar kartta iki satır (`fitCopy`) |
| isimler + altın ayırıcı | `h1.names` + `img.names-orn` | |
| "SATURDAY · DECEMBER 18, 2027" | `.hero-date` | |
| "THE GRAND LUMIÈRE HOTEL" (altın, aralıklı), "CHICAGO, ILLINOIS" | `.hero-venue`, `.hero-city` (`venue.city_region`) | |
| dört kutulu geri sayım | `.countdown` sade Italiana rakam + etiket | **sapma:** kutular CSS çerçeve olurdu (K21, §5.7) |
| lacivert RSVP hapı, ince altın kenar | `.hero-cta .btn` | arayüz hapı: lacivert degrade + 1 px altın iç kenar (katalog "buton") |
| alt gezinme (ayırıcı + aralıklı yazı) | `.site-nav .orn` (divider) + yazı | |
| ışınlar, köşe kümeleri, kadeh/parıltı | hero `.scene-bg` | küçük yelpaze hero'da yok (isim sütununa yakın) |
| — (comp yok) | davet kartı (`invitation_card` 3 dilim: tepede incili yelpaze tacı; host line, tam adlar, "request the pleasure of your company at their wedding", deco tarih bloğu, saat, mekân), "Kindly reply by" + RSVP, takvime ekle, iki altın kapı (`frame_portrait` + story_1 → Our Story; `frame_landscape` + mekân → The Day + programın ilk 4 satırı), "With love" + isimler + "Open the folder again" + `decor_br` | bu tasarımın parçaları ve tipografisi; 04/05'in panoları/düzeni kullanılmaz (simetrik, ortalanmış deco kapılar) |

### story ← W1.3 `web_3_story.png`
| W1 öğesi | Şablon | Not |
|---|---|---|
| "OUR STORY", "MOMENTS WE HOLD DEAR", ayırıcı | `h1.page-title`, `.page-head .kicker`, `.head-orn` | |
| — | `.lede` (story.intro + tarih) | standart zorunlu |
| üç basamaklı kemer çerçeve yan yana, ortadaki uzun | `.tiles .tile` (frame_portrait) | **sapma (docs/11 §9):** telefonda yan yana pencere ~25vw olurdu (< 38vw): merdiven gibi sol–orta–sağ, ortadaki en büyük; ≥ 900 px'te comp'un sırası |
| çapraz altın ışık süpürmesi | `[data-a="sweep"]::after` (kenarsız ışık bandı) | her kemerin girişinde |
| kemerlerin arasında inci dizileri | — | **sapma:** GPT parçası yok (K21: çizilmez); önerilen gpt-gorsel görevi aşağıda |
| başlıklar (deco) + küçük ayırıcı | `figcaption.deco` + `.cap-orn` | |
| ışınlar, köşe kümeleri, kadeh/parıltı/yelpaze | `.page-bg` ilk ekranda, `decor_br` sayfa sonunda | |

### details ← W1.4 `web_4_details.png`
| W1 öğesi | Şablon | Not |
|---|---|---|
| ışınlar, köşe kümeleri, sağ üst parçalar | `.page-bg` | |
| yatay "Order of the Day" kartı | `.day-card` (info_card 3 dilim) + `h1.card-title` | **sapma:** GPT info_card dikey (2:3); kart içerikle uzar (1–10 satır), başlık iki satır |
| saat / ETKİNLİK / yer üç sütun | `.sched-row` (saat \| etkinlik, yeri etkinliğin altında) | **sapma:** telefon kartında üç sütun sarardı; iki sütun |
| satır arası ayırıcı (incili çizgi) | `::before` GPT `divider` | 6+ satırda yalnız boşluk |
| — | `.page-kicker` gün · tarih | standart zorunlu başlık tarihi |
| mekân fotoğrafı basamaklı yatay çerçevede (köşelerde yelpaze + inci) | `.venue-photo` (frame_landscape + `venue`) | `cover` |
| "THE GRAND LUMIÈRE HOTEL", "CHICAGO, ILLINOIS" | `.venue-name`, `.venue-place` (+ adres, tören cümlesi) | yer `venue.city_region_country` |
| ayırıcı + "DRESS CODE · BLACK TIE" | `.dress` (`.dress-orn` + satır) | |
| — | takvime ekle, harita, Travel & Stay, Registry, SSS, RSVP | yalnız içerik/link varsa |

### rsvp ← W1.5 `web_5_rsvp.png`
| W1 öğesi | Şablon | Not |
|---|---|---|
| üstte ışınlar (köşe kümesi yok) | `.page-bg .rays` | |
| lacivert kart, çift altın çerçeve, köşe yelpazeleri | `.rsvp-card` (info_card 3 dilim) | |
| "WILL YOU JOIN US?" | `h1.card-title` | |
| "KINDLY REPLY BY", tarih | `.kicker`, `.deadline` | `data-if="rsvp.deadline"` |
| RSVP hapı, iki yanında küçük parıltı | `a.btn.btn-star[href="#reply"]` + iki `accent_3` | forma kaydırır |
| "WE CAN'T WAIT TO CELEBRATE WITH YOU", "With Love," + isimler | `.wait`, `.love`, `.sign` | uzun isimde sarar; ilk ekrana sığmazsa önce küçülür (`--sg` ≥ 0,72) |
| alt kenarda madalyon | `.sig-unit > .card-clasp` (closure) | `turn-in` girişiyle yerine döner; imza birimiyle birlikte katlanır |
| alt gezinme (uçlarda baklava) | `.site-nav` | ayırıcı GPT divider |
| — | yanıt formu, kapanış ("Thank you"; yanıttan sonra gizlenir) | platform sözleşmesi; masaüstünde de kartın altında (tek sütun) |

## Teşekkür hâli (G075)
Düğünden sonra aynı sayfalar `data-if="thank_you_on"` ile teşekkür hâline döner; yeni sayfa ve yeni görsel yok (K21):
- **Zarf:** açılış şovu aynen; üst satır "With love and thanks" (`ty_kicker`); kartta teşekkür başlığı (Italiana, bronz, dengeli
  sarar) + tarih; " · şehir" yok. Kart penceresinde teşekkür fotoğrafı; yoksa **lacivert kadife + altın ışınlar üstünde dosyanın
  madalyonu** — asla yer tutucu.
- **Home:** hero kartı zarfla aynı; isimler, tarih, mekân kalır; geri sayım ve RSVP hapı yok. Davet kartının yerine aynı
  `invitation_card` kâğıdında (3 dilim) teşekkür kartı: başlık, çiftin mesajı (`white-space: pre-line`), "With love,", isimler,
  tarih. Yanıt satırı ve takvime ekle yok; kapılarda Our Story ve The Day kalır (çift Details'i gizlerse The Day kapısı yok).
- **Details:** "The Day" olarak kalır; takvim, dress code, Travel & Stay, SSS ve RSVP linki yok; tören cümlesi geçmiş zaman.
  Çift gizlerse sayfa 404 ve hiçbir link yok.
- **RSVP:** kartta "Replies are closed" + teşekkür başlığı + Home hapı + imza birimi; form yok.
- **Nav:** Details etiketi "The Day" (`nav_day`), RSVP yok. Stiller `thank-you.css`'te (yalnız teşekkür modunda yüklenir).

## Düzenlenebilir metinler (G068) ve misafir adları (G069)
Görünür her sabit metin `data-copy` taşır (71 standart anahtar, `theme.json` → `copy`; `node scripts/copy-manifest.ts --theme
art-deco-black-tie --check` temiz). `max` değerleri `theme-check --stress` ile (her anahtar `max`'ta, 360/390, teşekkür hâli
dahil) doğrulandı: gezinme 6/6/7/5 (`nav_home`/`nav_story`/`nav_details`/`nav_rsvp`; 8 harfte satır 360 px'e sığmıyordu),
teşekkür hâlinde `nav_day` 8 (üç etiket); sayaç etiketleri 7 (`cd_*`). Ana sayfa kapanışındaki "With love" (`foot_kicker`) ile
kartlardaki "With love," (`love_line`) ayrı anahtar. Bilerek sabit: iç sayfaların `description` meta cümleleri, bölge
`aria-label`'ları, "Please turn on JavaScript…" (`data-copy-fixed`), platform mesajları (`[data-rsvp-message]`).
Formda "Number of guests"in hemen altında `<template data-rsvp-party>` (G069): formun kendi `.field` / `.kicker` / `.opt` stilinde.

## Bilinen sınırlar
- **Italiana yalnız `latin` alt kümesiyle gelir** (Google Fonts; `latin-ext` yok): Latin-1 aksanları (é, è, ü, ñ, ø, å) Italiana'da;
  `latin-ext` harfleri (ł, ś, č, ő, ğ, ş …) yedek aileye düşer — yedek **Josefin Sans** (yüklü, latin-ext var; `--deco: "Italiana",
  "Josefin Sans", …`), sistem serifi değil. Üçüncü bir aile eklenmedi (yalnız yedek glif için yüklenmeyen bir aile theme-check'te
  "font not loaded" uyarısı verirdi).
- Kapı katmanları kaynakta 326–349 px genişlikte (GPT tuvalinde dosya 652 px): masaüstünde DPR 2'de hafif büyütülür.
- Program en çok 10 satır (şema); Order of the Day kartı uzar (3 dilim). `story.items` 3'ten fazlaysa ilk 3 başlık; anların
  `text`'i gösterilmez. Monogram (`initials`) bu tasarımda kullanılmaz: madalyonun ortası inci (boş mühür değil).
- Kart penceresi (≈ 0,98:1) ve kemer penceresi (≈ 0,52:1) GPT oranında; panel kırpımı bu oranlara yapar.
- 360×640 ve 375×553'te story'nin ilk kemeri, rsvp imza birimi ilk ekranın altından başlar (sığmıyor; fold kuralı); yatay
  telefonlarda iç sayfaların ilk ekranı başlık + ilk satır(lar)la biter.
- Italiana'nın kıl inceliğindeki yatayları DPR 1 ekranda ~14 px altında kopuk görünebilir (kart satırı 360 px'te 11,6 px);
  DPR 2–3 telefonlarda temiz (DPR 3 ile bakıldı).
- `favicon.png` şeffaf; `apple-touch-icon` yazılmaz.
- Denenmedi: gerçek iPhone/Safari ve Android Chrome (`svh`, `mask`, `:has`, kesişen belge view transition, 3B `rotateY` +
  `backface-visibility`), Vercel yayını, gerçek alıcı fotoğrafları (farklı oran/ışık), yavaş ağ.
