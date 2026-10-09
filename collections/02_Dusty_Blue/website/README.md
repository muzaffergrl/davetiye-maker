# Website kaynağı — tasarım 02 Dusty Blue (G020 pilotu)

A2 düğün websitesinin **HTML kaynağı**. Canva Website'a aktarım (G021) ve diğer 19 tasarımın
website görevleri (G4NN) bu klasörün yapısını kopyalar.

Durum: `editable_draft` kaynağı — **HTML'de** test edildi. Canva import'u, Canva Form, yayın ve
canlı sayaç **test edilmedi** (HTML'de çalışması Canva'da çalışacağını kanıtlamaz).

## Dosyalar

| Dosya | Ne? |
|---|---|
| `index.html` | Tek uzun, responsive (mobil öncelikli) landing page. CSS içinde, JS yalnız geri sayım için. Fontlar Google Fonts link'i |
| `canva_import.html` | Canva static HTML import sürümü: her bölüm `data-document-role="page"` olan sabit boyutlu (1366 px genişlik) bir sayfa; JS yok |
| `make_previews.cjs` | Playwright: önizlemeler + mobil/yapı kontrolleri (aşağıda) |
| `previews/website_html_<W>px.png` | `index.html` tam sayfa, W = 360 · 390 · 430 · 768 · 1280 (HTML render, Canva değil) |
| `previews/canva_import_html_pages.png` | `canva_import.html` tüm sayfalar, küçültülmüş (HTML render) |

Görseller `../assets/layers/` içinden göreli yolla gelir (kodla çizilmiş katmanlar; AI/stok
görsel yok). Font dosyası yok.

## Bölüm yapısı (G4NN aynı sırayı ve `data-section` adlarını kullanır)

| # | `data-section` | id | İçerik (content kaydı alanı) | `data-optional` |
|---|---|---|---|---|
| 1 | `hero` | `#home` | `name_display`, mühür + `initials`, tarih (gün adıyla), `venue.name` + şehir/eyalet, **geri sayım**, "Open the invitation" → `#invitation` | `countdown` (sayaç bloğu) |
| 2 | `invitation` | `#invitation` | `host_line`, `partners[].full_name`, davet cümlesi, tarih kutusu (gün · ay/gün/yıl · saat), mekân, RSVP butonu → `#rsvp`, `rsvp.deadline` | — |
| 3 | `story` | `#story` | "Our Story" + 3 polaroid (foto yer tutucu + ayrı başlık metni) + kısa şablon metni | `our_story` |
| 4 | `details` | `#details` | "The Celebration": `schedule[]` (saat · etiket · yer), mekân kartı (`urls.map`), kıyafet kartı (`dress_code`) | `dress_code` (kart) |
| 5 | `travel` | `#travel` | Getting There (`urls.map`) · Where to Stay (`urls.accommodation`) — şablon metni | `travel_stay` |
| 6 | `registry` | `#registry` | Kısa metin + `urls.registry` butonu | `registry` |
| 7 | `rsvp` | `#rsvp` | "Kindly Reply" + `rsvp.deadline` + **Canva Form yer tutucusu** (`data-placeholder="canva-form"`) | — |
| 8 | `faq` | `#faq` | 4 soru; cevaplar yalnız content kaydındaki bilgilerden | `faq` |
| 9 | `closing` | (footer) | Mühür + kapanış cümlesi + isim · tarih | — |

İşaretler:
- `data-field="..."` = metnin geldiği content alanı (ör. `venue.name`, `rsvp.deadline`). Alıcı/entegratör eşleme için.
- `data-url="map|registry|accommodation"` = `urls.*` alanı. Demo kayıtta hepsi `null` → `href="#"` ve HTML yorumu.
- `<!-- TEMPLATE COPY -->` = content kaydında karşılığı olmayan, alıcının değiştireceği genel şablon metni
  (Our Story paragrafı, Travel & Stay ve Registry metinleri). Uydurma olgu (otel adı, havalimanı, adres) içermez.
- `data-optional` = content kaydındaki `optional_blocks` anahtarı. Demo kayıtta `countdown: false` ve `faq: false`
  olmasına rağmen pilot **tüm blokları** gösterir (şablonun yeteneğini göstermek için). Satış/alıcı sürümünde
  kaydı izlemek entegratörün kararıdır (G021); gerekiyorsa `optional_blocks` güncellenir.

## Tasarım kuralları (kopyalarken değiştirilecek yerler)

1. `:root` token'ları = `palette.json` (`ink, deep, primary, mist_top, mist_bottom, gold, gold_light, ivory, leaf`).
   Yeni tasarımda yalnız bu değerler + `--font-*` değişkenleri + görsel yolları değişir.
2. Fontlar: başlık/isim `--font-script`, gövde `--font-serif`, küçük başlık `--font-sans`; hepsi Google Fonts link'i
   ve fallback zinciriyle. Canva'da aynı adla bulunmalı (alıcı hesabında doğrulanmalı).
