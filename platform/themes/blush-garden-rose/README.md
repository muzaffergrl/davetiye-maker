# Tema: blush-garden-rose (tasarım 03 · Blush Garden Rose)

Platformun ilk gerçek teması (G038). Kaynak: onaylı G035 demosu (`collections/03_Blush_Garden_Rose/website/`).
Görseller yalnız GPT parçaları (K21); kod yerleşim, tipografi, hareket ve teknik kırpma/maske yapar.
İşaret başvurusu ve platform kuralları: `platform/README.md`.

## Dosyalar
| Dosya | İş |
|---|---|
| `theme.json` | ad, 5 sayfa, foto alanları (anahtar → içerik yolu + pencere oranı) |
| `index.html` | kapalı zarf + fiyonk → dokun → fiyonk kayar, **kapak menteşesinde kalkar**, açık kapak devralır, kart ön cebin arkasından yükselir, öne geçer → `home` (kart view transition ile hero kartına uçar) |
| `home.html` | hero (kart + foto, isimler, tarih, mekân, canlı geri sayım), davet kartı + **takvime ekle** (G051), Story / The Day / RSVP tanıtımları |
| `story.html` | Our Story — 3 altın kemer çerçeve (`story_1..3`), başlıklar `story.items.0..2.caption` |
| `details.html` | Order of the Day kartı (program satırları `data-repeat`) + **takvime ekle**, dress code, mekân (GPT yatay çerçeve + `venue`), harita, Travel & Stay, Registry, **Questions & Answers** (`faq`, G051) |
| `rsvp.html` | RSVP kartı (son tarih, düğme forma kaydırır) + **platform yanıt formu** (G042 sözleşmesi: `/rsvp/form.js`, `data-rsvp-*`; önizlemede gönderilmez; G051: çiftin ≤ 3 sorusu, yalnız katılan misafire) + fiyonklu kapanış |
| `site.css` | palet token'ları, hareket ön ayarları, foto alanı bileşeni, zarf katman yüzdeleri |
| `site.js` | `MOTION` koreografi + `ENVELOPE_GEOMETRY`; `#site-data` okur; yoksa `DEV_CONTENT` ile önizleme |
| `img/` | WebP katmanlar, foto yer tutucuları (`ph_*`), pencere maskeleri (`mask_*.png`), `manifest.json` (servis edilmez) |
| `build_images.py` | GPT parçaları → `img/` (servis edilmez) |

## Foto alanları
| Anahtar | İçerik yolu | Oran (g/y px) | Yer |
|---|---|---|---|
| `hero_portrait` | `media.hero_portrait` | 567/595 | zarftan çıkan kartın kemerli penceresi (index + home) |
| `story_1..3` | `media.memory_photos.0..2` | 626/868 | Our Story altın kemer çerçeveleri (story_1 home tanıtımında da) |
| `venue` | `media.venue_image` | 1172/681 | Details, GPT yatay altın çerçeve (G047) |

Şablonda `<img data-photo="<anahtar>">` + `.ph-mark`; platform `data-photo-state="user|placeholder"` yazar. "Your photo here"
(`.ph-mark`) yalnız önizlemede (`html[data-preview="true"]`) görünür; misafir yalnız nötr yer tutucu görseli görür. Alt metin
`data-attr-alt` ile (portre "Photo of {name_display}", hikâye başlıkları, mekân adı); yer tutucuda `alt=""`.
Panel kırpımı bu oranlarla yapmalı (G039); kırpılmamış fotoğrafta CSS `object-fit: cover` + yüz için `object-position`.

