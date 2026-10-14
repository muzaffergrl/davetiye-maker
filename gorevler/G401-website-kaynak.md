---
id: G401
baslik: Tasarım 01 Olive & Ivory — platform teması
rol: claude-kod
durum: inceleme
alan: wf-tema01
oncelik: 2
bagimli: [G201, G038, G046, G052]
yazar: [platform/themes/olive-ivory/, platform/tests/theme-olive-ivory.test.ts, platform/previews/g401/]
---

## Amaç
Tasarım 01'i platformda tema olarak kurmak (K24, `docs/10_SITE_PLATFORMU.md`): kapalı zarf açılış sayfası → home → story, details, rsvp; yalnız bu tasarımın GPT parçalarıyla (K21), kişisel metin HTML'de. **Kurallar `docs/11_TEMA_STANDARDI.md`'dedir; bu görev metniyle çelişirse docs/11 geçerlidir.**

## Girdiler
- Tema standardı: `docs/11_TEMA_STANDARDI.md` — bütünü; zarf tipi **kapaklı zarf** → §7.1 + §7.3; bitti tanımı §13, kontrol listesi §15
- Platform sözleşmesi: `platform/README.md` (işaretler, RSVP form sözleşmesi, `#site-data`); çalışan örnek `platform/themes/blush-garden-rose/` — **yalnız** işaret/RSVP/`#site-data`/oturum anahtarı kullanımı için; yerleşimi, aralıkları, süs konumları ve zamanlaması bu temaya taşınmaz (docs/11 §8). G035 kaynağı (`collections/03_Blush_Garden_Rose/website/`) örnek değildir
- GPT çıktıları (G201): `collections/01_Olive_Ivory/assets/gpt/comps/` (W1, yerleşim referansı, satılmaz; yalnız sade adlar — `_vN` denemedir), `parts/` (katmanlar), `photos/` (örnek fotoğraflar)
- İçerik `collections/01_Olive_Ivory/content.demo.json`, renk `collections/01_Olive_Ivory/palette.json`, özet `collections/01_Olive_Ivory/DESIGN_BRIEF.md`
- Araçlar: `tools/parts_prep.py` (geçici klasöre; docs/11 §5.3), `python3 tools/kit_check.py collections/01_Olive_Ivory --paket 5`, `node scripts/theme-check.cjs --theme <slug>` (G052)

