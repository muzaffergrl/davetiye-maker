# Tropical Destination — platform teması (tasarım 12, G412)

Standart: `docs/11_TEMA_STANDARDI.md`. Platform sözleşmesi (işaretler, RSVP formu, `#site-data`): `platform/README.md`.
Kaynak parçalar: `collections/12_Tropical_Destination/assets/gpt/` (G212; W1 comp'ları yalnız yerleşim referansı).
Zarf tipi: **kapak — cüzdan** (docs/11 §7.2): yuvarlak kapak + kapağın ortasından inen deri kayış; kapanış = pirinç çıtçıt +
sicim + beyaz plumeria (tek parça).

## Dosyalar

| Dosya | Ne |
|---|---|
| `theme.json` | ad, 5 sayfa, 5 foto alanı (`aspect` = `img/manifest.json` `photo_slots.*.box_px`), tasarım metinleri (`copy`, G068 — `node scripts/copy-manifest.ts --theme tropical-destination` üretir) |
| `content.demo.json` | `collections/12_Tropical_Destination/content.demo.json`'ın birebir kopyası (`site.js` `DEV_CONTENT` ile aynı) |
| `index.html` … `rsvp.html` | 5 sayfa (motor işaretleri; kişisel metin yok) |
| `site.css` | token'lar, giriş preset'leri (`swing` bu tasarımın), foto bileşeni, zarf katman yüzdeleri (manifest'ten, her yüzdenin yanında anahtarı) |
| `thank-you.css` | teşekkür modu (G075), yalnız düğünden sonra yüklenir |
| `site.js` | `MOTION` (açılış, sahneler, parçacıklar), `ENVELOPE_GEOMETRY`, `DEV_CONTENT`; uzun isim/ilk ekran/etiket yazısı sığdırma, süs ↔ yazı ayrımı |
| `build_images.py` | GPT parçaları → `img/` (`tools/tema_build.py` yardımcılarıyla; `parts_prep` geçici klasöre) |
| `img/` | WebP'ler, `mask_*.png`, `og-1200x630.jpg`, `favicon.png`, `manifest.json` (servis edilmez) |

Yeniden üretim (repo kökünden): `PYTHONUTF8=1 python3 platform/themes/tropical-destination/build_images.py [--onizleme <klasör>]`.
Tema klasörü 1,9 MB (sınır 3 MB).

## Foto alanları

| Anahtar | Parça (pencere) | Kutu (px) | Nerede |
|---|---|---|---|
| `hero_portrait` | `card_small` (bavul etiketi kart) | 355 × 462 | zarf kartı = home hero kartı |
| `story_1..3` | `frame_portrait` (ipli kraft etiket) | 474 × 621 | story; `story_1` home Story etiketinde de |
| `venue` | `frame_landscape` (yatay kraft etiket) | 666 × 411 | details mekân; home The Day etiketi |

Maske `img/mask_<şekil>.png` (pencere + 2 px), foto çerçevenin **altında**; yer tutucular `bg_page`'in çiçeksiz deniz köpüğü
kırpımlarından (`build_images.py` `PLACEHOLDERS`, süs pikseli denetimiyle). "Your photo here" yalnız önizlemede.

## Zarf: kesim, hiza, kapanış

- **Kapak + kayış** (`env_cflap`): `tema_build.kapak_kes("egri")` bu parçada yanılıyor (yuvarlak kapağın dik yan yaylarında
  sütun taraması kenar bulamıyor, kayış sütunlarında kayışın ucunu kapak kenarı sanıyor). `build_images.py`
  `cuzdan_kapak_kes`: sütun başına en güçlü parlaklık düşüşü (kayış dışında) → aykırısız eksen hizalı **elips** (xc 511,9 ·
  yc 689,9 · a 267,4 · b 240,0; 216 noktadan 194'ü) → elipsin ±10 px'inde iz (414 sütun), dik yanlarda elips (146 sütun);
  kayış deri renginden satır satır (sütun 465–560) ve kapak katmanına eklenir — kayış kapakla birlikte kalkar.
- **Ön cep** (`env_pocket`): gülümseme biçimli eğri kenar; her sütunda astarın en alt renkli pikseli → aykırısız 2. derece
  eğri (kenar: yanlarda y ≈ 751, ortada ≈ 907; dolgulu tuvalde). `tema_build.cep_kes("egri")` köşelerde astar bıraktığı için
  kullanılmadı.
- **Hiza**: `kit_check` kenarları geçiyor (sol +0,20 · sağ +0,20 · alt 0,00 %). Açık görselin kapak/gövde katlanma satırı
  kapalı zarfın üst kenarından (menteşe) 15 px aşağıda → açık katmanlar ölçülen ölçek (0,9982 × 1,0159) + ötelemeyle
  (−1,6, −24,2 px) oturtulur (`manifest.stage.align_fix`, sonrası sol/sağ/alt ≤ 1 px). Tuvalin üstüne 48 px boşluk
  eklenir (`stage.canvas_top_pad`): öteleme kayışın ucunu kesmesin.
- **Kapanış** (`manifest.closure`): çapa = kapağın en alt noktası (elips tabanı, kayış ekseni); W1.1 comp'ta ölçülen kapanış
  genişliği / zarf genişliği 0,445 ve çıtçıt topunun uçtan 0,132 × zarf genişliği yukarıda oluşu (`COMP`; her yapıda comp'tan
  yeniden ölçülüp doğrulanır). Dönüş noktası topun merkezi (`pivot_in_crop_pct` 19,6 % · 43,0 %). Karşılaştırma:
  `platform/previews/g412/compare_closure.jpg`.
- Kart yolu (`stage.card_path`): kart (zarf genişliğinin %58'i) cepte sicim ilmeği ve etiket başı görünür bekler (foto
  penceresinin en çok %4'ü cebin üstünde); `out` alt köşeler cep kenarını kart boyunun %4'ü aşar (−74,9 %), `front` %3 aşağı
  + × 1,05 (−71,9 %) → home kartına yukarı uçar.

## Açılış ve koreografi

- **Açılış** (katalog cümlesi): dokununca pirinç çıtçıt patlar (kayıştan hafifçe kalkar, × 1,08), plumerialı sekme topun
  çevresinde savrulup (72°, sarkaç gibi biraz geri) ekranın sağından çıkar → yuvarlak kapak kayışıyla menteşesinde 0→90° kalkar,
  palmiye astarlı iç yüz −90°→0 devralır → bavul etiketi kart cepten yukarı kayar; bu sırada **bir monstera yaprağı (soldan
  sağa) ve bir beyaz plumeria (sağdan sola)** ekranı geçer → kart öne gelir, home'a view transition ile uçar. Dokun → home
  4,18 s (`MOTION.envelope.go`); Skip her an.
- **Story**: ipli kraft etiketler (yazısız) teker teker ipinin tepesinden sallanarak (`swing`: 12–16° → 0, yaylanan eğri)
  yerine oturur, sonra hafifçe sallanmaya devam eder (`.tag-sway`, ±1,3°, 5,6–6,4 s; azaltılmış harekette yok); her etiketin
  köşesinde bir çiçek (plumeria, monstera, hibiskus), altında el yazısı başlık.
- Parçacıklar (`MOTION.accents`): açılışta monstera × 1 + plumeria × 1 (`across`), home'a varışta plumeria × 2 (`fall`, metnin
  yanından), rsvp kapanışında plumeria × 2 + monstera × 1.

## Comp öğe haritası (W1 → şablon)

### W1.1 zarf (`index.html`)
| Comp öğesi | Şablon | Not |
|---|---|---|
| deniz köpüğü yıkaması | `.scene-bg picture` (`lagoon`, `lagoon_wide`) | `bg_page` köşelerinde pişmiş çiçekler var: telefonda cover kırpardı → iki çiçeksiz kırpım (docs/11 §5.1) |
| sol üst / sağ alt çiçek kümeleri | `.corner-tl` / `.corner-br` (`florals_tl/br`) | ayrı katman, ekranda bütün; yazıya değerse `site.js` küçültür |
| serbest hibiskus, plumeria, monstera | `.f-hibiscus`, `.f-plumeria`, `.f-monstera` (`accent_3/1/2`) | zarfa/yazıya değen gizlenir |
| "YOU ARE INVITED" | `.env-head .kicker` (`envelope_kicker`) | |
| altın palmiye ikonlu kıl çizgi | `.orn` (1 px çizgi + GPT plumeria `accent_1`) | **sapma**: comp'taki altın palmiye ikonu bir GPT parçası değil; çizilmedi, yerine bu tasarımın plumeria'sı |
| isimler (script) | `h1.names` | |
| cüzdan + kayış | `.env-closed`, `.env-cflap` | |
| çıtçıt + sicim + plumeria | `.closure` | |
| "TAP TO OPEN" + kıl çizgi | `.env-hint` (+ `.orn`) | |

### W1.2 home (`home.html` hero)
| Comp öğesi | Şablon | Not |
|---|---|---|
| ipten sarkan bavul etiketi + pencere | `.hero-card` (`card_small`, `hero_portrait`) | comp'ta ip ekranın tepesine uzanıyor; parçanın kısa ilmeği kullanıldı (kart ekranın tepesinde) |
| "We're getting married" + kıl çizgi + "JUNE 19, 2027 · WAILEA" | `.card-copy` | kartın içindeki palmiye ikonlu çizgi yok (yer yok; ikon GPT parçası değil) |
| isimler | `h1.names` | |
| "SATURDAY · JUNE 19, 2027" | `.hero-date` | |
| "Coral Bay Resort" / "Wailea, Hawaii" (italik) | `.hero-venue`, `.hero-city` | |
| dört kutulu geri sayım | `.countdown` sade rakam + etiket | **sapma** (docs/11 §5.7): CSS kutusu yok, kutu GPT parçası da yok |
| teal "RSVP" hapı | `.hero-cta .btn` | arayüz düğmesi (CSS, §5.7 izinli) |
| kıl çizgi + nav | `.hero-orn`, `nav.site-nav` | |
| köşe kümeleri, serbest çiçekler | `.hero-bg` | |

Kısa telefonda (≤ 700 px yükseklik) etiket isimlerin soluna geçer, geri sayım ve hap altta (ilk ekran nav'ın üstünde biter,
theme-check "home first screen"); comp dikey düzeni 390 × 844 ve üstünde.

### W1.3 story (`story.html`)
| Comp öğesi | Şablon | Not |
|---|---|---|
| "Our Story" + kıl çizgi + "MOMENTS WE HOLD DEAR" | `h1.page-title`, `.orn`, `.kicker` | |
| üç ipli kraft etiket, farklı yükseklikte | `.tags .tag` (`frame_portrait`) | **sapma (telefon)**: yan yana dizilişte pencere ~ 18vw kalırdı (docs/11 §9: ≥ 38vw) → telefonda zikzak sütun (sol, sağ, sol; her etiket 54vw, pencere 42vw, sonraki ip üsttekinin yanından yükselir); ≥ 720 px comp'taki gibi tek sıra, üç yükseklik |
| köşelere sıkıştırılmış plumeria / palmiye yaprağı / hibiskus | `.tuck` (`accent_1`, `accent_2` monstera, `accent_3`) | 2. etikette comp'taki palmiye yaprağı yerine monstera (palmiye tek parça olarak yok); telefonda 3. etiketin hibiskusu **sol** üstte (zikzakta etiketin dış kenarı: sağda 2. etiketin başlığının üstüne binerdi), ≥ 720 px'te comp'taki gibi sağda |
| el yazısı başlıklar + aradaki küçük plumerialar | `figcaption` | başlıklar arası plumeria'lar yok (telefonda etiketler alt alta) |
| yazı (giriş cümlesi) | `.lede` | comp'ta yok; standart (docs/11 §3.2) |

### W1.4 details (`details.html`)
| Comp öğesi | Şablon | Not |
|---|---|---|
| yuvarlak tepeli kart + üstte sprey | `.paper.info.day-card` (`info_card`, 3 dilim 22–97 %) | 1–10 satırla uzar |
| "Order of the Day" | `h1.card-title` | |
| saat / ETKİNLİK / yer satırları | `.sched-row` (`.time`, `.label`, `.loc`) | |
| satırlar arası palmiye + plumeria sprey, kıl çizgili | `.sched-row + .sched-row::before` (`divider`) | **sapma**: yanlardaki kıl çizgiler yok — sprey satır sözde öğesi; çizgiler için her satıra ek boş öğe gerekirdi (motor `data-repeat` kopyası), sprey tek başına ayraç; 6+ satırda sprey kalkar |
| sağ alt çiçek kümesi (kartın yanında) | — | **sapma (telefon)**: kart ekran genişliğinde, küme arkasında yarım kalırdı; telefonda sayfa sonundaki `florals_br` taşır (geniş ekranda yerinde) |
| yatay kraft etiket, ip solda, mekân fotoğrafı | `.venue-tag` (`frame_landscape`, `venue`) | |
| "Coral Bay Resort" / "Wailea, Hawaii" | `.venue-name`, `.venue-place` (+ ülke) | |
| kıl çizgi + "DRESS CODE · Beach formal" | `.dress` | |
| (comp'ta yok) takvim, harita, Travel & Stay, Registry, SSS | `.cal`, `.action`, `.block`, `.faq-sec` | bu tasarımın sprey, tipografi ve düğmeleriyle |

### W1.5 rsvp (`rsvp.html`)
| Comp öğesi | Şablon | Not |
|---|---|---|
| yuvarlak tepeli kart | `.paper.info.rsvp-card` (3 dilim) | |
| "Will You Join Us?" | `h1.card-title` | |
| "KINDLY REPLY BY" + tarih | `.unit .kicker`, `.deadline` | |
| teal "RSVP" hapı | `.pill .btn` (→ `#reply`) | |
| kıl çizgili sprey | `.spray` (`divider`) | kıl çizgiler yok |
| "We can't wait to celebrate with you" | `.wait` | |
| "With love," + isimler | `.love`, `.sign` | |
| kartın alt kenarındaki çıtçıt + plumeria | `.card-snap` (`closure`) | |
| mekân, yer, kıl çizgi, dress code | `.rsvp-venue` | |
| (comp'ta yok) form, kapanış | `.reply-sec`, `.closing` | |

### Comp'u olmayan bölümler (home)
- **Davet kartı**: `info_card` (3 dilim) üzerinde ev sahibi satırı, tam adlar (tam ad yoksa ad), "&", davet cümlesi, seyahat
  etiketi gibi tarih satırı (gün adı; AY | gün | YIL iki 1 px ayraçla; saat), mekân, şehir. **Sapma**: `invitation_card`
  kullanılmadı — süsleri çapraz köşelerde (sağ üst + sol alt), kartın tam genişliğinde düz yatay bant yok; 3 dilimle
  uzatılamıyor ve telefonda düz alanı (~ %26 yükseklik × %40 genişlik) davet metnine yetmiyor. Önerilen GPT parçası Sonuç'ta.
- **Tanıtımlar**: iki kraft etiket — Story (`frame_portrait` + `story_1`, sallanarak girer) ve The Day (`frame_landscape` +
  `venue`, ilk dört program satırı).
- **Kapanışlar** (home altbilgisi, story/details sonu, rsvp kapanışı): sayfa sonunda `florals_br`.

## Bilinen sınırlar

- Zarf katmanları kaynakta en çok 567 px genişliğinde (GPT tuvali 1024; zarf ~ 560 px) — DPR 3 telefonda hafif büyütme.
- `invitation_card` temada yok (yukarıda).
- İç sayfalarda (story/details/rsvp) ilk ekranın son satırı kısa ekranlarda nav çizgisine denk gelebilir (docs/11 §11 kabul
  edilen davranış).
