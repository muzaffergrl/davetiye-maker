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
| `home.html` | hero (W1.2: kart + foto, isimler, gün · tarih, mekân, şehir, geri sayım, RSVP hapı), davet kartı (3 dilim), takvime ekle, "More about the day" üç vinyet, kapanış |
| `story.html` | W1.3: başlık + alt başlık + giriş cümlesi, üç altın çerçeveli kart (telefonda basamaklı, ≥ 720 px'te yelpaze), başlıklar kartların altında |
| `details.html` | W1.4: Order of the Day kartı (info_card, 3 dilim, program satırları + aralarında GPT dal), takvime ekle, mekân (GPT yatay çerçeve), dress code, harita / Travel & Stay / Registry (yalnız linkle), SSS |
| `rsvp.html` | W1.5: RSVP kartı (info_card, 3 dilim) + kartın alt kenarına basılmış mühür (closure), platform yanıt formu (G042 + G051 soruları), kapanış |
| `site.css` | palet token'ları, giriş ön ayarları (`fan` bu tasarımın), foto alanı + maske, zarf katman yüzdeleri, kart 3 dilim, sayfa yerleşimleri |
| `site.js` | `MOTION` (açılış, sahneler, `accents`), `ENVELOPE_GEOMETRY`, uzun isim sığdırma, geri sayım, zarf, `DEV_CONTENT` + `devRender` |
| `build_images.py` | GPT parçaları → `img/` (servis edilmez); `tools/tema_build.py` + bu tasarımın kesimleri |
| `img/` | WebP katmanlar, `ph_*` yer tutucular, `mask_{card,portrait,landscape}.png`, `og-1200x630.jpg`, `favicon.png`, `manifest.json` (servis edilmez) |

## Foto alanları
| Anahtar | İçerik yolu | Oran (px) | Yer |
|---|---|---|---|
| `hero_portrait` | `media.hero_portrait` | 663/715 | card_small penceresi (index kartı = home hero kartı) |
| `story_1..3` | `media.memory_photos.0..2` | 653/883 | frame_portrait (story; `story_1` home vinyetinde de) |
| `venue` | `media.venue_image` | 1009/618 | frame_landscape (details) |

Foto çerçevenin **altında**, kutusu pencere + 2 px, maske `mask_<şekil>.png` (yuvarlak köşe GPT penceresinden; CSS `border-radius`
yok). `object-position` portre 50% 38%, mekân 50% 50%. "Your photo here" yalnız önizlemede (`html[data-preview="true"]`); misafir
yalnız nötr yer tutucuyu (bg_page'in sakin, güneşli bölgelerinden bulanık + fildişine tonlanmış kırpım) görür. Alt metinler
içerikten.

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
  fildişi dantel pikselleri (lum > 178, 4 px kapatma) her sütunda en alt satır + 2 px (`method: "renk"`).
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
  birlikte** menteşesinde izleyiciye doğru kalkar (tek `.env-cflap-wrap`, tek `rotateX`, 90°'de söner), altında kapalı gövde açık
  gövdeye (zeytin dallı astar + ön cep) geçer, açık kapak −90°'den yatar, fildişi kart cepten süzülerek yükselirken iki zeytin
  yaprağı (accent_1 × 2, `across`) ekranı soldan sağa geçer, kart öne gelip home hero kartına uçar (view transition). Dokun → home
  3,9 s (Skip her an).
- **Story:** üç kart elden yelpaze gibi açılır — her kart orta çizgiye toplanmış ve dik başlar, kendi eğimine dönerek yerine açılır
  (`fan` ön ayarı), altına başlığı yazılır.
- **Parçacıklar:** açılış 2 zeytin yaprağı · home'a varış 3 yasemin çiçeği süzülür · RSVP kapanışı 2 çiçek + 1 yaprak.

## Comp öğe haritası (docs/11 §8)

### index ← W1.1 `web_1_envelope.png`
| W1 öğesi | Şablon | Not |
|---|---|---|
| köşe dalları + güller (sol üst, sağ alt), güneş lekeleri | `.scene-bg .scene-img` = `bg_page` (telefon); geniş ekranda `mist` + `decor_tl/br` | aynı GPT sahnesi |
| "YOU ARE INVITED" | `.env-head .kicker` | |
| isimler (kaligrafi) | `h1.names` (+ `.amp` italik serif) | uzun isimde `site.js` küçültür |
| zeytin yeşili zarf, dantel V kapak | `.env-closed` + `.env-cflap` | |
| oval mühür + dal, V'nin ucunda | `.closure` (`.env-cflap-wrap` içinde) | boş ovalde monogram (`initials`) — comp'ta boş |
| "TAP TO OPEN" | `.env-hint` | |
| yüzen yaprak / zeytin / yasemin | — (statik değil) | açılışta GPT accent parçacıkları |
| — | `a.skip`, "Enter / Replay the opening" | platform gereği |

### home ← W1.2 `web_2_home.png`
| W1 öğesi | Şablon | Not |
|---|---|---|
| foto penceresi kart, "We're getting married", "JUNE 12, 2027 · NAPA" | `.hero-card` (card_small + `hero_portrait`) | tarih ve şehir/bölge iki satır (bölge uzun olabilir) |
| isimler | `h1.names` | |
| "SATURDAY · JUNE 12, 2027" | `.hero-date` | |
| mekân (italik), şehir (büyük harf) | `.hero-venue`, `.hero-city` | |
| dört kutulu geri sayım | `.countdown` sade rakam + etiket | **sapma:** kutular CSS çerçeve olurdu (K21, §5.7) |
| olive RSVP düğmesi | `.hero-cta .btn` | hap düğme (arayüz) |
| alt gezinme | `.site-nav` (sabit alt çubuk, 1 px altın çizgi) | |
| — (comp yok) | davet kartı (`invitation_card` 3 dilim), takvime ekle, "More about the day" (story_1 mini çerçeve, programın ilk 4 satırı, mühür), "With love" + replay | bu tasarımın parçaları ve tipografisi; 03'ün yan yana tanıtım satırları yerine ortalanmış vinyetler + GPT dal ayraçları |

### story ← W1.3 `web_3_story.png`
| W1 öğesi | Şablon | Not |
|---|---|---|
| "Our Story", "MOMENTS WE HOLD DEAR" | `h1.page-title`, `.page-head .kicker` | |
| — | `.lede` (story.intro + tarih) | standart zorunlu |
| yelpaze gibi açılmış 3 kart (orta dik ve yüksek, yanlar ±8°) | `.fan` ≥ 720 px: aynı düzen | |
| | telefon: basamaklı (−6° sol, +5° sağ, −4° sol) | **sapma:** yan yana pencereler ~85 px olurdu (< 38vw, §9); telefonda pencere 43vw |
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
- Program en çok 10 satır (şema); Order of the Day kartı uzar (3 dilim). Home "The Day" vinyeti ilk 4 satırı gösterir.
- `story.items` 3'ten fazlaysa ilk 3 başlık; anların `text`'i gösterilmez (panel sormaz). Monogram (`initials`) mühürde gösterilir.
- Link blokları yalnız linkleriyle; `rsvp.method` dolu → RSVP sayfası 404, ona giden her link kalkar.
- `favicon.png` şeffaf; `apple-touch-icon` yazılmaz (docs/11 §3.1).
- Kontrast (390 px, oluşan sayfada metnin arkasındaki piksellerin medyanı): görünen her metin ≥ 5,1:1 (en düşük: home program
  saatleri ve "Replay the envelope"). Mühürdeki monogram bilerek kabartma tonunda (≈ 2,7:1) ve yardımcı teknolojiden gizli; zarf
  içindeki küçük kart metni kapalıyken görünmez, yalnız açılışta bir an görünür ve gizlidir (`aria-hidden`).
- Denenmedi: gerçek iPhone/Safari ve Android Chrome, Vercel yayını, gerçek alıcı fotoğrafları (farklı oran/ışık), yavaş ağ.
