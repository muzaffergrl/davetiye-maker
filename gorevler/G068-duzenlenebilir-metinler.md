---
id: G068
baslik: Neredeyse her metin düzenlenebilir — tema başlık/etiketleri panelden değişsin (varsayılan + sıfırla)
rol: claude-kod
durum: bitti
alan: claude-G068
oncelik: 1
bagimli: [G060]
yazar: [platform/lib/, platform/components/panel/, platform/app/api/, platform/themes/olive-ivory/, platform/themes/blush-garden-rose/, platform/tests/, docs/03_URUN_ICERIK_SEMASI.json, docs/11_TEMA_STANDARDI.md, platform/README.md, platform/previews/g068/]
---

## Amaç
Kullanıcı (2026-10-14): "en kolay şekilde düzenlenebilir olmalı mutlaka, neredeyse tüm alanlar". Bugün isimler, tarih, mekân,
program, hikâye, SSS, RSVP soruları, linkler ve fotoğraflar düzenleniyor; ama tema başlıkları ve etiketleri sabit ("You are
invited", "We're getting married", "Order of the Day", "Will You Join Us?", "Kindly reply by", "Moments we hold dear",
gezinme etiketleri, düğme yazıları…). G059 bu yüzden ilan metnini "her yazı değişmez" diye düzeltmek zorunda kaldı.

## Yapılacaklar
1. **Motor:** temalarda sabit metinler `data-copy="<anahtar>"` işaretiyle (iç metin = tema varsayılanı). Motor `content.copy.<anahtar>`
   doluysa onu (HTML kaçışlı, uzunluk sınırlı) koyar, boşsa varsayılan kalır. `aria-label`/`title`/`<title>`/`og` gibi öznitelik
   metinleri de kapsanır (`data-copy-attr`). Anahtar listesi tema derlemesinde otomatik çıkarılır (`theme.json` → `copy` manifesti:
   anahtar, varsayılan, sayfa, en uzun izinli uzunluk — tasarımın taşmadan taşıyabileceği; docs/11 stres kayıtlarıyla doğrulanır).
2. **Şema + doğrulama:** `docs/03` ve `lib` doğrulaması `copy` nesnesi (bilinmeyen anahtar reddedilir, uzunluk sınırı tema manifestinden).
3. **Panel:** Edit altında **"Wording"** bölümü — sayfa sayfa gruplanmış, her satırda varsayılan gri ipucu, canlı önizleme, tek dokunuşla
   "Reset to design text". En çok değişenler üstte (ör. davet başlığı, RSVP başlığı). Kimlik hakkı sistemini (G060) **etkilemez**.
   Ayrıca etkinlik türü kısayolu: "Wedding / Vow renewal / Elopement…" seçince ilgili başlıklar topluca önerilir (isteğe bağlı; yalnız öneri).
4. **Temalar:** 01 olive-ivory ve 03 blush-garden-rose'taki bütün görünür sabit metinler işaretlenir (gezinme ve düğmeler dahil).
   `docs/11_TEMA_STANDARDI.md`'ye kural: yeni temalarda her görünür sabit metin `data-copy` taşır; theme-check bunu denetler
   (işaretsiz görünür metin = hata, izin listesi hariç).
5. **Testler:** motor (kaçış, sınır, varsayılan), API, panel tarayıcı yolculuğu (değiştir → önizle → yayınla → misafir sayfası),
   theme-check `--stress` her iki temada uzun `copy` değerleriyle; `final-smoke`, `g051-browser`, `g060-browser` geçmeli.
6. Önizleme: `platform/previews/g068/` (panel Wording 390 px, değişmiş başlıklarla misafir sayfaları).

7. **G064 QA'dan küçük ek (01 olive-ivory, düşük):** zarfa geri dönüşte (`index?replay=1`) giden nav 250 ms solarken zarf sayfası
   etiketlerin arasından görünüyor → `::view-transition-old(site-nav):only-child { animation: none; opacity: 0; }` + theme-check'e ters
   yön kontrolü. Yatay/kısa ekranda iç sayfaların ilk ekranında son satırın nav çizgisinde kesilmesi: docs/11'e kabul edilen davranış
   olarak yazılır ya da yatay düzende üst boşluk kısaltılır.

## Bitti sayılması için
- [x] 01 ve 03'te görünür her sabit metin panelden değişir ve sıfırlanır; theme-check işaretsiz metin bulmaz
- [x] Bütün testler geçti; docs/11 ve README güncel

## Sonuç