## Görselleri yeniden üretmek
```
python3 platform/themes/blush-garden-rose/build_images.py [--prep-dir DIR] [--q 80]
```
Önce `tools/parts_prep.py` (alfa kırpma, `#00FF00` pencereleri + GPT "bulut lekesi" tam şeffaf). Sonra: açık zarf →
kapak / gövde / ön cep (G035 kesimi), kapalı zarfın kapağı tırtıklı kenarı izlenerek ayrı katman (`env_cflap`),
çerçeveler + pencere maskeleri, kart serbest bölgeleri (`manifest.json` `free_zone`), petaller, zemin, nötr foto yer
tutucuları. Betik pencerenin WebP çıktısında da tam şeffaf kaldığını ve hiçbir görselde #00FF00 görünmediğini denetler.
`site.css`'teki yüzdeler `manifest.json`'dan; görsel değişirse onları da güncelle.

## Bu temayı ayarlarken
- `site.js` başındaki `MOTION` (sıra/süre) ve gerekiyorsa `ENVELOPE_GEOMETRY`; `site.css` zarf katman yüzdeleri.
- Kart metin kutuları (`.invite-text`, `.info-text`, `.card-copy`): `manifest.json` `free_zone`'a göre;
  `scripts/theme-check.cjs` metnin boyalı çiçeğe değmediğini ölçer.

**Yeni tasarım (G4NN) bu temanın kopyası değildir:** `docs/11_TEMA_STANDARDI.md` geçerlidir — yerleşim o tasarımın W1
comp'larından (sayfa başına "comp öğe haritası"), zarf tipi ve açılış katalogdaki `acilis` cümlesinden, parçacık ve story dizilişi
o tasarımdan. Buradan yalnız platform sözleşmesi (motor işaretleri, RSVP formu, `#site-data`, oturum anahtarları) ve
`data-scene`/`data-step`/`data-a` kancaları ortaktır; 03'ün aralıkları, süs konumları ve zamanlaması taşınmaz.

## Bilinen sınırlar
- Program 7+ satırda Details kartına sığmaz (1–6 satır ölçüldü; şema/panel program satırını sınırlamıyor — `docs/11` §12);
  ana sayfa tanıtımı ilk 4 satırı gösterir.
- `story.items` 3'ten fazlaysa yalnız ilk 3 başlık gösterilir (3 çerçeve); anların `text`'i ve monogram (`initials`) bu temada
  hiç gösterilmez. Panel bunları şablondan okur ve sormaz (Monogram / "A few words" yok, en çok 3 an; `lib/panel/state.ts`).
- Link blokları yalnız linkleriyle görünür: harita düğmesi `urls.map`, Travel & Stay `urls.accommodation`, Registry `urls.registry`
  (`data-if`); linksiz açık blok canlı sitede hiç görünmez (panel yayın öncesi uyarır).
- `rsvp.method` dolu (yanıtlar başka yoldan): RSVP sayfası 404 ve ona giden bütün düğme/linkler kalkar.
- Kısa telefonlarda (en-boy ≥ 1/2) boyalı arka plan ortadan büyütülür (%115 / 9:16'dan sonra %135) ki köşe çiçekleri zarf
  yazılarına değmesin; `theme-check.cjs` 360×640, 375×553, 390×690, 390×844'te yazı altındaki zemini ölçer.
- Paylaşım görseli (`og:image`) yok: ayrı bir GPT paylaşım görseli gerekiyor.
- Kartın home'a "uçması" cross-document View Transitions ister (Chromium 126+, Safari 18.2+); diğerlerinde solma.
  Gerçek iPhone/Safari ve Android cihazda denenmedi.
- RSVP misafir sayısı üst sınırı platform varsayılanı (10); tema `theme.json` `rsvp.max_guests` yazmıyor.
- G051 öğeleri yeni görsel istemedi: takvim düğmeleri `.btn-ghost` hapı (`.btn-sm`), SSS 1 px altın çizgi + "+"/"×" yazı glifi, başlık
  Great Vibes, ayraç mevcut GPT `divider` parçası. SSS en çok 12 madde (her biri açılır-kapanır; uzun liste sayfayı uzatır, karta girmez).
  Demo kaydında (`collections/03_…/content.demo.json`) örnek SSS / özel soru yok: tema demosunda bu bloklar görünmez (eklemek içerik
  kaydının sahibinin işi). Gerçek telefonda `.ics` açılışı denenmedi.
