# Tema: winter-evergreen (tasarım 08 · Winter Evergreen, G408)

Karlı bir dağ köşkü: soluk gri-yeşil karlı sis, kar tanesi bokehi; sol üst ve sağ alt köşede suluboya çam, köknar, mavi
meyveli ardıç, kırmızı kış meyveleri ve kozalak kümeleri; sağda süzülen bir kar tanesi, bir kozalak ve bir meyve dalı. Orman
yeşili dokulu zarf, V kapağı karlı beyaz yırtık (deckle) kenarlı; kapağın ucunda kırmızı kadife fiyonkla bağlı çam + sedir dalı
ve üç kırmızı meyve ("pine-and-berry bundle"). Parisienne (isimler, başlıklar) + Libre Baskerville (aralıklı büyük harf
satırları, italik mekân). Kurallar `docs/11_TEMA_STANDARDI.md`; motor ve platform sözleşmesi `platform/README.md`. Yerleşim,
tipografi ve hiyerarşi bu tasarımın W1 comp'larından (`collections/08_Winter_Evergreen/assets/gpt/comps/web_1..5`, yalnız
sade adlar; `_v1/_v2` denemedir); bütün görseller bu tasarımın GPT parçaları (K21). 05 (mediterranean-lemon) ve 04
(vintage-airmail) temalarından yalnız platform sözleşmesi ve çözülmüş ilk ekran sorunları alındı (motor işaretleri, RSVP formu,
`#site-data`, slug'lı oturum anahtarları, `data-scene`/`data-step`/`data-a` kancaları, `fitNames` + `fold` + `folds`, yatay
telefon ızgarası, `devRender`); görünüş, aralıklar, süs konumları, zamanlama, kart oranları ve bölüm sırası bu tasarımın.

## Dosyalar
| Dosya | İş |
|---|---|
| `theme.json` | ad "Winter Evergreen", 5 sayfa, 5 foto alanı (oranlar = `img/manifest.json` `photo_slots.*.box_px`), 71 copy anahtarı |
| `content.demo.json` | `collections/08_Winter_Evergreen/content.demo.json`'ın birebir kopyası (`/start?theme=winter-evergreen` ve tema demosu; servis edilmez) |
| `index.html` | kapalı zarf → dokun → kar yağmaya başlar, demet gevşeyip zarfın önünden aşağı kayarak ekrandan çıkar, yeşil kapak yukarı açılır (karlı astar), kart yükselirken kar taneleri ekranın bir yanından öbürüne süzülür, kart öne gelir → home (view transition) |
| `home.html` | hero (W1.2: kart + foto, isimler, gün · tarih, mekân, şehir/bölge, geri sayım, orman yeşili RSVP hapı, hapın altında çam dalı + iki ince çizgi), davet kartı (3 dilim; AY \| gün \| YIL), tek "Kindly reply by" satırı, takvime ekle, iki köşk penceresi (story_1 buğulu camın ardında → Our Story · mekân → The Day + programın ilk 4 satırı), kapanış (kar yığını + sağ alt küme) |
| `story.html` | W1.3: ilk ekran karlı sis (`.page-bg`: sis kırpımı, iki köşe kümesi, üç süzülen parça); başlık + alt başlık + dal/çizgiler + giriş cümlesi; üç beyaz boyalı ahşap pencere, her birinin camı buğulu (GPT `frost_overlay`) ve görünüme girince buğu ortadan dışa silinir, köşelerde kırağı kalır; pencereler arasında meyve dalı; telefonda alt alta, ≥ 720 px comp'un sırası |
| `details.html` | W1.4: ilk ekran karlı sis; Order of the Day kartı (info_card, 3 dilim; saat · ETKİNLİK · yer, satır aralarında GPT çam dalı + iki ince çizgi), takvime ekle, mekân (GPT yatay pencere), dal + dress code, harita / Travel & Stay / Registry (yalnız linkle), SSS |
| `rsvp.html` | W1.5: ilk ekran karlı sis; RSVP kartı (info_card, 3 dilim): başlık, son tarih, hap, **zarfın demeti kartın ortasında**, bekleme satırı, dal + "With love," + isimler; platform yanıt formu (G042 + G051 soruları + G069 misafir adları), kapanış |
| `site.css` | palet token'ları, giriş ön ayarları (`sway-tl/br`, `drop`, `set`, **`wipe`** bu tasarımın), foto alanı + maske + buğu katmanı, zarf katman yüzdeleri, kart 3 dilim, sayfa yerleşimleri |
| `thank-you.css` | teşekkür hâli (yalnız düğünden sonra yüklenir) |
| `site.js` | `MOTION` (açılış, sahneler, `accents`), `ENVELOPE_GEOMETRY`, uzun isim + ilk ekranlar (`fitNames`, `fold`, `folds`, `row`, zarf sayfası `envFit`), dekor–metin (`decor`), kart kopyası (`fitCopy`), geri sayım, zarf, `DEV_CONTENT` + `devRender` |
| `build_images.py` | GPT parçaları → `img/` (servis edilmez); `tools/tema_build.py` + bu tasarımın kesimleri |
| `img/` | WebP katmanlar, `decor_*` 360/540/720, `frost_overlay` 320/640, `snow` / `snow_wide` / `snow_foot` zeminleri, `ph_*` yer tutucular, `mask_{card,portrait,landscape}.png`, `og-1200x630.jpg`, `favicon.png`, `manifest.json` (servis edilmez) |

