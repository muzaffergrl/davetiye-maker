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
| `index.html` | kapalı zarf → dokun → limon bağı çözülüp yuvarlanır, kapak yukarı açılır (çini astar), kart yükselirken köşedeki limon dalı içeri sallanır ve bir çiçek süzülür, kart öne gelir → home (view transition) |
| `home.html` | hero (W1.2: kart + foto, isimler, gün · tarih, mekân, şehir/bölge/ülke, geri sayım, kobalt RSVP hapı), davet kartı (3 dilim, Didone yığılı tarih) + tek "Kindly reply by" satırı, takvime ekle, duvara gömülü iki çini pano (story_1 · mekân) → Our Story / The Day, kapanış (gök mavisi) |
| `story.html` | W1.3: başlık + alt başlık + giriş cümlesi, üç çini çerçeve basamaklı sütunda (sol, sağ, sol), dimdik, üst üste binmeden; her biri görünüme girerken pano gibi döner; köşelerinde küçük limon, duvarda yaprak/çiçek; başlık panonun altında |
| `details.html` | W1.4: Order of the Day kartı (info_card, 3 dilim; saat · ETKİNLİK · yer, satır aralarında GPT limon dalı), takvime ekle, mekân (GPT yatay çini çerçeve), dress code, harita / Travel & Stay / Registry (yalnız linkle), SSS |
| `rsvp.html` | W1.5: RSVP kartı (info_card, 3 dilim) + kartın alt kenarında limon bağı (closure), platform yanıt formu (G042 + G051 soruları), kapanış |
| `site.css` | palet token'ları, giriş ön ayarları (`sway-tl/br`, `turn-l/r`, `drop`, `set` bu tasarımın), foto alanı + maske, zarf katman yüzdeleri, kart 3 dilim, sayfa yerleşimleri |
| `site.js` | `MOTION` (açılış, sahneler, `accents`), `ENVELOPE_GEOMETRY`, uzun isim + home ilk ekranı (`fitNames`, `fold`), kart kopyası (`fitCopy`), geri sayım, zarf, `DEV_CONTENT` + `devRender` |
| `build_images.py` | GPT parçaları → `img/` (servis edilmez); `tools/tema_build.py` + bu tasarımın kesimleri |
| `img/` | WebP katmanlar, `wall` / `wall_wide` / `wash` zeminleri, `ph_*` yer tutucular, `mask_{card,portrait,landscape}.png`, `og-1200x630.jpg`, `favicon.png`, `manifest.json` (servis edilmez) |

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
- Kartlar: `free_zone` + 3 dilim (`slices`: davet kartı %38–90, info kartı %24–93). og: `web_hero` alt hizalı 1.91:1; favicon:
  closure. Tema klasörü ~2,0 MB (≤ 3 MB).

