# Tema: lavender-provence (tasarım 09 · Lavender Provence, G409)

Provence lavanta tarlası: el yapımı leylak kâğıt (üstte açık, altta koyulaşan), sol üst ve sağ alt köşede preslenmiş lavanta,
beyaz papatya ve buğday başağı buketleri, kâğıdın üstünde serbest lavanta tomurcukları; zarf yerine **jüt sicimle bağlı,
önüne lavanta demeti iliştirilmiş krem keten kese** (`ZARF_TIPI` kese, sarılı kapanış). Alex Brush (isimler, başlıklar) +
Cormorant Garamond (aralıklı büyük harf satırları, italik mekân). Kurallar `docs/11_TEMA_STANDARDI.md`; motor ve platform
sözleşmesi `platform/README.md`. Yerleşim, tipografi ve hiyerarşi bu tasarımın W1 comp'larından
(`collections/09_Lavender_Provence/assets/gpt/comps/web_1..5`, yalnız sade adlar; `web_3_story_v1` denemedir); bütün
görseller bu tasarımın GPT parçaları (K21). 05 (mediterranean-lemon) ve 01/03 temalarından yalnız platform sözleşmesi ve
çözülmüş sorunlar alındı (motor işaretleri, RSVP formu, `#site-data`, slug'lı oturum anahtarları, `data-scene`/`data-step`/
`data-a` kancaları, `fitNames` + `fold` + `folds` ilk ekran adımları, `decor` yaprak haritası, yatay telefon ızgarası,
`devRender`); görünüş, kese açılışı, kart oranları, süs konumları, zamanlama ve bölüm sırası bu tasarımın.

## Dosyalar
| Dosya | İş |
|---|---|
| `theme.json` | ad "Lavender Provence", 5 sayfa, 5 foto alanı (oranlar = `img/manifest.json` `photo_slots.*.box_px`), 72 düzenlenebilir metin (G068; `node scripts/copy-manifest.ts --theme lavender-provence --check` temiz) |
| `content.demo.json` | `collections/09_Lavender_Provence/content.demo.json`'ın birebir kopyası (`/start?theme=lavender-provence`, tema demosu; servis edilmez) |
| `index.html` | kapalı kese → dokun → sicim çözülür ve lavanta demetiyle kayıp gider, kese gevşeyip açılır, kart ağızdan yukarı kayar, lavanta tomurcukları yaz esintisiyle savrulur, kart öne gelir → home (view transition) |
| `home.html` | hero (W1.2: kart + foto, isimler, gün · tarih, mekân, şehir/bölge/ülke, geri sayım, lavanta RSVP hapı), davet kartı (invitation_card, buketin sağındaki düz kâğıtta, 3 dilim), tek "Kindly reply by" satırı, takvime ekle, kâğıda gelişigüzel bırakılmış üç preslenmiş kart (Our Story · The Day + ilk 4 program satırı · Will You Join Us? + lavanta demeti), kapanış |
| `story.html` | W1.3: başlık + alt başlık + giriş cümlesi, üç preslenmiş kart gevşek açılarla (−4°, +3,5°, −2,2°; sol, sağ, sol), her biri görünüme girerken kendi yanından esintiyle savrulup yerine oturur; başlık kartın altında el yazısıyla; yanlarda tomurcuk + papatya |
| `details.html` | W1.4: tarih satırı, Order of the Day (info_card, 3 dilim; saat · ETKİNLİK · yer, satır aralarında GPT lavanta–papatya dalı), takvime ekle, mekân (yatay preslenmiş çerçeve), mekân adı el yazısıyla, çizgi + tomurcuk + dress code, harita / Travel & Stay / Registry (yalnız linkle), SSS |
| `rsvp.html` | W1.5: RSVP kartı (info_card, 3 dilim) — başlık, GPT dalı, son tarih, hap, çizgi + tomurcuk, bekleme satırı, "With love," + isimler, kartın alt kenarında lavanta demeti (closure); platform yanıt formu (G042 + G051 soruları + G069 misafir adları), kapanış |
| `site.css` | palet token'ları, giriş ön ayarları (`tumble-l/r`, `settle` bu tasarımın; `drift-tl/br`), foto alanı + maske, kese katman yüzdeleri + ağız kırpması, kart 3 dilim, sayfa yerleşimleri |
| `thank-you.css` | teşekkür hâli (G075): kart penceresinde teşekkür fotoğrafı ya da kâğıt + lavanta demeti, teşekkür kartı |
| `site.js` | `MOTION` (kese açılışı, sahneler, `accents`), `ENVELOPE_GEOMETRY`, ilk ekranlar (`fitNames`, `fold`, `folds`, `envFit`), kart kopyası (`fitCopy`), story başlıkları (`fitCaps`), dekor–metin (`decor`), geri sayım, `DEV_CONTENT` + `devRender` |
| `build_images.py` | GPT parçaları → `img/` (servis edilmez); `tools/tema_build.py` + bu tasarımın kesimleri |
| `img/` | WebP katmanlar, `florals_*` 400/640/820, `paper_tile` (kâğıt zemin), `bud` (tomurcuk), `ph_*` yer tutucular, `mask_{card,portrait,landscape}.png`, `og-1200x630.jpg`, `favicon.png`, `manifest.json` (servis edilmez) |

