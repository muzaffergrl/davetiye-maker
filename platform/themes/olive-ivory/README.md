# Tema: olive-ivory (tasarım 01 · Olive & Ivory, G401)

Akdeniz bahçesi sadeliğinde zeytin dallı klasik fildişi davet: zeytin yeşili dokulu pamuk kâğıt zarf, fildişi dantel kenarlı V
kapak, oval botanik balmumu mühür + altına sıkıştırılmış zeytin dalı; Great Vibes (isimler, başlıklar) + EB Garamond (aralıklı
büyük harf satırları, italik mekân). Kurallar `docs/11_TEMA_STANDARDI.md`; motor ve platform sözleşmesi `platform/README.md`.
Yerleşim, tipografi ve hiyerarşi bu tasarımın W1 comp'larından (`collections/01_Olive_Ivory/assets/gpt/comps/web_1..5`, yalnız sade
adlar); bütün görseller bu tasarımın GPT parçaları (K21). 03 (blush-garden-rose) temasından yalnız platform sözleşmesi alındı
(motor işaretleri, RSVP formu, `#site-data`, slug'lı oturum anahtarları, `data-scene`/`data-step`/`data-a` kancaları ve
`devRender` yedeği); aralıklar, süs konumları, zamanlama, kart oranları ve bölüm sırası bu tasarımın.