## Açılış ve koreografi (`site.js` `MOTION`)
- **Açılış** (katalog: "On tap, the lemon tie slips loose and rolls away, the white flap opens upward to reveal the blue-and-white
  tile liner, and the card rises while a lemon branch sways in from the top corner and a blossom drifts down."): dokununca limon
  bağı gevşer (ilk hareket 0 ms: kurdele bırakır, limon hafifçe kalkar), V'nin ucundan düşer ve sağa doğru **yuvarlanarak** gider
  (limonun merkezi etrafında 300° döner, zarfın sağ kenarından çıkarken söner; 1,3 s) → beyaz fisto kapak menteşesinde izleyiciye
  doğru kalkar (560 ms'de, 880 ms; 82°'den sonra söner), altında kapalı gövde açık gövdeye (çini astar + ön cep) geçer, çini astarlı
  açık kapak −90°'den dikilir (yukarı açılır) → kart cepten yükselir (1,8 s) ve **aynı anda** sol üst köşedeki limon dalı içeri
  sallanır (köşesi etrafında −2,5° → +5° → +2,5°, içeride kalır) ve tek bir limon çiçeği kartın yanındaki şeritten süzülür (accent_2
  × 1, `drift`, fotoğrafın üstünden asla; `go`dan önce söner) → kart olduğu yerde öne gelir (× 1,04, büyüyen gölge) ve view
  transition ile home kartına uçar. Dokun → home 4,12 s (Skip her an).
- **Story:** her çini pano kendi sahnesi: görünüme girince dış kenarı üzerinde (sol pano sol kenarında, sağ pano sağ kenarında)
  72°'den döner ve dimdik durur (`turn-l` / `turn-r`), sonra başlığı yazılır ve duvardaki yaprak/çiçek belirir. Telefonda pano 64vw,
  foto penceresi 64 × 0,605 = **38,7vw** (≥ 38vw); ≥ 720 px'te comp'un iki sütunlu basamaklı dizilişi. Yan kaydırma yok (dikey sütun),
  bu yüzden kaydırma ipucu gerekmez.
- **Parçacıklar:** açılış 1 limon çiçeği · home'a varış 2 çiçek hero fotoğrafının iki yanındaki şeritlerden (`avoid`) · RSVP kapanışı
  3 çiçek + 1 yaprak.
- **Boyalı kartlar** (davet, Order of the Day, RSVP): `set` girişi — kart duvara konur gibi kayar ve yerleşir, **hep opak** (metinleri
  sırayla girer). Not: theme-check'in "home first screen" akışı ilk ekranın altındaki sahneleri açmadan (revealAll yok) kart piksel
  testini yapıyor; opaklıkla giren bir kart o anda görünmez olduğundan test kartın değil sıvanın piksellerini ölçüyordu (sıva
  çatlakları → sahte "metin dekorun üstünde" hataları). `set` kartı her an görünür tutar; ölçüm gerçek kart üstünde yapılır.

## Home ilk ekranı (hero) ve yatay telefon
01'in çözülmüş adımları korunur: `fitNames` (isimler en çok %24 küçülür → `.is-tight` + isimler **36 px tabanı** → `.is-long`
(sayaç hapın altına) → hero kaydırılır), ardından `fold` (nav'ın altında yarım parça yok: sığmayan parça ilk ekranın altından
başlar). Kısa yatay (`min-aspect-ratio: 1/1` ve yükseklik ≤ 620 px) ızgara: kart solda, isimler · tarih · mekân · şehir · sayaç · hap
sağda. Kart ≥ 150 px her genişlikte; kart kopyası `fitCopy`: tarih · kasaba tek satır, sığmazsa iki satır, sonra kasaba, sonra
script düşer (yazı ≥ 11 px). Zarf sayfası: üst boşluk formülü sahnenin boş üst kısmının ekran üstüne taşmamasını sağlar
(844×390'da sahne üstü 4 px, ipucu 354–374/390).

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
| çini pencereli kart, "We're getting married", "JUNE 12, 2027 · SORRENTO" | `.hero-card` (card_small + `hero_portrait`) | dar kartta tarih ve kasaba iki satır (`fitCopy`) |
| isimler | `h1.names` | |
| "SATURDAY · JUNE 12, 2027" | `.hero-date` | |
| "Villa Limonaia" (italik), "Sorrento, Italy" (italik) | `.hero-venue`, `.hero-city` | `venue.city_region_country` (bölge de yazılır: "Sorrento, Campania, Italy") |
| dört kutulu geri sayım | `.countdown` sade Didone rakam + etiket | **sapma:** kutular CSS çerçeve olurdu (K21, §5.7) |
| kobalt RSVP hapı | `.hero-cta .btn` | arayüz hapı (emaye degrade) |
| alt gezinme (çizgi + ortada mavi çini çiçeği) | `.site-nav` (1 px çizgi + yazı) | **sapma:** ortadaki çini çiçeği için GPT parçası yok; çizilmez |
| köşe kümeleri, sağ alt küme hapın yanında | `decor_tl` / `decor_br` (hero `scene-bg`) | sağ alt küme telefonda küçük ve ekranın köşesinde (hapın yanında, metne binmez) |
| — (comp yok) | davet kartı (`invitation_card` 3 dilim, yığılı Didone tarih), "Kindly reply by" + RSVP, takvime ekle, iki çini pano (`frame_portrait` + story_1 → Our Story, `frame_landscape` + mekân → The Day), "With love" + isimler + "Open the envelope again" (gök mavisi `wash` + `decor_br`) | bu tasarımın parçaları; 01'in yelpaze üçlüsü / 03'ün tanıtımları kullanılmaz |

### story ← W1.3 `web_3_story.png`
| W1 öğesi | Şablon | Not |
|---|---|---|
| "Our Story", "MOMENTS WE HOLD DEAR" | `h1.page-title`, `.page-head .kicker` | |
| — | `.lede` (story.intro + tarih) | standart zorunlu |
| üç çini çerçeve, basamaklı (sol, sağ, sol), dimdik | `.tiles .tile` (frame_portrait), `.t-2` sağda | telefonda tek sütun basamaklı (64vw); ≥ 720 px comp'un iki sütunu |
| başlık çerçevenin içinde, alt boşlukta | `figcaption` panonun altında | **sapma:** GPT `frame_portrait`'in alt boşluğu yok (pencere çerçeveyi dolduruyor); başlık duvarda, panonun altında |
| köşelerde limon + çiçek demeti | `.sprig-tuck` (accent_1) | comp'taki demet yerine tek limon + yaprak (W2'de demet parçası yok) |
| duvarda yaprak / çiçek | `.wall-piece` (accent_3, accent_2) | |
| köşe kümeleri, gök mavisi alt | `decor_tl` başlıkta, `decor_br` + `wash` sayfa sonunda | |

