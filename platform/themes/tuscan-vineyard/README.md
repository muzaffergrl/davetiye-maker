# Tema: tuscan-vineyard (tasarım 10 · Tuscan Vineyard, G410)

Kapaklı kraft zarf, jüt sicim + mantar + iki kurutulmuş zeytin yaprağıyla **sarılı** kapanış (docs/11 §7.1 + §7.3). Bağ bozumu
düğünü: Toskana gün batımı göğü ve tepeler, üzüm salkımı / asma yaprağı / zeytin dalı kümeleri, köşeleri kesik (isimsiz) şarap
etiketi biçimli kartlar ve çerçeveler, meşe masa. Fontlar: **Italianno** (isimler, başlıklar, caption'lar) + **Marcellus**
(bilgi, büyük harf satırları) — katalogdaki çift (Google Fonts; repoda font dosyası yok; ikisinde de `latin-ext` var → aksanlı
isimler aynı fontta).

Standart: `docs/11_TEMA_STANDARDI.md`. Platform sözleşmesi: `platform/README.md`. Görseller yalnız G210'un GPT parçaları (K21).

## Dosyalar

| Dosya | İçerik |
|---|---|
| `theme.json` | ad, 5 sayfa, 5 foto alanı (`aspect` = `img/manifest.json` `photo_slots.*.box_px`), 75 copy anahtarı (G068; `node scripts/copy-manifest.ts --theme tuscan-vineyard` üretir, `--check` temiz) |
| `content.demo.json` | `collections/10_Tuscan_Vineyard/content.demo.json`'ın birebir kopyası (`site.js` `DEV_CONTENT` = bu) |
| `index.html` … `rsvp.html` | 5 sayfa (motor işaretleri, G051 takvim/SSS/sorular, G069 misafir adları, G075 teşekkür hâli, G068 copy) |
| `site.css` | token'lar, hareket preset'leri, foto bileşeni, zarf katman yüzdeleri (manifest'ten, yorumlu), 3 dilim kartlar |
| `site.js` | `MOTION`, `ENVELOPE_GEOMETRY`, `DEV_CONTENT` + `devRender` (statik önizleme), isim sığdırma, geri sayım |
| `thank-you.css` | teşekkür modu (yalnız düğünden sonra yüklenir) |
| `build_images.py` | GPT parçaları → `img/` (kesimler, maskeler, yer tutucular, og, favicon, manifest) |
| `img/` | 48 WebP + 3 maske + `og-1200x630.jpg` + `favicon.png` + `manifest.json` |

## Foto alanları

| Anahtar | Parça (pencere) | `aspect` | Sayfalar | `object-position` |
|---|---|---|---|---|
| `hero_portrait` | `card_small` (kesik köşeli etiket penceresi, `mask_card.png`) | 505/680 | index kartı, home hero kartı | 50% 38% |
| `story_1..3` | `frame_portrait` (`mask_portrait.png`) | 737/1006 | story; `story_1` home'daki satırda da | 50% 38% |
| `venue` | `frame_landscape` (`mask_landscape.png`) — pencere ≈ 1,59:1 (prompt 3:2 istedi) | 1036/652 | details; home'daki "The Day" satırında da | 50% 50% (`cover`) |

Fotoğraf yoksa `ph_<anahtar>` (bg_page'in kümesiz gökyüzünden yumuşak, fildişine çekilmiş kırpım; en koyu piksel ≥ 175, build
denetler). "Your photo here" yalnız önizlemede.

## Görseller (`python3 platform/themes/tuscan-vineyard/build_images.py [--prep-dir DIR] [--onizleme DIR]`)

- `parts_prep` geçici klasöre koşar (tema klasörüne/`assets/`'e yazılmaz). İki çerçevenin yeşil penceresindeki koyu/yarı saydam
  leke (G210 açık kusuru) `parts_prep` `leke_doldur` ile pencereye katılır (frame_portrait 288 799 px, frame_landscape 421 735 px);
  `tema_build.foto_alani` kaynakta ve her WebP'de pencerenin tam şeffaf kaldığını denetler. Pencere çevresindeki ayrıştırma saçağı
  ve dış hattaki yarı saydam hâle 01'in yöntemiyle temizlenir (`hale_temizle`, `pencere_halkasi`, `renk_tasir`).
- **Kapak kesimi (gerçek kenar):** kraft kapağın serbest kenarının hemen içinde şarap rengi gravür asma bordürü var;
  `tema_build.kapak_kes("v")` en güçlü düşüşü bordürün asma sapında buluyordu (kesim yaprakları ortadan bölüyordu). Burada her
  kanatta eğim ± 0,08 / kayma −20…+150 px aralığında, doğru boyunca 3 satır üst − 3 satır alt parlaklık farkının **sütun
  medyanı** en büyük doğru seçilir (ışıklı kapak kenarı → gövdedeki temas gölgesi bütün kanat boyunca sürer; motifler dağınık).
  Skorlar 94,7 / 101,5; sonra sütun başına ±6 px iz + 7 sütun medyanı. Kapak ucu (509, 1161).
- **Ön cep:** iki çapraz yan kanat + üstü düz (köşeleri yuvarlak) alt kanat; astar koyu şarap zemin + krem asma deseni. Her sütunda
  astardan aşağı inilip ilk "kraft" bandı (G/R 0,66–0,86, B/R < 0,60 — krem motif B/R ≈ 0,66) aranır; sol/sağ çapraz + düz orta
  için aykırısız doğru, sütun ölçümü modelden > 6 px saparsa model (motifin kenara değdiği sütunlar), kenar 2 px yukarı.
- **Kapalı ↔ açık hiza:** `kit_check` UYARI (sol −0,10 · sağ 0,00 · **alt −1,82 %**). Açık zarfın gövdesi (menteşe kırışığı
  satır 700 … alt 1351) kapalı gövdeden (723 … 1379) ~23 px yukarıda çizilmiş: açık katmanlar ölçülen dönüşümle oturtulur —
  × (0,9989, 1,0077), öteleme (1,1, 17,6) px (`manifest.stage.align`). 90°'deki el değiştirme aynı menteşe satırında olur.
- **Kapanış (sarılı, 1:1):** `closure.png` zarfla aynı tuvalde. Sicim uçları zarf hattından taşıyordu (`kit_check` üst −2,02 %,
  alt −3,12 %): kapanışın alfası kapalı zarfın alfasıyla (1 px genişletilmiş) kırpıldı (4 552 px) — teller tam zarf kenarında
  biter. Sahnede `.closure-wrap` = zarfın kutusu (`overflow: hidden`): açılırken teller kenardan arkaya kayar, zarfın dışına
  çıkmaz. **Monogram yok:** mantar diski prompt'ta "plain natural cork disc (no branding)", W1.1'de harf yok; `initials`
  işaretlenmedi (panelde Monogram alanı bu tasarımda çıkmaz) — docs/11 §7.1 "boş mühür" gerekçesi.
- **Gökyüzü + tepeler (`sky-460.webp`):** `bg_page` telefonda (en/boy ≈ 0,46) iki köşe kümesini keserdi. Kümesiz bölge
  (kaynak x 0–460, y 660–1536: sol üst kümenin en alt zeytin yaprağı y ≤ 645, sağ alt kümenin en sol yaprağı x ≥ 465 — ölçüldü)
  telefon zemini; `decor_tl`/`decor_br` ayrı katman, ekranda bütün. Ufuk kırpımın %64'ünde (`manifest.sky.horizon_pct`); görsel
  ekrandan uzun (116 %, üstten) → tepeler ekranın ~%74'ünde başlar, "Tap to open" tepelerin üstünde kalır. Geniş/yatay ekranda
  aynı kırpımın 3 px bulanık hâli (`mist-640`, ufuk ~%85) — `bg_page`'in tamamı bulanıkken iki küme dev lekeler oluyordu.
  Uzun sayfaların sonundaki tepe bandı (`.vista`) da bu kırpım (üstü maskeyle kâğıda solar) + `decor_br`.
- **Kâğıt:** `bg_tile` kendi krem tonunda (`#FAE6CF`, `page_color`, `theme-color`); gökyüzünün şeftalisi uzun okumada fazla doygundu.
- **Meşe masa (`oak_tile`, tasarıma özel):** story masası, `brightness(.82)` (fildişi caption kontrastı).
- **Kart dilimleri (docs/11 §9):** `invitation_card` düz bant %52–88 (sol üst üzüm salkımı kağıdın %51'ine iniyor; bant yalnız
  tam genişlikte düz satırlar, `min_gen` 88), `info_card` %17–93. `card_small` `free_zone` metin denetimi için.
- og: `web_hero` alt hizalı 1.91:1 (zarf + kapanış altta tam). favicon: kapanışın düğümü (mantar + iki yaprak; uzun ince sicim
  180 px'te okunmuyordu), 41 KB.
- Tema klasörü 2,58 MB (≤ 3 MB).

## Açılış ve koreografi (`site.js` `MOTION`)

**Açılış (katalog cümlesi):** dokununca jüt sicim mantarı ve zeytin yapraklarıyla kapağın ucundan yukarı çözülür (alt tel düğüme
toplanır — `clip-path` alttan —, düğüm uçtan kalkıp tırmanır, teller zarfın kenarından arkaya kayar, söner; ilk hareket 0 ms),
kraft kapak menteşesinde 0→90° açılır (`env_cflap`), açık kapak (astar yüzü) −90°→0 devralır ve şarap rengi üzüm astarı görünür
(`env_closed` → `env_body` + `env_pocket`), kart cepten yükselirken **köşeden bir asma dalı kıvrılarak gelir** (accent_2 × 1,
tasarıma özel `path: 'curl'`: sağ üst köşenin dışından ~1 tur kapanan sarmalla kartın yanına, dönerek; `go`'dan önce söner),
kart olduğu yerde öne gelir (× 1,04, büyüyen gölge) ve home kartına uçar (view transition). Dokun → home 4,45 s.

| Adım | ms (başlangıç, süre) |
|---|---|
| hint, tug | 0 / 300, 320 |
| closure (sicim çözülür) | 0, 1050 |
| head | 160, 620 |
| lift (kapak 0→90°) | 820, 900 |
| open (gövde takası) | 860, 420 |
| flap (astar yüzü −90→0°) | 1720, 760 |
| rise / accents (dal) | 2150, 1400 / 2050 |
| forward | 3550, 650 |
| go | 4450 |

Kart yolu: `out` −90,015 % (alt köşeler cebin kenarını kartın %4'ü kadar aşar), `front` −87,015 % × 1,04 (aynı yerde öne; aşağı
dönüş yok). Kart genişliği zarfın 0,54'ü (W1.2 kartı ÷ W1.1 zarfı ≈ 0,51).

**Story:** isimsiz şarap etiketi çerçeveleri meşe masaya **tek tek bırakılır** (`place`: biraz yukarıdan, büyük gölgeyle iner,
520 ms arayla), caption'lar yazılır, sonra yanlarına bir üzüm salkımı, gümüşi bir zeytin yaprağı ve bir asma yaprağı konar
(`settle`). Home: "vineyard rows" — her satır kendi tarafından (`row-l` / `row-r`). Parçacıklar: home'a varışta 3 zeytin yaprağı
düşer (fotoğrafın yanından), rsvp kapanışında 2 zeytin yaprağı + 1 asma yaprağı süzülür.

Tasarıma özel preset'ler: `place` (etiket masaya), `settle` (meyve/yaprak), `row-l` / `row-r` (home satırları).

## Comp öğe haritası (docs/11 §8)

### index ← W1.1 `web_1_envelope.png`
| W1 öğesi | Şablon | Not |
|---|---|---|
| gün batımı göğü, puslu tepeler | `.scene-bg .scene-img` = `sky-460` (telefon), `mist-640` (yatay) | tepeler ekranın alt dörtte birinde |
| sol üst / sağ alt üzüm-zeytin kümeleri | `.corner-tl` / `.corner-br` (`decor_tl` / `decor_br`) | ekranda bütün |
| yüzen asma yaprağı + zeytin yaprağı | `.f-vine` (accent_2), `.f-olive` (accent_3) | yavaş "nefes" |
| "YOU ARE INVITED" | `.env-head .kicker` | |
| isimler (şansölye yazısı) | `h1.names` | uzun isimde `site.js` küçültür |
| kraft zarf, şarap rengi asma bordürlü V kapak | `.env-closed` + `.env-cflap` | |
| sicim + mantar + iki zeytin yaprağı (V ucunda düğüm) | `.closure-wrap > .closure` | 1:1 sarılı; monogram yok (comp'ta da yok) |
| "TAP TO OPEN" | `.env-hint` | comp'taki altındaki küçük süs çizgisi yok (sade) |
| — | `a.skip`, "Enter / Replay the opening" | platform gereği |

### home ← W1.2 `web_2_home.png`
| W1 öğesi | Şablon | Not |
|---|---|---|
| zarftan çıkan kart (etiket penceresi), "We're getting married", "SEPTEMBER 25, 2027 · MONTEPULCIANO" | `.hero-card` (`card_small` + `hero_portrait`) | tarih ve şehir/bölge iki satır; dar kartta `fitCopy` satır düşürür |
| isimler | `h1.names` | |
| "SATURDAY · SEPTEMBER 25, 2027" | `.hero-date` | |
| küçük süs çizgisi | `.hero-sprig` (GPT `divider`) | |
| mekân (italik serif), "Montepulciano, Italy" | `.hero-venue`, `.hero-city` | **sapma:** Marcellus'un italiği yok → dik (`font-synthesis: none`); şehir satırı `venue.city_region` (standart alan) |
| dört etiket biçimli geri sayım kutusu | `.countdown` sade rakam + etiket | **sapma:** kutular CSS çerçeve olurdu (K21, §5.7) |
| şarap kırmızısı RSVP hapı | `.hero-cta .btn` | arayüz hapı; comp'taki hap içi yaprak süsleri yok |
| tepeler + köşe kümeleri | hero `scene-bg` | tepelerin üstündeki metne `--halo` + kenarsız gün batımı ışığı (§5.7) |
| alt gezinme | `.site-nav` | kâğıt rengine yumuşak geçiş, geçerli sayfada 1 px altın alt çizgi (comp'taki minik fleur yok) |
| — (comp yok) | davet kartı (`invitation_card`, 3 dilim; metin salkımın sağında/altında), "Kindly reply by" + RSVP, takvime ekle, "Pour a glass, stay a while" + üç bağ sırası (story etiketi `story_1` · mekân etiketi `venue` + programın ilk 4 satırı · sicim düğümü), "Until then" + isimler + "Open the envelope again", tepe bandı | bu tasarımın parçaları; 01'in yelpaze üçlüsü / 03'ün blokları kullanılmadı |

### story ← W1.3 `web_3_story.png`
| W1 öğesi | Şablon | Not |
|---|---|---|
| "Our Story", "MOMENTS WE HOLD DEAR", süs çizgisi | `h1.page-title`, `.kicker`, `.sprig` | + giriş cümlesi (`story.intro` + tarih, §3.2) |
| arka plandaki tepeler/ufuk | — | **sapma:** başlıkla masa arası sade kâğıt (telefonda ekran yüksekliği masaya ayrıldı); tepeler sayfa sonunda (`.vista`) |
| meşe masa | `.table::before` (`oak_tile`, uzun kenarları kâğıda solar) | GPT `oak_tile` üstten görünüm: etiketler masaya **yatırılmış** okunur (comp'ta masanın arka kenarında dik duruyorlar) |
| üç etiket çerçevesi yan yana, üst üste binmeden | `.wl` × 3 (`frame_portrait` + `story_1..3`) | **sapma (§9):** telefonda yan yana pencere ~100 px (< 38vw) olurdu → basamaklı sütun (genişlik 64vw, pencere 52,6vw, ±2° eğik); ≥ 720 px yan yana |
| caption'lar etiketin içinde | `figcaption` etiketin **altında**, masada | **sapma:** GPT çerçevesinin pencere altında kağıt yok (pencere %92,7'ye iniyor, yalnız çift çizgi); fildişi Italianno + koyu hâle (`brightness(.82)` meşe üstünde ≥ 3:1) |
| üzüm, gümüşi zeytin yaprağı (masada) | `.rest-grapes` (accent_1), `.rest-olive` (accent_3), `.rest-vine` (accent_2) | |
| masa örtüsü, zeytinler | — | parça yok (W2'de yok; çizilmez) |

### details ← W1.4 `web_4_details.png`
| W1 öğesi | Şablon | Not |
|---|---|---|
| — | `.page-kicker` (gün · tarih) | docs/11 §3.2 zorunlu başlık |
| kesik köşeli uzun etiket kartı (üstte tek asma dalı), "Order of the Day" | `.paper.info.day-card` (`info_card`, 3 dilim), `h1.card-title` | 1–10 satırda kart uzar |
| satırlar: saat (aralıklı) / ETKİNLİK / yer (italik) | `.sched-row` `.time` / `.label` / `.loc` | yer dik Marcellus (italik yok) |
| satır araları minik asma dalı + salkım | `.sched-row + .sched-row::before` (GPT `divider`) | 6+ satırda yalnız boşluk |
| yatay etiket çerçevesinde mekân fotoğrafı | `.venue-photo` (`frame_landscape` + `venue`) | `object-fit: cover` (pencere 1,59:1) |
| "Tenuta del Sole", "Montepulciano, Italy", süs çizgisi, "DRESS CODE · Garden formal" | `.venue-name`, `.venue-city` (şehir, bölge, ülke), `.sprig`, `.dress` | + adres, tören cümlesi |
| — (comp yok) | takvime ekle, harita, Travel & Stay, Registry, SSS, RSVP, tepe bandı | link blokları yalnız linkiyle |

### rsvp ← W1.5 `web_5_rsvp.png`
| W1 öğesi | Şablon | Not |
|---|---|---|
| sayfa 4'teki kart, "Will You Join Us?", süs çizgisi | `.paper.info.rsvp-card`, `h1.card-title`, `.sprig` | |
| "KINDLY REPLY BY" + tarih (büyük harf) | `.kicker` + `.deadline` | |
| şarap kırmızısı RSVP hapı | `.pill .btn` → `#reply` | |
| süs çizgisi, "We can't wait to celebrate with you", "With love," + isimler | `.sprig`, `.wait`, `.love`, `.sign` | |
| kartın tabanında sicim + mantar | `.card-tie` (GPT `closure`, −90° yatırılmış) | teller kartın kenarlarında biter (zarftaki gibi sarılı); yapraklar sola-yukarı |
| — (comp yok) | yanıt formu (G042 + G051 soruları + G069 misafir adları), kapanış ("Thank you / for being part of our story", isimler · tarih, "Replay the envelope"), tepe bandı | |

## Düzenlenebilir metinler (G068)
75 standart anahtar (`STANDARD_COPY`), tasarıma özel anahtar yok. Varsayılanlar comp sözleri; `home_more` = "Pour a glass, stay a
while". `max`'lar `STANDARD_COPY` önerisi; `theme-check --stress` sonucu Sonuç'ta.

## Bilinen sınırlar
- Marcellus'un tek ağırlığı var, italiği yok: comp'taki italik serif satırlar (mekân, yerler) dik dizildi.
- Story caption'ları etiketin içinde değil (GPT çerçevesinde yer yok); uzun caption (≤ 60) masada 2–3 satır sarar.
- Comp'taki masa örtüsü, zeytin taneleri ve geri sayım kutuları parça olarak yok (önerilen GPT parçası: `countdown_tile`,
  `linen_cloth` — katalog düzeltmesi + G2NN).
- `frame_landscape` penceresi ≈ 1,59:1 (prompt 3:2): mekân fotoğrafı `cover` ile kırpılır.
