# Boho Pampas Terracotta — platform teması (tasarım 11, G411)

Kural kaynağı: `docs/11_TEMA_STANDARDI.md`. Platform sözleşmesi (işaretler, RSVP formu, `#site-data`): `platform/README.md`.
Görseller yalnız bu tasarımın GPT parçaları (`collections/11_Boho_Pampas/assets/gpt/parts/`, G211); kod şekil/dekor çizmez (K21).

## Dosyalar

| Dosya | Ne |
|---|---|
| `theme.json` | ad, 5 sayfa, 5 foto alanı (`aspect` = `img/manifest.json` `photo_slots.*.box_px`), 75 copy anahtarı (G068, hepsi standart) |
| `content.demo.json` | `collections/11_Boho_Pampas/content.demo.json`'ın bayt bayt kopyası (`site.js` `DEV_CONTENT` ile aynı) |
| `index.html` … `rsvp.html` | kapalı zarf → home → story / details / rsvp (motor işaretleri; kişisel metin yok) |
| `site.css` | token'lar, hareket preset'leri (`sunrise`, `rainbow` bu tasarımın), zarf katman yüzdeleri (manifest'ten), sayfa düzenleri |
| `thank-you.css` | teşekkür modu (G075); yalnız düğünden sonra yüklenir |
| `site.js` | `MOTION` (açılış, sahneler, parçacıklar), `ENVELOPE_GEOMETRY`, isim sığdırma + ilk ekran katlama, geri sayım, `devRender` |
| `build_images.py` | GPT parçaları → `img/` (`tools/tema_build.py`; `parts_prep` geçici klasöre); denetimler, `img/manifest.json` |
| `img/` | WebP'ler (srcset genişlikleri), `mask_*.png`, `og-1200x630.jpg`, `favicon.png`, `manifest.json` — toplam ~2,1 MB |

Yeniden üretim (repo kökünden): `PYTHONUTF8=1 python3 platform/themes/boho-pampas-terracotta/build_images.py [--onizleme <klasör>]`.

## Zarf (docs/11 §7.2 "kapak — kemer cep", §7.3)

Açılış cümlesi (katalog): *On tap, the pampas-and-palm tie slips off, the arch flap folds upward, and the card slides slowly
up out of the arch like a rising sun while a pampas plume sways in from the side.*

- **Kesimler** (`build_images.py`): kapalı zarfın yuvarlak kemer kapağı `tema_build.kapak_kes("egri")` ile serbest kenarından
  (176 nokta, artık sd 0,7 px; yöntem `renk`). Ön cep: `tema_build.cep_kes("egri")` bu görselde geometrik yedeğe düştü (astardaki
  terrakota gökkuşakları cep kağıdıyla aynı renkte, kenar ~45 px aşağı); tema kendi kesimini yapar — ortada astarın açık
  zemininden ilk kalıcı terrakota satırına, iki yanda açık kesik şeridin üst kenarına, aykırısız 4. derece polinom (artık p50
  0,26 px). Açık zarf: kapak (astarlı kubbe) / gövde / ön cep; birleşince kaynakla örtüşür (alfa farkı 0).
- **Siluet hizası** (ölçülen dönüşüm, `manifest.stage.hinge_align`): `kit_check` kenarları sol −0,29 · sağ +0,39 · alt +1,04 %
  (geçti), ama GPT açık zarfı ~200 px uzun çizdi (astarlı kubbe y 242'de başlıyor, kapalı zarf 426'da). Açık katmanlar dikeyde
  alt kenara göre × 0,824 ölçeklenir: açık zarfta kubbenin gövdeye birleştiği boğum (y≈601) = kapalı zarfın omuzu (gövdenin tam
  genişliği, y≈730), alt kenarlar aynı → iki hâl aynı kemer siluette (üst kenar farkı 9 px), açılışta gövdeye "omuz" eklenmez.
- **Katmanlar** (alttan üste): `env_flap` · `env_body` · kart · `env_pocket` · `env_closed` · `env_cflap` · `closure`.
- **Hareket** (`MOTION.envelope`, dokunmadan ms): `closure` 0–780 bağ kapağın kenarından kayıp düşer (ilk hareket anında) →
  `lift` 520–1380 kemer kapak üst kenarında 0→90° katlanır, aynı anda `open` kapalı → açık gövde → `flap` 1360–2120 astarlı kemer
  −90°→0 omuzdan kalkar (90°'de el değiştirme) → `rise` 1720–3720 kart cepten yavaşça yükselir (uzun, düzgün yavaşlama: doğan
  güneş) → `accents` 1640 bir pampas tüyü (`accent_1` × 1, `across` soldan, sarkaç gibi sallanarak, ön cebin üstünde — fotoğrafın
  üstünden geçmez) → `forward` 3760–4360 kart olduğu yerde öne (× 1,05, büyüyen gölge) → `go` 4420 home (view transition).
- **Kapanış yeri** (`manifest.closure`): çapa = kemer kapağın ucu (kenarın en alt noktası, `kapak_kes` `tip`); boy ve kayma W1.1
  comp'unda ölçüldü (zarf genişliği 493 px, kapanış kutusu yüksekliği 360 px → 0,730; kutu merkezi uçtan (+0,045, −0,143) × zarf
  genişliği; comp'ta uç bağın altında kaldığı için iki yandaki kenar sütunlarından parabolle bulundu). Görsel doğrulama:
  `previews/g411/compare_closure.jpg`. Bağın ortası boş bir mühür değil: **monogram yok** (`initials` işareti kullanılmaz;
  panel bu temada Monogram alanını göstermez).
- **Kart yolu** (`ENVELOPE_GEOMETRY`, `manifest.stage.card_path`): kart genişliği = kapalı zarfın %60'ı; açık zarfta üstü astarın
  önünde görünür, `out` −92 % (alt kenar cebin kartın genişliğindeki en yüksek noktasını kart boyunun %4'ü aşar), `front`
  −89,5 % × 1,05.
- **Sahne boyu** (docs/11 §7.1): `--obj: min(84vw, 45svh × .7201, 440px)`, sahne = `--obj / .98457`, sahnenin kapalı zarfın
  üstünde kalan kısmı (sahne genişliğinin .35129'u) başlığın altına negatif üst boşlukla girer.

## Comp öğe haritası (docs/11 §8)

### W1.1 — zarf (`index.html`)
| Comp öğesi | Şablon | Not |
|---|---|---|
| kum duvar, güneş ışınları, alttaki kemer gölgeleri | `.scene-bg .scene-img` (`bg_page`; telefonda kümeler arasındaki x 290–760 px şerit) | telefonda alt kemer gölgeleri kırpılır (2:3 sayfa 0,46 ekrana); yatay ekranda `mist` |
| sol üst / sağ alt pampas kümeleri | `.corner-tl` / `.corner-br` (`decor_tl`, `decor_br`) | ayrı katman, ekranda bütün; kısa telefonda yazıların zemini düz kalsın diye küçülür |
| serbest gül, palmiye mızrağı, pampas tüyü | `.f-rose`, `.f-spear`, `.f-plume` (`accent_3/2/1`) | zarfın iki yanındaki boşlukta |
| YOU ARE INVITED | `.env-head .kicker` (`envelope_kicker`) | Josefin Slab 600, aralıklı büyük harf |
| Luna & River (fırça script) | `h1.names` | Sacramento; `&` aynı script |
| kemerli terrakota cep + kemer kapak + bağ | `.stage` katmanları | yukarıda |
| TAP TO OPEN | `.env-hint` (`envelope_hint_tap` / `_click`) | |

### W1.2 — home (`home.html`)
| Comp öğesi | Şablon | Not |
|---|---|---|
| kemer pencereli kart + "We're getting married" + tarih · yer | `.hero-card` (`card_small`, `hero_portrait`), `.card-copy` | **sapma:** comp tarih ve şehri tek satırda yazar; kartın kâğıt bandı dar (pencerenin altı, sapın sağı): script + tarih + `venue.city_region` ayrı satırlar, sığmayan satır `fitCopy` ile düşer (önce şehir) |
| isimler | `h1.names` | |
| SATURDAY · APRIL 17, 2027 | `.hero-date` | |
| Desert Bloom Ranch (italik slab) | `.hero-venue` | |
| Joshua Tree, California (italik) | `.hero-city` | |
| dört kutulu geri sayım | `.countdown` sade rakam + etiket | **sapma (K21, §5.7):** kutular CSS ile çizilmez, GPT kutu parçası yok |
| RSVP terrakota hap | `.hero-cta .btn` | arayüz hap düğmesi |
| HOME · STORY · DETAILS · RSVP | `.site-nav` | ince çizgi + noktalar |
| köşe kümeleri, serbest parçalar | `.hero-bg` | kısa telefonda (≤ 700 px yükseklik) sağ alt küme geri sayıma binmesin diye gizlenir |
| *(comp'ta yok)* davet kartı | `.paper.invite` (`invitation_card`, 3 dilim: %40–57 düz bant) | aileler, tam adlar (yedekli), davet cümlesi, tarih bloğu, saat, mekân |
| *(comp'ta yok)* yanıt, takvime ekle | `.reply`, `.cal` | |
| *(comp'ta yok)* diğer sayfalar | `.tiles`: kemer çerçeve (story_1), kemer gün kartı (ilk 4 program satırı), bağ | telefonda tek sütun, kemer ve başlık yan yana (sırayla sola/sağa); ≥ 640 px üçü yan yana |
| *(comp'ta yok)* kapanış | `.foot` (`divider`, isimler, "Open the envelope again") | |

### W1.3 — story (`story.html`)
| Comp öğesi | Şablon | Not |
|---|---|---|
| Our Story / MOMENTS WE HOLD DEAR | `h1.page-title`, `.kicker` | |
| *(comp'ta yok)* giriş cümlesi | `.lede` (`story.intro` + tarih + ".") | |
| yan yana üç kemer çerçeve, ortadaki en uzun ve önde, aralarında boşluk | `.arches .arch` (`frame_portrait`, `story_1..3`) | **sapma (telefon, docs/11 §9):** yan yana dizilişte pencere ~70 px (< 38vw); telefonda kemerler basamaklı iner (sol · sağ · sol, her çerçeve 63vw, pencere 40vw), başlık yanında; ortadaki %4 büyük ve önde. ≥ 720 px comp dizilişi (200 / 238 / 200 px) |
| her kemerin altında script başlık | `figcaption` | |
| gökkuşağı gibi açılma | `data-a="rainbow"` | her çerçeve tabanından dışa doğru açılır (GPT çerçeveye `clip-path` daire); önce ortadaki, sonra iki yanındakiler arkasından açılır, sonra başlıklar yazılır |

### W1.4 — details (`details.html`)
| Comp öğesi | Şablon | Not |
|---|---|---|
| "Order of the Day" kemer kart | `.paper.info.day-card` (`info_card`, 3 dilim: %25–83) | 1–10 satır kartı uzatır |
| saat / ETKİNLİK / yer, satır arası pampas dalı | `.sched-row` (`.time`, `.label`, `.loc`), `divider` arka planı | 6+ satırda dal yerine boşluk |
| kemer çerçeveli mekân fotoğrafı | `.venue-photo` (`frame_landscape`, `venue`) | |
| Desert Bloom Ranch (script) | `.venue-name` | |
| JOSHUA TREE, CALIFORNIA | `.venue-text .kicker` (+ ülke) | |
| ince çizgi + DRESS CODE · Boho chic | `.dress` | tek 1 px çizgi (arayüz) |
| *(comp'ta yok)* hafta günü · tarih başlığı | `.page-kicker` | docs/11 §3.2 |
| *(comp'ta yok)* takvime ekle, harita, Travel & Stay, Registry, SSS, RSVP | `.cal`, `.action`, `.block`, `.faq-sec`, `.next-sec` | link blokları yalnız linkleriyle |

### W1.5 — rsvp (`rsvp.html`)
| Comp öğesi | Şablon | Not |
|---|---|---|
| kemer kart, "Will You Join Us?" | `.paper.info.rsvp-card`, `h1.card-title` | |
| KINDLY REPLY BY / MARCH 6, 2027 | `.rsvp-text .kicker`, `.deadline` | |
| RSVP hap | `.pill .btn` → `#reply` | |
| WE CAN'T WAIT TO CELEBRATE WITH YOU | `.wait` | |
| With love, / isimler | `.love`, `.sign` | uzun isimde sarar, kart 3 dilimle uzar |
| kartın alt kenarındaki bağ | `.card-tie` (`closure`) | |
| *(comp'ta yok)* form, sorular, misafir adları, kapanış | `.reply-box`, `.questions`, `template[data-rsvp-party]`, `.closing` | G042, G051, G069 |

## Foto alanları
| Anahtar | Pencere | `aspect` | `object-position` |
|---|---|---|---|
| `hero_portrait` | `card_small` kemer pencere | 430/700 | 50% 40% |
| `story_1..3` | `frame_portrait` kemer pencere | 556/904 | 50% 40% |
| `venue` | `frame_landscape` kemerli yatay pencere | 1043/582 | 50% 50% |

Maskeler `img/mask_card.png`, `mask_portrait.png`, `mask_landscape.png` (pencere + 2 px). Yer tutucular `bg_page`'in dekorsuz kum
bölgelerinden (en koyu piksel ≥ 175). "Your photo here" yalnız önizlemede.

## Uzun isimler, ilk ekran
`site.js` `fitNames` (01'deki motor davranışı): zarf başlığı ≤ 2,15 satır / ekranın %22'si; home isimleri ≥ 32 px
(`manifest.theme_check.first_screen.names_min_px`), sığmazsa `is-tight` → `is-long` (geri sayım hapın arkasına) → katlama
(ilk ekranın altından başlar, nav'ın altında yarım kalmaz). Kart kopyası sığmazsa satır düşer (`fitCopy`: önce şehir, sonra script).
Hero kartının yüksekliği ekrana göre: `clamp(150px, 100svh − 440px, 350px)`.

## Bilinen sınırlar
- Josefin Slab Google Fonts'ta yalnız `latin` alt kümesiyle gelir (Latin-1 aksanları var: é, ü, ñ); Orta Avrupa/Türkçe harfleri
  (ł, ş, ğ, ő …) mekân/etiket satırlarında yedek serif fonta düşer. İsimler Sacramento'da (`latin-ext` var).
- Envelope katmanlarının en geniş dosyası 648 px (GPT zarfı tuvalde 648 px genişliğinde): DPR 3'te ~%50 büyütülür.
- Açık zarf GPT'de ~%18 uzun çizildi; dikey ölçekle hizalandı (astar gökkuşakları %18 basık görünür, gözle fark edilmiyor).