## Foto alanları
| Anahtar | İçerik yolu | Oran (px) | Yer |
|---|---|---|---|
| `hero_portrait` | `media.hero_portrait` | 413/469 | card_small penceresi (index kartı = home hero kartı) |
| `story_1..3` | `media.memory_photos.0..2` | 575/735 | frame_portrait (story; `story_1` home'daki preslenmiş kartta da) |
| `venue` | `media.venue_image` | 1022/490 | frame_landscape (details; home'daki The Day kartında da) |

Foto çerçevenin **altında**, kutusu pencere + 2 px, maske `mask_<şekil>.png` (CSS `border-radius` yok). `object-position` portre
50% 38%, mekân 50% 55%. **Mekân penceresi ≈ 2,09:1** (GPT çerçevesinin penceresi): panel kırpımı bu orana yapılır, 3:2 mekân
fotoğrafı `cover` ile üstten/alttan kırpılır. "Your photo here" yalnız önizlemede (`html[data-preview="true"]`); misafir nötr yer
tutucuyu (bg_page'in çiçeksiz leylak kâğıdından bulanık + fildişine tonlanmış kırpım) görür. `build_images.py` her yer tutucunun
en koyu pikselini (≥ 170) ve doygunluğunu (≤ 40) ölçer: lavanta/yaprak kırpıma girerse çıkış ≠ 0.

## Görseller (`python3 platform/themes/lavender-provence/build_images.py [--prep-dir DIR] [--onizleme DIR]`)
- `tools/parts_prep.py` **geçici klasöre**. G209'un açık kusuru (çerçeve ve küçük kart pencerelerinde yarı saydam / gradyanlı yeşil,
  yatay çerçevenin ortasında alfa boşluğu): `leke_doldur` pencereleri tam şeffaf yapar (leke: card 8, portrait 58 619, landscape
  390 059 px); `foto_alani` her WebP'de pencerede görünür piksel kalmadığını denetler (`checks.windows_transparent`: hepsi 0).
- **GPT hâlesi:** envelope_closed / envelope_open / closure tuvallerinde alfa 1–7 soluk hâle (7 550 / 9 079 / 30 417 px) sahne kutusunu
  tuval boyuna yayıyordu → alfa < 8 sıfırlanır (görünmez; `stage.haze_cleanup_px`).
- **Hiza** (`kit_check --paket 5` UYARI: alt −2,15 %, kapanış uçları −1,37 / −1,22 %): açık kese kapalıdan 31 px yukarıda çizilmiş
  (sol/sağ aynı) → açık kese ölçülen ölçek (× 1,0015) + ötelemeyle kapalının sol, sağ ve alt kenarına oturur (sonra 0 / 0 / 0 px).
  Sicimin iki ucu kesenin kenarından 14 / 12,5 px taşıyordu → kapanış düğüm sütunu (x 492) çevresinde yatayda × 0,9466 (uçlar
  kenarda: 0 / +4,5 px). Sonra `hiza_olc` "tamam" (sol 0, sağ 0, alt −0,07 %, uçlar 0 / +0,44 %). Hepsi `manifest.stage.align`.
- **Ön duvar** (`pouch_front`): `tema_build.kese_kes` bu kesede ağız yayını bulamadı (183/183 sütunda geçiş ama uydurma
  reddedildi; geometrik yay astarın ortasını ön duvara katıyordu). Ağzın içi leylak astar (G ≈ B), keten krem (G − B ≥ 15): her
  sütunda ağız bölgesinde astarın **en alt** satırı + 1 ön duvarın ilk satırı (astarın krem desenleri sütun içinde 12 px kapatılır,
  9 sütun medyanı) — krem ağız kenarı ön duvarda, astar arkada (`stage.rim.cut`: 415 sütun, en alçak nokta x 544, y 811).
  `pouch_back` = hizalanmış açık kesenin tamamı (ön duvar aynı piksellerle biner; örtüşme farkı 0,0074 ≤ 0,01).
- **Kapanış üç parça** (closure.png, kese tuvalinde 1:1 sarılı kapanış): renkle — jüt (R > G > B, R − B ≥ 38, G − B ≥ 14) düğüm
  sütununu buluyor; lavanta çiçeklerinin altında, düğüm sütunu ± 44 px dışında kalan her şey (yeşil saplar hariç) `tie_l` /
  `tie_r`, geri kalanı (lavanta, saplar, düğüm) `bundle`. İkili maske: üçü üst üste kapanışı birebir verir (fark 0). Gizli parça yok:
  düğümün arkasındaki saplar düğümle birlikte gider, hiçbir kesik açığa çıkmaz.
- **Kart yolu** (`stage.card_path`): kart (card_small) astar açıklığının %86'sı (kese gövdesinin %55'i); cepte ağız kenarının en alçak
  noktasının altında, en çok %5'i astarın önünde görünür (fotoğraf görünmez). `.card-slot` clip-path'i ön duvarın üst kenarını izler
  (`stage.rim.clip`, 15 nokta): kart büzgülü boynun yanlarından asla taşmaz. `out` = alt köşeler ağız kenarını kartın %4'ü aşmış,
  `front` = aynı yerde öne (%3 aşağı + × 1,05, büyüyen gölge) → home kartına yukarı uçar.
- **Lavanta tomurcuğu** (`bud-80.webp`): accent_1 dalının en alttaki tomurcuk halkasının kırpımı (sap uçları 4 px alfa ile solar).
  Açılış parçacığı, zeminde serbest tomurcuklar ve çizgi süsü (W1'deki "çizgi + küçük dal") bu kırpım. Çizim yok.
- **Zemin:** bg_page 2:3 leylak kâğıt; telefonda `cover` ile köşe buketleri kesilirdi. Sayfa zemini bg_page'in tam genişlikte
  çiçeksiz bandı (y 560–880) + dikey aynası (`paper_tile`, dikişsiz `repeat-y`, koyu pay 0); buketler ayrı katman (`florals_tl` /
  `florals_br`, ekranda bütün; 16 × 16 yaprak haritası `site.js` `MAP` = `manifest.florals_*.leaf_map`). Üstteki açık ton CSS kenarsız
  ışık (`body::before` radyal) — §5.7.
- Kartlar: `free_zone` + 3 dilim (`slices`: davet kartı %79–95 — buket sol kenar boyunca %80'e iniyor, yalnız tam genişlikte düz
  satırlar gerilir; info kartı %14–95). Story çerçevesinin pencere altı düz bandı yalnız %91–96 (`frame_portrait.free_zone`).
- Yeşil denetimi: parlak kroma yeşili (G ≥ 190, fazlası ≥ 60) her WebP'de 0; `tema_build.yesil_gorunur` florals_br-400'de 2 px kekik
  yaprağı sayıyor (yeşil yaprak, #00FF00 değil; `checks.green_check`).
- Boyutlar: `florals_*` 640 (390 px telefonda DPR 3) 112 / 152 KB ilk görünümde — br-640 150 KB'ın üstünde: yoğun preslenmiş buket,
  q 60'ta; 820'ler yalnız geniş ekran (≤ 250 KB). og: `web_hero` alt hizalı 1.91:1 (kese + kapanış altta tam); favicon: closure.
  Tema klasörü 2,64 MB (≤ 3 MB).

## Açılış ve koreografi (`site.js` `MOTION`)
- **Açılış** (katalog: "On tap, the jute twine with its lavender bundle unties and slips away, the linen pouch loosens and opens,
  and the card slides up out of it while dried lavender buds scatter on a summer breeze."): dokununca kese hafifçe sıkışır (`tug`),
  sicimin iki ilmeği gevşeyip yanlara açılarak sarkar ve söner (`closure` 80–860 ms, `tie_l`/`tie_r`), lavanta demeti düğümüyle
  önce hafifçe kalkar sonra kesenin önünden sağ alta kayıp gider (`slip` 300–1450 ms; kesenin içinden geçmez), kapalı kese açık keseye
  geçerken kese "gevşer" — açık hâl yatayda %3 geniş, dikeyde %3 basık başlayıp alt kenarı sabit oturur (`loosen` 760–1400 ms) → kart
  ağızdan yukarı kayar (`rise` 1300–2600 ms; ağız kenarı kırpar) ve **aynı anda** 7 lavanta tomurcuğu ağızdan esintiyle sağa-yukarı
  savrulur (`accents` 1450, `path: 'breeze'`) → kart olduğu yerde öne gelir (`forward` 2700, × 1,05) ve view transition ile home
  kartına uçar (`go` 3550 + VT 0,9 s ≈ 4,45 s). Skip her an. Ağırlıklı ilk hareket 80 ms'de.
- **Story:** her kart kendi sahnesi: görünüme girince kendi yanından (sol kartlar soldan, sağ kart sağdan) ekran dışından ±25° dönerek
  esintiyle gelir ve kendi gevşek açısında durur (`tumble-l/r`, 1,5 s; dinlenme açısı ayrı CSS `rotate`), sonra başlığı yazılır ve
  yanındaki tomurcuk + papatya belirir. Kartlar üst üste binmez (sütunda alt alta, sol/sağ kaydırmalı). Telefonda kart 62vw, foto
  penceresi 62 × 0,650 = **40,3vw** (≥ 38vw); ≥ 720 px comp'un iki sütunlu basamaklı dizilişi; masaüstünde (≥ 1024 px yatay) tek
  basamaklı sıra = tek fold birimi (`tiles`).
- **Parçacıklar** (`MOTION.accents`): açılış 7 tomurcuk (esinti) · home'a varış 3 tomurcuk (`host: '.hero'`, yazı sütununun yanından)
  · RSVP kapanışı 4 tomurcuk + 1 papatya (`host: '.closing'`).
- Süreler (docs/11 §8): sahne ilk adımı ≤ 150 ms, son adımı ≤ 3000 ms (`home-invite` `cal` 2900); tek giriş 600–1800 ms.

## Comp öğe haritası
**W1.1 (index)**
| Comp öğesi | Şablon | Not |
|---|---|---|
| leylak kâğıt, sol üst / sağ alt buket, serbest tomurcuklar | `body` (paper_tile), `.scene-bg .corner-tl/.corner-br`, `.float` (bud) | buketler ayrı GPT katmanı |
| "YOU ARE INVITED" | `.env-head .kicker` | |
| isimler (script) | `h1.names` | `fitNames` uzun isimde küçültür |
| bağlı keten kese + lavanta demeti | `.stage .pouch-closed` + `.tie-l/.tie-r/.bundle` | kese comp'tan büyük: telefonda ekran genişliğinin ~%65'i (comp'ta %34; docs/11 §7.1 sahne boyu) |
| "TAP TO OPEN" + çizgi · dal · çizgi | `.env-hint` + `.env-orn` | dal = `bud` kırpımı |

**W1.2 (home hero)**
| Comp öğesi | Şablon | Not |
|---|---|---|
| tırtıklı krem kart, lavanta çerçeveli foto | `.hero-card` (card_small + `hero_portrait`) | = index kartı (VT) |
| "We're getting married" / "JULY 3, 2027 • GORDES" | `.card-copy .script` / `.card-copy .kicker` | `fitCopy`: dar kartta önce iki satır, sonra şehir düşer |
| isimler | `h1.names` | |
| "SATURDAY · JULY 3, 2027" | `.hero-date` | motor biçimi |
| "Les Jardins de Lavande" italik | `.hero-venue` | |
| "Gordes, France" | `.hero-city` = `venue.city_region_country` | **sapma:** şemada "şehir, ülke" türetilmiş alanı yok → "Gordes, Provence, France" |
| dört kutulu geri sayım | `.countdown` sade rakam + etiket | **sapma** (§5.7: CSS kutu çizilmez; GPT kutu parçası yok) |
| RSVP hapı | `.hero-cta .btn` | arayüz hapı (izinli) |
| çizgi · dal · çizgi + HOME · STORY · DETAILS · RSVP | `.site-nav` (`.orn` + liste) | gezinme ekranın altına sabit (bütün sayfalarda erişilebilir) |

**W1.3 (story)**
| Comp öğesi | Şablon | Not |
|---|---|---|
| "Our Story" / "MOMENTS WE HOLD DEAR" | `h1.page-title` / `.page-head .kicker` | |
| — | `.lede` (giriş cümlesi + tarih) | §3.2 zorunlu |
| üç preslenmiş kart gevşek açılarla | `.tiles .tile` (frame_portrait + `story_1..3`) | telefonda tek sütun sol/sağ (≥ 38vw kuralı); ≥ 720 px comp'un iki sütunu |
| kartın üstünde el yazısı başlık | `figcaption.cap` **kartın altında** | **sapma:** GPT çerçevesinin pencere altı düz bandı yalnız %91–96 (≈ kart genişliğinin %7'si), bir el yazısı satırı sığmıyor; başlık kâğıtta kartın hemen altında, kartla aynı açıda |
| serbest tomurcuklar, küçük beyaz çiçekler | `.loose` (bud, accent_2) | |
| sol üst / sağ alt lavanta | `.page-bg .corner-tl`, `.next-sec .corner-br` | buket parçaları (comp'taki yalnız lavanta demeti ayrı parça olarak yok) |

**W1.4 (details)**
| Comp öğesi | Şablon | Not |
|---|---|---|
| — | `.page-kicker` (gün · tarih) | §3.2 zorunlu başlık |
| tepede lavanta dalı olan kart, "Order of the Day" | `.paper.info.day-card` + `h1.card-title` | 3 dilim (1–10 satır) |
| saat / ETKİNLİK / yer | `.sched-row .time/.label/.loc` | |
| satır arası lavanta–papatya dalı | `.sched-row + .sched-row::before` (divider) | 6+ satırda gizlenir (sıkışık düzen) |
| yatay çerçevede mekân fotoğrafı | `.venue-photo` (frame_landscape + `venue`) | |
| mekân adı (script), "Gordes, France", çizgi + dal, "DRESS CODE · Summer chic" | `.venue-name`, `.venue-place`, `.dress .orn`, `.dress` | **sapma:** comp'ta bu yazılar çerçeve kartının alt bandında; GPT çerçevesinin pencere altı bandı dar (~%10) → yazılar kartın altında kâğıtta |
| — | takvime ekle, harita, Travel & Stay, Registry, SSS | comp'ta yok; bu tasarımın divider'ı + tipografisi |

**W1.5 (rsvp)**
| Comp öğesi | Şablon | Not |
|---|---|---|
| tırtıklı krem kart | `.paper.info.rsvp-card` | **sapma:** comp kartının tepesinde dal yok; GPT `info_card`'ın tepesindeki lavanta dalı kalır (kesmek kâğıdın tırtıklı üst kenarını da götürür) |
| "Will You Join Us?" + lavanta–papatya dalı | `h1.card-title` + `.card-divider` | |
| "KINDLY REPLY BY" / tarih | `.unit .kicker` / `.deadline` | |
| RSVP hapı | `.pill .btn` → `#reply` | |
| çizgi · dal · çizgi, "WE CAN'T WAIT…" | `.orn`, `.wait` | |
| "With love," + isimler, kart altındaki lavanta demeti | `.sig-unit` (`.love`, `.sign`, `.card-tie` = closure) | |
| — | yanıt formu, kapanış | platform sözleşmesi; bu tasarımın tipografisi |

**Comp'u olmayan bölümler** (bu tasarımın parçaları ve tipografisi, docs/11 §8): home davet kartı (invitation_card — buket sol üst
köşeden sol kenar boyunca iner; metin buketin sağındaki düz kâğıtta), "Kindly reply by", takvime ekle, üç preslenmiş kart (frame_portrait,
frame_landscape gevşek açılarla; lavanta demeti), kapanış (çizgi + tomurcuk, isimler); details blokları; RSVP formu.

## Diğer sapmalar ve kararlar
- `bg_tile` (keten doku) kullanılmadı: comp'ların hepsinde zemin leylak kâğıt; keten yalnız kesede. Uzun sayfa zemini bg_page'in
  çiçeksiz bandı + aynası.
- Monogram yok: bu tasarımda mühür/boş kapanış ortası yok (kapanış = sicim + lavanta); `initials` kullanılmaz.
- Kese telefonda comp'tan büyük (okunurluk ve dokunma hedefi); masaüstünde ekran yüksekliğinin %38'iyle sınırlı.

## İlk ekranlar ve yatay telefon
01/05'in çözülmüş adımları: `fitNames` (isimler küçülür → `.is-tight` + 36 px tabanı → `.is-long` → hero kaydırılır), `fold` (nav'ın
altında yarım parça yok), iç sayfalarda `[data-fold]` birimleri (`folds`; RSVP imzası önce `--sg` ile küçülür). Kısa yatay ızgara (kart
solda, yazılar sağda). Zarf sayfasında `envFit`: başlık + kese + "Tap to open" ekrana sığana kadar sahne küçülür.

## Bilinen sınırlar
- Gerçek iPhone/Safari ve Android Chrome'da denenmedi; Vercel yayını bu görevin işi değil.
- Story başlığı uzunsa (iki satırdan fazla) yazı 24 px'e kadar küçülür, sonra sarar; kart altındaki boşluk uzar.