## Yapılacaklar
1. `theme.json`, 5 sayfa, `site.css`, `site.js`, `build_images.py`, `README.md` docs/11 §1–§4 düzeninde. 03'ten yalnız platform sözleşmesi alınır (motor işaretleri, RSVP formu, `#site-data`, slug'lı oturum anahtarları, `data-scene`/`data-step`/`data-a` kancaları); yerleşim, tipografi ve hiyerarşi bu tasarımın W1 comp'larından — tema `README.md`'sinde sayfa başına **comp öğe haritası** (her W1 öğesi → şablon öğesi ya da gerekçeli sapma; comp'u olmayan bölümler bu tasarımın parçaları ve tipografisiyle, docs/11 §8).
2. Parçalar: `python3 platform/themes/olive-ivory/build_images.py` → `parts_prep` **geçici klasöre** (`--prep-dir`; tema klasörüne, `img_src/`'ye ya da `assets/`'e asla — docs/11 §1, §5.3–§5.4), tip kesimleri (§7), maskeler, `free_zone`, yer tutucular, og; WebP + srcset genişlikleri (§5.1, §5.5). Yalnız bu tasarımın GPT parçaları; yeni şekil/dekor çizme (K21).
3. Zarf açılışı (`MOTION.envelope`, kapaklı zarf, docs/11 §7.1 + §7.3): On tap, the lace-edged flap peels up on its hinge carrying the oval seal and its tucked olive sprig with it, and the ivory card glides up out of the pocket while two olive leaves float across the screen. Katalog: Zeytin yeşili dokulu kağıt zarf, fildişi dantel kenarlı V kapak, botanik oval mühür; kapak mühürle birlikte kalkar, kart yükselir. Açılış cümlesindeki sıra, sayı ve yön bağlayıcıdır; kapanış elemanı, zarf/kapak ve kart ayrı katmanlar; kart home'daki karta dönüşür; `closure.png` kare tuvalde büyük çizilir; yeri kesim geometrisine bağlanır (`manifest.closure`, docs/11 §7.1).
4. Sayfa koreografisi (`MOTION.scenes`): her sayfada öğeler sırayla girer. Story: Yuvarlak köşeli ince altın çerçeveli kartlar, yelpaze gibi açılır (three rounded-corner gold-bordered portrait cards fanned out gently like a hand of cards — the middle card upright and slightly higher, the side cards tilted about 8 degrees outward and overlapping it only at their outer ivory margins, so all three green windows stay fully visible and each caption sits under its own card); telefonda foto penceresi ≥ 38vw (sığmazsa basamaklı/alt alta düzen, comp sapması olarak yazılır — docs/11 §9). Parçacıklar `MOTION.accents` (§8: tür başına dosya ve yol). Details/rsvp: kart, satırlar ve buton sırayla.
5. Foto alanları: `hero_portrait` (card_small penceresi), `story_1..3` (frame_portrait), `venue` (frame_landscape); kutu ve maske `windows.json`'dan (§5.6, §9). PAKET 2 fotoğrafı yoksa yer tutucu.
6. Fontlar: Great Vibes + EB Garamond (Google Fonts link'i; repoya font dosyası girmez). Tarih motor biçimiyle (`May 15, 2027`). Link blokları `data-if="urls.*"` ile linksiz kalkar — "link will be added soon" diyen ölü düğme yok (§4).
7. Testler ve önizleme (§13): `platform/tests/theme-olive-ivory.test.ts`; `theme-check --theme olive-ivory` (5 genişlik, kısa telefonlar, akışlar, ağırlık, MP4); `platform/previews/g401/` (W1 comp | tema karşılaştırmaları dahil).

## Bitti sayılması için
- [x] docs/11 §15 kontrol listesi tamam (atlanan madde Sonuç'ta gerekçesiyle: qa-kontrol incelemesi)
- [x] `npm test`, `npm run typecheck`, `npm run build` (trace-check) geçti; `tests/theme-olive-ivory.test.ts` (§13.2)
- [x] `theme-check --theme olive-ivory` hatasız; `previews/g401/` + `compare_<sayfa>_390.jpg` qa-kontrol incelemesinden geçti
      — qa-kontrol 2026-10-14: **KOŞULLU GEÇTİ**; 3 MUST FIX + 7 küçük madde düzeltildi (Sonuç → "qa-kontrol 2026-10-14"),
      theme-check --stress 88/88; düzeltmelere qa'nın yeniden bakması önerilir
- [x] Sonuç dürüst: açılış ve story tarifi, comp sapmaları, denenmeyenler (gerçek iPhone/Safari, yayın), sorunlu GPT parçaları

## Sonuç
**Yapıldı (wf-tema01, 2026-10-13).** Durum: yerelde çalışan ve test edilen platform teması; **hiçbir yere yayınlanmadı**.
Ayrıntı: `platform/themes/olive-ivory/README.md` (dosyalar, foto alanları, görsel hattı + GPT kusur temizliği, açılış/koreografi,
sayfa başına comp öğe haritası, bilinen sınırlar).

### qa-kontrol 2026-10-14: KOŞULLU GEÇTİ → düzeltildi (2026-10-14)
QA raporunun 3 MUST FIX'i ve 7 küçük maddesi `next start` + Chromium'da gerçek ekran görüntüleriyle (360×640, 375×553, 375×667,
390×690, 412×732, 390×844, 430×932, 768×1024, 1024×768, 1280×800, 1440×900, 1920×1080) önce doğrulandı, sonra düzeltildi ve
yeniden ölçüldü. Görsel çizilmedi, yeni GPT parçası istenmedi: kırpım, yerleşim, boyut, alfa maskesi, hareket zamanlaması.
- **1 Mekân yer tutucusunda leke (doğrulandı → düzeltildi):** `ph_venue` kırpımı (220, 560, 1000, 1080) bg_page alt kümesinin bulanık
  koyu yaprak ucunu alıyordu (en koyu 141); `build_images.py` yeni kırpım (0, 760, 760, 1225): sol orta güneş lekeleri, en koyu 216
  (öteki `ph_*` 184–221). Yeni sert denetim: her yer tutucunun en koyu pikseli ≥ 175 (`manifest.ph_*.min_lum`, aksi çıkış ≠ 0).
  Yalnız `ph_venue-480/960.webp` + `manifest.json` değişti, öteki görseller bayt bayt aynı (md5).
- **2 Kısa telefonda hap nav'ın altında (doğrulandı → düzeltildi):** önce (hap altı / nav üstü): 375×553 540/478, 360×640 576/565,
  375×667 594/592, 390×690 610/615, 1024×768 700/693, 1280×800 724/725. Düzeltme `site.css`: hero `100svh − nav` içinde 27 px alt
  boşlukla (nav'ın yumuşak üstü 19 + 8) biter; boyutlar svh terimleriyle okunur tabanlara iner (hero kartı ≥ 150 px, isimler ≥ 40 px,
  sayaç ≥ 26 px); 9:16 ve daha basık telefonda (≤ 640 px) sıkı düzen ve `decor_br` W1.2'deki gibi hapın **yanında** (hap–yaprak
  ≥ 16 px; ölçüm 20–37 px); geniş ekranda kart 34svh, isimler 10,4svh ile sınırlı. `site.js` `fitNames`: hero'da ilk ekran nav'ın
  8 px üstünde bitene kadar önce isimler (en çok %24), yetmezse `.is-tight` (mekân 16 px, sayaç 22 px), sonra yine isimler. Sonra
  (demo kaydı, 14 boyut): nav'a boşluk 10–176 px — 375×553 hap 468 / nav 478, 360×640 536/565, 1024×768 674/693, 1280×800 698/725;
  §12 stres kaydı (40+40 karakter isim, 80 karakter mekân) 375×553'te 10 px, 360×640'ta 19 px, 390×844'te 26 px boşlukla nav'ın
  üstünde. **Eski "home ilk ekranı nav'ın üstünde biter" iddiası kısa telefonlarda yanlıştı** (ikinci tur maddesinde işaretlendi).
- **3 Geniş ekranda düz çizgiyle kesilen kümeler (doğrulandı → düzeltildi):** home hero `decor_br`'si landscape'te `bottom: −6 %` ile
  hero'nun `overflow: hidden` kenarında (1280×800'de y = 744) kesiliyordu; aynı alt kenar telefonda da sayfa kayınca ve bütün sayfa
  sonlarında (home altbilgisi, story/details sonu, RSVP kapanışı) düz çizgi olarak görünüyordu. Şimdi hero'da `bottom: 0`, hero ve sayfa
  sonu `decor_br`'lerinin son %15'i kâğıda incelir (GPT parçasına alfa maskesi, `.hero .corner-br, .page-corner.corner-br`).
  RSVP ≥ 960 px: kapanış `decor_br`'si 1040 px ızgaranın sağ kenarında (x ≈ 1160) dikey kesiliyordu, üstteki `decor_tl` de ızgaranın
  sol kenarında (x ≈ 125) düz kenarla duruyordu → ikisi de sayfanın kenarında (`calc((min(100vw, 1040px) − 100vw) / 2)`).
  1024×768, 1280×800, 1000×800 (RSVP) ekran görüntüleriyle bakıldı.
- **Küçük maddeler (hepsi yapıldı):** (a) Android mavi dokunma dikdörtgeni: `a, button, summary, label, [role="button"]` →
  `-webkit-tap-highlight-color: transparent`, odak halkaları duruyor; (b) açılış yaprakları 1,3 s'de kalkar, ~2,3 s'de ekranı geçer,
  süreleri `go`ya göre kırpılır (ölçüm: ikinci yaprak dokunuştan ~3,9 s'de ekrandan çıkıyor, sayfa 4,15 s'de el değiştiriyor;
  eskiden 3,9–4,6 s süreyle yolun ortasında kalıyordu); (c) varış yasemini hero fotoğrafının iki yanındaki şeritlerden düşer
  (`MOTION.accents.arrive.avoid`; 4,5 s boyunca 126 örnekte fotoğraf kutusuyla 0 temas); (d) kart inişi → isimler: `arriveDelay`
  700 → 0 (yeni MP4: kart ~7,5 s'de iner, isimler ~7,7 s'de yazılmaya başlar; eskiden ~7,7 → 9,0 s); (e) yazı tabanı ≥ 11 px: kart
  kopyası (index + hero kartı) 8,5 → 11 px (harf aralığı .12em, kopya alanı %7,5 iç boşluk; 150 px kartta "NAPA, CALIFORNIA" tek
  satır), üçlüdeki saatler 9,5 → 11, RSVP kartı "We can't wait…" 10 → 11, ayrıca geri sayım etiketleri ve "Read/Details/Reply"
  10,5 → 11, davet kartının küçük satırları 10,5 → 11 (taşma yok: theme-check 5 genişlik + stres 360/390); (f) story telefon
  yelpazesinin altında arayüz yazısıyla `‹ 2 / 3 ›` kaydırma ipucu (`.swipe-nav`: iki etiketli ok düğmesi 48 × 44 px yelpazeyi bir
  kart kaydırır, sayaç ortadaki kartı izler, uçta ok söner; JS'siz ve ≥ 720 px'te gizli; çizim yok); (g) MP4'ün beyaz ilk karesi:
  kayıt sayfa açılınca başlıyor → theme-check ilk boyamaya kadarki süreyi kesiyor (bu koşuda 0,67 s) ve ilk kare beyazsa hata veriyor;
  yeni `opening_390x844.mp4`'ün ilk karesi zarf sayfası (ort. RGB 197, 189, 162).
- **theme-check (her tema, `platform/scripts/theme-check.cjs`):** yeni akış "home first screen (short phones)": 360×640 ve 375×553'te
  home'un ilk sahnesindeki her metin, link/düğme (birincil CTA), foto alanı ve kart nav'ın üstünde biter, hiçbiri nav'ın altında
  kalmaz (dekor nav zemininin altına girebilir). 01: 536/565 ve 468/478; 03 (hero'da CTA yok): 542/576 ve 481/489 — 03 değişmeden
  geçiyor, dokunulmadı. Eski 01 CSS'ine karşı denendi: 375×553'te hap (505 > 478) yakalanıyor. Kayıt akışı: lead-in kesimi + beyaz
  ilk kare denetimi.
- **Testler:** `tests/theme-olive-ivory.test.ts` yeni "qa 2026-10-14" testi (yer tutucu `min_lum`, hero alt boşluğu ve sıkı düzen,
  küme maskesi + RSVP köşeleri, dokunma vurgusu, ≥ 11 px tabanlar, kaydırma ipucu, yaprak zamanlaması ve `avoid`, `site.js` ≤ 35 KiB,
  `site.css` ≤ 45 KiB); test 22'nin gradyan izni kümelerin alfa maskesini kapsar (yalnız `mask: linear-gradient(to top, …)`).
- **Boyut:** `site.css` 45 277 B (44,2 KiB), `site.js` 35 571 B (34,7 KiB) — sınırların altında kalmak için yorumlar kısaltıldı
  (gerekçeler bu README'de); tema klasörü 1,71 MB.

**Bu turun sayıları:** `npm test` 293/293, typecheck temiz, `npm run build` + trace-check temiz; `theme-check --theme olive-ivory
--stress` **88/88, 0 uyarı** (MP4 dahil; zarf → home 4212 ms; ilk görünüm 390×844 DPR 3: yer tutucuyla index 998 / home 814 KB,
örnek fotoğraflarla 1072 / 992 KB); `theme-check --theme blush-garden-rose --stress --no-video` **87/87, 0 uyarı** (çıktı geçici
klasöre, `previews/g038` dokunulmadı); `g051-browser --theme olive-ivory` 44/44; `final-smoke --theme olive-ivory` 42/42
(`previews/g401/final/` yenilendi). `previews/g401/` bu koşudan (yeni MP4 dahil).

**Denenmedi / sınırlar:** gerçek iPhone SE / Android cihaz (yalnız Chromium emülasyonu; Safari'de `svh` ve `mask` davranışı
görülmedi); kontrast yeniden ölçülmedi (yazılar büyüdü, renkler aynı); `docs/11` (G056) ve `platform/README.md`'ye yeni theme-check
akışı yazılmadı (yazma alanım dışında — entegratöre not).

### İnceleme düzeltmeleri (wf-tema01, 2026-10-13, ikinci tur)
İncelemenin 24 bulgusu tek tek doğrulandı; aşağıdaki sayılar ve önizlemeler bu turun koşusundan (`previews/g401/` yeniden
üretildi). Görsel çizilmedi, yeni GPT parçası istenmedi: yalnız mevcut parçaların yeri/boyu/kırpımı, CSS ışık/arayüz, JS hareket.
- **Kart home kartına dönüşmüyordu (yüksek, doğrulandı → düzeltildi):** home hero kartı `.js [data-step]` yüzünden geçiş sırasında
  opaklık 0'dı. `.from-envelope .hero-card[data-step] { opacity: 1; transform: none; transition: none }` + geçiş grubu .9 s;
  ölçüm: hero kartı ilk kareden sonuna kadar opaklık 1. `theme-check` artık **her tema için** home'un ilk karesinde
  `invite-card` adlı öğenin etkin opaklığını ölçer (< 1 = hata; 03 de geçiyor).
- **Telefonda güller kesiliyordu (yüksek → düzeltildi):** telefonda sahne parçalardan: `bg_page`'in çiçeksiz güneşli sağ üst
  kırpımı kâğıt (kaynak x 590–1024, y 0–940; yeni dosya yok, `bg_page-1024` konumlanır) + `decor_tl` / `decor_br` ayrı katman, iki
  küme de ekranda bütün (index ve home; geniş ekranda `mist` + aynı kümeler). `.land-only` kaldırıldı (bulgu 20: telefonda çift köşe
  artık yok — köşeler bilerek tek katman). Kısa telefonlarda (en/boy 9/16–3/4) kümeler küçülür ve köşelerine çekilir.
- **Yukarı–aşağı–yukarı kart yolu (orta → düzeltildi):** `build_images.py` kart yolu: `out` = alt köşeler cep kenarını kartın %4'ü
  kadar **aşmış** (−87 %; z-index takasında köşe atlamıyor), `front` = olduğu yerde öne (−84 % × 1,04 + büyüyen gölge); sahne kutusu
  buna göre yeniden ölçüldü (oran ,70776; bütün yüzdeler manifest'ten). Açık hâlde kart artık zarfın üstünde dik duruyor; VT kartı
  yukarı, home kartına taşıyor. Kısa telefonda sahnenin boş üst kısmı ekranda kalsın diye üst boşluk `w` ile büyüyor; açık hâlde
  (geri dönüş) isimler kalkar, kısa ekranda zarf küçülür.
- **Nav bandı çiçekleri kesiyordu (orta → düzeltildi):** opak bant + çizgi yerine kâğıt üstünde yazı satırı, yazı genişliğinde 1 px
  altın çizgi, kenarsız yumuşak zemin (§5.7). ~~home ilk ekranı nav'ın üstünde biter~~ — **bu iddia yanlıştı** (qa-kontrol
  2026-10-14): yalnız 390×690/844'te doğruydu; 375×553'te RSVP hapı nav'ın 0–50 px altında, 360×640'ta nav'a değiyordu (hap altı
  576 > nav üstü 565), 375×667 ve 1024×768'de de nav'ın altına giriyordu. Düzeltme ve ölçüm: aşağıda "qa-kontrol 2026-10-14".
- **Hero maskesi kümeyi soldurıyordu (orta → düzeltildi):** maske yalnız kâğıtta (`.hero-bg picture`); `decor_br` maskesiz ve
  telefonda RSVP hapının altında: hap ile yaprak uçları arası 360 px'te ≥ 50 px (ölçüldü), 390 px'te ≥ 31 px. *(qa turu: 9:16 ve
  daha basık telefonda küme hapın yanına geçti; hap–yaprak 20–37 px, 390×844'te 32 px.)*
- **Story telefonda 03'ün basamaklarına benziyordu (orta → düzeltildi):** telefonda **kaydırılan el yelpazesi** (scroll-snap; ortadaki
  kart dik + %3 yukarıda, komşular ±8° kenarlardan, fildişi kenarlarından altına giriyor; yalnız ortadaki kartın başlığı; sayfa orta
  kartla açılır, `initFan`); kart 64vw, pencere **50vw**. ≥ 720 px: yanlar merkez etrafında ±8°, orta karta kartın %6'sı kadar
  girer (pencereler bütün), orta kart %4 yukarıda ve üstte, aynı gölge. Giriş tek sahne: orta kart, sonra yanlar arkasından açılır.
- **Home 03'ün iskeletiydi (orta → düzeltildi):** "More about the day" yerine "Pull up a chair" **yelpaze üçlüsü** (story_1 çerçevesi
  −7° · `info_card` kâğıdında günün ilk 4 satırı · monogramlı mühür +7°); 03 metinleri kalktı ("Moments we hold dear / Read our
  story", "Schedule & venue", "Reply now", "With love / Replay the envelope" → "Read", "Details", "Reply", "Until then", "Open the
  envelope again"). "Kindly reply by" home'da tek yerde (davet kartı altı). **Kataloğa not:** 01 ve 03 başlık yazısı ikisi de Great
  Vibes (katalog seçimi; bu görev değiştirmedi).
- **Açık zarfta "Tap to open" (orta → düzeltildi):** `.is-opened .env-hint { display: none; animation: none }`; `theme-check` açık
  zarfta ipucunun görünmediğini denetler.
- **Details tören cümlesi (orta → düzeltildi):** yer kısmı kalktı ("The ceremony begins at 4:00 PM."), `.note` `text-wrap: pretty`.
  03'te aynı varsayım duruyor ("Ceremony at … in {schedule.0.location}") — 03 yayında olduğu için dokunulmadı, entegratöre not.
- **Kapak açılışı geç çevriliyordu (düşük → düzeltildi):** `lift` 920 ms, %30'da 22° yumuşak başlangıç, 80°'den sonra sarmalayıcı
  söner (10× yavaş karelerle bakıldı: soyulma ~200 ms'den görünür, ezik mühür şeridi yok).
- **Yaprak fotoğrafın üstünden geçiyordu (düşük → düzeltildi):** `across` yaprakları kartın duracağı yerin üstündeki ve zarfın
  altındaki bantlarda uçar.
- **Tekrarlayan çağrılar (düşük → düzeltildi):** son tarih satırı home'da bir kez; RSVP teaser'ı mühür + "Will You Join Us?" +
  "Reply"; RSVP kapanışı "Thank you / for being part of our story." (kart satırı tekrar edilmiyor).
- **Mini mühür boş ovaldı (düşük → düzeltildi):** üç mühürde de monogram; `--seal-ink` #8C7442 → #735E2E + basılı gölge, boy
  8,4 → 8,8cqw (ölçüldü: yazı ovalin genişliğini dolduruyor; sorun boy değil açık tondu).
- **J kuyruğu tarihe değiyordu (düşük → düzeltildi):** `.hero-date` üst boşluğu isim boyunun %27'si; zarf sayfasında isim–zarf
  arası `max(20px, isim boyu × ,38)`.
- **Masaüstü seyrekti (düşük → düzeltildi):** home üçlüsü 640 px'e kadar bir sıra; RSVP ≥ 960 px'te kart (390 px) + form iki sütun,
  kart ve mühür 1280×900'de ilk görünümde. (Bulgunun "kartı 2:3'e genişlet" önerisi uygulanmadı: kart yazısı `cqw` ile ölçeklendiği
  için genişlemek kartı da uzatıyordu.)
- **Kapak kesiminde dil (orta → düzeltildi):** `build_images.py` dantel kenarı: 3 px açma (ince açık kat çizgisi dantel sayılmaz),
  arama bandı V + 62 px, aykırı sütun dolgusu ve **sert denetim** (sıçrama ≤ 24 px, dolgu ≤ %6; çıkış ≠ 0). Sonuç: 0 sütun dolgu,
  en büyük sıçrama 9,1 px; `cuts_envelope.jpg` yenilendi (sol dantelin altında dil yok). Yalnız `env_cflap-440/880` ve
  `manifest.json` değişti; öteki 43 WebP bayt bayt aynı. `compare_closure.jpg` yeniden üretilmedi (kapalı sahne aynı; çapa 1 px).
- **Replay'de uçuşan kart (orta → düzeltildi, 03'te de):** kart VT adı yalnız açıkken / `go(true)`'da; `?replay=1` `<head>`'de kapalı.
- **Skip + Geri boş sayfa (düşük → düzeltildi, 03'te de):** Skip durumu `done`; `pageshow` solmayı temizler (yalnız kodda; headless
  Chromium bfcache'ten dönmüyor).
- **srcset eksikleri (düşük → düzeltildi):** üçlüdeki çerçeve, mühür ve `ph_story_1` srcset + gerçek `sizes`; yeni test her çok
  dosyalı parça `<img>`'inde srcset + sizes arar.
- **README doğruluğu (düşük → düzeltildi):** 43vw → 50vw (yeni düzen), yüzen accent satırı, `closure-320/640` ve `accent_2-156`
  gerekçeleri, tören cümlesi; comp haritası yeni düzene göre.
- **Belgeler (düşük, kısmen):** `docs/11` (G056 yazma alanı) §2.1, §5.1, §7.1, §7.3, §11, §14 #11–#12 güncellendi; G401'den genel
  kurallar eklendi. Yapılmadı (entegratör dosyaları): `katalog.py belge` (docs/09), `platform/README.md` satırları.
- **qa-kontrol kapısı (orta):** bu oturumda da alt-ajan aracı yok; düzeltmelerden sonra **qa-kontrol incelemesi yapılmadı**, Bitti 3.
  madde işaretsiz kalıyor. İncelenecekler: `previews/g401/compare_*`, `opening_390x844.mp4` (kart home kartına iniyor), README comp
  haritası.

**Yazma alanı dışı (inceleme bulgusunun istediği):** `platform/scripts/theme-check.cjs` (G052'nin dosyası, görev bitti): iki yeni
genel denetim (varış kartı opaklığı, açık zarfta ipucu). `blush-garden-rose` dosyaları ve `docs/11` G056'nın, `tools/katalog.py`
yorumu G057'nin alanında (ikisi de bu turun bulguları).

**Bu turun sayıları:** `npm test` **292/292** (olive 28 test: §13.2 + zarf + 4 inceleme testi; 03'e 1 test), typecheck temiz,
build + trace-check temiz; `theme-check --theme olive-ivory --stress` **86/86, 0 uyarı** (zarf → home 4179 ms; ilk görünüm 390×844
DPR 3: yer tutucuyla index 999 / home 816 KB, örnek fotoğraflarla 1073 / 993 KB — telefonda köşe kümeleri ve `bg_page-1024`
ilk görünüme girdi, sınır 1,5 MB; ≥ 150 KB tek WebP: `decor_tl-960` 167 KB, DPR 3 telefonda seçiliyor); 03
`theme-check --stress`: **85/85, 0 uyarı** (`--no-video`, çıktı geçici klasöre — `previews/g038` dokunulmadı; yeni varış kartı ve açık zarf ipucu denetimleri dahil; zarf → home 4361 ms); g051-browser: `g051-browser --theme olive-ivory` 44/44; final-smoke: `final-smoke --theme olive-ivory` 42/42 (`previews/g401/final/` yenilendi). Boyutlar: `site.css` 44,7 KB, `site.js` 34,9 KB
(≤ 45 / 35 KB; ayraç yorumları kısaltıldı).

- **Tema** `platform/themes/olive-ivory/`: `theme.json` (5 sayfa; foto alanları `hero_portrait` 663/715, `story_1..3` 653/883,
  `venue` 1009/618 = manifest `box_px`), `content.demo.json` (koleksiyon kaydının birebir kopyası → `/start?theme=olive-ivory` ve
  `/start/demo/olive-ivory` çalışıyor; final-smoke'ta "Design: Olive & Ivory"), 5 sayfa, `site.css`, `site.js`, `build_images.py`,
  `README.md`, `img/` (45 WebP + 3 maske + og + favicon + `manifest.json`; klasör 1,62 MB). 03'ten yalnız platform sözleşmesi
  alındı (işaretler, RSVP formu, `#site-data`, slug'lı oturum anahtarları, sahne kancaları); yerleşim, tipografi, zamanlama W1'den.
- **Görsel hattı** (`build_images.py` → `tools/tema_build.py` + bu tasarımın kesimleri; `parts_prep` geçici klasöre; çıktı bayt
  bayt tekrar üretilebilir, md5 ile denendi). GPT kusurları **çizim yapmadan** görsel hattında temizlendi:
  (1) pencereler saf #00FF00 değil (≈ 5, 241, 1), frame_landscape'te koyu yarı saydam leke → parts_prep leke dolgusu + pencere
  çevresindeki 3 px halkada kalan pembe/turuncu ayrıştırma saçağı (card_small'da ort. 217, 126, 55) çerçevenin 4–10 px dışındaki
  renginden yeniden boyandı; (2) dış hatta sıcak/yeşil/gri hâle (frame_portrait'te 2–8 px'e uzanan alfa ≤ 33 gri parıltı,
  decor/closure/accent'lerde düşük alfa kuyruk) → alfa tabanı 12, çekirdekten uzak pikseller silinir, kenar rengi komşu opak renge
  çekilir, yeşil baskınlık sınırlanır (parça başına silinen piksel `manifest.cleanup`'ta); (3) Pillow küçültmesi + kayıplı WebP'nin
  şeffaf kenarda yaptığı koyu/yeşil saçak → kaydetmeden önce şeffaf piksellere komşu renk taşınır. Denetimler: pencere şeffaflığı
  3/3, görünür yeşil piksel 0, açık zarf katmanları ↔ kaynak alfa farkı 0,005, kapak kapalı zarfın dışına 0 px.
- **Kesimler:** kapak (`env_cflap`) dantelin **dış kenarından** (`tema_build.kapak_kes` V'si danteli ortadan bölüyordu, fisto
  sırası gövdede kalıyordu); ön cep düz üst kenarlı **trapez** (`cep_kes` V'si 40 px aşağıda sivri uç buluyordu; trapez uyumu
  artığı p50 0,7 px). Geometrik yedek uyarısı yok; kesim önizlemesi `previews/g401/cuts_envelope.jpg`.
- **Hiza:** `kit_check` hiza GEÇTİ (sol +0,29 · sağ −0,39 · alt −0,65 %), ama GPT açık arka panelin üst kenarını kapalı
  menteşeden ~60 px yukarı çizmiş → açık katmanlar alt kenara göre dikeyde × 0,931 (`manifest.stage.hinge_align`); 90°'de kapak
  aynı menteşe çizgisinde el değiştiriyor.
- **Kapanış:** `closure.png` (oval mühür + dal **tek parça**) kapakla aynı sarmalayıcıda (`.env-cflap-wrap`, tek `rotateX`):
  kapak mühür ve dalıyla birlikte kalkar. Yeri dantel V'sinin ucuna bağlı; mühür yüksekliği/zarf genişliği (0,282) ve uca göre
  kayma W1.1 comp'ta ölçüldü (`manifest.closure.measured_from`); monogram (`initials`) mührün boş ovalinde.
  `compare_closure.jpg`: tema | comp.

**Açılış:** dokununca mühür hafifçe kalkar, dantel kenarlı kapak mühür ve zeytin dalıyla birlikte menteşesinde izleyiciye doğru
kalkıp 90°'de açık kapağa devreder; fildişi kart cepten süzülerek yükselirken iki zeytin yaprağı ekranı soldan sağa geçer, kart
öne gelir ve view transition ile home'daki hero kartına dönüşür (dokunuştan home'a 4,1 s; Skip her an; reduced motion 0,2 s).
*(İkinci tur: kart cepten çıkınca yukarıda kalır, olduğu yerde öne gelir ve görünür home kartına yukarı uçar — yukarıdaki blok.)*
**Story:** üç yuvarlak köşeli, altın çerçeveli portre kartı elden yelpaze gibi açılır (orta kart yükselir, yanlar onun arkasından
8° eğimlerine açılır), başlıklar altına yazılır; ≥ 720 px'te comp'taki yelpaze (orta dik ve yüksek, yanlar ±8° ve orta kartın
altına girer), telefonda aynı el kaydırılan bir yelpaze (ikinci tur; ilk turda basamaklıydı).
**Parçacıklar:** açılışta 2 zeytin yaprağı (`across`), home'a varışta 3 yasemin çiçeği süzülür, RSVP kapanışında 2 çiçek + 1 yaprak.

**Comp sapmaları** (gerekçeleri README'deki comp haritasında):
- home geri sayımı: comp'taki dört kutu yerine sade rakam + etiket (kutular CSS çerçeve olurdu; K21, §5.7).
- story telefonda: yan yana yelpazede pencere ~85 px kalıyordu (< 38vw, §9) → kaydırılan yelpaze (kart 64vw, pencere 50vw;
  ilk turdaki basamaklı düzen ikinci turda kalktı).
- story başlıkları kartın üstünde değil altında (görev cümlesi; 60 karakterlik başlık kart kenarına sığmaz).
- details program satırları arasındaki GPT dalın iki yanındaki çizgiler yok; 6+ satırda yalnız boşluk.
- mühürde monogram var (comp'ta boş oval) — `initials` alanı.
- comp'u olmayan bölümler (davet kartı, takvime ekle, "Pull up a chair" yelpaze üçlüsü, yanıt formu, SSS, kapanış) bu tasarımın
  parçaları ve tipografisiyle.
- telefon sahnesi: comp'un tek boyalı sayfası yerine kâğıt + iki ayrı gül kümesi (aynı GPT parçaları; 2:3 sayfa telefonda gülleri kesiyordu).

**Test edildi:**
- `kit_check --paket 5` 23/23, `--paket 2` 5/5.
- *(İlk tur sayıları; ikinci turunkiler yukarıdaki blokta.)* `npm test` **287/287** (origin/main birleştirmesinden sonra; yeni `tests/theme-olive-ivory.test.ts` 24 test: §13.2'nin 23 maddesi + zarf/kapanış geometrisi);
  `npm run typecheck` temiz; `npm run build` + trace-check temiz (16 rota, 3 tema, yalnız html/json).
- `theme-check --theme olive-ivory --stress` (`next start` + Chromium, MP4 dahil): **85/85, 0 uyarı**. 5 sayfa ×
  360/390/430/768/1280 kayma yok, her alan = kayıt, kart metni düz kâğıtta; fotoğrafsız yer tutucu; taslak önizleme; kısa telefonlar
  (360×640, 375×553, 390×690, 390×844) zarf + ipucu ekranda; dokunma hedefleri ≥ 44 px; zarf → home 4114 ms + kart geçiş işareti;
  geri → açık zarf + Replay; Skip; reduced motion 191 ms; site başına oturum anahtarı; sayaç hedefi + today/after; RSVP boş ad,
  yanıt, teşekkür, tekrar yanıt; içerik değişikliği; zorlama kaydı (§12) 360/390'da taşma yok; ilk görünüm (390×844, DPR 3) yer
  tutucuyla index 789 KB / home 692 KB, örnek fotoğraflarla 863 / 870 KB (G056 seed'i türevli saklıyor; birleştirmeden önce tek dosyayla 1058 / 1240 KB);
  dış istek yalnız Google Fonts. Bu sayılar birleştirmeden sonraki koşudan (önizlemeler de). Ağırlık: `site.js` 33 KB,
  `site.css` 41 KB; ≥ 150 KB tek WebP yalnız `decor_tl-960` (166 KB; story/details başındaki köşe kümesi, DPR 3 telefonda
  960'lık seçiliyor; ≤ 200 KB sınırının altında, daha sıkı kalite denenmedi).
- `g051-browser --theme olive-ivory` 44/44; `final-smoke --theme olive-ivory` 42/42 (misafir + alıcı akışı: `/start`, panel,
  yayın, RSVP panelde) → `previews/g401/final/`.
- Kontrast (390 px, oluşan sayfada metnin arkasındaki piksellerin medyanı): görünen her metin ≥ 5,1:1. Ölçümle iki düzeltme:
  `--gold-ink` #7A6539 → #6E5A31 (sayfa renginde 4,4 → 5,2:1), "Tap to open" nefes animasyonunun alt noktası .55 → .8 opaklık.
  Mühürdeki monogram bilerek kabartma tonunda (≈ 2,7:1, `aria-hidden`).
- Aksanlı isimler: Great Vibes + EB Garamond latin-ext yüzleri yükleniyor ("Zoë Łucja & Renée Dvořák", "Château de Bézenac ·
  Šibenik" doğru çizildi; statik sayfada denendi).

**Önizlemeler** (`platform/previews/g401/`): 5 sayfa 390 + index/home 360/430/768/1280 + details 1280, yer tutucu ve değişen içerik
hâlleri, `stress_*`, `rsvp_390_reply_sent.png`, `compare_<sayfa>_390.jpg` (W1 comp | tema), `compare_closure.jpg`,
`cuts_envelope.jpg`, `opening_390x844.mp4`, `checks.json`, `final/` (final-smoke).

**Test edilmedi / yapılmadı:**
- **qa-kontrol incelemesi yapılmadı:** bu oturumda alt-ajan aracı yoktu; `compare_*` karşılaştırmalarına yalnız ben baktım. Bitti
  listesinin üçüncü maddesi bu yüzden işaretsiz; ayrı QA görevi öneriyorum.
- Gerçek iPhone/Safari ve Android Chrome (yalnız Chromium mobil emülasyonu); view transition'sız tarayıcıda solma yolu yalnız kodda;
  Vercel yayını (bu görevin işi değil); gerçek alıcı fotoğrafları (farklı oran/ışık); yavaş ağ.
- `platform/README.md`'ye olive-ivory satırları eklenmedi (yazma alanım dışında).
- İkinci turda yeniden ölçülmedi: kontrast (ilk tur ≥ 5,1:1; nav zemini ve hero kâğıdı değişti — nav yazısı hâleyle), aksanlı isim
  fontu (font ve aileler aynı).

**Sorunlu GPT parçaları + önerilen prompt düzeltmeleri:**
- card_small, frame_portrait, frame_landscape: pencere saf #00FF00 değil, frame_landscape'te koyu yarı saydam leke → "the photo
  window is one flat fill of pure #00FF00 (RGB 0,255,0): no gradient, shadow, texture, vignette or blotch inside it, hard edge
  against the frame".
- frame_portrait (en çok), decor_tl/br, closure, accent'ler: dış hatta yarı saydam gri/sıcak/yeşil hâle → "transparent background
  with a clean hard alpha edge; no glow, no outer haze, no drop shadow, no soft halo around the object".
- envelope_open: arka panelin üst kenarı kapalı zarfın katlanma çizgisinden ~60 px yukarıda → "same canvas, outline and scale as
  envelope_closed; the back panel's top edge sits exactly on the closed flap's hinge (fold) line".
- envelope_open ön cebi sivri V değil, düz üst kenarlı trapez (kesim artık ikisini de buluyor; promptta biri açıkça istenmeli).
- web_hero (og kaynağı): zarf sağa ve aşağıya kaymış, 1.91:1 kırpımda merkez dışında → "envelope centered in the middle third,
  1.91:1 safe area, decor only at the corners".

**Önerilen yeni görevler:**
- (claude-kod) `build_images.py`'deki genel düzeltmeleri `tools/tema_build.py`'ye taşı + test: hâle temizliği, şeffaf piksele renk
  taşıma (WebP kaydında), pencere halkasını yeniden boyama, dantel dış kenarından kapak kesimi, trapez cep kesimi; `parts_prep`
  yeşil ayrıştırmasını saf #00FF00 yerine ölçülen pencere rengiyle yap (saçağın kökü).
- (claude-qa) qa-kontrol: `previews/g401/compare_*` + MP4 incelemesi; gerçek iPhone/Safari ve Android'de açılış.
- (gpt-gorsel) yukarıdaki prompt düzeltmeleriyle frame_portrait, envelope_open, web_hero yenilenirse temizliğin bir kısmı gereksizleşir.
- (claude-kod/entegratör) `platform/README.md`'ye `themes/olive-ivory/` ve `previews/g401/` satırları.

## Günlük
- 2026-10-13 blokaj: K22 (kullanıcı, 2026-10-13): videodan çıkıldı, ürün yalnız mobil öncelikli website. Yeni website standardı pilotla (G035) belirlenince yeniden tanımlanacak
- 2026-10-13 yeniden tanımlandı (K22–K24, G033)
- 2026-10-13 alindi: wf-tema01
- 2026-10-13 bitti, incelemeye gönderildi
- 2026-10-13 inceleme düzeltmesi (wf-tema01): 24 bulgu doğrulandı; varış kartı, telefon sahnesi parçalardan, kart yolu, nav, story yelpazesi, home üçlüsü, kapak kesimi; theme-check 86/86, qa-kontrol yapılamadı
- 2026-10-13 bitti, incelemeye gönderildi
- 2026-10-13 son denetim (wf-tema01, origin/main c637fcc temiz worktree): npm test 292/292, typecheck, build+trace-check, seed; theme-check --stress olive-ivory 86/86 ve blush-garden-rose 86/86 (MP4 dahil); g051 44/44 + final-smoke 42/42 iki temada; tools/tests 7/7; kit_check 01 p5 23/23 p2 5/5, 03 p4 21/21 p2 5/5; validate_content 20/20; katalog --dene temiz (docs/09 01 satırı eşitlendi); previews/g401 güncel kodla aynı. qa-kontrol incelemesi hâlâ yapılmadı.
- 2026-10-14 qa-kontrol KOŞULLU GEÇTİ → düzeltildi: mekân yer tutucusu temiz kırpım (+ min_lum denetimi), kısa telefonda (360×640, 375×553) ve 1024×768'de home ilk ekranı nav'ın üstünde (eski iddia düzeltildi), kümeler düz çizgiyle kesilmiyor (hero/sayfa sonu maskesi, RSVP geniş köşeleri), ≥ 11 px yazı, dokunma vurgusu, yaprak/yasemin/isim zamanlaması, story kaydırma ipucu, MP4 beyaz ilk kare; theme-check yeni home kısa telefon akışı (01 ve 03 geçiyor); npm test 293/293, theme-check 01 88/88 + 03 87/87, g051 44/44, final-smoke 42/42
