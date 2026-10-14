---
id: G075
baslik: Düğün sonrası teşekkür modu — site düğünden sonra "Thank you" hâline geçer (otomatik, çift kapatabilir)
rol: claude-kod
durum: inceleme
alan: claude-G075
oncelik: 1
bagimli: [G060]
yazar: [platform/lib/, platform/app/, platform/components/panel/, platform/themes/olive-ivory/, platform/themes/blush-garden-rose/, platform/tests/, docs/03_URUN_ICERIK_SEMASI.json, docs/11_TEMA_STANDARDI.md, platform/README.md, platform/previews/g075/]
---

## Amaç
K28. Düğünden sonra misafirler aynı linke döndüğünde davet yerine bir **teşekkür sayfası** görsün; site 12 ay sonra arşivlenene
kadar (K25) anlamlı kalsın. docs/15'teki satış sonrası planın parçası.

## Yapılacaklar
1. **Kural:** düğün günü bitince (site saat diliminde ertesi gün 00:00) otomatik teşekkür modu; panelde "Thank-you mode: Automatic /
   On now / Off". Arşiv kuralları (G060) değişmez; arşivde 410 sürer.
2. **Misafir tarafı:** zarf sayfası ve home teşekkür içeriğine döner: başlık (varsayılan "Thank you for celebrating with us"),
   çiftin kısa mesajı, bir fotoğraf (isteğe bağlı, yoksa tema yer tutucusu değil temanın süsü), isimler ve tarih. RSVP formu kapanır
   (dürüst metin: "Replies are closed"), program/detaylar sayfası "The day" olarak kalabilir ya da gizlenir (çift seçer). Story kalır.
   Zarf açılış şovu korunur, kart içeriği teşekkür metni olur.
3. **Şema + panel:** `thank_you { mode: auto|on|off, title, message (≤ 400), photo }` — doğrulama, uzunluk, panel bölümü ("After the
   wedding"), canlı önizleme, Home kartı ("Your website switched to thank-you mode"). G068 tamamlandıysa başlık `copy` sistemiyle uyumlu.
4. **Temalar:** 01 ve 03'e teşekkür hâli (yeni sayfa değil; mevcut sayfalarda `data-if` ile). docs/11'e yeni temalar için kural + theme-check.
5. **Testler:** saat dilimi sınırı (DST dahil), mode on/off/auto, RSVP API'nin teşekkür modunda reddi (403 `closed`), panel yolculuğu,
   final-smoke ve theme-check iki temada. Önizleme `platform/previews/g075/`.

## Bitti sayılması için
- [x] Otomatik geçiş + elle aç/kapa; misafir sayfaları ve RSVP doğru; testler geçti

## Sonuç
Commit'ler: d84ab05 (çekirdek + temalar), f783447 (panel + testler + theme-check uyarısı), aaa62d6 (docs/11, README, tarayıcı testi),
8ef5934 (önizleme geçmiş düzeltmesi, önizlemeler); main ile birleştirmeler 141b576, b61ac07. Yayın yapılmadı (entegratörün işi).

**Ne yapıldı**
- **Şema** (`docs/03_URUN_ICERIK_SEMASI.json` → `lib/content/schema.ts`, `types.ts`, `limits.ts`, `validate.ts` `SCHEMA_LIMITS`):
  `thank_you {mode: auto|on|off, title ≤ 60, message ≤ 400, photo, details: keep|hide}`, hepsi isteğe bağlı (yoksa = auto). Python
  doğrulayıcı şemayı okuduğu için eşlik korunuyor (yeni iş kuralı yok).
- **Kural** `lib/content/thank-you.ts` (saf, sunucu + panel): auto = düğün gününün sonu, sitenin saat diliminde ertesi gün 00:00
  (`zonedTimeToUtc`: var olmayan gece yarısı → 01:00, iki kez yaşanan gece → ikincisinden sonra; hiç erken değil); geçersiz bölge = UTC-12;
  okunamayan tarih = kendiliğinden açılmaz. on = hemen, off = hiç. Arşiv (G060/K25) değişmedi: arşivde 410, mod ne olursa olsun.
- **Motor** (`lib/theme/engine.ts`, `lib/content/derive.ts`): türetilmiş `thank_you_on`, `thank_you_title`, `thank_you_hides_details`;
  **`data-if` artık boşlukla ayrılmış birden çok koşul** (hepsi tutmalı; eski tek koşul aynen); `<html data-thank-you>`;
  `site-data.derived.thank_you_on`; `?thanks=1` yalnız önizleme anahtarıyla (çiftin teşekkür önizlemesi, linklerde korunur); şifreli sitenin
  bağlantı önizlemesi teşekkür modunda "Thank you for celebrating with us" (çiftin kendi metni değil). Tema demosu (`/start/demo`) hep davet.
- **RSVP**: `rsvpWindow` → `reason: "thank_you"` (sıra: disabled → thank_you → deadline); misafir GET kapalı, **POST 403
  `{code:"closed", reason:"thank_you"}`**, hiçbir şey saklanmaz; Guests şeridi "Replies are closed: your website shows its thank-you page."
- **Fotoğraf**: `thank_you.photo` `/media` rotasında yalnız teşekkür modu açıkken herkese açık; yükleme `?slot=thank_you` (yalnız teşekkür
  hâli olan temada, `hero_portrait` oranında kırpılır; Photos sayfasında ve hazırlık yüzdesinde sayılmaz).
- **Temalar 01 ve 03** (yeni sayfa yok, yeni görsel yok — temaların kendi GPT parçaları): zarf + açılış şovu aynen, kartta teşekkür başlığı +
  tarih, kart penceresinde teşekkür fotoğrafı ya da **temanın süsü** (01: kâğıt + botanik mühür ve monogram, 03: sis + kurdele; asla yer
  tutucu); home'da geri sayım/RSVP/takvim yok, davet kartı yerine aynı kâğıtta teşekkür kartı (başlık, mesaj `pre-line`, "With love," +
  isimler, tarih); Details "The Day" olarak kalır (takvim, kıyafet, travel, SSS, RSVP gider; registry ve harita kalır; tören "began") ya da
  gizlenir (404, hiçbir link yok); RSVP sayfası eski linkler için açık: "Replies are closed" + başlık + Home, form yok; nav'da RSVP yok, Details
  etiketi "The Day". Stiller `thank-you.css` (yalnız teşekkür modunda yüklenir; `site.css` bütçesi aynen 45 983 / 45 913 B). `site.js`
  `devRender` çoklu koşulu okur.