**Ne yapıldı** (K29'a uyarlandı: 7. "Wording" sayfası yok; metinler her editör sayfasının sonunda).
- **Motor** (`lib/theme/engine.ts`): `data-copy="<anahtar>"` (öğe metni = tasarımın varsayılanı; `content.copy.<anahtar>` doluysa o
  yazılır: metin olarak kaçışlı, tek satır `normalizeLine`, anahtarın `max`'ında kesilir; script `&`'ı `.amp` kalır),
  `data-copy-attr="aria-label:<anahtar>"` (alt/title/content/aria-label/placeholder), `{copy.<anahtar>}` `data-text`/`data-attr-*`
  şablonlarında (sekme başlığı, og:title, paylaşım cümlesi). `<template>` içi de işleniyor (RSVP konuk satırı). İçerik
  `data-attr-data-copy` ile işaret üretemez; manifestsiz temada (02/04/05) şablon metni aynen kalır.
- **Manifest** `theme.json` → `copy` (`lib/theme/copy.ts`: standart anahtar kataloğu `STANDARD_COPY` — panel sayfası, etiket, sıra,
  önerilen max; okuma, çözme, denetim, öneriler, stres metinleri). Şablonlardan **otomatik** yazılır:
  `node scripts/copy-manifest.ts --theme <id>` (`--check`), tarama `lib/theme/copy-scan.ts` (kullanılan anahtarlar, işaretsiz görünür
  metin, manifest farkı). 01 olive-ivory **75**, 03 blush-garden-rose **79** anahtar; ikisinde de işaretsiz görünür metin **0**
  (izin listesi: `.ph-mark`, `[data-rsvp-message]`, `[data-copy-fixed]` — tek kullanım "Please turn on JavaScript…").
- **Şema** `docs/03` `copy` (anahtar deseni, metin|null, ≤ 300, ≤ 200 anahtar) + `lib/content/schema.ts`; TS doğrulayıcıya
  `propertyNames`, şema değerli `additionalProperties`, `maxProperties` eklendi (Python jsonschema ile eşlik testi). Temaya bağlı:
  `max` aşımı hata (kaydedilir, `publishSite` 422), tasarımda olmayan anahtar uyarı; `PUT` yeni bilinmeyen anahtarı 400 ile
  reddeder (taslakta zaten olan eski anahtar korunur). Copy kimlik değil: **hak harcamaz** (API testi: yayından sonra kayıt + yayın `used: 0`).
- **Panel** (`components/panel/CopyFields.tsx`, `Panel.tsx`, `pages.ts`, `usePanel.ts`, `ui.tsx`): her sayfanın sonunda açılır
  "Headings & labels on this page" (başlıkta "n changed"), satırda etiket + kutu (boş = tasarımın metni gri ipucu), değişince
  "Design text: “…”" + **Reset to design text**; en çok değişenler üstte, yalnız düğünden sonra görünenler "After the wedding" alt
  başlığında. Dağılım: zarf/kart/davet/imza/paylaşım → Us; Day sayfası, program/mekân, takvim, sayaç, teşekkür hâli → Day & place;
  hikâye → Our Story; bloklar + **gezinme etiketleri** → Details; RSVP kartı/form/yanıt sonrası/kapanış → RSVP; Photos'ta yok.
  Us'ta isteğe bağlı "Suggested wording" çipleri (Wedding · Vow renewal · Elopement party · Commitment ceremony; yalnız Us'taki 2
  satırı doldurur, Undo'lu). Değişiklikler "Unpublished changes: n"e sayfa olarak girer, Review "<Sayfa> · Headings & labels" yazar,
  hata Edit listesinde "N to fix" sayılır ve atlama bölümü açar; odaklanan satır önizlemeyi o metnin sayfasına götürür (geniş
  ekranda hemen, telefonda "Preview this page"). **Kurulum sihirbazına eklenmedi** (3 adım sade kalsın). `thank_you.title` (G075)
  içerik alanı olarak **aynen kaldı** (çiftin başlığı, platform varsayılanı, eski kayıtlar bozulmasın); teşekkür hâlinin tasarım
  metinleri copy anahtarı.
- **Temalar:** 01 ve 03'ün 5 sayfası işaretlendi (gezinme, düğmeler, form etiketleri, teşekkür hâli dahil); `site.js` devRender
  `{copy.…}`'yu sayfadaki `[data-copy]`'den okur. `max`'lar `theme-check --stress` ile ölçülüp daraltıldı (01: gezinme 6/6/7/6,
  `nav_day` 8, sayaç 7, hikâye adı 13, yan kart bağlantıları 10; 03: gezinme 8, `nav_day` 10, sayaç 8, zarf üst satırı 28). 03'ün info
  kartı başlığı `nowrap` yerine dengeli + ortalı sarar (tasarım metni sütuna sığdığı için görünüm aynı: 390 px'te 206/272 px).
- **G064 qa eki (01):** `::view-transition-old(site-nav):only-child { animation: none; opacity: 0; }`; theme-check'e ters yön
  denetimi (home → `index?replay=1`, 0/120 ms'de nav bandı nav grubu gizli hâliyle karşılaştırılır; opak nav hata, saydam uyarı).
  Ölçüm: 01 = %0 (çizilmiyor); düzeltmesiz davranışın yakalandığının kanıtı 03'ün saydam nav'ı: 0 ms'de bandın %79,9'u (390×844).
  Yatay iç sayfaların ilk ekranındaki son satır `docs/11` §11'e **kabul edilen davranış** olarak yazıldı (ölçümlerle; üst boşluk
  kısaltılmadı, 01 `site.css` bütçesi de dolu: 46 002 / 46 080 B).
- **Belgeler:** `docs/11` §3.7 (yeni kural), §4, §11, §13.2 #24, §15; `platform/README.md` "Düzenlenebilir tasarım metinleri (G068,
  K28)" (yalnız kendi bölümü); iki tema README'si.

