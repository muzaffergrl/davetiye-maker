# 11 — Tema standardı (19 tasarım → platform teması, G4NN)

Görev G046. Kalan 19 tasarımın (01, 02, 04–20) her biri bu belgeye göre `platform/themes/<slug>/` altında platform teması
olur (görevler **G401–G420**, G403 hariç). Belge **gerçek temadan** çıkarıldı: `platform/themes/blush-garden-rose/`
(tasarım 03, G038; onaylı, Vercel'de yayında) — `theme.json`, 5 şablon, `site.css`, `site.js` (`MOTION`,
`ENVELOPE_GEOMETRY`), `build_images.py`, `img/manifest.json`; ayrıca `tools/parts_prep.py`, `tools/katalog.py` (`WEB`,
`ZARF_TIPI`) ve PAKET 5 prompt'ları (06 gatefold, 09 kese, 13 kitap, 18 kılıf, 04 şerit, 11 kemer cep, 12 cüzdan).
Ortak görsel hattı (G054): `tools/tema_build.py` (§5.4) ve `tools/kit_check.py` zarf hizası (§5.2, §7.1).

Öncelik: kullanıcı talebi → `AGENTS.md` → bu belge → `platform/README.md` (motor ve platform sözleşmesinin **tek kaynağı**;
burada özetlenen işaret/RSVP kuralları değişirse README geçerlidir) → G4NN görev metni → örnek tema. **G4NN görev metni bu
belgeyle çelişirse bu belge geçerlidir.** G035 kaynağı (`collections/03_Blush_Garden_Rose/website/`, README'si dahil) örnek
değildir — yalnız build yardımcıları için bakılır (§5.4); 03 temasının `README.md`/`site.js` başlığındaki "yalnız `MOTION`'u
değiştir" notları 03'ün kendi ayarı içindir, G4NN'ye uygulanmaz (§8). "**Zorunlu**" = G4NN bitmiş sayılmaz;
"**önerilir**" = gerekçesiyle atlanabilir (Sonuç'a yazılır).

Temel kurallar (değişmez):
- **K21:** bütün görseller GPT parçasıdır. Claude kırpar, keser, maskeler, ölçekler, bulanıklaştırır, hareket ettirir;
  **şekil/dekor çizmez** (SVG süs, CSS ile çizilmiş çerçeve/çiçek/mühür/yıldız yok). İzinli CSS: §5.7.
- **K23:** her tema kapalı zarf sayfasıyla açılır, dokununca zarf **tasarıma özgü** sırayla açılır, kart home'a geçer;
  sayfalar sıralı koreografiyle girer. Nesneler ayrı hareket eder; tüm ekranı zoom/fade yetmez (AGENTS şart 4).
- **K24:** kişisel her değer sunucuda içerikten HTML'e yazılır; görsele pişirilmez, şablonda sabit kalmaz.
- Ürün metni İngilizce; tarih asla `06/12/27` gibi değil (motor biçimler).

---

## 0. Hat bir bakışta

```
G2NN (GPT)  collections/NN_*/assets/gpt/{comps,parts,photos}/      PAKET 5 W1 (5 comp) + W2 (17–19 parça) + PAKET 2 (5 foto)
   │        python3 tools/kit_check.py collections/NN_* --paket 5   (ve --paket 2)
   ▼
G4NN        platform/themes/<slug>/build_images.py   (yardımcılar: tools/tema_build.py, G054)
             ├─ tools/parts_prep.py → GEÇİCİ klasör (alfa kırpma, #00FF00 pencere → şeffaf + windows.json, kirpma ofsetleri)
             ├─ zarf tipine göre kesim (§7), maskeler, serbest bölgeler, yer tutucular, og görseli + favicon, hiza ölçümü
             └─ img/*.webp (srcset genişlikleri) + img/mask_*.png + og-1200x630.jpg + favicon.png + img/manifest.json
                (+ denetimler, hata → çıkış ≠ 0)
            şablonlar (5 sayfa, motor işaretleri) + site.css (token, preset, katman yüzdeleri) + site.js (MOTION)
            tests/theme-<slug>.test.ts (node:test) + theme-check --theme (Playwright, G052) + previews/g4NN/ + Sonuç
```

---

## 1. Klasör düzeni (zorunlu)

```
platform/themes/<slug>/
  theme.json           ad, 5 sayfa, foto alanları (§2)
  content.demo.json    temanın demo kaydı (§2.1) — /start ve tema demosu bunu kullanır; servis edilmez (.json)
  index.html           kapalı zarf açılış sayfası  (/<slug>)
  home.html            /<slug>/home
  story.html           /<slug>/story   (<body data-optional="our_story">)
  details.html         /<slug>/details
  rsvp.html            /<slug>/rsvp    (<body data-if="!rsvp.method">)
  site.css             token'lar, hareket preset'leri, foto bileşeni, zarf katman yüzdeleri (manifest'ten)
  site.js              MOTION + zarf geometrisi + DEV_CONTENT; bütün sayfaların ortak davranışı
  build_images.py      GPT parçaları → img/ (servis edilmez)
  README.md            tema notu: dosyalar, foto alanları, zarf kesimi, comp'tan sapmalar, bilinen sınırlar
  img/                 <parça>-<genişlik>.webp, mask_<şekil>.png, og-1200x630.jpg, favicon.png, manifest.json
```

- `<slug>` = G4NN görevindeki klasör adı (ör. `art-deco-black-tie`), `[a-z0-9_-]`; `theme.json` `id` ile aynı.
- Tema klasörüne **girmez:** `parts_prep` çıktısı / kaynak PNG'ler (`img_src/` dahil), önizlemeler, font dosyaları, test
  dosyaları, `node_modules`, kullanılmayan görsel. Sebep: `next.config.ts` `./themes/**/*`'ı **her tema rotasının** Vercel
  fonksiyon paketine kopyalıyor (17 rota, `next.config.ts` `THEME_ROUTES`). Tema klasörü toplamı **≤ 3 MB** (03: 2,7 MB).
  `parts_prep` çıktısı geçici klasöre gider (03'ün `build_images.py`'si gibi; `--prep-dir` ile dışarıda); G4NN görev metinleri
  G046 incelemesinde buna göre düzeltildi.
- Servis edilen uzantılar: `css js mjs png jpg jpeg webp avif gif svg ico mp4 webm`. `.html` yalnız `theme.json` sayfası
  olarak, `.json`/`.py`/`.md` hiç servis edilmez.

## 2. `theme.json` (zorunlu alanlar)

```json
{
  "id": "art-deco-black-tie",
  "name": "Art Deco Black-Tie",
  "version": "1.0.0",
  "pages": { "index": "index.html", "home": "home.html", "story": "story.html", "details": "details.html", "rsvp": "rsvp.html" },
  "photos": {
    "hero_portrait": { "label": "Portrait on the invitation card", "source": "media.hero_portrait",     "aspect": "567/595" },
    "story_1":       { "label": "Our Story photo 1",               "source": "media.memory_photos.0",   "aspect": "626/868" },
    "story_2":       { "label": "Our Story photo 2",               "source": "media.memory_photos.1",   "aspect": "626/868" },
    "story_3":       { "label": "Our Story photo 3",               "source": "media.memory_photos.2",   "aspect": "626/868" },
    "venue":         { "label": "Venue photo",                      "source": "media.venue_image",       "aspect": "1172/681" }
  }
}
```

(`aspect` değerleri örnekte 03'ünkiler; yeni temada kendi `manifest.json`'ından gelir.)

| Alan | Kural |
|---|---|
| `id` | klasör adı (motor eşitliği denetler) |
| `name` | katalogdaki tasarım adı, İngilizce (`/start` ve panel gösterir); marka adı uydurulmaz |
| `version` | semver; görsel/şablon değişince artar |
| `pages` | beşi de zorunlu (standart); `index` motor için zaten zorunlu |
| `photos.<anahtar>` | anahtarlar **sabit**: `hero_portrait`, `story_1..3`, `venue` (= PAKET 2 dosya adları; `npm run seed -- --photos` dosya adını anahtar sayar). `label` İngilizce (panel). `source` yalnız `media.hero_portrait`, `media.memory_photos.<0..3>`, `media.venue_image` (panelin düzenleyebildiği yollar). `aspect` = foto penceresi kutusu **px** `"g/y"` — `manifest.json` `photo_slots.<şekil>.box_px`'ten; panel kırpımı bu orana yapar |
| `rsvp.max_guests` | isteğe bağlı (1..20, yoksa 10); yalnız tasarım gerekçesi varsa |
| `internal` | satılık temada **yazılmaz** (`true` = `/start`'ta görünmez) |

Başka alan eklenmez (motor okumaz); tasarım verisi `site.css`/`site.js`'te durur.

### 2.1 `content.demo.json`
- `collections/NN_*/content.demo.json`'ın kopyası; `record_kind: "demo"`, kurgu isimler, bütün URL'ler `null`
  (`tools/validate_content.py` ve `lib/content/validate.ts` geçer).
- **Bugün yalnız 03'ün kaydında `story` var; 01'de `partners[].full_name` `null`** (02–20'de dolu). İkisini koleksiyon
  kayıtlarına **G053** (claude-metin) ekler; tema ajanı koleksiyon kaydını değiştirmez. G053 bitmeden başlayan tema, kopyasına
  yalnız `story` ekler: `{intro: "A few of the moments that led us to", items: [{caption: "First hello"}, {caption: "The
  proposal"}, {caption: "Forever begins"}]}` (03'ün sözü; intro sayfada tarihle biter; başlıklar PAKET 2 hikâye fotoğraflarıyla
  aynı); kalan alanlar koleksiyon kaydıyla birebir (test, §13). `full_name` `null` kalır — şablon bunu kaldırır (§3.2 tam ad
  yedeği). G053 bitince kopya koleksiyon kaydıyla tamamen eşitlenir.
- `site.js` `DEV_CONTENT` = bu dosya (test eşitliği denetler).

---

## 3. Sayfalar ve motor işaretleri

İşaret başvurusu: `platform/README.md` → "İşaret başvurusu". Kısaca: `data-field` (metin; `<img>`'de foto; `<a>`'da `urls.*`
linki), `data-format` (`date`, `date-long`, `weekday`, `month`, `day`, `year`, `time`, `raw`, `amp`), `data-text`
(`{yol|biçim}` şablonu; `<title>` dahil), `data-photo="<anahtar>"`, `data-url="map"`, `data-optional="<blok>"`,
`data-if="yol"` / `"!yol"`, `data-repeat="schedule"` (içeride `.time`, `.label`, `data-if=".location"`),
`data-attr-<ad>` (yalnız `alt`, `title`, `content`, `aria-label`, `datetime`, `value`, `placeholder`, `data-*`).
Bilinen bloklar: `our_story`, `countdown`, `dress_code`, `registry`, `travel_stay`, `faq`, `guest_policy`.
**`guest_policy` kullanılmaz:** şemada metni yok (yalnız aç/kapa); `data-optional="guest_policy"` panelde alıcının
düzenleyemediği sabit bir metin için anahtar açar (uydurma, değiştirilemez iddia). Şemaya metin alanı gelene kadar hiçbir tema
yazmaz. Panel bir bölümü **temanın işaretlerinden** gösterir (`themeFieldUse`: `faq`, `rsvp.questions`, `initials`, hikâye
alanları): işareti olmayan temada alıcı o özelliği hiç görmez — §3.2'deki zorunlu işaretler bu yüzden atlanamaz.

### 3.1 Her sayfada (zorunlu)
- `<html lang="en" class="no-js">`; `<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">`.
- `<title data-text="…">` ve `description`, `og:title`, `og:description` → `data-attr-content` şablonu (örnek metin
  öznitelikte kalabilir, sunucu ezer). `theme-color` = paletin sayfa rengi.
- Paylaşım görseli ve ikon **dosyaları** temada: `img/og-1200x630.jpg` (zorunlu) ve `img/favicon.png` (önerilir), ikisini
  de `build_images.py` üretir (§5.4 #7; adlar sabit). `og:image` (+ `og:image:width/height`, `twitter:card`) ve
  `<link rel="icon">` etiketlerini **motor** dosya varsa kendisi yazar (G055; mutlak URL) — şablona bu etiketler yazılmaz
  (G055 `main`'e girene kadar sayfada og/ikon etiketi yoktur; 03 dahil).
- Google Fonts `<link>` (preconnect + `display=swap`), sonra `site.css`, sonra `<script src="site.js" defer>`.
- Satır içi `<head>` betiği yalnız durum sınıfı için (§11); satır içi olay özniteliği (`onclick=`) **çalışmaz** (CSP).
- `<body data-pending="This link will be added soon.">` (yedek bildirim; link blokları zaten `data-if` ile kalkar).
- Nav (home/story/details/rsvp'de): `<nav class="site-nav" aria-label="Wedding pages">`, Story `<li data-optional="our_story">`,
  RSVP `<li data-if="!rsvp.method">`, geçerli sayfada `aria-current="page"`. Linkler `home.html` gibi göreli (motor çevirir).
- "Replay the envelope" linki `index.html?replay=1` (home altbilgisi ve rsvp kapanışı).

### 3.2 Sayfa sayfa (zorunlu içerik)

| Sayfa | Zorunlu işaretler ve öğeler |
|---|---|
| **index** | `<h1>` isimler: `data-field="partners.0.display_name"` · `<span class="amp">&amp;</span>` · `partners.1.display_name`; tasarım kopyası ("You are invited"). Sahne `.stage` (`role="button" tabindex="0" aria-label="Open the invitation"`) içinde zarf katmanları (§7) + kart: `.photo-slot[data-slot="hero_portrait"]` > `img[data-photo="hero_portrait"]` + `.ph-mark`, kart kopyası `data-field="date"`, `venue.city_region`. `a[data-skip]` ve `a[data-enter]` → `home.html`; `.replay` düğmesi; JS'siz yedek `p.nojs-only > a[href="home.html"]` (`<noscript>` değil). `<script type="speculationrules">` `selector_matches: "a[data-enter]"` |
| **home** | Hero: aynı kart (VT adı, §11) + `img[data-photo="hero_portrait"]` (`data-attr-alt="Photo of {name_display}"`), isimler, `date` (`weekday` + tarih), `venue.name`, `venue.city_region`. Geri sayım: `data-optional="countdown" data-if="countdown_target_utc" data-countdown role="timer"`, `[data-unit=days\|hours\|minutes\|seconds]`, `.cd-done[data-when=today\|after]` (sade rakam + etiket; §5.7). Davet kartı: `host_line` (`data-if`), **isimler tam ad yedeğiyle** — her eş için iki öğe: `<p data-if="partners.0.full_name" data-field="partners.0.full_name">` ve `<p data-if="!partners.0.full_name" data-field="partners.0.display_name">` (`full_name` şemada `null` olabilir: 01 demo kaydı, panelde silinen tam ad; yedeksiz kart boş isim satırı gösterir), tarih bloğu (`weekday`/`month`/`day`/`year`), `ceremony_time`, `venue.name`, `venue.city_region`. Yanıt çağrısı `data-if="!rsvp.method"` (+ `rsvp.deadline` `data-if`). **Takvime ekle** (G051) davet kartının altında: `<a data-calendar="ics">` (Apple / Outlook) + `<a data-calendar="google" target="_blank">` (Google) çifti, ≥ 44 px. Tanıtımlar: Story (`data-optional="our_story"`, `story_1` küçük çerçeve), The Day (`data-repeat="schedule"` `.label · .time`, CSS ile ilk 4), RSVP (`data-if="!rsvp.method"`). Altbilgi isimler + replay |
| **story** | `<body data-optional="our_story">`. Giriş `data-if="story.intro"` (+ `data-field="story.intro"`). 3 çerçeve: `data-slot`/`data-photo` = `story_1..3`, başlık ve alt metin sırayla `story.items.0..2.caption` (`data-field`, `data-attr-alt="{story.items.0.caption}"`). Panel an sayısını bu işaretlerden okur (`themeFieldUse`): 3 başlık → 3 an; `.text` ya da `initials` kullanılırsa panel sorar |
| **details** | Başlık `date` (`weekday` + tarih). Program kartı: `<li data-repeat="schedule">` `.time`, `.label`, `<span data-if=".location" data-field=".location">` — 1–6 satır kartın düz kâğıdında kalır; **7+ satırda düzen bozulmaz** (§12: kart uzar ya da satırlar kartın altında düz kâğıtta sürer). Programın altında **takvime ekle** çifti (`data-calendar="ics"` + `data-calendar="google" target="_blank"`, home ile aynı). Kıyafet `data-optional="dress_code" data-if="dress_code"`. Mekân: `venue` foto alanı (`data-attr-alt="{venue.name}"`), `venue.name`, `venue.city_region`, `venue.country`/`venue.address` (`data-if`), tören cümlesi `data-if="ceremony_time"`. Harita `<p data-if="urls.map"><a data-field="urls.map" target="_blank">`. Travel & Stay `data-optional="travel_stay" data-if="urls.accommodation"`, Registry `data-optional="registry" data-if="urls.registry"` (link bloğu linksiz görünmez). **SSS** (G051): `<section data-optional="faq" data-if="faq">` içinde `<details data-repeat="faq"><summary><span data-field=".q"></span></summary><p data-field=".a"></p></details>` — JS'siz açılır-kapanır, yanıtta `white-space: pre-line`, `summary` ≥ 44 px; "+"/"×" işareti erişilebilir ada girmez (`content: "+" / ""` ya da `aria-hidden` span). RSVP linki `data-if="!rsvp.method"` |
| **rsvp** | `<body data-if="!rsvp.method">`. Kart: `rsvp.deadline` (`data-if`), `a.btn[href="#reply"]`, isimler. Form: §3.3, **çiftin soruları dahil** (`.questions` bloğu konuk sayısının altında, `[data-rsvp-if-attending]` içinde). Kapanış: isimler/`name_display` + `date`, replay linki; yanıt sonrası tekrarlayan teşekkür gizlenir (`html[data-rsvp-replied]`, `rsvp:state` olayı) |

### 3.3 RSVP form sözleşmesi (G042; tam metin `platform/README.md` → "Tema form sözleşmesi")
- `<script src="/rsvp/form.js" defer>` (kök yolu; motor çevirmez). Form `form[data-rsvp-form][method="post"]`, `action` yok.
- Alanlar **`name` ile**: `name` (zorunlu, ≤120), `email`, `attending` (`yes`/`no`), `guests` (`data-rsvp-if-attending` içinde),
  `message` (≤500). Hiçbir alana `website` adı verilmez (honeypot).
- Paneller `[data-rsvp-state="success|closed|error|preview"]` `hidden` ile başlar; `error`/`closed`'da `[data-rsvp-message]`;
  `success`'te `[data-rsvp-reply="yes|no"]` ve `[data-rsvp-again]`; alan hataları `[data-rsvp-error-for="<alan>"]`.
- Kapsayıcı `[data-rsvp]`. `closed` başlığı `data-rsvp-reason` (`deadline` / `disabled`) ile ayrılabilir.
- **Çiftin soruları (G051, zorunlu):** `<div data-rsvp-if-attending data-if="rsvp.questions">` içinde soru başına
  `<fieldset data-repeat="rsvp.questions" data-attr-data-rsvp-question=".id">` + `<legend data-field=".label">`; seçenekli soru
  `<div data-if=".options"><label data-repeat=".options"><input type="radio" data-attr-value="."> <span data-field="."></span></label></div>`,
  kısa yanıt `<textarea data-if="!.options" maxlength="300" data-attr-aria-label=".label">`, hata yeri
  `<p data-attr-data-rsvp-error-for="answer:{.id}">`. Girişlere `name` yazılmaz (`form.js` `answer:<id>` verir). Örnek:
  `platform/themes/blush-garden-rose/rsvp.html`; tam metin README → "Özel sorular (G051)".

### 3.4 `#site-data` ve sayfa haritası
- Motor her sayfaya `<script type="application/json" id="site-data">` ekler: `slug`, `theme`, `variant`, `page`, `preview`,
  `pages` (`{index, home, story, details, rsvp}` → `/slug/...`, önizlemede `?preview=` ile), `derived`
  (`date_display`, `date_long`, `date_weekday`, `ceremony_time_display`, `rsvp_deadline_display`, `venue_city_region`,
  `venue_city_region_country`, `countdown_target_utc`). **İçerik kaydı yoktur** (kapalı bölümler kaynakta görünmesin).
- Tema JS'i adresleri **yalnız** `data.pages`'ten alır (`location.href = PAGES.home`); JS içindeki göreli adres çevrilmez.
  `pages` kapalı sayfaları da içerir: JS story/rsvp'ye kendisi yönlendirmez (yalnız sunucunun bıraktığı linkler).
- JS'teki tema görseli: `new URL('img/x.webp', document.currentScript.src)` (03: `asset()`).
- `#site-data` yoksa (tema dosyaları statik sunucuda) `DEV_CONTENT` + `devRender()` aynı işaretleri doldurur — yalnız tasarım
  önizlemesi; platformda asla çalışmaz.

### 3.5 G051 işaretleri (zorunlu)
G051 (`main`'de; README → "Takvime ekle, SSS, RSVP özel soruları (G051)") üç işaret getirdi; her G4NN temasında **zorunlu**
(§3.2'deki yerlerinde):
- **Takvime ekle:** home (davet kartı altı) ve details (program altı) `<a data-calendar="ics">` + `<a data-calendar="google"
  target="_blank">`. Motor `ics` → `/<slug>/event.ics` (önizlemede `?preview=`), `google` → Google Calendar linki yazar; okunur
  tarih yoksa ikisini de kaldırır.
- **SSS:** details'te `data-optional="faq" data-if="faq"` + `<details data-repeat="faq">` (`.q`/`.a`). Panelin "Questions &
  answers" bölümü yalnız bu işaret varsa görünür (`themeFieldUse().faq`).
- **Çiftin soruları:** rsvp formunda §3.3'teki `.questions` bloğu. Panelin "Questions for your guests" bölümü yalnız
  `rsvp.questions` işareti varsa görünür (`themeFieldUse().rsvpQuestions`).

Bu işaretlerden biri eksik tema alıcıya o özelliği **sessizce** vermez (panel bölümü hiç çıkmaz) — test (§13.2 #18–#20) ve
`g051-browser --theme` (G052) bunu yakalar.

---

## 4. Şablonda ve JS'te sabit yazılmayacaklar (zorunlu)

| Yasak | Doğrusu |
|---|---|
| İsim, tam ad, monogram, host line, tarih, saat, mekân, şehir/bölge/ülke, adres, program satırı, kıyafet, son tarih, hikâye girişi/başlıkları | `data-field` / `data-text` / `data-repeat` |
| `<title>`, meta, og metinlerinde kişisel veri | `data-text` / `data-attr-content` |
| Harita/registry/konaklama URL'si, "link will be added soon" diyen ölü düğme | `data-field="urls.*"` + `data-if="urls.*"` |
| Fotoğraf (demo fotoğrafı dahil) | `data-photo`; şablonda yalnız `img/ph_<anahtar>-*.webp` yer tutucu |
| Tarih/saat biçimlendirme ya da yazdırma (JS'te) | motor biçimler (`en-US`/`en-GB`); JS yalnız geri sayım rakamları |
| Geri sayım hedefi | `data.derived.countdown_target_utc` |
| Sayfa adresi (JS'te), `?preview=` kurgusu | `data.pages` |
| Oturum anahtarı slug'sız | `invite:opened:<slug>`, `invite:arrive:<slug>` (§11) |
| Misafir sayısı üst sınırı (form `max`) | `theme.json` `rsvp.max_guests` → `form.js` |
| Comp'taki demo metin ("Vivian & Charles", "The Grand Lumière Hotel", "Black tie", saatler) | işaret; comp yalnız yerleşim referansı |
| Kişisel metni JS ile yazmak (`textContent = …` içerikten) | sunucu yazdı; JS dokunmaz |
| `innerHTML`, `eval`, satır içi olay özniteliği, harici betik (Google Fonts dışı istek) | DOM API + `site.js` + `/rsvp/form.js` |
| `<noscript>` içinde link | `.nojs-only` sınıflı normal öğe |
| Şablonda HTML yorumu olarak görev/üretim notu | izinli (motor siler) ama kişisel veri içermez |

**Serbest tasarım metni** (İngilizce, işaretsiz kalabilir): "You are invited", "We're getting married", "Our Story", "Moments we
hold dear", "The Day", "Order of the Day", "Kindly reply by", "Will You Join Us?", "Thank you", "With love", "Tap to open",
form etiketleri. Şartı: içerikle çelişmez ("Ceremony at …" yalnız `data-if="ceremony_time"`), olmayan şeyi vaat etmez
(şemada olmayan "travel tips" yok), etkinlik türü bugün yalnız `wedding`.

---

## 5. Görsel hattı

### 5.1 PAKET 5 parçası → tema dosyası

| GPT (`assets/gpt/parts/`) | Tema (`img/`) | Genişlikler (px) | Kullanım |
|---|---|---|---|
| `bg_page.png` 1024×1536 opak | `bg_page-640/1024.webp` (q≈78); `mist-640.webp` (bulanık, en-boy ≥ 3/4 ekran); `ph_<anahtar>-*.webp` | 640, 1024 | index/home sahnesi (telefon), yer tutucular |
| `bg_tile.png` 1024 dikişsiz opak | `bg_tile-640.webp` (`repeat`) | 640 | uzun sayfaların `body` zemini (03'te `mist_tile`) |
| `envelope_closed.png` şeffaf | tipe göre kesimler (§7) | 440, 880 (zarf ~ ekran genişliği) | index |
| `closure.png` şeffaf | `closure-480/960.webp`; `favicon.png` (180 px kare, şeffaf; `tema_build.ikon`, önerilir) | 480, 960 | index; rsvp kapanışı; home tanıtımı |
| `envelope_open.png` şeffaf | tipe göre kesimler (§7) | 440, 880 | index |
| `card_small.png` (#00FF00 pencere) | `card_small-320/640.webp` + `mask_card.png` | 320, 640 | index kartı = home hero kartı |
| `invitation_card.png` | `invitation_card-480/960.webp` + `free_zone` | 480, 960 | home davet kartı |
| `info_card.png` | `info_card-480/960.webp` + `free_zone` | 480, 960 | details programı, rsvp kartı |
| `frame_portrait.png` (#00FF00) | `frame_portrait-320/640.webp` + `mask_portrait.png` | 320, 640 | story (+ home tanıtımı) |
| `frame_landscape.png` (#00FF00) | `frame_landscape-480/960.webp` + `mask_landscape.png` | 480, 960 | details mekân |
| `decor_tl/br.png` ya da `florals_tl/br.png` (katalog `kume`) | aynı ad `-480/960.webp`, `loading="lazy"` | 480, 960 | geniş ekran kenarları, sayfa başlıkları |
| `accent_1..3.png` | `accent_N-200.webp` | 200 | düşen/süzülen parçacıklar (`MOTION.accents`), `.ph-mark` ikonu |
| `divider.png` | `divider-300.webp` | 300 | başlık altı, satır araları |
| `web_hero.png` 1536×1024 opak | `og-1200x630.jpg` (q≈82, `tema_build.og_kirp` alt hizalı; isteğe bağlı masaüstü üst bant) | 1200 | `og:image` (isim yok) |
| `ekler` (01 `closure_sprig`, 04 `bg_desk`, 07 `velvet_swag`, 08 `frost_overlay`, 10 `oak_tile`, 16 `twine_line`+`barnwood`, 18 `vellum_overlay`, 20 `wave`) | adıyla | rolüne göre | tasarıma özel (01: mührün altından kayan dal, `closure` ile aynı tuvalde hizalı) |

`comps/web_*.png` (W1) yalnız yerleşim referansıdır: tipografi, hiyerarşi, yerleşim ve kart/çerçeve dizilişi buradan;
tema dosyalarına girmez, satılmaz. **Yalnız sade ad referanstır** (`web_1_envelope.png`); `_v1`, `_v2`… denemedir, karşılaştırma ve
ölçüm onları almaz: tam adlar kullanılır (`web_1_envelope`, `web_2_home`, `web_3_story`, `web_4_details`, `web_5_rsvp`); `web_*`
glob'u `_v1`'i de alır.

**GPT parça listesi (Paket W = PAKET 5 W2) yeterli mi?** Genel liste evet: yukarıdaki 17 parça her temanın ortak
ihtiyacını karşılıyor; 03'ün kullandığı her görselin PAKET 5 karşılığı var (petal sayfası → tek nesneli `accent_1..3`,
`mist_tile` → `bg_tile`, `florals_*` → `decor_*`/`florals_*`). **Ama açılış cümlesi ayrı hareket eden bir nesne istiyorsa ve o
nesne tek görselde başka parçanın altında kalıyorsa ek dosya gerekir** — kesmek gizli kısmı geri getirmez. G046 incelemesinde
bulunan ilk örnek 01: "the olive sprig slides out from under the oval seal" — `closure.png` artık dalsız mühür, dal tam hâliyle
`closure_sprig.png` (`WEB[1]["ekler"]`). Her tasarımda `acilis` cümlesi W2 üretiminden **önce** bu gözle okunur; eksik parça
`tools/katalog.py` `WEB[NN]` `ekler`'ine eklenir (19 dosya elle düzenlenmez). Standardın ortaya çıkardığı diğer eksikler
**kural**; G046 incelemesinde PAKET 5 prompt'larına işlendi (`tools/katalog.py` ortak metin + `KESIM_KENARI`, 19
`GPT_PROMPTS.md` yeniden üretildi) ve `gorevler/roller/gpt-gorsel.md`'de:
1. Kesilecek kenarlar görünür olmalı (kapalı kapağın serbest kenarı, gatefold dikişi, kitap kapağının kenarı/sırtı, kesenin
   ağız kenarı, açık zarfın ön cep kenarı): nesnenin kendi üstündeki ince temas gölgesi/kenar çizgisi gerekli; yasak olan
   zemine düşen gölge. Yoksa §7 kesimleri bulamaz.
2. Nesnenin dışına taşan ışıma/hâle/ışın yok (site ekler); yarı saydam hâle başka zeminde kirli kenar bırakır.
3. `web_hero` paylaşım görselinin (1200×630) kaynağı: zarf + kapanış altında boşlukla tam görünür, üst %20'de önemli öğe yok.
4. Birbirine oturan çiftler (`envelope_closed`/`envelope_open`, sarılı `closure`) üst üste konunca gövde çizgisi çakışmalı;
   GPT bunu üretimde gözle kontrol eder (Claude ayrıca ölçer, §7.1).

Tek görselde tek nesne, gölgesiz, aynı ışık (sol üst), gerçek alfa, düz `#00FF00` pencere, yazısız parça ve "birbirine
oturan parçalar tek görselden kesilir" kuralları PAKET 5'te zaten var.

### 5.2 `kit_check`
`python3 tools/kit_check.py collections/NN_* --paket 5` ve `--paket 2` geçmeden kesime başlanmaz (geçmiyorsa Sonuç'ta neden).
`kit_check` oran (±%2 — piksel ölçüsü farklı olabilir), alfa, kenar boşluğu, pencere varlığını ve (G054) **kapalı/açık zarf
hizasını** denetler: listede `envelope_closed` + `envelope_open` website parçası varsa ikisi "Kaydet" tuvaline getirilir ve
§7.1'deki tipine göre değişmeyen kenarları karşılaştırılır (`tools/tema_build.hiza_olc`; sarılı kapanışta `closure.png`
uçları da). Zarf tipi kapalı zarfın prompt başlığından ("Kapalı zarf (gatefold, iki kapı)" → `kapi`; parantez yok → `kapak`)
ya da `--zarf-tipi`. Satır: `GEÇTİ` (her kenar ≤ %1,5), `UYARI` (≤ %4; geçti sayılır, tema ölçülen dönüşümle düzeltir),
`KALDI` (> %4: GPT'den yeniden üretim, çıkış 1), `ATLANDI` (parça yok; sayılmaz). `--hiza` yalnız bu denetimi koşar. 03'ün
website parçaları PAKET 4'te (G030 pilotu): `kit_check collections/03_Blush_Garden_Rose --paket 4` ya da `--hiza`.

### 5.3 `tools/parts_prep.py`
- `build_images.py` içinden, çıktı **geçici klasöre** (`--prep-dir` verilirse oraya; tema klasörüne ve `assets/`'e asla).
- Yaptığı: şeffaf parçayı alfa kutusuna kırpar (+8 px pay) → `<ad>.png`; `#00FF00` pencereleri tam şeffaf yapar, GPT
  "bulut lekesi"ni temizler, `windows.json`'a pencere kutusu (`kutu`, katman pikseli) + şekil maskesi (`masks/…`) yazar;
  opak dikey PAKET 5 görselini kırpmaz (`.jpg`); her katmanın **kaynak tuvaldeki kırpma ofseti** `katmanlar[].kirpma`
  (`[x, y, w, h]`) — birbirine oturan parçaların hizası buradan geri kurulur (§7.1).
- Yapmadığı: ön cep kesimi yalnız `envelope_open` için ve **kare gövde + düz/V/ters-V kenar** varsayar (eğri kenar iki doğruyla
  yaklaşık; olmazsa uyarılı geometrik V). Kapak, kapı, kitap, kese kesimi **yok** → tema `build_images.py`'si
  `tools/tema_build.py` kesimleriyle yapar (§5.4, §7). `tema_build.cep_kes("v")` önce G035 yöntemini, tutmazsa bu
  `parts_prep.cep_kes`'i dener (03'te birincisi, 01'in lifli kağıdında ikincisi tuttu), ikisi de tutmazsa uyarılı geometrik V.
- `cep_kes` zarf tipine bakmadan **her** `envelope_open`'da koşar: **kapi, kitap, kese, kilif** temalarında çıkan
  `envelope_pocket_front.png` anlamsızdır ve "geometrik V" uyarısı beklenir → dosya kullanılmaz, uyarı yok sayılır, `--strict`
  verilmez (kesimler §7.4–§7.7'deki tema kesimleri). Kapak tiplerinde (eğri cepler dahil) uyarı gözle doğrulanır.

### 5.4 `build_images.py` (temanın; zorunlu sorumluluklar)
1. `parts_prep`'i geçici klasöre koştur (ya da `--prep-dir`); `windows.json` oku. Kaynak GPT dosyalarına yazma.
2. Zarf parçalarını tipine göre kes (§7); her kesimin geometrisini `manifest.json` → `stage` altına yaz.
3. Çerçeve/kart pencerelerinden foto alanı: kutu (`box_pct`, `box_px`, `aspect`) + `mask_<şekil>.png` (pencere +2 px, ≤ 480 px).
4. **Denetim (hata → çıkış ≠ 0):** her WebP'de pencere tam şeffaf kaldı mı (`pencere_seffaf_mi`), hiçbir görselde görünür
   `#00FF00` yok (`yesil_gorunur`), kesilen parçalar birleşince kaynakla örtüşüyor (alfa farkı ≤ %1, §7.1).
5. Kartlar için `free_zone` (düz kâğıt bandı haritası; `tema_build.serbest_bolge`) → metin kutuları ve `theme-check` ölçümü.
6. Yer tutucular: `bg_page`'den yumuşak, açık tonlanmış kırpım (`tema_build.yer_tutucu`, `ton` = paletin açık sayfa rengi),
   pencere oranında; kişi, yazı, düz renk kutu yok.
7. `og-1200x630.jpg` (zorunlu): `web_hero`'dan 1.91:1 kırpım — `tema_build.og_kirp(hiza="alt")`: tam genişlik, alttan
   (zarf + kapanış altta tam görünür, üst %20 düşer; yazı eklenmez), `og_kaydet` q 82; kırpım bandı `manifest.og.crop`.
   `favicon.png` (önerilir): `tema_build.ikon(closure)` — alfa kutusu ortalanır, şeffafla kareye tamamlanır, 180 px.
   Kırpım önizlemesine gözle bakılır (zarf ya da kapanış kesilmiş mi).
8. Fon: `bg_page` → `mist-640` (Gaussian blur), `bg_tile` → `bg_tile-640`.
9. `manifest.json`: her görsel `src_size`, `ratio`, `files[{file, w, h, bytes}]`; `stage` (tuval, sahne kutusu `box` = alfa kutularının birleşimi, parça kutuları `box_pct`,
   menteşe/dikiş/sırt/kenar geometrisi, `align` hiza ölçümleri — §7.1); `closure` yerleşimi (çapa, §7.1); `photo_slots`; `free_zone`; `og`; `favicon`; toplam bayt.
   Her kesimin bilgisi `method` (`renk`/`alfa` = görselden bulundu, `geometrik` = yedek) ve varsa `warnings` taşır.
   `site.css`'teki her yüzde yanında hangi manifest anahtarından geldiğini yazar (`/* manifest stage.env_cflap */`).
10. Tema klasörü ≤ 3 MB (`tema_build.klasor_boyutu`, `TEMA_BUTCE`; aşarsa çıkış ≠ 0).

**Ortak modül `tools/tema_build.py` (G054; 03 teması da bunu kullanır).** `sys.path`'e `tools/` eklenip `import tema_build as tb`;
G035 modülü (`collections/03_…/website/build_images.py`) artık içe aktarılmaz. Fonksiyonlar (tam belge modülün başında):

| Grup | Fonksiyon |
|---|---|
| çıktı | `webp(im, ad, genişlikler, q, manifest, out=…)` (çıktı klasörü parametre; WebP `quality=80, method=6, alpha_quality=90`), `manifest_yaz`, `klasor_boyutu` |
| hazırlık | `prep_hazirla(COL, args.prep_dir, yasak=[THEME])` (parts_prep → geçici klasör; tema klasörü reddedilir), `pencere`, `kaydet_olculeri` |
| foto alanı | `foto_alani` (pencere kaydı + `mask_<ad>.png` + kaynak/WebP şeffaflık denetimi), `pencere_maskesi`, `serbest_bolge(…, esik=28)`, `kapla`, `yer_tutucu(…, ton, karisim)`, `bulanik_fon`, `bilesenler` (çok nesneli eski sayfa) |
| paylaşım | `og_kirp`, `og_kaydet`, `ikon` |
| denetim | `pencere_seffaf_mi`, `yesil_gorunur`, `yesil_denetle`, `ortusme` (kesilen parçalar birleşince kaynak; ≤ 0,01) |
| hiza | `alfa_kutusu`, `kat_bul` (dikiş/katlanma/oluk sütunu), `hiza_olc`, `kapanis_hiza`, `hiza_ozet` |
| kesim (§7) | `kapak_kes(bicim="v"\|"egri")`, `cep_kes(bicim="v"\|"duz"\|"egri")`, `dikis_bul` + `kapi_kes`, `kitap_kes`, `kese_kes`, `kilif_serit`, `serit_farki` |

Her kesim kenarı görselin kendi pikselinden bulur; bulamazsa `method: "geometrik"` + `warnings` ile geometrik yedeğe düşer
(tema betiği uyarıyı basar ve manifest'e yazar; yedek kesim önizlemede gözle denetlenir, Sonuç'a yazılır). Hepsi
`tools/tests/test_tema_build.py`'de sahte görsellerle hem bulunan hem yedek yoluyla denenir; 03'ün yeniden üretimi bayt bayt
karşılaştırılır. Eşikler 03'ün ışığına göre varsayılandır (`kapak_kes` parlaklık düşüşü > 40 / > 30, `cep_kes`/`kese_kes` renk
sapması > 24, `serbest_bolge` renk farkı > 28): yeni tasarımda kesim önizlemesine bakılır, gerekirse eşik parametreyle verilir
(değer manifest'e).

### 5.5 `srcset` / `sizes`
- GPT parçası gösteren her `<img>`: `src` = küçük dosya, `srcset` = bütün genişlikler (`w` tanımlı), `sizes` = **CSS'teki
  gerçek genişlik formülü** (ör. `min(84vw, 44vh, 460px)`). DPR 3'te doğru adayı seçtirir; yanlış `sizes` bütçeyi patlatır.
- LCP adayları (sahne zemini, kapalı zarf) `fetchpriority="high"` / eager; ekran altı ve telefonda gizli (`.land-only`)
  her görsel `loading="lazy"`.
- JS'le oluşturulan parçacıklar tek 200 px dosya (`asset('img/accent_1-200.webp')`).

### 5.6 Maskeler
Foto, çerçeve görselinin **altında** durur; `.photo-slot` kutusu = pencere kutusu (+2 px pay), `mask: url(img/mask_<şekil>.png)
center / 100% 100% no-repeat` (+ `-webkit-mask`). Kemer/oval/yuvarlak/basamaklı her pencere şekli maskeyle gelir; CSS
`border-radius` ile pencere şekli taklit edilmez.

### 5.7 CSS'te izinli olan / olmayan (K21 sınırı)
| İzinli (ışık ve arayüz) | Yasak (dekor = GPT'nin işi) |
|---|---|
| Parçaya `filter: drop-shadow` (parçalar gölgesiz gelir, gölgeyi site ekler); ateş böceği gibi parçaya renkli parıltı | Çiçek, yaprak, çerçeve, mühür, kurdele, yıldız/parıltı çizimi (SVG, CSS şekil, emoji) |
| Kenarsız ışık: yumuşak `radial/linear-gradient` ışık süpürmesi (06 "gold light sweep"), mum ışığı hâlesi (19), `mix-blend-mode`, düşük opaklık | Gradient'le çizilmiş çizgi/desen/doku, süs bordür, CSS ile "altın çizgi" |
| Okunabilirlik: `text-shadow` hâlesi, buton/nav/form zeminleri, 1 px ayraç çizgisi, odak halkası, geri sayım rakamları, yarı saydam form paneli | Comp'taki süslü kutuyu (geri sayım kutusu, süslü buton) CSS ile taklit — ya sade arayüz ya GPT parçası |
| Arayüz kutusu: hap düğme, form alanı (kenarlıklı giriş kutusu), tek 1 px ayraç/alt çizgi | İçerik bloklarının (geri sayım, program, mekân, kart metni, SSS) çevresinde CSS `border`, `outline` (odak halkası dışında), `box-shadow` çerçevesi; çift çizgi, köşe süsü |
| Parçayı kesmek, aynalamak (`scaleX(-1)`), döndürmek, `clip-path` ile açığa çıkarmak ("write", "unfurl", çizgilerin "kendini çizmesi" = GPT çizimine maske) | Yeni şekil çizip boyamak |

Comp'ta çerçeveli öğe varsa (01 W1.2: dört kutulu geri sayım) iki yol var: **sade rakam + etiket** (03 gibi; tema README'sinde
comp sapması olarak yazılır) ya da tasarımın `ekler`'ine GPT kutu parçası (`countdown_tile.png`, katalog düzeltmesi + G2NN).
CSS kutusu üçüncü yol değildir. Test (§13.2 #22): `site.css`'te `.cd-*` kurallarında `border`/`outline`/`box-shadow` yok
(03'te `tests/theme-blush-garden-rose.test.ts` "K21: the countdown is plain numerals…").

---

## 6. Performans bütçesi (zorunlu)

| Ölçü | Sınır | 03 (ölçülen) |
|---|---|---|
| İlk görünüm, index, 390×844 **DPR 3**, yer tutucu fotoğraflarla | **≤ 1,5 MB** (fontlar dahil) | 1018 KB |
| İlk görünüm, home, aynı koşul | **≤ 1,5 MB** | 706 KB |
| Tek WebP, ilk görünümde | ≤ 200 KB (≥ 150 KB olanı Sonuç'ta gerekçelendir) | en büyük 187 KB (`invitation_card-909`, home) |
| Tek WebP, yalnız geniş ekran / `lazy` | ≤ 250 KB | en büyük 228 KB (`florals_tl-960`) |
| Tema klasörü toplamı | ≤ 3 MB | 2,7 MB |
| Font | ≤ 3 aile, yalnız kullanılan ağırlıklar, Google Fonts | 3 aile |
| Betik / stil | `site.js` ≤ 35 KB, `site.css` ≤ 45 KB (sıkıştırmasız), kütüphane yok; harici istek yalnız Google Fonts | 28 KB / 38 KB |
| Dokun → home | 3,2–5 s (Skip her an) | 4,45 s |

Ölçüm `theme-check`'in "first view" adımıyla (`next start` üzerinde yayınlanmış test sitesi; aktarılan bayt), **iki kez**:
yer tutucularla (tablodaki sınır) ve tohumlanmış PAKET 2 fotoğraflarıyla (`npm run seed -- --photos`); ikisi de `checks.json`'a ve
Sonuç'a yazılır. Alıcı fotoğrafı tek URL olarak servis edilir (motor `srcset`/`sizes`'ı kaldırır; panel uzun kenarı ≤ 2400 px,
JPEG q84 kaydeder) — index kartındaki tek portre 0,5–1 MB olabilir; fotoğraflı ölçüm 1,5 MB'ı aşarsa Sonuç'ta sayıyla yazılır
(tema sınırı değil, platform işi: yüklemede 640/1280 türevleri + motorun yazdığı `srcset`, §14 #9). Gerçek telefon/ağ ölçümü
değildir; "daha hızlı" iddiası buna dayanılarak yazılmaz (docs/13 §7).

---

## 7. Zarf açılışı — tipe göre

### 7.1 Ortak kurallar
- **Koordinatlar = kaynak tuval, sahne kutusu = kullanılan alan.** PAKET 5'te `envelope_closed`, `envelope_open` (ve sarılı
  kapanışta `closure`) **aynı tuvalde, aynı konumda** çizilir (`ZARF_TIPI`: kapak/kese/kılıf 1024×1536, kapı/kitap 1536×1024).
  Ölçümler tuval pikselinde yapılır (`parts_prep` `kirpma` ofsetleri). Ama `.stage` kutusu tuvalin kendisi **değildir** (GPT'nin
  boş payları sahneye girer: 01'de kapalı zarfın üstü tuvalin ~%45'inde, altta %12 boş bant): sahne kutusu = kapalı, açık ve
  kartın yol aldığı (yükselme + `forward`) alanların alfa kutularının **birleşimi** (tuval koordinatında, `manifest.stage.box`).
  Her parça bu kutuya göre yüzdeyle konur (`left/top/width/height %`, `/* manifest stage.<parça> */`). 03'teki elle ölçülmüş
  yüzdeler yerine bu.
- **Hiza denetimi:** önce iki görsel `GPT_PROMPTS.md` "Kaydet" ölçüsüne getirilir (`kit_check` oranı ±%2 kabul eder; piksel
  ölçüsü farklı olabilir). Sonra **yalnız değişmeyen kenarlar** karşılaştırılır — açık hâl alfa kutusunu bilerek büyütür (kapak
  yukarı, kapılar yanlara, kitap kapağı sola açılır):

  | Tip | Karşılaştırılan kenarlar (kapalı ↔ açık) |
  |---|---|
  | kapak (04 şerit dahil) | alfa kutusunun sol, sağ, alt kenarı |
  | kapi | üst ve alt alfa kenarı; açık görselde katlanma çizgileri (kapalı `x0`/`x1` ± %3 bandında en koyu/boşluklu dikey sütun, §7.4 dikiş araması gibi) ↔ kapalı sol/sağ kenar |
  | kitap | kapağın üst, alt ve sağ kenarı ↔ sağ sayfanın üst, alt ve sağ kenarı; sırt sütunu (açık görselde orta oluk, dikiş araması gibi) ↔ kapalı kapağın sol kenarı |
  | kese, kilif | sol, sağ, alt kenar (ağız/üst kenar açılınca değişir) |

  Her kenar ±%1,5 (tuval ölçüsüne göre) içinde olmalı. Daha büyük kaymada parçalardan biri ölçülen dönüşümle (ölçek + öteleme)
  düzeltilir; %4'ün üstünde GPT'den yeniden üretim istenir (Sonuç'a "önerilen" olarak). Ölçülen her kenar (kapalı px, açık px, fark
  %) ve uygulanan düzeltme `manifest.stage.align`'a yazılır. **Araç (G054):** `tema_build.hiza_olc(kapalı, açık, tip,
  kapalı_Kaydet, açık_Kaydet, kapanis=…)` — `kit_check --paket 5` (§5.2) ve tema `build_images.py` aynı fonksiyonu kullanır;
  katlanma çizgisi/oluk `kat_bul` ile (önce iki yanından koyu ince çizgi ya da alfa boşluğu, yoksa iki bölge arasındaki en güçlü
  renk adımı). **Sarılı kapanış** (`closure.png` Kaydet ölçüsü = zarfınki): sarma ekseni boyunca iki uç, zarfın aynı
  satırdaki/sütundaki kenarına göre (medyan; + boşluk, − taşma) aynı eşiklerle; ekseni sarmayan fiyonk/dal ucu taşma
  gösterirse gözle bakılır. **Farklı Kaydet tuvali** (yalnız 03: kapalı 1024×1024, açık 1024×1536 — PAKET 4 pilotu): yöntem
  `olcekli` — iki gövde eşit genişliğe getirilip alt kenarlar çakıştırılır, kalan gövde yüksekliği (en/boy) farkı ölçülür;
  prompt üst üste çizim istemediği için en çok `uyari` (03: −%4,55; `site.css` `.env-closed` dikeyde ~%5 basık oturuyor).
- **El değiştirme 90°'de:** dönen bir yüzün arkası gerekiyorsa (kapak, kapı, kitap kapağı) ön yüz kapalı görselden kesilir ve
  menteşesinde 0°→90° döner (kenardan görünür olur), aynı anda iç yüz açık görselden kesilmiş parça olarak 90°→0° devralır
  (03: `env_cflap` → `env_flap`). Dönüş `transform: perspective(800–1100px) rotateX/Y(…)`, `backface-visibility: hidden`,
  çıkan parça `offset .995`'te `opacity: 0` (kenardan 1 px şerit kalmasın).
- **Yön işaretleri** (CSS y aşağı; pozitif z izleyiciye doğru): serbest kenar **izleyiciye doğru** kalkar:

  | Parça | `transform-origin` | Ön yüz | İç yüz (devralan) |
  |---|---|---|---|
  | Üstten menteşeli kapak (kapalı) | menteşe satırı `50% <hinge>%` | `rotateX(0 → 90deg)` | açık kapak, origin `50% 100%`: `rotateX(-90deg → 0)` |
  | Sol kapı / kitap kapağı (sol menteşe) | `0% 50%` | `rotateY(0 → -90deg)` | origin `100% 50%`: `rotateY(90deg → 0)` |
  | Sağ kapı (sağ menteşe) | `100% 50%` | `rotateY(0 → 90deg)` | origin `0% 50%`: `rotateY(-90deg → 0)` |
- **Kapanış elemanı** (`closure.png`): **sarılı** (07, 09, 10, 16: kurdele/sicim zarfı sarar) → zarfla aynı tuvalde 1:1 üst
  üste. Kare tuvalde büyük çizilen → yeri **kesim geometrisine bağlanır** (`kapanis_yeri` İngilizce bir tarif, koordinat değil;
  comp'taki zarf `envelope_closed`'dan farklı ölçü ve konumda):

  | Tip | Çapa (kapanışın merkezi) |
  |---|---|
  | kapak — V/eğri kapak, sarılı olmayan (01, 02, 05, 08, 11, 12, 15, 17, 19, 20) | kapağın ucu: `kapak_kes` `tip` (eğri kapakta kenarın en alt noktası); `kapanis_yeri` "a little below…" diyorsa ölçülen kayma comp'tan |
  | kapak — yırtma şeridi (04) | şeridin (kapalı − açık alfa) kutu merkezi |
  | kapi (06, 14) | dikiş sütunu `x`, `kapanis_yeri`'ndeki yükseklikte ("a little above the middle", "mid-height") |
  | kitap (13) | kapağın sağ kenarı, yarı yükseklik |
  | kilif (18) | kılıfın üst kenarının ortası, hemen altı |

  Boyut: **kapanış genişliği / zarf genişliği**, W1.1 comp'taki zarf üzerinde bir kez ölçülür. Sonuç
  `manifest.closure = {anchor, anchor_px, center_pct, width_pct, measured_from: "comps/web_1_envelope.png"}` ve bir karşılaştırma
  görseli (kapalı sahne | comp'un zarf bölgesi, `previews/g4NN/compare_closure.jpg`) ile gözle doğrulanır. İlk hareket ≤ 250 ms
  içinde başlar (dokunmaya anında yanıt). Kurdele/sicim zarfın **içinden geçmez**:
  kenar boyunca kayar ya da düğüm noktasından ikiye kesilip (Claude kesimi) iki yana çekilir. "Çatlama" = mührü düz bir
  çizgiyle iki parçaya kesip ayırmak (çatlak çizilmez) ya da düşme + dönme.
- **Mühür monogramı (karar):** kapanış ortası boş çizilmişse (01, 02, 04, 17, 19: "smooth EMPTY … center") monogram
  `<span class="seal-mono" data-field="initials">` olarak kapanış sarmalayıcısının **içinde**, mühürle birlikte hareket eder
  (pişirilmez; panelde Monogram alanını açar — `themeFieldUse().initials`). Önerilir; "boş mühür" seçilirse tema README'sinde
  gerekçesi yazılır. Canva dönemi `COLLECTION_STATUS.md` mühür yerleşim notları (01 "harfler x=459, y=1174…") K22–K24 ile
  geçersizdir; ölçü bu bölümdeki çapadan gelir.
- **Kart:** `card_small` + `hero_portrait` foto alanı + kart kopyası. Kapalı durumda görünmez (kapalı gövde opak örter),
  açılınca ön cebin/gövdenin arkasından yükselir (`card-slot` `clip-path` ile zarfın altına taşmaz), sonra öne geçer
  (`z-index`, `ENVELOPE_GEOMETRY.front`), home'a VT ile uçar (§11). Cebi olmayan tiplerde (kitap, kılıf) kart sayfadan/kılıftan
  **kalkar** (ölçek + öteleme + büyüyen gölge).
- **Parçacıklar** (`accent_1..3`): açılışta `MOTION.accents.open`, home'a varışta `arrive`, rsvp kapanışında `closing`.
- **Sahne boyu (kapalı nesneye göre):** `--obj: min(84vw, 45svh × objAspect, 440px)` — `objAspect` = kapalı nesnenin alfa
  kutusu en/boy (dikey nesnelerde — 06 dosya 2:3, 13 kitap ~0,78, 09 kese, 18 kılıf — yükseklik sınırı belirler, genişlik %84'ün
  altında kalır; bu doğru). Sahne genişliği = `--obj / objFrac` (`objFrac` = kapalı nesne genişliği / sahne kutusu genişliği,
  manifest'ten). Sahne kutusunun kapalı nesnenin üstünde kalan kısmı (kapağın açılacağı, kartın yükseleceği boşluk) başlığın
  altına negatif üst boşlukla girer — 03: `.stage { margin-top: calc(18px - var(--w) * .49) }` (`.49` = o boşluğun sahne
  genişliğine oranı, manifest'ten hesaplanır, yorumla yazılır). 360×640, 375×553, 390×844'te isimler + "Tap to open" + kapalı
  nesne ekrana sığar.
- **Açık hâl ekrandan geniş olursa** (kapı, kitap): açılış adımı (`doors` / `cover`) boyunca sahne
  `scale(min(1, .94 × 100vw / openSpreadPx))` + açık nesneyi ortalayan öteleme ile toparlanır (`openSpreadPx` = açık nesnenin
  alfa kutusu genişliği × sahne ölçeği); kök `overflow-x: clip` (03) yine kalır. 360–1280 px'te yatay kaydırma yok (test).

### 7.2 Tip tablosu

| Tip (`ZARF_TIPI`) | Tasarımlar | GPT parçaları | Claude'un kestiği parçalar | Katman sırası (alttan üste) | `MOTION.envelope` anahtarları | Araç durumu |
|---|---|---|---|---|---|---|
| **kapak** — V/tırtıklı/dalgalı/fistolu V | 01, 02, 03, 05, 08, 10, 19, 20 | `envelope_closed`, `envelope_open`, `closure` | kapalı: `env_closed`, `env_cflap` (kapak, serbest kenarı izlenerek); açık: `env_flap` (gövde üstü), `env_body` (astar+arka), `env_pocket` (ön cep) | `env_flap` · `env_body` · kart · `env_pocket` · `env_closed` · `env_cflap` · `closure` | `hint, tug, closure, head, lift, open, flap, rise, forward, accents, go, fadeOut` | `tema_build.kapak_kes("v")` + `cep_kes("v")` (03'te çalışıyor; 01 parçalarında denendi) |
| **kapak** — düz/yuvarlak/çan/eğri kapak | 07 (dikdörtgen), 15 (yuvarlak), 16 (yuvarlak köşeli kare), 17 (çan/ogee) | aynı | aynı; kapak kenarı **eğri** izlenir | aynı | aynı | `kapak_kes("egri")` (biçimden bağımsız iz; zarftan dar kapakta kapak dışı = kapak yok) + `cep_kes` (V/`duz`/`egri`) |
| **kapak — kemer cep** | 11 | aynı | kemer kapak (eğri), ön cep (hafif eğri üst kenar) | aynı | aynı (+ yavaş `rise`) | `kapak_kes("egri")` + `cep_kes("egri")` |
| **kapak — cüzdan** | 12 | aynı (kayış kapakla bir) | yuvarlak kapak, ön panel = cep | aynı | aynı; `closure` = çıtçıt + sekme (pivot dönüşü) | `kapak_kes("egri")` + `cep_kes("duz"` ya da `"egri")` |
| **kapak — yırtma şeridi** | 04 | `envelope_closed`, `envelope_open` (= closed'un şeritsiz düzenlemesi), `closure` | `env_open` (gövde), `env_strip` = kapalı alfa − açık alfa | kart · `env_open` · `env_strip` · `closure` (kapalıyken `env_closed` üstte, `tear` başında takas) | `hint, tug, closure, head, tear, rise, forward, accents, go, fadeOut` | `tema_build.serit_farki` |
| **kapi** (gatefold) | 06, 14 | aynı üçlü (1536×1024) | kapalı: `door_l`, `door_r` (orta dikişten); açık: `center` (kapalı sınır kutusu içi), `door_l_in`, `door_r_in` (dışı), `pocket` (orta cep, düz üst kenar) | `door_l_in`, `door_r_in` · `center` · kart · `pocket` · `door_l`, `door_r` · `closure` | `hint, tug, closure, head, doors, inner, rise, forward, accents, go, fadeOut` (+ 06 `sweep`) | `tema_build.dikis_bul` + `kapi_kes` (dikiş, katlanma çizgileri, orta cep `duz`) |
| **kitap** | 13 | aynı üçlü (sırt tuval ortasında, kapak sağ yarıda) | kapalı: `cover`; açık: `cover_in` (sırtın solu), `page` (sağ sayfa); `page_turn` = `page` kopyası, arka yüzü aynalı `page` | `cover_in` · `page` · kart · `page_turn` · `cover` · `closure` | `hint, tug, closure, head, cover, inner, page, lift, forward, accents, go, fadeOut` | `tema_build.kitap_kes` (oluk/sırt) |
| **kese** | 09 (sarılı) | aynı üçlü (kapanış 1:1) | kapalı: `pouch_closed`; açık: `pouch_back` (arka duvar + astar), `pouch_front` (ağız ovalinin alt yayından kesilen ön duvar) | `pouch_back` · kart · `pouch_front` · `pouch_closed` · `closure` | `hint, tug, closure, head, loosen, rise, forward, accents, go, fadeOut` | `tema_build.kese_kes` (ağız yayı) |
| **kilif** (vellum) | 18 | `envelope_closed` (boş kılıf), `envelope_open` (üstü açılmış kılıf), `closure` (etiket) | önerilir: üst şerit — `sleeve_body` (gövde, tek nesne) + `sleeve_band` ↔ `sleeve_open_band` (yalnız şerit takası) | kart · `sleeve_body` · `sleeve_band` / `sleeve_open_band` · `closure` | `hint, tug, closure, head, flare, slide, lift, forward, accents, go, fadeOut` | `tema_build.kilif_serit` |

Ortak anahtarlar: `hint` (ipucu söner), `tug` (zarf küçük bir basınç), `closure`, `head` ("You are invited" + isimler kalkar),
`forward`, `accents` (tek sayı: başlangıç ms), `go` (tek sayı: home'a geçiş), `fadeOut` (VT yoksa solma). Değerler
`[başlangıç ms, süre ms]`, dokunmadan itibaren. Tasarıma özel ek anahtar serbest (ör. 06 `sweep`, 20 `wave`), `site.js`'te yorumlu.

### 7.3 kapak (03 modeli)
Sıra (03): `tug` + `closure` (03'te `bow`: fiyonk sağ alta kayar) → `head` → `lift` (`env_cflap` menteşesinde 0→90°) ile aynı anda
`open` (`env_closed` söner, `env_body` + `env_pocket` belirir — kalkan kapağın altında görünmez) → `flap` (`env_flap` −90°→0)
→ `rise` (kart cepten yükselir) → `forward` (kart öne, `scale(1.06)`) → `go`. Kapak kesimi: üst kenardan aşağı, her sütunda
kapak kenarının parlaklık/renk düşüşü; V'de iki doğru + ±14 px iz (`kapak_kes("v")`, 03), tırtık/dalga/fisto/dantel izlenir,
7 sütun medyanı. Eğri kapakta (07/11/12/15/16/17) `kapak_kes("egri")`: ilk geçiş noktaları biçimden bağımsız ayıklanır (yerel
doğru artığı; elips ucu gibi dik yerlerde de), aralarından ön bilgi çizgisi, aynı ±14 px iz + yumuşatma; noktaların x aralığı
dışında (zarftan dar kapak, 16) kapak yok sayılır. Kenar okunmazsa uyarılı geometrik V / yarım elips. Menteşe satırı = kapalı
zarfın üst kenarı (`hinge_pct_of_flap`). Ön cep `cep_kes`: V (03/01), `duz`, `egri`; kenar bandı (kesik kenarın açık şeridi,
altın çizgi) cebe dahil, astar dışarıda.
**Kapanış kapakla taşınıyorsa** (bugün yalnız 01: "carrying the seal with it"): `closure`, `env_cflap` ile ortak bir
`.env-cflap-wrap` içinde **aynı** `rotateX` ve aynı `transform-origin` (menteşe satırı, sarmalayıcı koordinatında) ile döner; 90°'de
ikisi birlikte söner (mühür artık kapağın arkasında). Kapanışı ayrı bir animasyonla "kapakla gidiyormuş gibi" taklit etmek
yasak (iki ayrı perspektif, 1 px kayma). Kapanışın altından çıkan ayrı parça (01 `closure_sprig`) önce kendi hareketini yapar
(dal mührün altından kayar: öteleme + hafif dönme, sonra solma ya da sahnede kalma), sonra kapak kalkar; dal katmanı mührün
**altında**, kapağın üstünde. 04 şeridi: kapalıdan açığın alfası çıkarılınca şerit kalır;
`tear`'de `clip-path: inset(0 0 0 X%)` soldan sağa açar, şerit hafifçe kalkıp döner; kart gövdenin arkasından yırtık
kenarın üstüne çıkar.

### 7.4 kapi (gatefold: 06, 14)
`closure` (06: döner ve kalkar; 14: kopça açılır, kayar) dikişin iki yanına bindiği için kapılardan **önce** biter (ya da dikişten
ikiye kesilip her yarı kendi kapısıyla gider) → `doors`: `door_l` `rotateY(0→-90deg)` origin `0% 50%`, `door_r`
`rotateY(0→90deg)` origin `100% 50%` (aynı anda ya da 06'da "balo kapısı" gibi 80–120 ms aralıkla) → `inner`: `door_l_in`
`rotateY(90deg→0)` origin `100% 50%`, `door_r_in` `rotateY(-90deg→0)` origin `0% 50%` → `rise` (kart orta cepten) →
`forward` → `go`. Dikiş (`dikis_bul`): kapalı sınır kutusunun ortasına yakın en koyu/boşluklu dikey sütun (14'te bilerek düz
boşluk var); bulunamazsa kutu ortası (uyarı). `kapi_kes`: `center` = açık görselin katlanma çizgileri (kapalı `x0`/`x1` ± %3;
çizgi yoksa astar ↔ orta panel renk adımı; o da yoksa kapalı kenar + uyarı) arasındaki kısmı; kapı içleri bunun dışında kalan
alfa; `pocket` = `center`'ın düz kenarlı ön cebi (06'nın altın kenar çizgisi cepte kalır). 06 `sweep`: sahne üstünde kenarsız ışık bandı (§5.7), kart yükselirken.

### 7.5 kitap (13)
Kapalı kitap tuvalin sağ yarısında (sırt tam ortada). Telefonda kapalıyken sahne, kapalı kapağın merkezi ekran ortasına gelecek
kadar ötelenir (`translateX` = `50vw` − kapak merkezi × sahne genişliği; 13'te kapak merkezi sahne kutusunun ~%72'si). `cover`
adımı boyunca bu öteleme, açık çift sayfayı (`cover_in` + `page`, ~sahnenin %88'i) ortalayan ötelemeye ve
`scale(min(1, .94 × 100vw / openSpreadPx))` ölçeğine geçer (§7.1; 390 px'te ~.62) — tek kural, "ya da" yok. Sıra: `closure` (kopça menteşe noktasında döner,
düşer) → `cover` (`rotateY(0→-90deg)`, origin sırt `0% 50%`) → `inner` (`cover_in` `rotateY(90deg→0)`, origin `100% 50%`) →
`page` (isteğe bağlı sayfa çevirme: `page_turn` ön yüzü 0→−90°, arka yüzü = aynalı `page` 90°→0, sol tarafa iner) →
`lift` (kart sayfanın üstünde düz başlar, ölçek + gölgeyle kalkar) → `forward` → `go`. Ateş böcekleri = `accent_1` +
CSS parıltı (§5.7). `kitap_kes`: oluk = kapalı kapağın sol kenarı ± %4 içinde en koyu/boşluklu sütun (yoksa renk adımı, o da
yoksa kapalı sol kenar + uyarı); solu `cover_in`, sağı `page`.

### 7.6 kese (09)
Menteşe yok; tek kabul edilen çapraz geçiş burada: `closure` (lavanta + sicim, 1:1 tuval) çözülüp aşağı/yana kayar →
`loosen`: `pouch_closed` söner, `pouch_back` + `pouch_front` belirir; aynı anda küçük bir "gevşeme" (`scaleX 1.03→1`,
`scaleY .97→1`, alt kenar sabit) — tek başına tam ekran solma değil, kapanış ve kart ayrı hareket eder → `rise` (kart ön
duvarın arkasından) → `forward` → `accents` (lavanta tomurcukları) → `go`. Ön duvar kesimi (`kese_kes`): ağız ovalinin alt
yayı — her sütunda krem ön duvardan yukarı çıkılıp ilk kalıcı renk sapması (astar ya da ağız kenarı), 2. derece "gülümseme"
ön bilgisi, ±10 px iz, yumuşatma; ağız kenarı şeridi ön duvarda kalır. `pouch_back` = açık görselin tamamı.

### 7.7 kilif (18)
Kart kılıfın **arkasında**, kılıfın sınırı içinde (kapalıyken kartın hiçbir kenarı taşmaz). Kılıf GPT'den opak gelirse CSS
`opacity: .82–.9` (kart soluk görünür; katalog "mostly opaque ~80%"). Sıra: `closure` (etiket üst kenarından kalkar:
`rotateX` + öteleme + solma) → `flare` (`sleeve` → `sleeve_open` çapraz geçiş, üst kenar açılır) → `slide` (kılıf aşağı
kayar + söner) → `lift` (kart yukarı) → `forward` → `go`. Önerilir (`kilif_serit`): `flare`'de yalnız üst şerit takas edilir
(`sleeve_band` → `sleeve_open_band`; sınır = iki alfanın farklı olduğu son satır + 6 px), gövde `sleeve_body` tek nesne kalır
— yarı saydam aydınger tümüyle çapraz solunca çift kenar (hayalet) görünür. Şerit ve gövde örtüşmez (üst üste binen yarı
saydam satır koyu çizgi olur).

---

## 8. `MOTION` ve koreografi

`site.js` başında tek ayar nesnesi; içerikten ayrı. İskelet 03 ile aynı, **değerler ve `accents` biçimi değil** (sayılar
aşağıda bilerek yer tutucu; 03'ün sayıları kopyalanmaz):

```js
const MOTION = {
  storage: { opened: 'invite:opened', arrive: 'invite:arrive' },     // + ':<slug>' (§11); <head> betikleri aynı anahtarlar
  envelope: { hint: [/* başlangıç, süre ms */], tug: [ … ], closure: [ … ], /* tipe göre §7.2 */ accents: /* ms */, go: /* ms */, fadeOut: /* ms */ },
  scenes: {                                                           // sahne → [[adım, gecikme ms], …] — sıralı, asla hepsi birden
    'home-hero': [['decor', 0], ['card', /* ms */], ['names', /* ms */], /* … bu tasarımın comp sırası */],
    /* 'home-invite', 'home-teasers', 'home-foot', 'story-head', 'story-frame', 'story-next', 'details-head', 'details-card',
       'details-faq', 'rsvp-card', 'rsvp-form', 'rsvp-closing' */
  },
  stagger: /* 150–250 */, batchGap: /* 300–450 */, arriveDelay: /* ms */,
  accents: {                                                          // an → parçacık grupları; her grup tek tür
    open:    [{ file: 'img/accent_1-200.webp', count: /* açılış cümlesindeki sayı */, path: 'across', origin: 'left',
                dur: [/* min, max ms */], size: [/* min, max px */] }],
    arrive:  [ /* … */ ],
    closing: [ /* … */ ],
  },
};
const ENVELOPE_GEOMETRY = { out: 'translateY(…%)', front: 'translateY(…%) scale(1.06)' };   // manifest.stage'ten hesap, yorumlu
```

- 03'teki adlar: parçacık ayarı `petals` (6 petal dosyası, dosyaları sırayla dağıtır, **yalnız düşer**: y −70 → H+140) ve
  kapanış anahtarı `envelope.bow`; yeni temalarda `envelope.closure` ve yukarıdaki `accents` biçimi: an başına grup listesi,
  grup = `{file, count, path, origin?, dur, size, spread?}`. `path`: `'fall'` (yukarıdan aşağı, 03), `'rise'` (aşağıdan yukarı;
  13 "fireflies glow up"), `'across'` (yatay süzülme, hafif dalga; 01 "two olive leaves float across"), `'swirl'` (dönerek
  yükselip dağılma; 15 "petals swirls up"). `origin`: `'top'`, `'bottom'`, `'left'`, `'right'`, `'card'` (kartın çevresinden),
  `'stage'`. **Açılış cümlesindeki tür, sayı ve yön bağlayıcıdır** (01 `open`: yalnız `accent_1` × 2, `across`; 02 "a single
  eucalyptus leaf drifts down": × 1, `fall`); "konfeti" gibi rastgele çoklu yağmur cümlede yoksa yapılmaz. Ateş böceği parıltısı
  gibi ışık CSS'tir (§5.7), dosya yine GPT accent'idir.
- İşaretler: `[data-scene="<sayfa>-<blok>"]` (görünüme girince oynar), `[data-step="<anahtar>"]` (gecikme = plan),
  `[data-a="<preset>"]` (giriş biçimi), `[data-i]` (aynı adımda ek sıra); `data-repeat` kopyaları sırasını kendisi alır.
- Ortak preset'ler (`site.css`): `rise`, `rise-lg`, `bloom`, `write` (soldan sağa açılan yazı), `unfurl`, `drift-tl`,
  `drift-br`, `drift-l`, `drift-r`; işaretsiz = solma. **Tasarıma özel preset** eklenir, yorumla (ör. `swing` 12/16 etiket ve
  mandallı fotolar, `wipe` 08 buğu katmanı, `lift-veil` 18 vellum, `tumble` 09 presli kartlar, `sweep` 06, `glint` 14 inciler).
  Preset yalnız `opacity`/`transform`/`clip-path`/`filter` ile GPT parçasını oynatır.
- Süreler: sahne başına ilk adım ≤ 150 ms, son adım ≤ 3000 ms; tek giriş 600–1800 ms; `batchGap` 300–450; `stagger` 150–250.
  Görünüme birlikte giren sahneler sırayla (`batchGap`). JS'siz her şey görünür (`.js [data-step]` yalnız JS varken gizler).
- **Comp öğe haritası (zorunlu):** tema `README.md`'sinde sayfa başına tablo: her W1 comp öğesi → şablon öğesi (seçici) ya da
  **bilinçli sapma + nedeni** (ör. 01 W1.2 dört kutulu geri sayım → sade rakam, §5.7). Comp'u olmayan bölümler (01: home davet kartı,
  tanıtımlar, RSVP formu, SSS) bu tasarımın parçaları (`invitation_card`, `info_card`, `divider`, `decor_*`) ve tipografisiyle
  kurulur — 03'ün aralıkları, süs konumları, bölüm sırası ve kart oranları taşınmaz. `compare_<sayfa>_390.jpg` (W1 | tema) G4NN
  kapanmadan **qa-kontrol** incelemesinden geçer (§13.4); "03'ün yeni renkli kopyası" görünümü ret sebebidir (her tasarım
  katalogdaki eksenlerde diğerlerinden ayrışmalı — `tools/katalog.py kontrol`).
- **Her tasarımın koreografisi kendi**: zarf açılışı = katalogdaki `acilis` cümlesi (§7), story dizilişi = katalog `story` /
  `DESIGN_BRIEF.md` "Foto sunumu" + W1.3 comp (ör. 02 anlık baskılar uçarak, 06 basamaklı kemerler ışık süpürmesiyle, 13 tek
  sayfada zikzak, 17 galeri duvarı), parçacık = o tasarımın 3 accent'i. 03'ün zamanlaması kopyalanıp yalnız dosya adı
  değiştirilmez; Sonuç'ta "açılış: …" ve "story: …" birer cümleyle yazılır.

## 9. Foto alanları ve yer tutucu durumu

```html
<div class="photo-slot mask-portrait" data-slot="story_1">
  <img data-photo="story_1" src="img/ph_story_1-300.webp" srcset="img/ph_story_1-300.webp 300w, img/ph_story_1-600.webp 600w"
       sizes="…" alt="" data-attr-alt="{story.items.0.caption}" loading="lazy">
  <span class="ph-mark" aria-hidden="true"><img src="img/accent_1-200.webp" alt=""><span>Your photo here</span></span>
</div>
<img src="img/frame_portrait-320.webp" srcset="…" sizes="…" alt="">        <!-- çerçeve fotoğrafın ÜSTÜNDE -->
```

- Motor: foto varsa `src` = `/media/…`, `srcset`/`sizes` kalkar, `data-photo-state="user"` hem `img`'ye hem `[data-slot]`'a;
  yoksa yer tutucu kalır, `placeholder`. Yer tutucuda `data-attr-alt` uygulanmaz (`alt=""`).
- "Your photo here" (`.ph-mark`) **yalnız önizlemede**: `html[data-preview="true"] .photo-slot[data-photo-state="placeholder"] > .ph-mark`.
  Misafir yalnız nötr yer tutucuyu görür.
- `object-fit: cover`; yüz için `object-position` (portre `50% 38%`, kemer `50% 40%`; daire/oval `50% 45%`). Panel kırpımı
  `aspect` oranında yapar; oran dışı fotoğraf yine `cover` ile dolar.
- Alt metin: hero `"Photo of {name_display}"`, story başlıkları, mekân `"{venue.name}"`.
- Tema 0, 1, 2, 3 hikâye fotoğrafıyla ve boş başlıkla düzgün görünür (boş başlık `data-empty` alır; CSS boşluğu kapatır).
- **Telefonda en küçük foto penceresi:** 390 px'te her story penceresi ≥ **38vw** (~148 px) genişlikte. Comp yan yana dizilişi
  (06 "three arch frames standing side by side" ≈ 110 px, 13 tek sayfada üç foto ≈ 100 px) buna sığmıyorsa telefonda basamaklı ya
  da alt alta düzen kurulur ve tema README'sinde comp sapması olarak yazılır; geniş ekranda comp dizilişi kalır.
- **Uzun kart / uzun sayfa:** GPT kartı (`info_card`, `invitation_card`) 2:3 sabit gelir. Daha uzun bir kâğıt gerekiyorsa (13
  "single tall storybook page", 7+ program satırı) yalnız **dikey 3 dilim** kesimiyle uzatılır: üst bant + tekrarlanabilir düz kâğıt
  orta bandı (dekorsuz olduğu `serbest_bolge`/`free_zone` ile doğrulanır) + alt bant; ek yeri önizlemede gözle denetlenir.
  CSS ile kâğıt, kenarlık ya da çerçeve çizilmez. Orta bant tekrarı ek yeri bırakıyorsa tasarımın `ekler`'ine uzun bir GPT
  parçası (`story_page.png`) istenir (katalog düzeltmesi + G2NN).

## 10. Erişilebilirlik ve azaltılmış hareket (zorunlu)

- Sayfa başına tek `<h1>`; `main` + `nav` landmark'ları; dekor görselleri `alt=""` (GPT parçalarının hepsi), parçacık katmanı
  `aria-hidden`; index kartı `aria-hidden="true"` (isimler `<h1>`'de).
- Sahne `role="button" tabindex="0" aria-label="Open the invitation"`; Enter/Space açar; `:focus-visible` halkası her
  etkileşimli öğede.
- Dokunma alanı ≥ 44×44 px (Skip, Replay, nav, metin linkleri — gerekirse `::after` ile genişletilir); Skip sağ üstte,
  açılış boyunca görünür.
- Kontrast: gövde metni ≥ 4,5:1, büyük el yazısı ≥ 3:1 — **boyalı zeminin gerçek renginde** ölçülür; gerekirse paletten türetilmiş
  koyu token (03: `--ink-soft`, `--gold-ink`) ve `text-shadow` hâlesi. Koyu tasarımlarda (06, 19) açık metin.
- `prefers-reduced-motion: reduce`: dokununca animasyonsuz doğrudan home (kart uçuşu yok), sahneler anında görünür, parçacık yok,
  sonsuz döngülü animasyon (ipucu nabzı, ok) yok, VT süreleri ~0, `scroll-behavior: smooth` kapalı.
- Geri sayım `role="timer"` (canlı bölge değil), bitince metin. Ses/otomatik oynatma yok. İçerik yalnız görselde değil.
- CSS `content` ile eklenen işaretler (SSS "+"/"×", oklar) erişilebilir ada girmez: `content: "+" / ""` (önce yedek olarak
  `content: "+"`) ya da şablonda `aria-hidden="true"` span. Denetim: SSS sorusunun erişilebilir adı = soru metni (CDP
  `Accessibility.getFullAXTree`; `tests/g051-browser.ts`).

## 11. View transition, geri dönüş, oturum anahtarları (zorunlu)

- `site.css`: `@view-transition { navigation: auto; }`. Kart (index `.card` ve home hero kartı) aynı `view-transition-name`
  (`invite-card`), nav `site-nav`. **Her ad sayfada tek öğede** (iki öğe aynı adı alırsa geçiş düşer).
- `sessionStorage` (try/catch; gizli kipte sessizce yok sayılır), **site başına**: `invite:opened:<slug>`,
  `invite:arrive:<slug>` (`<slug>` = `site-data.slug`; statik önizlemede ek yok). Başka anahtar, `localStorage`, çerez yok.
- index `<head>` betiği `opened` varsa `is-opened` (açık zarf, kart dışarıda, "Enter" + "Replay the opening"); `?replay=1`
  kapalı başlatır. home `<head>` betiği `arrive`'ı okuyup siler → `from-envelope`; çapraz belge VT yoksa `arrive-fade` (solma).
- `go(withCard)`: `opened` yazar; kartla geçişte `arrive`; Skip'te kartın `view-transition-name = 'none'`.
- bfcache: `pageshow` (`persisted`) → betik animasyonları iptal, açık durum (kullanıcı tuzağa düşmez).
- Satır içi betik değişirse CSP hash'ini motor kendisi hesaplar; anahtar adları `MOTION.storage` ile aynı kalmalı (test).

## 12. Tipografi, uzunluk, tarih

- Fontlar katalogdaki çift (Google Fonts; repoya font dosyası yok). Script fontun `&`'ı yerine `.amp` (italik serif;
  `data-format="amp"` ya da elle `<span class="amp">`).
- Alfabe: isimler aksanlı olabilir (09 demo "Amélie"). Seçilen ailelerin Google Fonts CSS yanıtında `latin-ext` bloğu yoksa
  (yalnız `latin`) aksanlı isim başka fontla karışır → başlık için `latin-ext` destekli eş seçilir ya da Sonuç'a sınır olarak yazılır.
- Taşma: alıcının girebildiği her değerde düzen bozulmaz. Şema bugün çoğu alanı **sınırlamıyor** (`schedule` için `maxItems`,
  `display_name`/`full_name`/`venue.name`/`host_line`/program etiketi-yeri/`dress_code` için `maxLength` yok; panel de sınır
  koymuyor; yalnız `/start` isimleri ≤ 40). Bu yüzden tema iki düzeyde denenir:
  1. **Tasarım aralığı** (kart `free_zone` içinde, sıkışık düzen dahil): isimler ≥ 14 harf, 1–6 program satırı, 60 karakterlik
     mekân, tam İngiliz tarih (`en-GB`) — `clamp()` + container query birimleri, 4+ satırda sıkışık düzen (03 `.sched-list:has(...)`).
  2. **Zorlama kaydı** (bozulmadan, kart dışına taşmadan; görünüm sade kalabilir): 12 program satırı (60 karakterlik etiket ve yer),
     40 karakterlik isimler ve tam adlar, 80 karakterlik mekân, host line ve dress code. Kartın sığdıramadığı program satırları
     kartın **altında düz kâğıtta** sürer (ya da kart §9'daki 3 dilim kesimle uzar); metin boyalı dekorun üstüne binmez, yatay
     kaydırma yok. 03 bugün bunu karşılamıyor (README "Program 7+ satırda Details kartına sığmaz") → §14 #10.
  Şemaya/panele üst sınır koymak ürün kararıdır (§14 #10); karar gelene kadar tema 2. düzeyi karşılar.
- Tarihler yalnız motor biçimiyle (`May 15, 2027` / `15 May 2027`); comp'taki büyük harfli tarih CSS `text-transform` ile.

---

## 13. G4NN bitti tanımı

### 13.1 Dosyalar ve komutlar
```bash
# repo kökünden
python3 tools/kit_check.py collections/NN_* --paket 5 && python3 tools/kit_check.py collections/NN_* --paket 2   # + zarf hizası
python3 platform/themes/<slug>/build_images.py                 # tools/tema_build.py; denetimler geçer, img/manifest.json yazılır
python3 tools/tests/test_tema_build.py --hizli                 # ortak modül değiştiyse (tam hâli 03'ü bayt bayt yeniden üretir)
# platform/ içinde (Node 22)
export PATH=/opt/node22/bin:$PATH && cd platform && npm ci
npm test && npm run typecheck && npm run build                 # build → trace-check yeni temanın index.html'ini de arar
NODE_PATH=/opt/node22/lib/node_modules node scripts/theme-check.cjs --theme <slug>    # G052
NODE_PATH=/opt/node22/lib/node_modules node tests/g051-browser.ts --theme <slug>       # G052 (takvim, SSS, sorular)
```
Yazma alanı: `platform/themes/<slug>/` + `platform/tests/theme-<slug>.test.ts` + `platform/previews/g4NN/` (G4NN `yazar:`
alanında; G046 incelemesinde katalogdan yeniden üretildi).

**`--theme` bugün yok:** `theme-check.cjs` (ve `g051-browser.ts`, `final-smoke.ts`) yalnız `blush-garden-rose`'u denetliyor.
Genelleştirme **G052**; G401–G420'nin `bagimli`'sinde G052 var — **G052 bitmeden hiçbir G4NN alınmaz** (yoksa ajan ya `yazar`
dışına yazar ya tarayıcı denetimini atlar).

### 13.2 `tests/theme-<slug>.test.ts` (node:test; `theme-blush-garden-rose.test.ts`'in 20 testinin karşılığı + ekler)
1. `theme.json`: herkese açık (`listThemes`), 5 sayfa, 5 foto alanı, `aspect` = `manifest.photo_slots` `box_px`.
2. Sayfaların ve `site.css`'in andığı her tema dosyası var (kırık görsel yok); `og:image` dosyası var.
3. Beş sayfa motor uyarısız; her `data-field` içerik kaydına eşit (bağımsız `en-US` biçimleyici).
4. Şablonlarda kişisel metin yok (demo isim/mekân/tarih/saat dizgileri kaynakta geçmez; başka kayıtla render'da eskisi yok).
5. İçerik değişimi her sayfada görünür (isim, tarih, mekân, program satırları, hikâye, son tarih).
6. Foto alanları: alıcı fotoğrafı yer tutucuyu değiştirir (`srcset` kalkar, `user`); yoksa yer tutucu (`placeholder`).
7. İsteğe bağlı bloklar: bölümler, Story sayfası (404) ve ona giden linkler kalkar.
8. Linkler: eksik URL düğmesi kaldırır; gerçek URL `rel="noopener noreferrer"` alır.
9. RSVP sözleşmesi: `name` alanları, `method="post"`, `action` yok, 4 durum paneli, `/rsvp/form.js`.
10. Önizleme: her sayfa linki ve `site-data.pages` `?preview=` taşır.
11. `rsvp.method` dolu: RSVP sayfası 404, hiçbir yerde yanıt çağrısı yok.
12. "Your photo here" yalnız önizlemede; foto alt metinleri içerikten; çıktıda şablon yorumu yok.
13. `site.js` sözleşmesi: `#site-data` okur, `data.pages` ile gezinir, sayfa adresi yazmaz, oturum anahtarları slug'lı ve
    `<head>` betikleriyle aynı, `DEV_CONTENT` = `content.demo.json`, `devRender` foto haritası = `theme.json`.
14. Gerçek rotalar: yayındaki site 200, CSP hash'leri, yüklenen foto `/media/…`.
15. Gizlilik: kapalı bölümler hiçbir sayfa kaynağında (site-data dahil) iz bırakmaz.
16. **Ek:** `content.demo.json` geçerli, `record_kind: "demo"`, koleksiyon kaydıyla `story` dışında birebir; `/start` teması
    sunar (`claimableTheme`).
17. **Ek:** program 1 ve 6 satır, uzun isimler ve `en-GB` kayıtla render uyarısız; §12 zorlama kaydıyla (12 satır, 40/80
    karakter) uyarısız (görsel taşma §13.3'te).
18. **G051 takvim:** home ve details'te `data-calendar="ics"` → `/<slug>/event.ics` ve `google` → Google linki (`target` +
    `rel`); önizlemede anahtar korunur; tarihsiz kayıtta ikisi de yok.
19. **G051 SSS:** details'te sırayla `<details>` akordeon, `.q`/`.a` içerikten; blok kapalıyken ya da liste boşken kaynakta yok.
20. **G051 sorular:** rsvp formunda soru başına `fieldset[data-rsvp-question]`, seçenekler radyo, kısa yanıt kutusu, hata yeri;
    hepsi `[data-rsvp-if-attending]` içinde. (18–20: `theme-blush-garden-rose.test.ts` G051 testlerinin karşılığı.)
21. **Tam ad yedeği:** `partners[n].full_name = null` → davet kartında `display_name`; boş isim satırı (`data-empty`) yok.
22. **K21 statik denetim:** `site.css`'te `.cd-*` (ve tasarımın içerik bloklarında) `border`/`outline`/`box-shadow` yok (§5.7).

### 13.3 Tarayıcı denetimi (`theme-check --theme` + `g051-browser --theme`, G052; Playwright, `next start`, `/opt/pw-browsers`; `playwright install` yok)
- **Genişlikler:** 5 sayfa × 360 / 390 / 430 / 768 / 1280: yatay kaydırma yok, ekran dışı metin yok, kırpılmamış taşan öğe yok,
  bütün görseller yüklü, konsol/CSP hatası yok, her alan = içerik, `<title>` doğru, kart metni `free_zone`'da, foto durumları
  (demo fotoğraflı site `user`; fotoğrafsız site `placeholder`; önizlemede etiket görünür, yayında görünmez), fontlar yüklü.
- **Kısa telefonlar:** 360×640, 375×553 (Safari çubuklarıyla), 390×690 (panel önizlemesi), 390×844: zarf sayfası yazıları
  (kicker, isimler, ipucu; açıkken "Replay") boyalı dekorun değil düz zeminin üstünde (yazı gizlenip zemin ölçülür); kapalı nesne
  ve "Tap to open" ekranda (§7.1 sahne boyu); açık hâl (kapı/kitap) yatay kaydırma üretmiyor.
- **G051 (390 px):** takvim düğmeleri ≥ 44 px ve kart dışında; SSS dokun/klavye ile açılır, sorunun erişilebilir adı = soru metni;
  sorular "yes"te görünür, "no"da gitmez; panelde "Questions & answers" ve "Questions for your guests" bölümleri bu temada görünür.
- **Akışlar (390×844):** zarf → home (kart geçiş bayrağı, süre) → nav ile story; geri → açık zarf + "Replay the opening";
  replay; Skip → home; reduced motion → animasyonsuz home; site başına oturum (başka slug kapalı zarfla açılır); önizleme
  anahtarı açılış ve sayfalar boyunca korunur; geri sayım hedefi ve bitmiş hâli; linksiz bloklar misafire görünmez; RSVP: boş
  isim hatası yerinde + odak + gönderim yok, yanıt bu siteye kaydedilir + teşekkür, "Send another reply", önizlemede
  gönderim yok, tema demosu (`/start/demo/<slug>/rsvp`) hatasız; dış istek yalnız Google Fonts; veri değişince sayfa değişir.
- **Ölçüm:** ilk görünüm index ve home (DPR 3, yer tutucu) ≤ 1,5 MB, ayrıca tohumlanmış fotoğraflarla (sayı yazılır, §6);
  dokunmatik hedefler ≥ 44 px.
- **Kayıt:** 390×844 açılış MP4'ü (dokun → açılış → home → story → details).

### 13.4 Önizlemeler (`platform/previews/g4NN/`, yayına girmez)
`<sayfa>_390.png` (5), index ve home her genişlikte, `details_1280.png`, `*_placeholder.png`, `details_390_changed_content.png`,
`compare_<sayfa>_390.jpg` (**W1 comp | tema** yan yana), `compare_closure.jpg` (§7.1), `opening_390x844.mp4`, `checks.json`
(geçen/uyarı/hata, ilk görünüm KB — yer tutuculu ve fotoğraflı —, açılış ms, seed fotoğrafları).

**Karşılaştırma bir kapıdır:** `compare_*` görselleri ve tema README'sindeki comp öğe haritası (§8) G4NN `inceleme`'ye geçmeden
**qa-kontrol** alt-ajanına (salt okunur) incelettirilir; ret sebepleri: comp'ta olmayan 03 düzeni/süs konumu, kodla çizilmiş
çerçeve/dekor (§5.7), comp öğesinin gerekçesiz atlanması. İnceleme sonucu Sonuç'a yazılır.

### 13.5 Sonuç (dürüst; görev dosyasında)
- Ne yapıldı (dosyalar), açılışın ve story'nin tek cümlelik tarifi, comp'tan bilinçli sapmalar ve nedeni.
- Komut + sayı: `npm test` (n/n), typecheck, build + trace-check, `theme-check` (geçen/uyarı/hata), ilk görünüm KB, açılış ms.
- **Denenmedi** (her zaman yazılır): gerçek iPhone/Safari ve Android Chrome, temanın Vercel'de yayını (yayın bu görevin işi
  değil), gerçek alıcı fotoğrafları (farklı oran/ışık), yavaş ağ.
- Sorunlu GPT parçaları (hiza kayması, kesilemeyen kenar, leke) ve **önerilen prompt düzeltmesi** (`tools/katalog.py` `WEB[NN]`
  ya da ortak metin; 19 dosya elle düzenlenmez), önerilen görevler (entegratör açar).

---

## 14. Bilinen boşluklar → önerilen görevler (G046 Sonuç'ta da)

| # | Boşluk | Öneri | Rol |
|---|---|---|---|
| 1 | Ortak tema yardımcıları 03'ün klasörlerinden içe aktarılıyor | **yapıldı (G054):** `tools/tema_build.py` (§5.4) — webp/manifest, foto alanı + maske, serbest bölge, yer tutucu, og + favicon, denetimler, hiza; kesimler: V/eğri kapak, V/düz/eğri ön cep, gatefold dikişi + katlar, kitap sırtı, kese ağız yayı, kılıf üst şeridi, şerit farkı (her biri sahte görselle + uyarılı geometrik yedek; `tools/tests/test_tema_build.py`); 03 teması bunu kullanıyor, çıktısı bayt bayt aynı | — |
| 2 | `kit_check` kapalı/açık zarf (ve sarılı kapanış) hizasını denetlemiyor | **yapıldı (G054):** `--paket 5` (ve 4) tipe göre kenar karşılaştırması (±%1,5 uyarı, > %4 hata), sarılı kapanış uçları, `--hiza`, `--zarf-tipi` (§5.2, §7.1). 03: farklı tuval, ölçekli −%4,55 (uyarı); 01 (birleşmemiş `origin/codex/g201-…` dalındaki W2 parçaları): sol +0,29 · sağ −0,39 · alt −0,65 % (geçti) | — |
| 3 | `scripts/theme-check.cjs`, `tests/g051-browser.ts`, `tests/final-smoke.ts` blush-garden-rose'a bağlı | **açıldı: G052** (`--theme <id>`; G401–G420 ona bağlı) | claude-kod (ilk G4NN'den önce) |
| 4 | G4NN `yazar:` yalnız tema klasörü; görev metni `img_src`, "link will be added soon", "03'ün yapısını kopyala" diyordu | **yapıldı** (G046 incelemesi): `tools/katalog.py` `g4_gorev` düzeltildi, 19 görev dosyası yeniden üretildi | — |
| 5 | 01, 02, 04–20 demo kayıtlarında `story` yok; 01'de `full_name` `null` | **açıldı: G053** | claude-metin |
| 6 | blush-garden-rose'ta `og:image` ve favicon yok | **dosyalar yapıldı (G054):** `img/og-1200x630.jpg` (`web_hero` alt hizalı 1.91:1, yazısız; zarf + fiyonk tam) ve `img/favicon.png` (`ribbon_bow`, 180 px şeffaf kare); **etiketler G055** (motor dosya varsa yazar) | claude-kod (G055) |
| 7 | Her tema rotasının Vercel paketine bütün tema görselleri giriyor (20 tema × ~2,7 MB ≈ 55 MB/fonksiyon; Aşama 2 varyantlarıyla 250 MB sınırına yaklaşır) | görselleri yalnız tema varlık rotasına izle (diğer rotalara `*.html`/`*.json`), ya da derlemede `public/`'e kopyala | claude-kod |
| 8 | Aşama 2 varyantları (G090 sonrası) | renkler yalnız `:root` token'larında; `html[data-variant]` kancası hazır; varyant görsel klasörü ayrı karar | — |
| 9 | Alıcı fotoğrafı tek büyük dosya (≤ 2400 px q84, `srcset` yok) → fotoğraflı ilk görünüm ölçülmemişti | yüklemede 640/1280 türevleri + motorun yazdığı `srcset`/`sizes`; o zamana kadar §6 fotoğraflı ölçüm yazılır | claude-kod (platform) |
| 10 | Şema/panel program satırını ve metin uzunluklarını sınırlamıyor; 03 Details kartı 7+ satırda taşıyor | **ürün kararı:** üst sınır (ör. `schedule` ≤ 8–12, isimler ≤ 40 — `/start` gibi —, mekân ≤ 80; şema + iki doğrulayıcı + panel) ya da yalnız tema tarafı (§12 zorlama kaydı); 03'ün Details kartı §9 3 dilimle uzatılır | kullanıcı kararı → claude-kod |
| 11 | 01 `closure_sprig` gibi açılış cümlesinin gerektirdiği gizli parçalar | her G2NN W2'den önce `acilis` cümlesi §5.1'e göre okunur; eksik `ekler` katalogda | entegratör |

## 15. Kontrol listesi (G4NN)

- [ ] `kit_check --paket 5` ve `--paket 2` geçti (ya da Sonuç'ta neden)
- [ ] Klasör §1 düzeninde; kaynak PNG / `img_src` / önizleme tema klasöründe yok; klasör ≤ 3 MB
- [ ] `theme.json`: 5 sayfa, 5 sabit foto anahtarı, `aspect` = manifest `box_px`, `internal` yok
- [ ] `content.demo.json` = koleksiyon kaydı (+ `story`), `DEV_CONTENT` ile aynı
- [ ] Kişisel her değer işaretli (§3.2, §4); comp demo metni şablonda yok; link blokları `data-if="urls.*"`
- [ ] Davet kartında tam ad yedeği (`full_name` boşsa `display_name`); `guest_policy` yok
- [ ] G051: takvim çifti home + details, SSS bloğu details, çiftin soruları rsvp formunda (§3.5); SSS işareti erişilebilir ada girmiyor
- [ ] RSVP sayfası G042 sözleşmesinde; story `data-optional="our_story"`, rsvp `data-if="!rsvp.method"`; nav kuralları
- [ ] `build_images.py` (`tools/tema_build.py` ile): geçici `parts_prep`, tip kesimleri (geometrik yedek uyarısı varsa önizleme +
      Sonuç), maskeler, `free_zone`, yer tutucular, `og-1200x630.jpg` + `favicon.png`, klasör ≤ 3 MB; pencere şeffaflığı ve yeşil
      denetimi geçiyor; `manifest.json` (stage, closure, photo_slots, bayt)
- [ ] Kapalı/açık hiza tipine göre kenarlarla ±%1,5 (ya da ölçülen düzeltme `manifest.stage.align`'da)
- [ ] Kapanış kesim geometrisine bağlı (`manifest.closure`, `compare_closure.jpg`); kapakla taşınan kapanış ortak sarmalayıcıda
- [ ] Zarf açılışı tipine uygun (§7): kapanış, zarf parçaları, kart ayrı hareket; 90° el değiştirme temiz; ≤ 5 s; Skip
- [ ] Kart home'a VT ile geçiyor; VT adları sayfada tek; VT'siz tarayıcıda solma
- [ ] `MOTION` tasarıma özel (açılış + story + accent); 03 zamanlaması olduğu gibi kopyalanmadı; `accents` açılış cümlesindeki
      tür/sayı/yönde
- [ ] Tema README'sinde comp öğe haritası; comp'u olmayan bölümler bu tasarımın parçalarıyla; `compare_*` qa-kontrol'den geçti
- [ ] Yalnız GPT parçaları; CSS yalnız ışık ve arayüz (§5.7); içerik bloklarında CSS çerçeve yok
- [ ] Her `<img>` doğru `srcset`/`sizes`; ekran altı `lazy`; ilk görünüm index/home ≤ 1,5 MB (DPR 3, yer tutucu); fotoğraflı
      ölçüm Sonuç'ta
- [ ] Foto alanları: maske, `object-position`, yer tutucu, etiket yalnız önizlemede, alt metinler
- [ ] Erişilebilirlik: tek `h1`, sahne düğmesi + klavye, ≥ 44 px, kontrast ölçüldü, reduced motion
- [ ] `sessionStorage` anahtarları slug'lı, `<head>` betikleriyle aynı; geri dönüş/replay/bfcache çalışıyor
- [ ] 360 px'te tasarım aralığı (uzun isim, 6 program satırı, uzun mekân, `en-GB`) ve §12 zorlama kaydıyla taşma yok; story
      pencereleri ≥ 38vw; aksanlı isim fontu (latin-ext) kontrol edildi
- [ ] `og:image` (isimsiz, 1200×630) + `og:title` kişisel
- [ ] `npm test`, `npm run typecheck`, `npm run build` (trace-check) geçti; `tests/theme-<slug>.test.ts` (§13.2, 22 madde)
- [ ] `theme-check --theme` ve `g051-browser --theme` (G052): 5 genişlik, kısa telefonlar, akışlar, G051, ağırlık, MP4 — hatasız
- [ ] `previews/g4NN/` (W1 karşılaştırması dahil); tema `README.md`
- [ ] Sonuç dürüst: denenmeyenler, comp sapmaları, sorunlu GPT parçaları + önerilen prompt düzeltmeleri