## Dosyalar
| Dosya | İş |
|---|---|
| `theme.json` | ad "Olive & Ivory", 5 sayfa, 5 foto alanı (oranlar = `img/manifest.json` `photo_slots.*.box_px`) |
| `content.demo.json` | `collections/01_Olive_Ivory/content.demo.json`'ın birebir kopyası (`/start?theme=olive-ivory` ve tema demosu bunu kullanır; servis edilmez) |
| `index.html` | kapalı zarf → dokun → kapak + mühür menteşede birlikte kalkar, açık kapak devralır, kart cepten süzülür, iki zeytin yaprağı ekranı geçer, kart öne gelir → home (view transition) |
| `home.html` | hero (W1.2: kart + foto, isimler, gün · tarih, mekân, şehir, geri sayım, RSVP hapı), davet kartı (3 dilim) + tek "Kindly reply by" satırı, takvime ekle, üç sayfanın yelpaze üçlüsü (story çerçevesi · günün kartı · mühür), kapanış |
| `story.html` | W1.3: başlık + alt başlık + giriş cümlesi, üç altın çerçeveli kart el yelpazesi gibi (telefonda kaydırılan yelpaze, ≥ 720 px'te comp dizilişi), başlıklar kartların altında |
| `details.html` | W1.4: Order of the Day kartı (info_card, 3 dilim, program satırları + aralarında GPT dal), takvime ekle, mekân (GPT yatay çerçeve), dress code, harita / Travel & Stay / Registry (yalnız linkle), SSS |
| `rsvp.html` | W1.5: RSVP kartı (info_card, 3 dilim) + kartın alt kenarına basılmış mühür (closure), platform yanıt formu (G042 + G051 soruları), kapanış |
| `site.css` | palet token'ları, giriş ön ayarları (`fan` bu tasarımın), foto alanı + maske, zarf katman yüzdeleri, kart 3 dilim, sayfa yerleşimleri |
| `site.js` | `MOTION` (açılış, sahneler, `accents`), `ENVELOPE_GEOMETRY`, uzun isim sığdırma, geri sayım, zarf, story yelpazesi (`initFan`), `DEV_CONTENT` + `devRender` |
| `build_images.py` | GPT parçaları → `img/` (servis edilmez); `tools/tema_build.py` + bu tasarımın kesimleri |
| `img/` | WebP katmanlar, `ph_*` yer tutucular, `mask_{card,portrait,landscape}.png`, `og-1200x630.jpg`, `favicon.png`, `manifest.json` (servis edilmez) |

## Foto alanları
| Anahtar | İçerik yolu | Oran (px) | Yer |
|---|---|---|---|
| `hero_portrait` | `media.hero_portrait` | 663/715 | card_small penceresi (index kartı = home hero kartı) |
| `story_1..3` | `media.memory_photos.0..2` | 653/883 | frame_portrait (story; `story_1` home üçlüsünde de) |
| `venue` | `media.venue_image` | 1009/618 | frame_landscape (details) |

Foto çerçevenin **altında**, kutusu pencere + 2 px, maske `mask_<şekil>.png` (yuvarlak köşe GPT penceresinden; CSS `border-radius`
yok). `object-position` portre 50% 38%, mekân 50% 50%. "Your photo here" yalnız önizlemede (`html[data-preview="true"]`); misafir
yalnız nötr yer tutucuyu (bg_page'in sakin, güneşli bölgelerinden bulanık + fildişine tonlanmış kırpım) görür. Alt metinler
içerikten. qa-kontrol 2026-10-14: mekân yer tutucusunun eski kırpımı (220, 560, 1000, 1080) sağ altta alt kümenin bulanık koyu
yaprak ucunu alıyordu (en koyu 136); yeni kırpım (0, 760, 760, 1225) sol orta güneş lekeleri, en koyu 216. `build_images.py`
her yer tutucunun en koyu pikselini ölçer (`manifest.ph_*.min_lum`; < 175 → çıkış ≠ 0).

## Görseller (`python3 platform/themes/olive-ivory/build_images.py [--prep-dir DIR] [--onizleme DIR]`)
- `tools/parts_prep.py` **geçici klasöre** (alfa kırpma, #00FF00 pencereleri + leke dolgusu, `windows.json`).
- **GPT kusurları temizliği (çizim yok):** (1) dış hatta yarı saydam hâle — frame_portrait'te 2–8 px'e uzanan alfa ≤ 33 gri hâle,
  decor/closure'da sıcak/yeşil düşük alfa kuyruk: alfa < 12 sıfır + yeniden ölçek, çekirdekten uzak (sert parça 1 px, suluboya 3 px)
  piksel silinir, yarı saydam kenarın rengi komşu opak renge çekilir, yeşil baskınlık sınırlanır; (2) pencereler saf #00FF00 değil
  (≈ 5, 241, 1; frame_landscape'te koyu yarı saydam leke): parts_prep leke dolgusu + pencere çevresi 3 px halkada kalan
  pembe/turuncu ayrıştırma saçağı (card_small'da ortalama 217, 126, 55) halkanın 4–10 px dışındaki çerçeve renginden yeniden
  boyanır; (3) Pillow'un önçarpımlı küçültmesi şeffaf piksellerin rengini siyaha çekiyor, kayıplı WebP bunu kenara karıştırıp
  koyu/yeşil saçak yapıyordu → kaydetmeden önce şeffaf piksellere komşu renk taşınır (`renk_tasir`).
- **Kapak kesimi** (`env_cflap`): `tema_build.kapak_kes("v")` V doğrularını buluyor ama en güçlü parlaklık düşüşü dantelin delikli
  iç kısmına düştüğü için danteli ortadan bölüyordu (fisto sırası gövdede kalıyordu). Kesim dantelin **dış kenarından**: V bandında
  fildişi dantel pikselleri (lum > 178, 4 px kapatma, **3 px açma**) her sütunda en alt satır + 2 px (`method: "renk"`); arama bandı
  V'nin 62 px altına kadar. G401 incelemesi: eskiden sol yan kanadın ışıklı katı (2–3 px açık çizgi) danteli 28 sütunda ~80 px aşağı
  uzatıyor, kapak açılırken dantelin altında zeytin yeşili bir dil sallanıyordu. Şimdi açma ince çizgiyi siler; ayrıca kenarın V'ye
  göre kayması 101 sütunluk kayan medyandan 22 px'ten fazla saparsa komşulardan doldurulur ve **sert denetim** (çıkış ≠ 0): komşu
  sütun sıçraması ≤ 24 px, doldurulan sütun ≤ %6 (`manifest.stage.cuts.cflap.continuity`: 0 sütun, en büyük sıçrama 9,1 px).
- **Ön cep** (`env_pocket`): cep sivri V değil, düz üst kenarlı trapez; `cep_kes("v")` ucu 40 px aşağıda sivri V buluyordu. Kesim
  her sütunda astarın fildişi zemininden aşağı ilk kalıcı cep kâğıdı; sol çapraz, sağ çapraz ve düz orta için aykırısız doğru;
  artık p50 < 1 px.
- **Menteşe hizası** (`manifest.stage.hinge_align`): `kit_check` kenarları (sol +0,29 · sağ −0,39 · alt −0,65 %) geçiyor, ama
  GPT açık arka panelin üst kenarını kapalı katlanma çizgisinden ~60 px yukarıda çizdi; açık katmanlar alt kenara göre dikeyde
  × 0,931 ölçeklendi → 90°'de kapak aynı menteşe çizgisinde el değiştirir.
- **Kapanış** (`closure.png` = mühür + dal tek parça): yeri kesim geometrisine bağlı — çapa = dantel V'sinin ucu; W1.1 comp'ta
  ölçülen mühür yüksekliği / zarf genişliği (0,282) ve mühür merkezinin uca göre kayması (−0,118 × zarf genişliği) uygulanır;
  mühür merkezi = boş ovalin merkezi (görüntüden). Monogram (`initials`) bu ovalin içinde (`.seal-mono`), mühürle birlikte döner.
  Gözle karşılaştırma: `platform/previews/g401/compare_closure.jpg`.
- Kartlar: `free_zone` + 3 dilim sınırları (`slices`: yalnız tam genişlikte düz kâğıt satırları gerilir — davet kartında %49–63,
  info kartında %17–91). og: `web_hero` alt hizalı 1.91:1; favicon: closure. Denetimler: pencere şeffaflığı, görünür yeşil,
  açık zarf katmanları ↔ kaynak (alfa farkı 0,005), kapak kapalı zarfın içinde, tema klasörü ≤ 3 MB.

## Açılış ve koreografi (`site.js` `MOTION`)
- **Açılış:** dokununca balmumu mühür bırakırken hafifçe kalkar (≤ 250 ms ilk hareket), dantel kenarlı kapak **mühür ve dalıyla
  birlikte** menteşesinde izleyiciye doğru soyulur gibi kalkar (tek `.env-cflap-wrap`, tek `rotateX`; 920 ms, yumuşak başlangıç:
  %30'da 22°, 80°'den sonra sarmalayıcı söner — kenardan ezik mühür şeridi görünmez), altında kapalı gövde açık gövdeye (zeytin
  dallı astar + ön cep) geçer, açık kapak −90°'den yatar, fildişi kart cepten süzülerek yükselir — iki zeytin yaprağı (accent_1 × 2,
  `across`) biri kartın üstündeki, biri zarfın altındaki bantta ekranı soldan sağa geçer (fotoğrafın üstünden geçmez; 1,3 s'de
  kalkar, ~2,3 s'de geçer, `go`dan önce ekrandan çıkar — süre `go`ya göre kırpılır) — kart
  **yukarıda kalır**: alt köşeleri cebin kenarını aştıktan sonra (`out` −87 %) olduğu yerde öne gelir (`front` −84 % × 1,04, büyüyen
  gölge; z-index takasında köşe atlamaz) ve view transition ile home hero kartına yukarı doğru uçar (yukarı–aşağı–yukarı yok).
  Home'da hero kartı ilk kareden görünür (`.from-envelope .hero-card[data-step]`), geçiş görünür karta iner; isimler kart inerken
  yazılmaya başlar (`arriveDelay` 0, eskiden 700: MP4'te kart indikten sonra ~1,3 s boşluk vardı). Dokun → home ≈ 4,2 s
  (Skip her an). Zarf kartı `view-transition-name`'i yalnız açıkken ya da `go(true)`'da alır: "Replay the envelope"da kapalı
  zarfın üstünde kırpılmamış kart uçuşmaz; `?replay=1` `<head>` betiğinde de kapalı başlar.
- **Story:** üç kart el yelpazesi gibi açılır — orta kart yükselir, yan kartlar onun arkasında toplanmış ve dik başlayıp 8°
  eğimlerine dönerek açılır (`fan`), sonra başlıklar yazılır. Telefonda aynı el **kaydırılan bir yelpaze** (scroll-snap): ortadaki
  kart dik ve biraz yukarıda, komşuları kenarlardan 8° dışa eğik görünür ve fildişi kenarlarından onun altına girer; yalnız ortadaki
  kartın başlığı görünür; sayfa orta kartla açılır (`initFan`). Kart 64vw, foto penceresi 64 × 0,789 = **50vw** (≥ 38vw).
  Altında arayüz yazısıyla kaydırma ipucu `‹ 2 / 3 ›` (`.swipe-nav`, yalnız telefonda ve JS ile; oklar yelpazeyi bir kart kaydırır,
  sayaç ortadaki kartı izler; çizim yok).
- **Parçacıklar:** açılış 2 zeytin yaprağı · home'a varış 3 yasemin çiçeği süzülür (hero fotoğrafının iki yanındaki şeritlerden,
  fotoğrafın/yüzlerin üstünden asla: `avoid`) · RSVP kapanışı 2 çiçek + 1 yaprak.

## Comp öğe haritası (docs/11 §8)

### index ← W1.1 `web_1_envelope.png`
| W1 öğesi | Şablon | Not |
|---|---|---|
| köşe dalları + güller (sol üst, sağ alt), güneş lekeleri | telefon: `bg_page`'in çiçeksiz güneşli sağ üst kırpımı (kaynak x 590–1024, y 0–940) kâğıt + `decor_tl` / `decor_br` ayrı katman, ikisi de ekranda tam; geniş ekranda `mist` + aynı kümeler | G401 incelemesi: `bg_page` telefonda (en/boy ≈ 0,46) her yandan ~%15 kırpılıyor, iki gül kümesi de kesiliyordu |
| "YOU ARE INVITED" | `.env-head .kicker` | |
| isimler (kaligrafi) | `h1.names` (+ `.amp` italik serif) | uzun isimde `site.js` küçültür |
| zeytin yeşili zarf, dantel V kapak | `.env-closed` + `.env-cflap` | |
| oval mühür + dal, V'nin ucunda | `.closure` (`.env-cflap-wrap` içinde) | boş ovalde monogram (`initials`) — comp'ta boş |
| "TAP TO OPEN" | `.env-hint` | |
| yüzen yaprak / zeytin / yasemin | `.float` (accent_1/2/3, telefonda statik, yavaş "nefes") | ayrıca açılışta 2 zeytin yaprağı parçacığı |
| — | `a.skip`, "Enter / Replay the opening" | platform gereği |

### home ← W1.2 `web_2_home.png`
| W1 öğesi | Şablon | Not |
|---|---|---|
| foto penceresi kart, "We're getting married", "JUNE 12, 2027 · NAPA" | `.hero-card` (card_small + `hero_portrait`) | tarih ve şehir/bölge iki satır (bölge uzun olabilir) |
| isimler | `h1.names` | |
| "SATURDAY · JUNE 12, 2027" | `.hero-date` | |
| mekân (italik), şehir (büyük harf) | `.hero-venue`, `.hero-city` | |
| dört kutulu geri sayım | `.countdown` sade rakam + etiket | **sapma:** kutular CSS çerçeve olurdu (K21, §5.7) |
| olive RSVP düğmesi | `.hero-cta .btn` | hap düğme (arayüz); uzun telefonda sağ alt küme hapın altında, 9:16 ve daha basık telefonda (360×640, 375×553, 375×667, 390×690) comp'taki gibi hapın yanında; hap ile yaprak uçları arası ≥ 16 px (ölçüldü: 20–37 px) |
| köşe kümeleri | `decor_tl` / `decor_br` (hero `scene-bg`) | ilk ekranın içeriği (kart … hap) her boyutta nav'ın 8+ px üstünde biter (qa 2026-10-14 düzeltmesi: 360×640 ve 375×553'te hap nav'ın altındaydı; boyutlar svh ile okunur tabanlara iner, kısa telefonda sıkı düzen, uzun isim + mekânda `fitNames` → `.is-tight`). `decor_br`'nin altı kesilmez: son sıraları kâğıda incelir (maske), sağ kenarı ekran kenarı |
| alt gezinme | `.site-nav`: kâğıt üstünde bir yazı satırı + yazı genişliğinde 1 px altın çizgi, kenarsız yumuşak zemin | opak bant yok: boyalı köşeler altında düz çizgiyle kesilmez |
| — (comp yok) | davet kartı (`invitation_card` 3 dilim) + tek "Kindly reply by" satırı, takvime ekle, "Pull up a chair" üçlüsü (story_1 çerçevesi −7° · günün kartı `info_card` ilk 4 satır · monogramlı mühür +7°; story yelpazesinin yankısı), "Until then" + isimler + "Open the envelope again" | bu tasarımın parçaları ve dili; 03'ün blok sırası/teaser metinleri kullanılmaz (G401 incelemesi) |

### story ← W1.3 `web_3_story.png`
| W1 öğesi | Şablon | Not |
|---|---|---|
| "Our Story", "MOMENTS WE HOLD DEAR" | `h1.page-title`, `.page-head .kicker` | |
| — | `.lede` (story.intro + tarih) | standart zorunlu |
| yelpaze gibi açılmış 3 kart (orta dik ve yüksek, yanlar ±8°) | `.fan` ≥ 720 px: aynı düzen; yanlar merkezleri etrafında ±8° döner, orta karta kartın %6'sı kadar (yalnız fildişi kenar) girer, orta kart %4 yukarıda ve üstte | |
| | telefon: kaydırılan yelpaze (orta kart dik + %3 yukarıda, komşular ±8° kenarlardan) | **sapma:** yan yana pencereler ~85 px olurdu (< 38vw, §9); telefonda kart 64vw, pencere 50vw; yalnız ortadaki kartın başlığı görünür |
| kart üstünde başlık | `figcaption` kartın altında | görev metni: "each caption sits under its own card"; 60 karakterlik başlık kart kenar boşluğuna sığmaz |
| köşe dekoru | `.page-corner` decor_tl (başlık), decor_br (sayfa sonu) | |

### details ← W1.4 `web_4_details.png`
| W1 öğesi | Şablon | Not |
|---|---|---|
| "Order of the Day" kartı, üst ortada dal | `.day-card` (info_card 3 dilim) + `h1.card-title` | kart içerikle uzar/kısalır (1–10 satır) |
| saat · ETKİNLİK / yer (italik) | `.sched-row` | |
| satır arası küçük dal + çizgiler | `::before` GPT `divider` | **sapma:** dalın iki yanındaki çizgiler yok (gereksiz CSS çizgi); 6+ satırda yalnız boşluk |
| — | `.page-kicker` gün · tarih | standart zorunlu başlık tarihi |
| mekân fotoğrafı çerçevede | `.venue-photo` (frame_landscape + `venue`) | |
| mekân (italik), şehir | `.venue-name`, `.venue-text .kicker` (+ ülke, adres, tören cümlesi) | |
| "DRESS CODE · Formal Attire" çizgiler arasında | `.dress` | iki tek 1 px çizgi (arayüz ayracı) |
| — | takvime ekle, harita, Travel & Stay, Registry, SSS, RSVP | yalnız içerik/link varsa |

### rsvp ← W1.5 `web_5_rsvp.png`
| W1 öğesi | Şablon | Not |
|---|---|---|
| kart + üstte dal | `.rsvp-card` (info_card 3 dilim) | |
| "Will You Join Us?" | `h1.card-title` (tek satır) | |
| "KINDLY REPLY BY", tarih | `.kicker`, `.deadline` | `data-if="rsvp.deadline"` |
| RSVP düğmesi | `a.btn[href="#reply"]` | forma kaydırır |
| "WE CAN'T WAIT TO CELEBRATE WITH YOU" | `.wait` | |
| "With love," + isimler | `.love`, `.sign` | uzun isimde sarar |
| alt kenara basılı mühür + dal | `.card-seal` (closure) + monogram | |
| — | yanıt formu, kapanış ("Thank you"; yanıttan sonra gizlenir) | platform sözleşmesi |

## Bilinen sınırlar
- Program en çok 10 satır (şema); Order of the Day kartı uzar (3 dilim). Home üçlüsündeki günün kartı ilk 4 satırı gösterir.
- Details tören cümlesi yalnız saati söyler ("The ceremony begins at 4:00 PM."): programın ilk satırı tören olmayabilir.
- Genişlik sapmaları (docs/11 §5.1): `closure-320/640` (480/960 değil — mühür CSS'te en çok ~215 px, DPR 3'te 640 yeter),
  `accent_2-156` (zeytin parçası dik: 200 px yükseklik sınırında genişliği 156 px).
- `story.items` 3'ten fazlaysa ilk 3 başlık; anların `text`'i gösterilmez (panel sormaz). Monogram (`initials`) mühürde gösterilir.
- Link blokları yalnız linkleriyle; `rsvp.method` dolu → RSVP sayfası 404, ona giden her link kalkar.
- `favicon.png` şeffaf; `apple-touch-icon` yazılmaz (docs/11 §3.1).
- Kontrast (390 px, oluşan sayfada metnin arkasındaki piksellerin medyanı): görünen her metin ≥ 5,1:1 (G401 ilk ölçümü; inceleme
  düzeltmelerinden sonra yeniden ölçülmedi). Mühürdeki monogram (zarf, home üçlüsü, RSVP) bilerek kabartma tonunda (`--seal-ink`
  #735E2E + basılı gölge; G401 incelemesinde koyulaştırıldı) ve yardımcı teknolojiden gizli; zarf
  içindeki küçük kart metni kapalıyken görünmez, yalnız açılışta bir an görünür ve gizlidir (`aria-hidden`).
- Yazı tabanı (qa 2026-10-14): görünen her metin ≥ 11 px — kart kopyası (index kartı = home hero kartı; harf aralığı .12em, kopya
  alanı %7,5 iç boşluk), üçlüdeki saatler, RSVP kartındaki "We can't wait…", geri sayım etiketleri, "Read/Details/Reply". Hero
  kartı bu yüzden en az 150 px (375×553'te 150 × 216). Android'de dokunma dikdörtgeni yok (`-webkit-tap-highlight-color`), odak
  halkaları duruyor.
- Köşe kümeleri hiçbir yerde düz çizgiyle kesilmez: hero ve sayfa sonlarında `decor_br`'nin alt sıraları kâğıda incelir (maske),
  geniş RSVP'de (≥ 960 px, 1040 px ızgara) iki köşe de ızgaranın değil sayfanın kenarında.
- Denenmedi: gerçek iPhone/Safari ve Android Chrome, Vercel yayını, gerçek alıcı fotoğrafları (farklı oran/ışık), yavaş ağ.
