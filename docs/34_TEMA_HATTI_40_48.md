# Tema hattı 40–48 — pilot 39'dan çıkan yönerge (2026-10-21)

Pilot: **39 Silver Photo Booth**, commit `16adf6fa` (G439). Her tema oturumu (G440–G448) bu belgeyi ve pilotun dosyalarını
örnek alır. Genel standart `docs/11_TEMA_STANDARDI.md`; çelişkide **bu belge + pilot** (4. dalga, GPT parçaları önceden hazır).
Tasarımın kendisi: `collections/<NN>_*/DESIGN_BRIEF.md` + `assets/gpt/GPT_PROMPTS.md` (her parçanın "Kullanım" satırı tema
için yazıldı). GPT görselleri (PAKET 5/2/6) repoda; göz kontrolü yapıldı, bilinen kusurlar aşağıda §4.

## 1. Çalışma düzeni (paralel oturumlar)
- Her oturum **kendi worktree'sinde, kendi dalında**: `claude/g4NN-<slug>` (ör. `claude/g440-swan-chantilly-lace`). main'e
  push **yok**; dal push'lanır, birleştirmeyi entegratör (39'u kuran oturum) yapar. Commit kimliği:
  `git -c user.name=dflora -c user.email=yaniksazcetin@gmail.com commit …`, mesaj `G4NN: …`, sonda
  `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.
- `platform/node_modules` worktree'de yoksa ana checkout'takine bağla (kurulum beklemez):
  `cmd //c mklink /J platform\\node_modules C:\\Users\\Foto\\Documents\\davetiye-maker\\platform\\node_modules`
- Dev sunucu portu çakışmasın: `npm --prefix platform run dev -- -p 30NN` (40 → 3040 …). Not: `predev` `public/themes/`'i
  siler (gitignored, sorun değil).
- Yalnız kendi tasarımının dosyalarına + aşağıdaki ortak kayıt satırlarına yaz. Durum dosyalarına (PROJECT_STATE.json,
  COLLECTION_STATUS.md) dokunma.

## 2. Yapılacaklar (pilotun karşılığı; dosya adlarını kendi slug'ınla değiştir)
1. `platform/themes/<slug>/` — pilotun yapısı: `theme.json`, `content.demo.json` (= koleksiyondakinin birebir kopyası),
   `index.html` · `home.html` · `story.html` · `details.html` · `rsvp.html`, `site.css`, `site.js`, `thank-you.css`,
   `build_images.py`, `README.md`, `img/` (build çıktısı). `parts.css` gerekmez (bütün parçalar var).
   - Zarf: brief'teki zarf/kapanış/açılış koreografisi; katmanlar ayrı (arka, kart, ön cep, kapak dış/iç, kapanış öğeleri).
   - Açık kapak isimleri örtmesin: zarfın üstünde kapağın açık boyu kadar yer (pilot: `.stage` margin = `obj / oran × kapak%`),
     zarf boyu ekran yüksekliğinden: `--obj:min(56vw,calc((100svh - 300px) / 2.32),260px)` gibi (kendi oranınla hesapla).
   - Foto sunumu ve hareket imzası brief'ten; `MOTION` (site.js) ile CSS keyframe gecikmeleri **aynı sayılar**.
   - Metin/düzenlenebilir metinler: `node scripts/copy-manifest.ts --theme <slug>` (yazar) ve `--check` (işaretsiz metin yok).
2. `build_images.py` (pilot: `platform/themes/silver-photo-booth/build_images.py`): bütün parçalar zorunlu; aynı tuvalde
   üst üste çizilmiş zarf katmanlarını **alfa kutusuna kırp + arka katmanın kutusuna göre yerleştir** (GPT %3–5 kaydırıyor),
   sayılar `manifest.stage` → site.css aynı sayılar (test eşitliği denetler). Pencere: `keyed_window` (pencere dikdörtgenini
   tümden şeffaf yap + 10 px halkada yeşil taşmasını nötrle) — `checks.green` boş olmalı. Yeşili hiç olmayan/çok az olan
   pencere için §4'teki çözüm. Klasör ≤ 3 MB.