### details ← W1.4 `web_4_details.png`
| W1 öğesi | Şablon | Not |
|---|---|---|
| "Order of the Day" kartı, üstte limon dalı | `.day-card` (info_card 3 dilim) + `h1.card-title` (tek satır) | kart içerikle uzar/kısalır (1–10 satır) |
| saat / ETKİNLİK / yer (italik), ortalı | `.sched-row` | |
| satır arası küçük limon dalı + iki yanında çizgi | `::before` GPT `divider` | **sapma:** dalın iki yanındaki çizgiler yok; 6+ satırda yalnız boşluk |
| — | `.page-kicker` gün · tarih | standart zorunlu başlık tarihi |
| mekân fotoğrafı yatay çini çerçevede (köşede limon) | `.venue-photo` (frame_landscape + `venue`) | pencere 1,86:1 (G205), `cover` |
| "Villa Limonaia", "Sorrento, Italy" | `.venue-name`, `.venue-place` (+ adres, tören cümlesi) | |
| "DRESS CODE · Summer formal" çizgiler arasında, üstte çini çiçeği | `.dress` | iki tek 1 px çizgi; çini çiçeği yok (parça yok) |
| — | takvime ekle, harita, Travel & Stay, Registry, SSS, RSVP | yalnız içerik/link varsa |

### rsvp ← W1.5 `web_5_rsvp.png`
| W1 öğesi | Şablon | Not |
|---|---|---|
| fisto kenarlı kart + üstte limon dalı | `.rsvp-card` (info_card 3 dilim) | |
| "Will You Join Us?" | `h1.card-title` (tek satır) | |
| "KINDLY REPLY BY", tarih | `.kicker`, `.deadline` | `data-if="rsvp.deadline"` |
| RSVP hapı | `a.btn[href="#reply"]` | forma kaydırır |
| iki kısa çizgi | `.hairs` (iki 1 px ayraç) | |
| "WE CAN'T WAIT TO CELEBRATE WITH YOU", "With love," + isimler | `.wait`, `.love`, `.sign` | uzun isimde sarar |
| alt kenarda limon bağı | `.card-tie` (closure) | `drop` girişiyle karta oturur |
| — | yanıt formu, kapanış ("Thank you"; yanıttan sonra gizlenir) | platform sözleşmesi |

## Bilinen sınırlar
- Program en çok 10 satır (şema); Order of the Day kartı uzar (3 dilim).
- Details tören cümlesi yalnız saati söyler ("The ceremony begins at 4:00 PM.").
- Genişlik sapmaları (docs/11 §5.1): `closure-320/640` (kart üstünde en çok ~170 px), `accent_1-174` (limon dik: 200 px yükseklik
  sınırında 174 px genişlik), `wall-540` / `wall_wide-640` / `wash-420` (bg_page'in kırpım genişliği; büyütülmez).
- `story.items` 3'ten fazlaysa ilk 3 başlık; anların `text`'i gösterilmez. Monogram (`initials`) bu tasarımda kullanılmaz: kapanış
  bir limon bağı (mühür değil, boş oval yok).
- `favicon.png` şeffaf; `apple-touch-icon` yazılmaz.
- Zarf sayfası isimleri (§12 zorlama kaydı, 40 harfli adlar) 01 gibi ölçeklenir (en çok 0,4×); home hero isimleri 36 px tabanında.
- Kontrast (oluşan sayfada metnin arkasındaki piksellerin medyanı ve en kötü %10'u; 390 px, 844×390, 1280 px): görünen her metin
  ≥ 4,5:1 (büyük el yazısı ≥ 3:1); hap düğmeler beyaz yazı / kobalt degrade 5,5–7,9:1.
- Denenmedi: gerçek iPhone/Safari ve Android Chrome (`svh`, `mask`, `:has`, kesişen belge view transition), Vercel yayını, gerçek
  alıcı fotoğrafları (farklı oran/ışık), yavaş ağ.