## Foto alanları
| Anahtar | İçerik yolu | Oran (px) | Yer |
|---|---|---|---|
| `hero_portrait` | `media.hero_portrait` | 420/440 | card_small penceresi (index kartı = home hero kartı) |
| `story_1..3` | `media.memory_photos.0..2` | 557/730 | frame_portrait (story; `story_1` home penceresinde de) |
| `venue` | `media.venue_image` | 1052/553 | frame_landscape (details; home penceresinde de) |

Foto çerçevenin **altında**, kutusu pencere + 2 px, maske `mask_<şekil>.png` (CSS `border-radius` yok). `object-position` portre
50% 38%, mekân 50% 58%. **Mekân penceresi ≈ 1,90:1** (GPT `frame_landscape` 3:2 tutmadı): panel kırpımı bu orana yapılır, 3:2
mekân fotoğrafı `cover` ile üstten/alttan ~%11 kırpılır. Story fotoğraflarının üstünde (çerçevenin altında) buğu katmanı durur:
sonunda ortası açık, kenar ve köşelerde yarı saydam kırağı kalır — yüzler ortada olduğu sürece görünür (`object-position` 50% 38%).
"Your photo here" yalnız önizlemede; misafir nötr yer tutucuyu (bg_page'in kümesiz karlı sisinden bulanık + fildişine tonlanmış
kırpım) görür. `build_images.py` her yer tutucunun en koyu pikselini (≥ 175) ve doygunluğunu (≤ 26) ölçer (`manifest.ph_*`).

## Görseller (`python3 platform/themes/winter-evergreen/build_images.py [--prep-dir DIR] [--onizleme DIR]`)
- `tools/parts_prep.py` **geçici klasöre**. G208'in açık kusuru (yatay çerçeve penceresinde koyu leke): `leke_doldur` pencereyi tam
  şeffaf yapar (`manifest.frame_landscape.leke_px`); `foto_alani` her WebP'de tam pencerede görünür piksel kalmadığını denetler
  (`manifest.checks.windows_transparent`: hepsi 0).
- **Kapak kesimi** (`env_cflap`): `tema_build.kapak_kes("v")`, `method: renk` — en güçlü parlaklık düşüşü karlı beyaz yırtık
  şeridin altındaki yeşil gövdede, yani şerit kapakta kalır (`previews/g408/cuts_envelope.jpg`).
- **Ön cep alttan taranır** (`cep_alttan`): açık zarfın ön yüzü iki yan kanat + yuvarlak omuzlu alt kanat; kenar iki doğru değil.
  `tema_build.cep_kes("v")` düz V uydurdu ve omuzların iki yanında astar şeritlerini cebe aldı (kart onların arkasından geçerken
  beyaz kamalar görünürdü). Her sütunda gövdenin altından yukarı: cep yeşili (lum < 165, B ≥ R − 8, G > R — astarın zeytin
  yeşili dalları B < R olduğu için cebe girmez) bitip 6 satır astar görülen yer kenar; 9 sütun medyanı (4 tek sütunluk sıçrama),
  en dış 4 sütun komşudan. Cebin içinde açık astar pikseli (örneklenen): `manifest.stage.cuts.pocket.light_liner_px_inside_sampled`.
