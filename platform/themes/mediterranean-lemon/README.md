# Tema: mediterranean-lemon (tasarım 05 · Mediterranean Lemon, G405)

Güneşli bir sahil kasabası: güneş vuran beyaz sıva duvar, altta gök mavisine döner; sol üst ve sağ alt köşede limon dalları;
fisto (scalloped) kenarı kobalt mavisi boyalı beyaz zarf, içi mavi-beyaz çini astarlı; zarfın ucunda kobalt kurdeleyle
bağlanmış limon + yaprak + çiçek ("lemon tie"). Allura (isimler, başlıklar) + Playfair Display (Didone: aralıklı büyük harf
satırları, italik mekân). Kurallar `docs/11_TEMA_STANDARDI.md`; motor ve platform sözleşmesi `platform/README.md`. Yerleşim,
tipografi ve hiyerarşi bu tasarımın W1 comp'larından (`collections/05_Lemon_Mediterranean/assets/gpt/comps/web_1..5`, yalnız
sade adlar; `web_5_rsvp_v1/v2` denemedir); bütün görseller bu tasarımın GPT parçaları (K21). 01 (olive-ivory) ve 03
(blush-garden-rose) temalarından yalnız platform sözleşmesi ve çözülmüş sorunlar alındı (motor işaretleri, RSVP formu,
`#site-data`, slug'lı oturum anahtarları, `data-scene`/`data-step`/`data-a` kancaları, `fitNames` + `fold` ilk ekran adımları,
yatay telefon ızgarası, `devRender`); görünüş, aralıklar, süs konumları, zamanlama, kart oranları ve bölüm sırası bu tasarımın.