**Testler (hepsi bu dalda, `origin/main` ile birleştirmeden sonra; Node 22, `/opt/pw-browsers`):**
- `npm test` **551/551** (yeni `tests/g068-copy.test.ts` 13: motor kaçış/sınır/varsayılan/öznitelik/`{copy}`/`<template>`, şema +
  Python eşliği, manifest = şablon ve işaretsiz metin 0 (01/03), API (kayıt, şerit, hak 0, bilinmeyen 400, uzun 422, misafir
  sayfası), iki temada her anahtar max'ta uyarısız (teşekkür hâli dahil), panel yardımcıları), `typecheck` temiz, `build` +
  trace-check geçti.
- Tarayıcı: `g068-browser` **48/48** (yeni; panel yolculuğu 390, axe-core + dokunma hedefleri, 1280 önizleme takibi, iki temada
  misafir sayfaları), `panel-browser` 77/77, `g060-browser` 151/151, `g069-browser` 60/60, `g075-browser` 61/61, `g076-browser` 51/51,
  `final-smoke --theme olive-ivory` 45/45, `--theme blush-garden-rose` 45/45, `g051-browser` 44/44 (03) ve `--theme olive-ivory` 44/44.
- `theme-check --stress` (birleştirmeden hemen önce; birleşme 01/03, motor ve panel dosyalarına dokunmadı): **olive-ivory 127 geçti,
  0 uyarı, 0 hata**; **blush-garden-rose 123 geçti, 4 uyarı, 0 hata** (uyarılar: saydam/bulanık nav'ın geliş ve dönüş geçişi — 03'te
  tasarım gereği, gelişteki 2'si G064'ten beri var). Bir ara koşuda 01'de "home@390 (draft preview, no photos): card text over painted
  decor" görüldü; G069 Sonuç'unda G069 öncesi kodda da kayıtlı aralıklı bir hata (tembel yüklenen kart görseli), son koşuda yoktu.
  Theme-check'teki "content change" akışı G060'tan beri `identityChangeFor` ile çalışıyor (IdentityMismatchError yaşanmadı).

**Önizlemeler** `platform/previews/g068/` (PNG): 01 Us'ta açık "Headings & labels" (390), 02 RSVP önizlemesi yeni başlıkla, 03 Review
("Us · Headings & labels", "RSVP · Headings & labels"), 04 sıfırlama, 05–07 iki temada değişmiş başlıklarla misafir index/details/rsvp
(390), 08 03 Details zorlama kaydı (30 harflik kart başlığı sarılmış), 09 01 RSVP zorlama kaydı.

**Yazma alanı dışı (zorunlu, listelenen istisnalar):** `platform/scripts/theme-check.cjs` (copy denetimi, stres, nav dönüşü, teşekkür
hâli foto yeri), yeni `platform/scripts/copy-manifest.ts` (manifest üretici). `platform/app/edit/` ve `lib/themes/` değişmedi.

**Açık noktalar / denenmeyenler:**
- Gerçek iPhone/Safari ve Android denenmedi (Chromium mobil emülasyonu); canlı Vercel yayını yapılmadı.
- 02/04/05 işaretlenmedi (başka görevlerde): theme-check onlarda yalnız uyarı verir → **önerilen görev:** 02/04/05'e `data-copy` +
  manifest + `--stress` ölçümü.
- Bilerek sabit: iç sayfaların `description` meta cümleleri, bölge `aria-label`'ları (landmark adları), story kaydırma oklarının
  `aria-label`'ları, platform mesajları (`/rsvp/form.js`, `[data-rsvp-message]`), şifreli sitenin paylaşım cümlesi ("You're invited").
- Boş kutu metni gizlemez (tasarımın metnine döner); bir metni tamamen kaldırma yok. Copy serbest metin: çift bir başlığa başka
  isim yazabilir (büyük isimler/tarih yine kimlik alanlarından; risk düşük, belgelendi).
- 01'in dar sıraları kısa: gezinme 6–7 harf, hikâye adı 13 — daha uzun ad/çeviri için tasarım (gezinme/yan kart) değişikliği gerekir.
- `docs/16_PANEL_V2.md` bu görevin yazma alanında değil: K29 bölümüne "Headings & labels" notu eklenmeli (entegratör).

## Günlük
- 2026-10-14 açıldı (entegratör): kullanıcı isteği (neredeyse tüm alanlar düzenlenebilir); panel v2 düzeltme turu bitince başlar
- 2026-10-14 alindi: claude-G068
- 2026-10-14 claude-G068: motor + şema + panel bölümü + 01/03 işaretli (75/79 anahtar), theme-check --stress iki temada hatasız; testler yeşil; Sonuç yazıldı
- 2026-10-14 bitti, incelemeye gönderildi
- 2026-10-14 entegratör onayladı