- **Hiza**: `kit_check` geçiyor (sol 0,00 · sağ 0,00 · alt +0,13 %) — dönüşüm yok; açık kapak/gövde kapalının menteşe satırından
  (`kapak_kes` `hinge_row`) ayrılır.
- **Kapanış** (`closure.png`, kapakla **taşınmaz**): çapa = V kapağın ucu (`kapak_kes` `tip`); W1.1 comp'ta ölçülen demet genişliği /
  zarf genişliği (0,3497) ve demet merkezinin uca göre kayması (+0,0146, −0,1469 × zarf genişliği) — ölçüm `build_images.py` COMP
  yorumunda; `previews/g408/compare_closure.jpg`: tema | comp.
- **Zeminler**: telefon `snow` = bg_page'in iki kümesiz kırpımı (karlı sis x 290–710 y 330–1010 + sol alttaki kar yığını x 0–420
  y 1060–1536) 110 px yumuşak geçişle; geniş ekran `snow_wide` (x 0–800, y 520–1040); uzun sayfaların sonu `snow_foot` (kar yığını,
  ≥ 768 px'te `snow_wide`) üstten maskeyle beliren. Çam kümeleri hep ayrı katman (`decor_tl` / `decor_br`), düz çizgiyle kesilmez.
- **Ağırlık**: kümeler yoğun iğne dokulu; alfa kalitesi 60 (q 76) ile 720 px ≈ 116–123 KB (q 80 / alfa 90'da 187 KB idi, docs/11 §6
  ≥ 150 KB gerekçe ister). Buğu q 72 / alfa 70. `divider` tek 300 px dosya (her yerde ≤ 60 px).
- **Yeşil denetimi**: `tema_build.yesil_gorunur` çam iğnelerini de sayıyor → `kroma_yesil()`: parlak kroma yeşili (G ≥ 190, fazla
  ≥ 60) her WebP'de 0; iğne sayıları `manifest.checks.green_check`'te.
- Kartlar: `free_zone` + 3 dilim (`slices`: davet kartı %35–76 — sol alt dal %76'da başladığı için düz bant ≥ %95 genişlik ister;
  bilgi kartı %16–93). og: `web_hero` alt hizalı 1.91:1; favicon: closure. Tema klasörü ~2,3 MB (≤ 3 MB).

## Açılış ve koreografi (`site.js` `MOTION`)
- **Açılış** (katalog: "On tap, soft snow begins to fall, the pine-and-berry bundle loosens and slides away, the green flap opens
  upward, and the snowy white card rises as snowflakes drift across the screen."): dokununca (0 ms) **kar yağmaya başlar**
  (GPT kar tanesi accent_1 × 18, 14–26 px, gölgeli; zarfın **arkasında**, bir kısmı havada başlar, salınarak aşağı, açılış
  boyunca); **demet gevşer** (120 ms'den:
  fiyonk düğümü çevresinde −4° → +3,5° → −1,5° sallanır, hafifçe şişip yerine oturur) ve **kayarak gider** (zarfın önünden aşağı,
  hafifçe sağa ve 16° dönerek, hızlanarak ekranın altından çıkar — zarfın üstünde sönmez; 1,62 s'de biter); **yeşil kapak**
  menteşesinde izleyiciye doğru kalkar (1,24 s; 82°'den sonra söner), altında kapalı gövde açık gövdeye (karlı astar + ön cep)
  geçer, astarlı açık kapak −90°'den dikilir (2,06 s) → **kart cepten yükselir** (2,32 s) ve **aynı anda** 4 büyük kar tanesi
  (24–32 px) sırayla soldan ve sağdan ekranı boydan boya geçer (zarfın yeşil ön cebinin önünde, cep yüksekliğinin %50–86'sı
  şeridinde — kartın foto penceresinin üstünden geçmez) → kart olduğu yerde öne gelir (× 1,04, büyüyen gölge) ve view
  transition ile home kartına uçar. Dokun → home 4,56 s (Skip her an).
- **Story:** her pencere kendi sahnesi: görünüme girince yükselerek yerine oturur (`rise-lg`), 760 ms sonra camındaki buğu ortadan
  dışa silinir (`wipe`: GPT buğu katmanına radyal maske, `--wipe` 0 → %74, 1,7 s; köşelerde kırağı kalır — "frost still clinging
  to their corners as if just wiped clear"), sonra başlığı yazılır. Telefonda pencere 66vw (foto penceresi 66 × 0,65 = **42,9vw**
  ≥ 38vw), alt alta ortalı, aralarında duvarda bir meyve dalı (accent_3); ≥ 720 px comp'un üçlü sırası (aralarında dal) ve
  **tek fold birimi**: sıra nav'ın üstünde bitene kadar `site.js` `row` pencereleri 6 px adımlarla küçültür (en az 140 px).
- **Parçacıklar** (`MOTION.accents`, hep GPT kar tanesi): açılış 18 düşen (zarfın arkasında) + 4 süzülen (ön cebin önünde) · home'a varış 4 kar tanesi (hero'nun içinde,
  metnin arkasında, yazı sütununun yanındaki şeritlerde) · RSVP kapanışı 5 kar tanesi (yalnız `.closing` kutusunda, forma uzanmaz).
- **Boyalı kartlar** (davet, Order of the Day, RSVP): `set` girişi — kart konur gibi kayar ve yerleşir, **hep opak** (theme-check'in
  kart piksel testi gerçek kart üstünde ölçer). RSVP kartındaki demet `drop` ile karta düşer.
- Süreler (docs/11 §8): her sahnenin son adımı ≤ 3000 ms, tek giriş 600–1800 ms (`wipe` 1700).

## İlk ekranlar ve yatay telefon
05'in çözülmüş adımları korunur: `fitNames` (isimler en çok %24 küçülür → `.is-tight` + isimler **36 px tabanı** → `.is-long`
(sayaç hapın altına) → hero kaydırılır), ardından `fold` (nav'ın altında yarım parça yok). Kısa yatay (`min-aspect-ratio: 1/1` ve
yükseklik ≤ 620 px) ızgara: kart solda, isimler · tarih · mekân · şehir · sayaç · hap sağda. **İç sayfalar** (`folds`): her ilk
ekran öğesi ya nav'ın üstünde biter ya da ilk ekranın tamamen altında başlar (`[data-fold]`: story'de alt başlık, giriş cümlesi,
her pencere — ≥ 720 px'te sıra bir bütün —, sonraki bölüm; details'te kart başlığı, her program satırı, takvim çifti, mekân
penceresi; rsvp'de başlık, son tarih, hap, demet, bekleme satırı, imza birimi, form satırları). İmza ve kartın demeti katlanmadan
önce `--sg` 1 → 0,72 küçülür. **Zarf sayfası** (`envFit`): sahnenin boş üstü (`.63349 × --w`) ölçülen başlığın altına girer; "Tap
to open" ilk ekranda bitmiyorsa sahne küçülür (`--ok`, en az 0,6).

## Dekor ve metin (`site.js` `decor`)
- Köşe kümeleri **hep bütün** GPT parçası; yalnız ekran kenarı keser. Hero'nun sağ alt kümesi ilk ekranda nav'ın üstünde biter.
- İç sayfaların ilk ekranı W1.3–W1.5'in karlı sisi: `.page-bg` (100svh) = `snow` / `snow_wide` (alt %26'sı maskeyle söner) +
  `decor_tl` + `decor_br` + W1'in üç süzülen parçası (kar tanesi, kozalak, meyve dalı).
- Sis üstündeki hiçbir yazı bir kümenin iğnesi üstünde durmaz: `decor` her kümenin 16 × 16 iğne haritasını (WebP alfasından, `MAP`)
  yazı kutularıyla karşılaştırır; çakışırsa küme %6 adımlarla küçülür (en çok %45), yine çakışırsa gizlenir. Yazıya, karta,
  çerçeveye ya da kapalı zarfa değen süzülen parça gizlenir (sahnenin zarf üstündeki boş kart alanı "katı" sayılmaz).

## Comp öğe haritası (docs/11 §8)

### index ← W1.1 `web_1_envelope.png`
| W1 öğesi | Şablon | Not |
|---|---|---|
| soluk gri-yeşil karlı sis, kar bokehi, sol altta kar yığını | `.scene-bg` `snow` (telefon) / `snow_wide` (geniş) | bg_page 2:3 telefonda kümeleri keserdi: zemin kümesiz kırpımlardan |
| çam kümeleri sol üst, sağ alt | `decor_tl` / `decor_br` ayrı katman | ekranda bütün; kenarda ekran dışına taşar (comp gibi) |
| sağda kar tanesi, kozalak, meyve dalı | `.float` (accent_1, accent_2, accent_3) | yavaş "nefes"; zarfa/yazıya değerse gizlenir |
| "YOU ARE INVITED" | `.env-head .kicker` | |
| isimler (Parisienne) | `h1.names` (+ `.amp` italik Libre Baskerville) | uzun isimde `site.js` küçültür |
| orman yeşili zarf, karlı beyaz yırtık kenarlı V kapak | `.env-closed` + `.env-cflap` | |
| çam + sedir + üç meyve, kırmızı kadife fiyonk, V'nin ucunda | `.closure` (kapaktan ayrı) | ölçü ve yer comp'tan (manifest.closure) |
| "TAP TO OPEN" + altında çizgi · dal · çizgi | `.env-hint p` + `.env-hint .orn` (GPT divider + iki 1 px çizgi) | kısa yatayda dal gizli |
| — | `a.skip`, "Enter / Replay the opening" | platform gereği |

### home ← W1.2 `web_2_home.png`
| W1 öğesi | Şablon | Not |
|---|---|---|
| karlı beyaz kart, beyaz ahşap pencere (köşelerde kırağı), "We're getting married", "DECEMBER 11, 2027 · ASPEN" | `.hero-card` (card_small + `hero_portrait`) | dar kartta tarih ve kasaba iki satır (`fitCopy`); kasaba = `venue.city` (W1.2 yalnız kasabayı yazar; docs/11 §3.2 kart kopyası için `venue.city_region` der — **sapma**, comp'a uyuldu, 05 ile aynı; kasaba boşsa ayırıcı da gizli) |
| isimler | `h1.names` | |
| "SATURDAY · DECEMBER 11, 2027" | `.hero-date` | |
| "Pinecrest Lodge" (italik), "Aspen, Colorado" (italik) | `.hero-venue`, `.hero-city` (`venue.city_region`) | |
| dört buzlu kutulu geri sayım | `.countdown` sade serif rakam + etiket | **sapma:** kutular CSS çerçeve olurdu (K21, §5.7) |
| üstü karlı orman yeşili RSVP hapı | `.hero-cta .btn` | arayüz hapı: orman yeşili degrade (#3E6B53 → #284636); **sapma:** hapın üstündeki kar GPT parçası değil, çizilmedi |
| hapın altında çizgi · dal · çizgi | `.hero-orn` (GPT divider + iki 1 px çizgi) | telefonda 9:16'dan basık ekranlarda gizli (ilk ekran) |
| alt gezinme (üstte ince çizgi, geçerli sayfa kalın ve altı çizili) | `.site-nav` (`::before` 1 px çizgi) | |
| köşe kümeleri, sağdaki süzülen parçalar | `decor_tl` / `decor_br`, `.float` | |
| — (comp yok) | davet kartı (`invitation_card` 3 dilim: çelenk, sol alt dal, altın çerçeve; AY \| gün \| YIL iki 1 px ayraçla), "Kindly reply by" + RSVP, takvime ekle, iki köşk penceresi (`frame_portrait` + story_1 + buğu → Our Story, `frame_landscape` + mekân → The Day + programın ilk 4 satırı, docs/11 §3.2), "With love" + isimler + "Open the envelope again" (kar yığını + `decor_br`) | bu tasarımın parçaları; 05'in duvar panoları / 03'ün tanıtımları kullanılmaz |

### story ← W1.3 `web_3_story.png`
| W1 öğesi | Şablon | Not |
|---|---|---|
| "Our Story", "MOMENTS WE HOLD DEAR", çizgi · dal · çizgi | `h1.page-title`, `.page-head .kicker`, `.page-head .orn` | |
| — | `.lede` (story.intro + tarih) | standart zorunlu |
| üç buğulu ahşap pencere yan yana, pervazda kar | `.windows-row .pane` (frame_portrait + `frost_overlay` + foto) | **sapma:** telefonda yan yana pencere ~%22vw olurdu (< 38vw, docs/11 §9) → alt alta ortalı, 66vw; ≥ 720 px comp'un sırası |
| pencereler arasında küçük dekor (meyve dalı, ardıç dalı) | `.between` (accent_3, iki tane) | ardıç dalı tek parça olarak yok; ikisi de GPT meyve dalı |
| başlıklar pencerenin altında | `figcaption` | |
| köşe kümeleri, süzülen parçalar | `.page-bg` ilk ekranda; `decor_br` + kar yığını sayfa sonunda | |

### details ← W1.4 `web_4_details.png`
| W1 öğesi | Şablon | Not |
|---|---|---|
| karlı sis, köşe kümeleri, süzülen parçalar | `.page-bg` | kart ve çerçeve kümenin önünde |
| "Order of the Day" kartı, altın ince çerçeve, üstte çam dalı | `.day-card` (info_card 3 dilim) + `h1.card-title` | kart içerikle uzar/kısalır (1–10 satır) |
| saat / ETKİNLİK / yer (italik), ortalı | `.sched-row` | |
| satır arası çam dalı + iki yanında ince çizgi | `.row-orn` (GPT divider + iki 1 px çizgi; ilk satırda yok) | 6+ satırda yalnız boşluk |
| — | `.page-kicker` gün · tarih | standart zorunlu başlık tarihi |
| mekân fotoğrafı yatay ahşap pencerede (köşelerde kırağı, pervazda kar) | `.venue-photo` (frame_landscape + `venue`) | pencere 1,90:1, `cover` |
| "Pinecrest Lodge", "Aspen, Colorado" | `.venue-name`, `.venue-place` (`city_region_country`, + adres, tören cümlesi) | |
| çizgi · dal · çizgi, "DRESS CODE · Winter formal" | `.dress` (`.orn` + satır) | |
| — | takvime ekle, harita, Travel & Stay, Registry, SSS, RSVP | yalnız içerik/link varsa |

### rsvp ← W1.5 `web_5_rsvp.png`
| W1 öğesi | Şablon | Not |
|---|---|---|
| karlı sis, köşe kümeleri, süzülen parçalar | `.page-bg` | kart kümenin önünde |
| altın ince çerçeveli karlı beyaz kart | `.rsvp-card` (info_card 3 dilim) | **sapma:** info_card'ın üstünde W1.4'teki küçük çam dalı da var (W1.5 kartında yok; tek GPT parçası iki sayfada) |
| "Will You Join Us?" (iki satır) | `h1.card-title` | |
| "KINDLY REPLY BY", tarih | `.kicker`, `.deadline` | `data-if="rsvp.deadline"` |
| üstü karlı RSVP hapı | `a.btn[href="#reply"]` | forma kaydırır; kar çizilmedi (yukarıdaki sapma) |
| kartın ortasında zarfın demeti | `.card-bundle` (closure) | comp'taki boy (~kart genişliğinin %37'si) |
| "WE CAN'T WAIT TO CELEBRATE WITH YOU" | `.wait` | |
| çizgi · dal · çizgi, "With love, Noelle & James" | `.sig-unit` (`.orn` + `.sign`) | uzun isimde sarar; ilk ekrana sığmazsa önce küçülür (`--sg` ≥ 0,72) |
| — | yanıt formu, kapanış ("Thank you"; yanıttan sonra gizlenir) | platform sözleşmesi |

## Teşekkür hâli (G075 kuralı)
Düğünden sonra (platform kuralı `lib/content/thank-you.ts`, docs/11 §3.6) aynı sayfalar `data-if="thank_you_on"` ile teşekkür
hâline döner; yeni sayfa ve yeni görsel yok (K21):
- **Zarf:** açılış şovu aynen; üst satır "With love and thanks" (`ty_kicker`); kartta teşekkür başlığı (`thank_you_title`, el yazısı,
  dengeli sarar; `fitCopy` sığmazsa küçültür, ≥ 11 px) + tarih; " · kasaba" yok. Kart penceresinde teşekkür fotoğrafı; yoksa
  **karlı sis üstünde zarfın demeti** — asla yer tutucu.
- **Home:** hero kartı zarfla aynı; isimler, tarih, mekân kalır; geri sayım ve RSVP hapı yok. Davet kartının yerine aynı
  `invitation_card` kâğıdında (3 dilim) **teşekkür kartı**: başlık, mesaj (`white-space: pre-line`), "With love,", isimler, tarih.
  Yanıt satırı ve takvim yok; pencerelerde Our Story ve The Day kalır (çift Details'i gizlerse The Day penceresi yok).
- **Details:** "The Day" (program, mekân, harita, registry); takvim, dress code, Travel & Stay, SSS ve RSVP linki yok; tören cümlesi
  geçmiş zaman. Çift gizlerse sayfa 404 ve hiçbir link yok (story'nin kapanış düğmesi Home'a döner).
- **RSVP:** kartta "Replies are closed" + teşekkür başlığı + Home hapı + demet + imza; bekleme satırı ve form yok.
- **Nav:** Details etiketi "The Day" (`nav_day`), RSVP yok. Stiller `thank-you.css`'te.

## Düzenlenebilir metinler (G068) ve misafir adları (G069)
Görünür her sabit metin `data-copy` taşır (71 standart anahtar, `theme.json` → `copy`; `node scripts/copy-manifest.ts --theme
winter-evergreen --check` temiz). `max` değerleri 05'ten başlatıldı ve `theme-check --stress` ile 360/390'da (teşekkür hâli dahil)
doğrulandı (sonuç: bkz. "Ölçümler"). Formda "Number of guests"in hemen altında `<template data-rsvp-party>` (formun kendi `.field`
stili, `form_party` + `form_optional`).

## Bilinen sınırlar
- Program en çok 10 satır (şema); Order of the Day kartı uzar (3 dilim).
- Mekân penceresi 1,90:1 — 3:2 fotoğraf üstten/alttan kırpılır.
- Story fotoğrafının kenarları son hâlde de yarı saydam kırağı altında (tasarım gereği "köşelerde kırağı"); yüz ve önemli öğe
  ortada olmalı (panel kırpımı pencere oranında, `object-position` 50% 38%).
- `story.items` 3'ten fazlaysa ilk 3 başlık; anların `text`'i gösterilmez. Monogram (`initials`) kullanılmaz: kapanış bir dal
  demeti (mühür değil, boş oval yok).
- `@property --wipe` desteklemeyen tarayıcıda (Safari < 16.4, Firefox < 128) buğu silinme animasyonu olmadan, gecikme sonunda bir
  anda açılır (JS'siz ve azaltılmış harekette baştan açık).
- `favicon.png` şeffaf; `apple-touch-icon` yazılmaz.
- Denenmedi: gerçek iPhone/Safari ve Android Chrome (`svh`, `mask`, `:has`, `@property`, kesişen belge view transition), Vercel
  yayını, gerçek alıcı fotoğrafları (farklı oran/ışık), yavaş ağ.

## Ölçümler
2026-10-15, worktree `worktree-agent-a489a0b0127280e51`, PORT 3480, Chromium (Playwright, `/opt/pw-browsers`).

| Ölçüm | Sonuç |
|---|---|
| `theme-check --theme winter-evergreen --stress` | 128 geçti, 0 hata, 0 uyarı (`previews/g408/checks.json`) |
| `g051-browser --theme winter-evergreen` | 44/44 |
| `final-smoke --theme winter-evergreen` | 45/45, konsol/sayfa hatası yok (`previews/g408/final/`) |
| `npm test` / `typecheck` / `build` | 620/620 · temiz · temiz (trace-check 7 tema) |
| zarf → home | 4855 ms (MOTION `go` 4560 + view transition) |
| azaltılmış hareket | 231 ms, doğrudan home, her şey görünür |
| ilk görünüm 390×844 DPR 3 | index 1003 KB, home 962 KB (yer tutucu); örnek fotoğrafla 1074 / 1350 KB (sınır 1,5 MB) |
| açılış kaydı | `previews/g408/opening_390x844.mp4` 2884 KB (dokun → açılış → home → story → details) |
| dosya boyları | site.js 35 741 B (≤ 35 KiB), site.css 45 583 B (≤ 45 KiB), thank-you.css 2372 B; tema klasörü 2,35 MB; decor_tl/br-720 116 / 123 KB |
| kit uyumu (`kit_check`) | paket 5 24/24 (hiza sol +0,00, sağ +0,00, alt +0,13 %), paket 2 5/5 |
| kendi ilk-ekran taraması | 228 ilk ekran (home/story/details/rsvp × 19 boy × demo/range/stress): nav çizgisinin kestiği parça 0, nav bandında parça 0 |
| kontrast (metnin arkasındaki en kötü %10 zemin) | en düşük "Click to open" 5,68:1 (index 390×844, gerekli 4,5); diğerleri 6–8,5:1 |
