# Tasarım 03 · Blush Garden Rose — website (G035, demo / pilot)

Mobil öncelikli, çok sayfalı düğün sitesi. Görseller yalnız GPT parçaları (K21); kod yalnız yerleşim, tipografi
ve hareket. Durum: `concept` demo — yayınlanmadı, RSVP bağlı değil.

## Sayfalar
| Dosya | İçerik |
|---|---|
| `index.html` | Zarf açılışı (her tasarımda aynı akış): kapalı zarf + fiyonk → dokun → fiyonk kayar → kapak menteşede açılır → kart ön cebin arkasından yükselir, öne geçer → petaller → `home.html` (kart, view transition ile home'daki karta dönüşür) |
| `home.html` | Hero (kart, isimler, tarih, canlı geri sayım), davet kartı, Story / The Day / RSVP tanıtımları |
| `story.html` | Our Story — 3 kemerli altın çerçeve (foto yer tutucu) |
| `details.html` | Order of the Day kartı, dress code, mekân + harita, Travel & Stay, Registry |
| `rsvp.html` | RSVP yer tutucu (form yok, hiçbir veri gönderilmez) + kurdeleli kapanış |

Ortak: `site.css` (palet token'ları, hareket ön ayarları), `site.js` (zamanlama), `img/` (WebP).

## İçerik (K24 — kendi platformumuz)
Kişisel/düzenlenebilir her değer `data-field="content.demo.json yolu"` ile işaretli ve **tek kaynaktan**,
`site.js` içindeki `CONTENT` nesnesinden doldurulur; HTML'de kişisel metin yok (`make_previews.cjs` ham HTML'i tarar).
- Metin: `partners.0.display_name`, `schedule.1.time`, `rsvp.deadline` … Tarih/saat `data-format` ile
  (`weekday`, `month`, `day`, `year`; otomatik: ISO tarih → "May 15, 2027", "16:00" → "4:00 PM").
- `<a data-field="urls.*">` → href (null → `#` + "link will be added soon"); `<img data-field="media.*">` → src.
- İsteğe bağlı bölümler: `data-optional="<optional_blocks anahtarı>"` (yalnız işaret; gizleme platform işi).
- `CONTENT.story` (intro + 3 başlık) **önerilen** alan: content.demo.json'da henüz yok.
- `MOTION` (koreografi) içerikten ayrıdır.

## Foto alanları
Aynı bileşen: `.photo-slot[data-slot]` > `img[data-photo]` + `.ph-mark` (GPT petal + "Your photo here").
| Anahtar | Yer | Oran (g:y) | Şekil |
|---|---|---|---|
| `hero_portrait` | zarftan çıkan kartın penceresi (index + home hero) | 0.953 (563×591) | kemer, `img/mask_card.png` |
| `story_1..3` | story.html kemerli çerçeveler (story_1 home tanıtımında da) | 0.720 (622×864) | kemer, `img/mask_arch.png` |
| `venue` | details.html mekân | 1.5 (3:2) | yatay, kemerli üst (CSS kırpma) + GPT çiçek kümeleri |

`assets/gpt/photos/<anahtar>.jpg` (G036) gelince yalnız `build_images.py` yeniden çalıştırılır: fotoğraf pencere
oranına kırpılır, aynı `img/photo_<anahtar>-<w>.webp` adına yazılır, `img/photos.css` etiketi kapatır.
Gelmeyen anahtar için bg_scene'den yumuşak, tonlanmış yer tutucu yazılır.

## Yeni tasarım için değişecek yerler
- `site.js` en üstteki **`MOTION`**: açılış zamanlaması (`envelope`) ve her sayfadaki sıralı girişler (`scenes`).
  İşaretler: `data-scene` (grup), `data-step` (sıra anahtarı), `data-a` (giriş biçimi: rise, rise-lg, bloom,
  write, unfurl, drift-*), `data-i` (aynı adımda ek gecikme).
- `ENVELOPE_GEOMETRY` ve `site.css` içindeki zarf katmanı yüzdeleri: `img/manifest.json`'daki ölçülerden.
- Kart metin kutuları (`.invite-text`, `.info-text`, `.card-copy`): `manifest.json` → `free_zone` haritasına göre.

## Üretim ve test
```
python3 collections/03_Blush_Garden_Rose/website/build_images.py        # GPT parçaları → img/ (img_src/ ara çıktı, git'e girmez)
PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers NODE_PATH=/opt/node22/lib/node_modules \
PLAYWRIGHT_DISABLE_FORCED_CHROMIUM_PROXIED_LOOPBACK=1 node collections/03_Blush_Garden_Rose/website/make_previews.cjs
```
`make_previews.cjs` kendi yerel HTTP sunucusunu açar (view transition ve sessionStorage `file://` ile çalışmaz),
`previews/` altına PNG + MP4 + `checks.json` yazar; kontrol listesi dosyanın başında.

## Bilinen sınırlar
- Fotoğraflar yer tutucu (içerik kaydında `media` boş; G036 örnekleri henüz yok).
- Bütün URL'ler `null`: harita/konaklama/registry/RSVP düğmeleri yalnız "link will be added soon" bildirimi verir.
- Kişisel metin JS ile dolduğu için JS kapalıysa isimler görünmez; `<title>` genel, paylaşım önizlemesi (OG) yok —
  platformda sunucu tarafı doldurma gerekir.
- Kartın zarftan home'a "uçması" cross-document View Transitions ister (Chromium 126+, Safari 18.2+);
  diğer tarayıcılarda solma ile geçer. Gerçek iPhone/Safari'de denenmedi.
- Fontlar Google Fonts'tan (Great Vibes, Cormorant Garamond, Lora); repoya font dosyası girmez.