3. Kırılımlar: temel = mobil (≤639 px), `min-width: 640px` tablet (polaroidler 3 sütun, program 2 sütun, kartlar 2 sütun),
   `min-width: 1024px` masaüstü (üst menü linkleri görünür, isimler tek satır).
4. Dekor görselleri `position:absolute` + bölüm `overflow:hidden` — taşma yatay kaydırma yaratmaz. `body { overflow-x:hidden }`
   güvenlik ağıdır; test `document.documentElement.scrollWidth` ile yapılır.
5. Metin görsele pişirilmez: mühür monogramı (`E&T`), polaroid başlıkları, tarih kutusu hepsi HTML metnidir.
6. **Ampersand kuralı** (`print/README.md`, entegratör): Pinyon Script'in `&` glifi "v" gibi okunur. Script başlık/isimlerdeki
   `&` her zaman `<span class="amp">&amp;</span>` (tablet/masaüstü satır içi: `amp-inline`) = Cormorant Garamond italik, altın, ~0.72em.

## Geri sayım

`index.html`: `#countdown[data-target-utc]` = `date` + `ceremony_time` + `timezone` → UTC
(02 için `2027-09-18T20:30:00Z`; New York Eylül'de EDT = UTC−4). Saniyede bir güncellenir; hedef geçince
"The celebration has begun — thank you for being part of our story." gösterilir. Yeni tasarımda UTC değeri
yaz saatine dikkat edilerek yeniden hesaplanır.

`canva_import.html`: sayaç **statik yer tutucudur** (`–`). Canva'da canlı sayaç öğesi/uygulaması doğrulanmadan
"live countdown" vaat edilmez; doğrulanamazsa blok kaldırılır.

## RSVP

Gerçek form yok. `#rsvp-form-slot` kesik çizgili kutu, Canva Form'un konacağı yeri ve önerilen alanları
(Name(s) · Will you attend? Yes / No · Number of guests · A note for the couple) gösterir. Veri göndermez,
başarı mesajı yoktur. Form + yayın + A/B veri ayrımı testi GB02'nin işidir.

## Canva import (`canva_import.html`)

- Sayfalar `body`'nin doğrudan çocuğu, iç içe değil; 1366 px genişlik, sabit yükseklik:
  hero 900 · invitation 1100 · story 980 · details 1060 · travel 720 · registry 540 · rsvp 960 · faq 900 · closing 460.
- Konumlar mutlak/sabit; `<details>`, `::before/::after` içerik, `backdrop-filter`, JS kullanılmaz. Çerçeveler gerçek `div`.
- Sayfa içi linkler (`Open the invitation`, `RSVP`) `href="#"` + `data-link="invitation|rsvp"`; Canva'da sayfa bağlantısıyla kurulur.
- **Görsel yolları göreli.** Canva import aracı herkese açık URL isterse görseller ayrıca yüklenmeli ya da
  data: URI olarak gömülmelidir — bu adım G021'e aittir ve yapılmadı.

## Test (`make_previews.cjs`)

```
NODE_PATH=/opt/node22/lib/node_modules node collections/02_Dusty_Blue/website/make_previews.cjs [website_klasoru]
```

Varsayılan klasör scriptin klasörüdür; G4NN kendi klasörünü argüman olarak verir (ya da scripti kopyalar).
Kontroller: her genişlikte yatay kaydırma yok (`scrollWidth <= innerWidth`), doğrudan metin içeren hiçbir öğe
viewport dışına taşmıyor, bütün `<img>` yüklendi; `canva_import.html` için sayfa yapısı (doğrudan çocuk, iç içe değil),
her metnin kendi sayfa sınırında kalması, `<script>` olmaması. PNG'ler 1.5 MB'ı aşarsa tarayıcı canvas'ında küçültülür.
Google Fonts için Chromium `HTTPS_PROXY` üzerinden başlatılır.

## G4NN için kopyalama listesi

1. Bu klasörü `collections/<NN_Ad>/website/` altına kopyala (`previews/` hariç).
2. `:root` token'larını o tasarımın `palette.json`'ından, fontları `DESIGN_BRIEF.md`'den al.
3. `../assets/layers/` dosya adlarını o tasarımın katmanlarına göre değiştir (botanik köşeler, mühür, foto yer tutucuları, arka plan).
4. Bütün `data-field` metinlerini o tasarımın `content.demo.json`'ından doldur; `python3 tools/validate_content.py` çıktısındaki canonical metinlerle karşılaştır.
5. Geri sayım UTC hedefini yeniden hesapla.
6. Bölüm sırası, `data-section`/`data-optional`/`data-url` işaretleri ve `canva_import.html` sayfa düzeni aynı kalır; görsel dil o tasarımın brief'inden gelir.
7. `make_previews.cjs` ile önizleme + kontrol; ekran görüntülerine bakıp görsel sorunları düzelt.