- **Panel** (K29: 7. sayfa yok): Day & place'in sonunda açılır **"After the wedding"** (`components/panel/ThankYou.tsx`): Thank-you mode
  Automatic ("From Sunday, May 16, 2027") / On now / Off (dikey, büyük hedefler), ne zaman ne göreceklerini söyleyen tek satır, Title,
  Your message, Photo, "The Day page: Keep it / Hide it", **"Preview the thank-you page"** (önizleme başlığı "Thank-you page — what guests see
  after the wedding." + "Show the invitation"). Değişiklikler otomatik kaydedilir, "Unpublished changes" şeridinde sayılır; Review sayfanın
  değişen bölümünü de yazar ("Day & place · After the wedding"). Yayındaki site teşekkür modundayken Home'da **"Your website switched to
  thank-you mode"** kartı → "Edit the thank-you page" (`#edit/thankyou`, bölüm açık). Bölüm yalnız tema `thank_you_on` kullanıyorsa çıkar.
- **docs/11 §3.6** yeni temalar için kural (+ §1 klasör, §15 kontrol listesi); `lib/theme/thank-you-support.ts` işaret listesi;
  `scripts/theme-check.cjs` eksik temada **uyarı** (hata değil). README: "Teşekkür modu (G075, K28)" bölümü, işaret tablosu, RSVP API.
- **Yan düzeltme** (G075 yolculuğunda bulundu, eskiden de vardı — normal önizlemeyle de tekrarlandı): telefonda önizleme modalı başka sayfada
  açılınca açılış adresi bir render geride kalıyor, kapanışta geçmiş kaydı silinmiyordu; sonra açılan sheet'in geri adımı sayfayı yeniden
  yüklüyor, "Review → Publish changes" sonrası "Your website is live" çıkmıyordu (`PreviewPane` artık kapanışta güncel adresle karşılaştırıyor).

**Testler (hepsi bu dalda, `PORT` 4194x)**
- `npm test` **520/520** (main birleşmesinden sonra; öncesi 519/519; görev öncesi main 499 + 2 atlanan — atlananlar build yokken).
  Yeni `tests/g075-thank-you.test.ts` 18 test: saat dilimi sınırı (New York iki DST gecesi, Londra, Beyrut boşluğu, Santiago iki yön, Sydney,
  UTC+14/−11, yıl sonu, geçersiz bölge; 1 ms önce/sonra), modlar, şema sınırları, çoklu `data-if`, RSVP kuralı, iki temada beş sayfa + gizlilik
  + `?thanks=1`, gerçek rotalar (kendiliğinden geçiş, **API 403 closed**, On/Off, gizli Details 404, arşiv 410, şifreli site, foto, demo),
  panel API, panel yardımcıları, theme-check kuralı. Değişen eski testler: g066 sayfa haritası, panel tema bilgisi, rsvp (2099'da otomatik
  teşekkür modu → test `mode: off`), 01/03 tema testlerinde tören cümlesinin seçicisi.
- `npm run typecheck` temiz; `npm run build` + trace-check geçti (16 rota, 6 tema).
- Tarayıcı: **g075-browser 61/61** (iki tema × 360/390/430/1280 beş sayfa, zarf → home, kapalı RSVP + API 403, süs, 60'a yakın başlık 360×640,
  gizli Details, panel yolculuğu, axe-core, dokunma hedefleri), **panel-browser 77/77**, **g060 151/151**, **g069 60/60**, **g076 51/51**,
  **final-smoke olive-ivory 45/45, blush-garden-rose 45/45**, **theme-check --stress olive-ivory 116/0/0**, **blush-garden-rose 114/0 hata,
  2 uyarı**. Kanıt: olive'in ilk koşusu 2 hata verdi (taslak önizlemesinde home davet kartı piksel testi, makine yüklüyken); aynı build'le
  tekrar 116/0/0. Blush'taki 2 uyarı ("nav in the envelope → home view transition … see-through nav") G075 öncesi şablonlarla da aynı
  yüzdelerle çıkıyor (A/B: `PLATFORM_THEMES_DIR` = 4abf2b7'deki blush → 113 geçti, 0 hata, aynı 2 uyarı + yeni teşekkür modu uyarısı).

**Önizlemeler** `platform/previews/g075/` (PNG, 390 px; 5,8 MB): `01_envelope_*`, `02_envelope_open_*` (kartta teşekkür fotoğrafı),
`03_home_*` (tam sayfa), `04_rsvp_closed_*`, `05_card_decoration_*` (fotoğrafsız: temanın süsü) — iki tema; `09_home_1280_blush-garden-rose`,
`10_panel_after_the_wedding`, `11_panel_preview_thank_you`, `12_panel_review`, `13_panel_home_card`, `checks.json`.

**Yazma alanı dışı (zorunlu, küçük):** `platform/scripts/theme-check.cjs` (teşekkür modu uyarı bloğu, 12 satır).

**Açık / denenmedi**
- 02, 04, 05 temalarında teşekkür hâli yok (başka görevlerdeydi; dokunulmadı): theme-check uyarı verir, panel bölümü çıkmaz, düğünden sonra
  davet görünür (yanıtlar yine kapanır). **Önerilen görevler** (claude-kod): G402/G404/G405 temalarına docs/11 §3.6 işaretleri.
- G068 (düzenlenebilir metinler) yapılmadı: başlık şimdilik `thank_you.title`; G068 gelince `copy` sistemine bağlanabilir. Zarf kickeri
  ("With love and thanks") ve "Look back with us" gibi satırlar tema tasarım metni.
- Şifre sayfası (G076) düğünden sonra da "You're invited" der (şifre içerikten önce gelir); istenirse ayrı karar.
- Demo kayıtları 2027 tarihli: tohumlanan demo site (ör. `clara-and-julian`) o tarih geçince kendiliğinden teşekkür moduna geçer (doğru
  davranış); `/start/demo` hep davet gösterir.
- Gerçek telefonda (iOS Safari / Android Chrome), Vercel'de ve gerçek Blob deposunda denenmedi; geçiş anında e-posta/bildirim yok.


## Günlük
- 2026-10-14 açıldı (entegratör): K28
- 2026-10-14 alindi: claude-G075
- 2026-10-14 claude-G075: şema + kural + motor + RSVP 403 + 01/03 teşekkür hâli + panel "After the wedding"/Home kartı; npm test 520/520, g075-browser 61/61, diğer tarayıcı takımları yeşil; Sonuç yazıldı
- 2026-10-14 bitti, incelemeye gönderildi