3. Ortak kayıtlar (hepsi **ekleme**; 39'un satırının hemen altına):
   - `platform/lib/marketing/config.ts` (status `coming`, price `[PRICE]`, `updated: '2026-10-21'`)
   - `platform/lib/marketing/designs.ts` — `DESIGN_COPY` girdisi (opening `Your guests tap the envelope. …` ile başlar) +
     `DESIGN_STYLES` (`classic|floral|rustic|destination|seasonal|storybook`); palet adları mevcut çevrilmiş adlardan
     (`grep -o "name: msg('[^']*')" lib/marketing/designs.ts | sort -u`). Tek tırnak içinde kesme işareti `\'`.
   - `platform/lib/audio/catalog.ts` (efektler: seal ribbon clasp paper slide page tear whoosh chime tap; müzik
     content.demo.json `audio.music`), `platform/lib/claim/demo-map.ts` (demo şehri pini), `platform/lib/print/layouts.ts`
     (PAKET 6 zeminleri `sources: { front: 'print/invitation_front_5x7.png', back: … }`, `cover('front')`; kutular süsün
     dışında — zeminde süs bantlarını ölç, pilot yorumundaki gibi yaz), `tools/katalog.py` `EK_TEMALAR` (39'un altına;
     `PYTHONUTF8=1 python3 tools/katalog.py kontrol` geçmeli).
   - i18n: `platform/lib/i18n/dict/market/{tr,de,es,fr}.ts` (designs.ts'teki 8 cümle) ve `dict/site/*` (yeni copy
     varsayılanları, ör. `home_intro`) — `node scripts/i18n-missing.ts` eksik sayısı artmamalı (önceden market 19, site 2 eksik
     vardı; onlar senin değil). Düğün sözlüğü `platform/lib/i18n/wedding-glossary.ts`: demo içeriğindeki program satırları,
     kıyafet kuralı, SSS soru-cevapları (`tests/g150-i18n.test.ts` "glossary covers…" testi). Sırası: en, tr, es, de, fr.
   - Demo fotoğrafları: `node scripts/build-demo-photos.ts --theme <slug>` (public/demo/<slug>/ + lib/claim/demo-photos.json);
     baskı: `node scripts/build-print-assets.ts --theme <slug>` (public/print/<slug>/).
4. Testler: `platform/tests/theme-<slug>.test.ts` (pilotun testini uyarla: zarf katmanları, MOTION↔CSS sayıları,
   manifest.stage↔site.css, pencere yüzdeleri, K21, demo, teşekkür modu, ses, RSVP). Sayım testlerine kendini ekle:
   `g085/g093/g094/g097-designs` (coming listesinin sonuna), `g175-openings` (COMING_OPENINGS + designs.length),
   `g138-extras` (THEMES.length), `g139-print` (`PLANNED` listesinden **kendi** koleksiyonunu çıkar). Sayılar birleştirmede
   entegratör tarafından toplanır; kendi dalında doğru olsun.
   - Windows'ta: `PYTHONUTF8=1` ile koş (yoksa g055-limits Türkçe çıktıda düşer). `g080-approval` 8 testi symlink EPERM ile
     düşer — ortamdan, senin değil; Sonuç'a böyle yaz.
5. Göz kontrolü: tarayıcı paneli gizliyken sayfa arka planda çalışır (animasyon/zaman kayar, kaydırma ekrana yansımaz).
   Kapalı/açık zarfı JS ile `is-opening` ekleyip `document.getAnimations()` → `pause()` + `currentTime = t` sararak kare kare
   kontrol et; iç sayfaları bütün `[data-step]`'lere `.in` + animasyonları `finish()` ederek, taşmayı `scrollWidth` ile ölç.
   Yerel Chromium (playwright-core) bu kum havuzunda başlamıyor; `theme-check` / `font-fallback` koşulamadı — Sonuç'a yaz.
6. Bitti: tema testi + yukarıdaki sayım testleri + g139 + g150 + g155 + content testleri geçer; build temiz (yeşil yok, ≤3 MB);
   kapalı → açık → home karelerine bakıldı; dal push'landı; kısa Sonuç (ne yapıldı, ne test edildi, ne edilemedi, GPT
   kusurları nasıl çözüldü) dalın son commit mesajında ve oturum raporunda.

## 3. Pilotta düzeltilen tuzaklar
- Yazı "pozlama" bulanıklığı gibi `filter` kullanan genel `[data-step]` kuralı, çerçevenin `drop-shadow`'unu siler:
  çerçeveli öğeleri `:not(.frame)` ile dışarıda bırak.
- `span` kapsayıcılarda `width:%` ve `margin:auto` için `display:block` şart (pilotta şerit tam genişlikte çıktı).
- U/yay kapaklı zarfta kapalıyken kapağın yanlarında arka astar görünebilir: cebin kendi kâğıdından kırpılmış bir `under`
  katmanı kapalıyken boşluğu doldurur, kapak kalkarken söner (çizim değil, GPT kırpımı).
- Tarayıcı CSS'i önbellekten getirir: değişiklikten sonra `fetch('/themes/<slug>/site.css',{cache:'reload'})`.

## 4. GPT görsellerinin bilinen kusurları (2026-10-21 göz kontrolü + kit_check)
- **Oran:** kit_check'in 49 "oran" uyarısının çoğu zararsız (şeffaf parça alfa kutusuna kırpılıyor; web_hero 1,9:1 zaten og
  oranı). Önemli olan aynı tuvalde üst üste konacak katmanlar: kutularına göre yerleştir (§2.2).
- **Pencere yeşilsiz / çok küçük:** 40 `print_wide` (pencere içi şeffaf, yeşil yok), 41 `canvas_frame` (yeşil %0,25),
  48 `cartouche_frame` (yeşil yok). Çözüm: pencereyi şeffaf iç boşluktan ölç — çerçevenin alfa kutusu içinde, kenara
  değmeyen en büyük `alfa < 16` bölgesinin kutusu (48'de köşeleri içe kesik: kutu + maske gerekmez, foto kutuya oturur,
  çerçeve üstte). Yeşil halkası olanlarda `keyed_window` yeter.
- Pencere içinde hayalet leke: 43 `instant_frame` (ortada gri leke) — pencere dikdörtgenini tümden temizlemek giderir.
- 45: `env_front` ve `cord` 1036×1518, `env_back`/`flap` 1079×1457 (farklı tuval) ve `cord` zarf eninden kısa (ortada küçük
  düğüm). Katmanları yüzdeyle eşle; kordon kısa kaldıysa düğümü konçonun altına ortala, eksik sarmayı uydurma/çizme.
- 44 `env_front`: yan kanatlar yukarıda sivri uzuyor (agresif yan flaplar); kapalı hâlde kapak bunları örtüyorsa sorun yok,
  örtmüyorsa üstünü `under` yöntemiyle veya kırpımla çöz.
- 46 `knot` çok küçük bir kurdele parçası (iki delik arası) — çözülmüş hâl için yeterli; fiyonktan düğüme geçişte kullan.
- 42 `hills/meadow/grasses` kenarları yumuşak sönüyor (paralaks için taşırarak büyüt).
- Fotoğraflar (PAKET 2) 50/50 kit_check'ten geçti; çiftler tutarlı.