## Dosyalar
| Dosya | İş |
|---|---|
| `theme.json` | ad "Mediterranean Lemon", 5 sayfa, 5 foto alanı (oranlar = `img/manifest.json` `photo_slots.*.box_px`) |
| `content.demo.json` | `collections/05_Lemon_Mediterranean/content.demo.json`'ın birebir kopyası (`/start?theme=mediterranean-lemon` ve tema demosu; servis edilmez) |
| `index.html` | kapalı zarf → dokun → limon bağı gevşer, zarfın alt kenarına düşüp sağa yuvarlanarak ekrandan çıkar, kapak yukarı açılır (çini astar), kart yükselirken köşedeki limon dalı içeri sallanır ve bir çiçek astarın üstünden süzülür, kart öne gelir → home (view transition) |
| `home.html` | hero (W1.2: kart + foto, isimler, gün · tarih, mekân, şehir/bölge/ülke, geri sayım, kobalt RSVP hapı), davet kartı (3 dilim, Didone yığılı tarih) + tek "Kindly reply by" satırı, takvime ekle, duvara gömülü iki çini pano (story_1 · mekân) → Our Story / The Day (altında programın ilk 4 satırı), kapanış (gök mavisi) |
| `story.html` | W1.3: ilk ekran güneşli duvar (`.page-bg`: duvar kırpımı, iki köşe kümesi, serbest parçalar); başlık + alt başlık + giriş cümlesi, üç çini çerçeve basamaklı sütunda (sol, sağ, sol), dimdik, üst üste binmeden; her biri görünüme girerken pano gibi döner; dış alt köşede GPT `divider` buketi + çiçek, her panonun yanında duvarda iki parça; başlık panonun altında |
| `details.html` | W1.4: ilk ekran güneşli duvar (`.page-bg`); Order of the Day kartı (info_card, 3 dilim; saat · ETKİNLİK · yer, satır aralarında GPT limon dalı), takvime ekle, mekân (GPT yatay çini çerçeve), çini çiçekli çizgi + dress code, harita / Travel & Stay / Registry (yalnız linkle), SSS |
| `rsvp.html` | W1.5: ilk ekran güneşli duvar (`.page-bg`); RSVP kartı (info_card, 3 dilim) + kartın alt kenarında limon bağı (closure), platform yanıt formu (G042 + G051 soruları), kapanış |
| `site.css` | palet token'ları, giriş ön ayarları (`sway-tl/br`, `turn-l/r`, `drop`, `set` bu tasarımın), foto alanı + maske, zarf katman yüzdeleri, kart 3 dilim, sayfa yerleşimleri |
| `site.js` | `MOTION` (açılış, sahneler, `accents`), `ENVELOPE_GEOMETRY`, uzun isim + ilk ekranlar (`fitNames`, `fold`, `[data-fold]`, zarf sayfası `envFit`), dekor–metin (`decor`), kart kopyası (`fitCopy`), geri sayım, zarf, `DEV_CONTENT` + `devRender` |
| `build_images.py` | GPT parçaları → `img/` (servis edilmez); `tools/tema_build.py` + bu tasarımın kesimleri |
| `img/` | WebP katmanlar, `decor_*` 480/720/960, `tile_flower` (frame_portrait'in çini çiçeği), `wall` / `wall_wide` / `wash` zeminleri, `ph_*` yer tutucular, `mask_{card,portrait,landscape}.png`, `og-1200x630.jpg`, `favicon.png`, `manifest.json` (servis edilmez) |

## Foto alanları
| Anahtar | İçerik yolu | Oran (px) | Yer |
|---|---|---|---|
| `hero_portrait` | `media.hero_portrait` | 470/629 | card_small penceresi (index kartı = home hero kartı) |
| `story_1..3` | `media.memory_photos.0..2` | 528/738 | frame_portrait (story; `story_1` home panosunda da) |
| `venue` | `media.venue_image` | 946/508 | frame_landscape (details; home panosunda da) |

Foto çerçevenin **altında**, kutusu pencere + 2 px, maske `mask_<şekil>.png` (CSS `border-radius` yok). `object-position` portre
50% 38%, mekân 50% 55%. **Mekân penceresi ≈ 1,86:1** (G205 Sonuç: hedef 3:2 tutmadı): panel kırpımı bu orana yapılır, 3:2
mekân fotoğrafı `object-fit: cover` ile üstten/alttan ~%10 kırpılır — örnek `venue.jpg` ile kontrol edildi (`compare_details_390.jpg`:
villa, teras ve deniz pencerede). "Your photo here" yalnız önizlemede (`html[data-preview="true"]`); misafir nötr yer tutucuyu
(bg_page'in çiçeksiz, güneş gölgeli sıvasından bulanık + fildişine tonlanmış kırpım) görür. `build_images.py` her yer tutucunun
en koyu pikselini (≥ 175) ve sarı/yeşil fazlasını (≤ 24; limon parlak olduğu için yalnız gri denetimi onu kaçırıyordu) ölçer
(`manifest.ph_*.min_lum`, `max_warm`; aşarsa çıkış ≠ 0).

## Görseller (`python3 platform/themes/mediterranean-lemon/build_images.py [--prep-dir DIR] [--onizleme DIR]`)
- `tools/parts_prep.py` **geçici klasöre** (alfa kırpma, #00FF00 pencereleri + leke dolgusu, `windows.json`). G205'in açık kusuru
  (frame_portrait ve frame_landscape pencerelerinde yarı saydam koyu lekeler, alfa 30–253): `leke_doldur` pencereyi tam şeffaf yapar;
  `foto_alani` her WebP'de tam pencerede görünür piksel kalmadığını denetler (`manifest.checks.windows_transparent`: hepsi 0).
- **GPT kusurları temizliği (çizim yok):** dış hatta yarı saydam hâle (alfa < 12 sıfır + yeniden ölçek, çekirdekten uzak piksel
  silinir, kenar rengi komşu opak renge çekilir); pencere çevresi 3 px halkada kalan pembe/kırmızı ayrıştırma saçağı çerçeve
  renginden; yatay çerçevenin pencereye taşan limon dalı ucundaki kırmızımsı saçak komşu yaprak renginden (komşusu olmayan
  saçak silinir); WebP kenar saçağı için kaydetmeden önce şeffaf piksellere komşu renk taşınır (`renk_tasir`).
- **Yeşil denetimi (sapma, gerekçeli):** `tema_build.yesil_gorunur` (yeşil fazlası > 40) bu tasarımın canlı limon yapraklarını da
  "görünür #00FF00" sayıyor (kaynak decor_tl'de ~4700 piksel, ör. (82, 124, 46)). 01'in tek eşikli yeşil kırpması burada yaprakların
  ~%16'sını donuklaştırırdı. Yapı `kroma_yesil()` ile durur: parlak kroma yeşili (G ≥ 190 ve fazla ≥ 60; opak #00FF00 ≈ (5, 241, 1),
  beyaza karışmışı ≈ (184, 250, 184)) her WebP'de 0; tema_build sayıları `manifest.checks.green_check` altında açıkça yazılı.
- **Kapak kesimi** (`env_cflap`, `method: renk`): kapağın serbest kenarı ince kobalt fisto çizgisi. `kapak_kes("v")` en güçlü
  parlaklık düşüşünü (beyaz → mavi) bulur, yani çizginin **üstünden** keserdi (mavi çizgi gövdede kalırdı). Burada V doğruları her
  sütunun en alt mavi pikselinden (fisto diplerinden) aykırısız; kenar = V − 80 … V + 30 bandında en alt mavi satır + 2 px. Sert
  denetim: komşu sütun sıçraması ≤ 24 px (ölçülen 23,0 — fisto sivri birleşimleri), bulunamayan sütun ≤ %3 (1 sütun).
- **Ön cep** (`env_pocket`, trapez): iki çapraz yan kanat + düz üst kenarlı alt kanat. `cep_kes("v")` sivri V buluyordu (G035 yöntemi
  "uyum zayıf"). Noktalar = her sütunda çini astarın en alt renkli pikseli; çapraz doğrular noktaların **alt zarfından** (astarın
  beyaz çini zemininde yukarıda kalan noktalar atılır), düz kenar ortanın %90'lık değeri; köşelerde ve yuvarlak dirsekte doğrunun
  ≤ 6 px altındaki astar noktası kenarı indirir (`lowered_columns`). Kenarın > 3 px altında kalan astar noktası: 1.
- **Hiza** (`manifest.align` + `stage.align_fix`): `kit_check` geçiyor (sol −0,20 · sağ +0,49 · alt +0,85 %). Açık gövde kapalıdan
  ~%1 geniş, ~%3 uzundu; açık katmanlar ölçülen ölçek (× 0,9933, × 0,9686) + ötelemeyle kapalının sol/sağ kenarına, menteşesine ve
  alt kenarına oturtuldu (sonrası: sol −1 px, sağ 0, alt 0) → 90°'de kapak aynı menteşe çizgisinde el değiştirir.
- **Kapanış** (`closure.png` = limon + iki yaprak + çiçek dalı + kurdele, tek parça; kapakla **taşınmaz**): yeri kesim geometrisine
  bağlı — çapa = fisto V'sinin ucu (V doğrularının kesişimi); W1.1'de ölçülen limon yüksekliği / zarf genişliği (0,192) ve limon
  merkezinin uca göre kayması (−0,067 × zarf genişliği). `previews/g405/compare_closure.jpg`: tema | comp.
- Zeminler: telefon `wall` = bg_page'in iki çiçeksiz kırpımı (üst güneşli sıva x 460–1000 y 210–700, alt beyazdan maviye x 100–640
  y 700–1290) 110 px yumuşak geçişle; geniş ekran `wall_wide` (x 60–700, y 820–1290); uzun sayfaların sonu `wash` (gök mavisi sıva,
  ≥ 768 px'te `wall_wide`) üstten maskeyle beliren. Limon kümeleri hep ayrı katman (`decor_tl` / `decor_br`), düz çizgiyle kesilmez.
- **Çini çiçeği** (`tile_flower-73.webp`; W1.2 gezinme ortası, W1.4 dress code üstü): `frame_portrait`'in üst sırasındaki ortadaki
  çiçek karosundan (kaynak x 466–564, y 284–368) yalnız çiçek — karo zemini doygunlukla anahtarlanır (kobalt + sarı göbek kalır, krem
  zemin ve gölge düşer), merkeze yakın bileşenler (8 yaprak + göbek) tutulur, köşe noktaları ve karo kenarı atılır; yaprak
  parlaklıkları (iç delikler) dolu, kenar rengi çiçeğin kendi rengi. Kırpım + anahtarlama; çizim yok (K21).
- **Köşe kümeleri** `decor_tl/br` 480/720/960: 390 px telefonda DPR 3'te `sizes` ≈ 200–250 px → 720 seçilir (114 / 121 KB; 960'lar
  177 / 187 KB idi, docs/11 §6'daki 150 KB gerekçe sınırının üstü). Kümelerin 16 × 16 yaprak haritası (alfa) `site.js` `MAP`'te.
- **Kart cepte** (`stage.parts.card` üst %60,755; `card_path` −97,838 / −94,838 %): fotoğraf penceresinin en çok %6'sı cebin düz
  kenarının üstünde (`CARD_PHOTO_ABOVE`, `manifest.stage.card_path.photo_above_pocket`); önceki %54 duruşta fotoğrafın üst ~%26'sı
  görünüyor, yüzler 1 s cep kenarıyla kesiliyordu (G405 incelemesi). `out`/`front` konumları değişmedi.
- Kartlar: `free_zone` + 3 dilim (`slices`: davet kartı %38–90, info kartı %24–93). og: `web_hero` alt hizalı 1.91:1; favicon:
  closure. Tema klasörü ~2,0 MB (≤ 3 MB).

## Açılış ve koreografi (`site.js` `MOTION`)
- **Açılış** (katalog: "On tap, the lemon tie slips loose and rolls away, the white flap opens upward to reveal the blue-and-white
  tile liner, and the card rises while a lemon branch sways in from the top corner and a blossom drifts down."): dokununca limon
  bağı **gevşer** (0–350 ms: kurdele bırakır, bağ %5 aşağı kayar, ≤ 7°), zarfın **alt kenarına düşer** (body_bottom_pct; küçük
  sıçrama yok, yerleşir), sağa **yuvarlanır** — dönüş = yol / limon yarıçapı (limon = zarf genişliğinin 0,192'si; 140° = 2,44 rad ×
  yarıçap), zarfın üstünde ≤ 150° — ve hızlanarak ekranın sağ kenarından çıkar (1,4 s; zarfın üstünde **sönmez**). Kapak bağ
  kapaktan çekildikten sonra (680 ms) menteşesinde izleyiciye doğru kalkar (860 ms; 82°'den sonra söner), altında kapalı gövde açık
  gövdeye (çini astar + ön cep) geçer, çini astarlı açık kapak −90°'den dikilir (1,52 s) → kart cepten yükselir (1,8 s; cepte beklerken
  yalnız çini başlığı ve fotoğrafın ≤ %6'sı görünür) ve **aynı anda** sol üst köşedeki limon dalı içeri sallanır (−2,5° → +5° → +2,5°,
  içeride kalır) ve tek bir limon çiçeği (accent_2 × 1, 46–54 px ama sahne genişliğinin en çok %16'sı, `origin: 'liner'`) kartın
  sağındaki şeritte, kobalt çini astarın üstünden süzülür: şerit kartın sağ kenarının %3 içinden (kartın beyaz kenarı; fotoğraf
  penceresi kenardan %11 içeride biter) zarfın sağ kenarına kadar, her boyutta sahnenin en az %8'i (QA 2026-10-14: eski şerit kart
  kenarından başlıyordu ve telefonların çoğunda 0–8 px kalıyordu, çiçek hiç doğmuyordu); yol sahne yüksekliğinin %27'sinden %52'sine
  (merkez %33 → %58: kapağın kenarından astara iner), merkezi 0,65–1,25 s mavi astarın üstünde (13 boyut × 10 deneme, hepsinde
  doğdu, hiçbirinde fotoğraf penceresine girmedi) → kart olduğu yerde öne gelir (× 1,04,
  büyüyen gölge) ve view transition ile home kartına uçar. Dokun → home 4,12 s (Skip her an).
- **Story:** her çini pano kendi sahnesi: görünüme girince dış kenarı üzerinde (sol pano sol kenarında, sağ pano sağ kenarında)
  72°'den döner ve dimdik durur (`turn-l` / `turn-r`), sonra başlığı yazılır ve duvardaki iki parça (yaprak + çiçek, panonun boş
  yanında) belirir. Dış alt köşede W1.3'ün buketi: GPT `divider` (limon + çiçekler + yapraklar) çerçeve genişliğinin %58'i, ±26°,
  köşenin üstünden geçer + bir accent_2 çiçeği; foto penceresine değmez. Telefonda pano 64vw, foto penceresi 64 × 0,605 = **38,7vw**
  (≥ 38vw); ≥ 720 px'te comp'un iki sütunlu basamaklı dizilişi (orta pano `align-self: start` + kenar boşluğuyla aşağıda, böylece
  fold itişi onu tam taşır). **Masaüstü** (≥ 1024 px, yatay, ≥ 621 px yükseklik): üç pano tek basamaklı sırada (yüksek, alçak,
  yüksek) başlığın altında; `site.js` `tiles` panoları (≥ 190 px) sıra nav'ın üstünde bitene kadar küçültür (QA 2026-10-14: iki
  sütunda üç pano da ilk ekranın altına itiliyordu, 1280×800'de ekranın %46'sı boş duvardı). Nav çizgisini kesecek pano ilk ekranın
  altından başlar (`data-fold`).
  Yan kaydırma yok (dikey sütun), bu yüzden kaydırma ipucu gerekmez. Dış köşe buketleri ekran kenarından taşar; `.tiles` (tam
  genişlik) yalnız yatayda kırpar (`overflow-x: clip`), yani buketi yalnız ekran kenarı keser.
- **Parçacıklar** (`MOTION.accents`): açılış 1 çiçek (yukarıda) · home'a varış 2 çiçek · RSVP kapanışı 3 çiçek + 1 yaprak. Varış ve
  kapanışta katman **bölümün içinde ve metnin arkasında** (`host`, `.accent-layer.in-host` z-index 0: hero'da duvarın üstü, yazı
  sütununun altı); yollar yazı sütununun (ve fotoğrafın) yanındaki şeritlerden (`avoid`), şerit yoksa yazının altındaki banttan;
  kapanışınki yalnız `.closing` kutusunda, forma hiç uzanmaz (G405 incelemesi: isimlerin, kapanış satırının ve form alanlarının
  üstünden geçiyordu).
- **Boyalı kartlar** (davet, Order of the Day, RSVP): `set` girişi — kart duvara konur gibi kayar ve yerleşir, **hep opak** (metinleri
  sırayla girer). Not: theme-check'in "home first screen" akışı ilk ekranın altındaki sahneleri açmadan (revealAll yok) kart piksel
  testini yapıyor; opaklıkla giren bir kart o anda görünmez olduğundan test kartın değil sıvanın piksellerini ölçüyordu (sıva
  çatlakları → sahte "metin dekorun üstünde" hataları). `set` kartı her an görünür tutar; ölçüm gerçek kart üstünde yapılır.
- Süreler (docs/11 §8): her sahnenin son adımı ≤ 3000 ms (`home-invite` `cal` 2860), tek giriş 600–1800 ms (`sway-*` 1800).

## İlk ekranlar ve yatay telefon
01'in çözülmüş adımları korunur: `fitNames` (isimler en çok %24 küçülür → `.is-tight` + isimler **36 px tabanı** → `.is-long`
(sayaç hapın altına) → hero kaydırılır), ardından `fold` (nav'ın altında yarım parça yok: sığmayan parça ilk ekranın altından
başlar). Kısa yatay (`min-aspect-ratio: 1/1` ve yükseklik ≤ 620 px) ızgara: kart solda, isimler · tarih · mekân · şehir · sayaç ·
hap sağda. Kart ≥ 150 px her genişlikte (≥ 1024 px ve ≥ 621 px yükseklikte `47svh × .709`, en çok 290 px);
kart kopyası `fitCopy`: tarih · kasaba tek satır, sığmazsa iki satır, sonra kasaba, sonra script düşer (yazı ≥ 11 px); kasaba boşsa
"·" ayırıcı da gizlenir.

**İç sayfalar** (`folds`, QA 2026-10-14): aynı kural birim birim — her ilk ekran öğesi ya nav'ın üstünde biter ya da ilk ekranın
tamamen altında başlar. Birimler `[data-fold]`: details'te kart başlığı, her program satırı, takvim çifti, mekân fotoğrafı; rsvp'de
başlık, "Kindly reply by" + tarih, hap, iki çizgi + bekleme satırı, "With love," + isimler + limon bağı (bağ imza biriminin içinde,
birlikte taşınır), form başlığı ve her form satırı; story'de alt başlık, giriş cümlesi ve panolar. Nav çizgisini kesen **ilk**
birim için ilk bölüm en çok 40 px (üst boşluğun %34'ü) yukarı alınır (`.page-bg`'den sonraki öğeye negatif kenar boşluğu); bu
yetmiyorsa birim ilk ekranın 6 px altından başlar (kart 3 dilimle uzar, ilk ekranda kartın boş kâğıdı nav'ın altına iner). Kısa
yatayda kartlar daralır ki kart başlığı nav'ın üstünde bitsin (details `(100svh − 162px) × 1,98`, rsvp `(100svh − 128px) × 1,97`);
sonraki satırlar ilk ekranın altından başlar (önceki "yatayda üst boşluk 52 px — kart başlığı nav'ın üstünde biter" iddiası
568×320 ve 740×360'ta doğru değildi). Masaüstünde (≥ 1024 px) RSVP **tek sütun**: kart (`(100svh − 232px) × .58`, en çok 440 px)
ve bağı ilk ekranda, form altında — yan yana form satırları her ekranda nav'ın altından geçiyordu.

**Zarf sayfası** (`envFit`): sahnenin boş üstü (`.63776 × --w`) ölçülen başlığın altına girer (`--pt`); "Tap to open" ilk ekranda
bitmiyorsa sahne küçülür (`--ok`, en az 0,6). Yatayda isim sütunu köşe kümelerinin arasında (`min(100% − 2 × min(10vw, 17svh), 560px)`).
Ölçüm (demo / aralık / zorlama kaydı): 390×844, 360×640, 375×553, 320×568, 568×320, 667×375, 740×360, 844×390, 932×430'da sahne üstü
≥ 0 ve ipucu ekranda (ör. 932×430 aralık: ipucu 410/430; 568×320 zorlama: 311/320); `&` en az 11 px.

**Gezinme:** etiket satırı opak (`rgba(…, .96–.97)` + `backdrop-filter: blur(8px)`), üst kenar 12 px'te yumuşak belirir; ortasında
W1.2'nin çini çiçeği (GPT kırpımı) bir 1 px çizginin üstünde. Sayfalar arası geçişte nav bütün gelir
(`::view-transition-new(site-nav):only-child { animation: none }`, G064 dersi).
Yumuşak kaydırma yalnız RSVP sayfasındaki `#reply` atlaması için (`html:has(#reply)`, azaltılmış harekette kapalı); sayfa
geneli `scroll-behavior: smooth` betikle yapılan her kaydırmayı da yavaşlatıyordu (theme-check'in taslak önizlemesinde yapışkan
"Preview" şeridi kaydırma bitmeden çekilen kart görüntüsüne düşüyordu).

## Dekor ve metin (`site.js` `decor`)
- Köşe kümeleri **hep bütün** GPT parçası; yalnız ekran kenarı keser (ekran içinde hiçbir maske/`overflow` kesimi yok). Hero'nun sağ alt kümesi
  hero'nun içinde ve ilk ekranda nav'ın üstünde biter (`bottom` = max(22 px, hero sonu − ilk ekran + nav + 2)); uzun sayfaların son
  bölümündeki küme kaydırma sonunda nav'ın üstünde (`bottom: var(--below)`).
- İç sayfaların ilk ekranı W1.3–W1.5'in güneşli duvarı: `.page-bg` (100svh) = `wall` / `wall_wide` (alt %26'sı maskeyle söner) +
  `decor_tl` + `decor_br` (ilk ekranda nav'ın üstünde biter) + 3 serbest parça; kartlar/çerçeveler kümelerin önünde (comp'taki gibi).
- Duvardaki hiçbir yazı bir kümenin yaprağı üstünde durmaz: `decor` her kümenin 16 × 16 yaprak haritasını (WebP alfasından,
  `MAP`) yazı kutularıyla karşılaştırır; çakışırsa küme %6 adımlarla küçülür (en çok %45), yine çakışırsa gizlenir. Yazıya, karta,
  çerçeveye değen serbest parça (`.float`) gizlenir. Ölçüm: yazı gizli / dekor gizli iki görüntü farkı (yazı satırlarının altında
  dekor pikseli) — 5 sayfa × 11 görünüm (390×844, 360×640, 375×553, 375×667, 320×568, 844×390, 568×320, 667×375, 740×360, 932×430,
  1280×800) × demo / tasarım aralığı / zorlama kaydı = 165 ilk ekran, hepsi temiz.
- 320 px'te geri sayım satırı daralır (aralık 12 px, etiket harf aralığı .14em) — "SECONDS" artık yaprağa binmiyor.

## Comp öğe haritası (docs/11 §8)

### index ← W1.1 `web_1_envelope.png`
| W1 öğesi | Şablon | Not |
|---|---|---|
| güneşli beyaz sıva, altta gök mavisi, sağda yaprak gölgeleri | `.scene-bg` `wall` (telefon) / `wall_wide` (geniş) | bg_page 2:3 telefonda kümeleri keserdi: zemin çiçeksiz kırpımlardan |
| limon dalları sol üst, sağ alt | `decor_tl` / `decor_br` ayrı katman | ekranda bütün; kenarda ekran dışına taşar (comp gibi) |
| "YOU ARE INVITED" | `.env-head .kicker` | |
| isimler (Allura) | `h1.names` (+ `.amp` italik Playfair) | uzun isimde `site.js` küçültür |
| beyaz zarf, kobalt fisto V kapak | `.env-closed` + `.env-cflap` | |
| limon bağı V'nin ucunda | `.closure` (kapaktan ayrı) | ölçü ve yer comp'tan (manifest.closure) |
| "TAP TO OPEN" | `.env-hint` | |
| duvarda yaprak / çiçekler | `.float` (accent_3, accent_2) | telefonda; yavaş "nefes" |
| — | `a.skip`, "Enter / Replay the opening" | platform gereği |

### home ← W1.2 `web_2_home.png`
| W1 öğesi | Şablon | Not |
|---|---|---|
| çini pencereli kart, "We're getting married", "JUNE 12, 2027 · SORRENTO" | `.hero-card` (card_small + `hero_portrait`) | dar kartta tarih ve kasaba iki satır (`fitCopy`); kasaba = `venue.city` (W1.2 yalnız kasabayı yazar; docs/11 §3.2 kart kopyası için `venue.city_region` der — **sapma**, comp'a uyuldu; kasaba boşsa ayırıcı da gizli) |
| isimler | `h1.names` | |
| "SATURDAY · JUNE 12, 2027" | `.hero-date` | |
| "Villa Limonaia" (italik), "Sorrento, Italy" (italik) | `.hero-venue`, `.hero-city` | `venue.city_region_country` (bölge de yazılır: "Sorrento, Campania, Italy") |
| dört kutulu geri sayım | `.countdown` sade Didone rakam + etiket | **sapma:** kutular CSS çerçeve olurdu (K21, §5.7) |
| kobalt RSVP hapı | `.hero-cta .btn` | arayüz hapı: koyu kobalt emaye degrade (#2A5DA8 → #1C3F80), dar gölge |
| alt gezinme (çizgi + ortada mavi çini çiçeği) | `.site-nav .orn` (iki 1 px çizgi + `tile_flower`) + yazı | çiçek `frame_portrait`'in çini karosundan kırpım (K21) |
| köşe kümeleri, sağ alt küme hapın yanında | `decor_tl` / `decor_br` (hero `scene-bg`) | sağ alt küme 58vw (comp ≈ %45 genişlik), sağ kenardan taşar, hero'nun içinde bütün, nav'ın üstünde biter; yazıya değecekse küçülür |
| — (comp yok) | davet kartı (`invitation_card` 3 dilim, yığılı Didone tarih), "Kindly reply by" + RSVP, takvime ekle, iki çini pano (`frame_portrait` + story_1 → Our Story, `frame_landscape` + mekân → The Day + programın ilk 4 satırı, docs/11 §3.2), "With love" + isimler + "Open the envelope again" (gök mavisi `wash` + `decor_br`) | bu tasarımın parçaları; 01'in yelpaze üçlüsü / 03'ün tanıtımları kullanılmaz |

### story ← W1.3 `web_3_story.png`
| W1 öğesi | Şablon | Not |
|---|---|---|
| "Our Story", "MOMENTS WE HOLD DEAR" | `h1.page-title`, `.page-head .kicker` | |
| — | `.lede` (story.intro + tarih) | standart zorunlu |
| üç çini çerçeve, basamaklı (sol, sağ, sol), dimdik | `.tiles .tile` (frame_portrait), `.t-2` sağda | telefonda tek sütun basamaklı (64vw); ≥ 720 px comp'un iki sütunu; **sapma:** ≥ 1024 px yatay masaüstünde tek basamaklı sıra (yüksek, alçak, yüksek), üç pano ilk ekranda |
| başlık çerçevenin içinde, alt boşlukta | `figcaption` panonun altında | **sapma:** GPT `frame_portrait`'in alt boşluğu yok (pencere çerçeveyi dolduruyor); başlık duvarda, panonun altında |
| köşelerde limon + çiçek demeti | `.sprig-tuck` (GPT `divider`: limon + çiçekler + yapraklar) + `.tuck-bloom` (accent_2) | demet parçası yok; `divider` aynı demet, dış alt köşede ±26° |
| duvarda yaprak / çiçek | `.wall-piece` (accent_3 + accent_2, panonun boş yanında ikişer) | |
| güneşli sıva, yaprak gölgeleri, sol alttan gök mavisi; köşe kümeleri | `.page-bg` (`wall` + `decor_tl` + `decor_br` + serbest parçalar) ilk ekranda; `decor_br` + `wash` sayfa sonunda | |

### details ← W1.4 `web_4_details.png`
| W1 öğesi | Şablon | Not |
|---|---|---|
| güneşli duvar, köşe kümeleri, serbest parçalar | `.page-bg` | kart ve çerçeve kümenin önünde (comp'taki gibi) |
| "Order of the Day" kartı, üstte limon dalı | `.day-card` (info_card 3 dilim) + `h1.card-title` (tek satır) | kart içerikle uzar/kısalır (1–10 satır) |
| saat / ETKİNLİK / yer (italik), ortalı | `.sched-row` | |
| satır arası küçük limon dalı + iki yanında çizgi | `::before` GPT `divider` | **sapma:** dalın iki yanındaki çizgiler yok; 6+ satırda yalnız boşluk |
| — | `.page-kicker` gün · tarih | standart zorunlu başlık tarihi |
| mekân fotoğrafı yatay çini çerçevede (köşede limon) | `.venue-photo` (frame_landscape + `venue`) | pencere 1,86:1 (G205), `cover` |
| "Villa Limonaia", "Sorrento, Italy" | `.venue-name`, `.venue-place` (+ adres, tören cümlesi) | |
| "DRESS CODE · Summer formal", üstte çizgi + çini çiçeği | `.dress` (`.orn` + satır) | çiçek `tile_flower` (frame_portrait kırpımı) |
| — | takvime ekle, harita, Travel & Stay, Registry, SSS, RSVP | yalnız içerik/link varsa |

### rsvp ← W1.5 `web_5_rsvp.png`
| W1 öğesi | Şablon | Not |
|---|---|---|
| güneşli duvar, köşe kümeleri, serbest parçalar | `.page-bg` | kart kümenin önünde (comp'taki gibi) |
| fisto kenarlı kart + üstte limon dalı | `.rsvp-card` (info_card 3 dilim) | |
| "Will You Join Us?" | `h1.card-title` (tek satır) | |
| "KINDLY REPLY BY", tarih | `.kicker`, `.deadline` | `data-if="rsvp.deadline"` |
| RSVP hapı | `a.btn[href="#reply"]` | forma kaydırır |
| iki kısa çizgi | `.hairs` (iki 1 px ayraç) | |
| "WE CAN'T WAIT TO CELEBRATE WITH YOU", "With love," + isimler | `.wait`, `.love`, `.sign` | uzun isimde sarar |
| alt kenarda limon bağı | `.sig-unit > .card-tie` (closure) | `drop` girişiyle karta oturur; imza birimiyle birlikte katlanır |
| — | yanıt formu, kapanış ("Thank you"; yanıttan sonra gizlenir) | platform sözleşmesi; masaüstünde de kartın altında (tek sütun) |

## Bilinen sınırlar
- Program en çok 10 satır (şema); Order of the Day kartı uzar (3 dilim).
- Details tören cümlesi yalnız saati söyler ("The ceremony begins at 4:00 PM.").
- Genişlik sapmaları (docs/11 §5.1): `closure-320/640` (kart üstünde en çok ~170 px), `accent_1-174` (limon dik: 200 px yükseklik
  sınırında 174 px genişlik), `wall-540` / `wall_wide-640` / `wash-420` (bg_page'in kırpım genişliği; büyütülmez).
- `story.items` 3'ten fazlaysa ilk 3 başlık; anların `text`'i gösterilmez. Monogram (`initials`) bu tasarımda kullanılmaz: kapanış
  bir limon bağı (mühür değil, boş oval yok).
- `favicon.png` şeffaf; `apple-touch-icon` yazılmaz.
- Zarf sayfası isimleri (§12 zorlama kaydı, 40 harfli adlar) 01 gibi ölçeklenir (en çok 0,4×); home hero isimleri 36 px tabanında.
- Boyut (docs/11 §6, KiB okuması; test `≤ 35 × 1024` / `≤ 45 × 1024`): `site.js` 35 804 B (34,96 KiB; IIFE gövdesi bir girinti
  sola alındı, yorumlar kısaltıldı), `site.css` 46 039 B (44,96 KiB; aynı "tam doldur" kuralları birleştirildi). İkisinde de pay
  ≤ 41 B: sonraki eklemeden önce sıkıştırma gerekir.
- Kontrast (oluşan sayfada metnin arkasındaki piksellerin medyanı ve en kötü %10'u; 390 px, 844×390, 1280 px): görünen her metin
  ≥ 4,5:1 (büyük el yazısı ≥ 3:1); hap düğmeler beyaz yazı / kobalt degrade 5,5–7,9:1.
- Denenmedi: gerçek iPhone/Safari ve Android Chrome (`svh`, `mask`, `:has`, kesişen belge view transition), Vercel yayını, gerçek
  alıcı fotoğrafları (farklı oran/ışık), yavaş ağ.
