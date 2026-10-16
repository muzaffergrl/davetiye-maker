---
id: G420
baslik: Tasarım 20 Coastal Seaside — platform teması
rol: claude-kod
durum: bitti
alan: claude-G420
oncelik: 3
bagimli: [G220, G038, G046, G052]
yazar: [platform/themes/coastal-seaside/, platform/tests/theme-coastal-seaside.test.ts, platform/previews/g420/]
---

## Amaç
Tasarım 20'i platformda tema olarak kurmak (K24, `docs/10_SITE_PLATFORMU.md`): kapalı zarf açılış sayfası → home → story, details, rsvp; yalnız bu tasarımın GPT parçalarıyla (K21), kişisel metin HTML'de. **Kurallar `docs/11_TEMA_STANDARDI.md`'dedir; bu görev metniyle çelişirse docs/11 geçerlidir.**

## Girdiler
- Tema standardı: `docs/11_TEMA_STANDARDI.md` — bütünü; zarf tipi **kapaklı zarf** → §7.1 + §7.3; bitti tanımı §13, kontrol listesi §15
- Platform sözleşmesi: `platform/README.md` (işaretler, RSVP form sözleşmesi, `#site-data`); çalışan örnek `platform/themes/blush-garden-rose/` — **yalnız** işaret/RSVP/`#site-data`/oturum anahtarı kullanımı için; yerleşimi, aralıkları, süs konumları ve zamanlaması bu temaya taşınmaz (docs/11 §8). G035 kaynağı (`collections/03_Blush_Garden_Rose/website/`) örnek değildir
- GPT çıktıları (G220): `collections/20_Coastal_Seaside/assets/gpt/comps/` (W1, yerleşim referansı, satılmaz; yalnız sade adlar — `_vN` denemedir), `parts/` (katmanlar), `photos/` (örnek fotoğraflar)
- İçerik `collections/20_Coastal_Seaside/content.demo.json`, renk `collections/20_Coastal_Seaside/palette.json`, özet `collections/20_Coastal_Seaside/DESIGN_BRIEF.md`
- Araçlar: `tools/parts_prep.py` (geçici klasöre; docs/11 §5.3), `python3 tools/kit_check.py collections/20_Coastal_Seaside --paket 5`, `node scripts/theme-check.cjs --theme <slug>` (G052)

## Yapılacaklar
1. `theme.json`, 5 sayfa, `site.css`, `site.js`, `build_images.py`, `README.md` docs/11 §1–§4 düzeninde. 03'ten yalnız platform sözleşmesi alınır (motor işaretleri, RSVP formu, `#site-data`, slug'lı oturum anahtarları, `data-scene`/`data-step`/`data-a` kancaları); yerleşim, tipografi ve hiyerarşi bu tasarımın W1 comp'larından — tema `README.md`'sinde sayfa başına **comp öğe haritası** (her W1 öğesi → şablon öğesi ya da gerekçeli sapma; comp'u olmayan bölümler bu tasarımın parçaları ve tipografisiyle, docs/11 §8).
2. Parçalar: `python3 platform/themes/coastal-seaside/build_images.py` → `parts_prep` **geçici klasöre** (`--prep-dir`; tema klasörüne, `img_src/`'ye ya da `assets/`'e asla — docs/11 §1, §5.3–§5.4), tip kesimleri (§7), maskeler, `free_zone`, yer tutucular, og; WebP + srcset genişlikleri (§5.1, §5.5). Yalnız bu tasarımın GPT parçaları; yeni şekil/dekor çizme (K21).
3. Zarf açılışı (`MOTION.envelope`, kapaklı zarf, docs/11 §7.1 + §7.3): On tap, the watercolor wave (wave.png) sweeps across the screen and carries the seashell and twine away, the wave-edged flap lifts, and the card rises like the incoming tide. Katalog: Dalga desenli astarlı kum rengi zarf, deniz kabuğu süslü; dalga geçince açılır. Açılış cümlesindeki sıra, sayı ve yön bağlayıcıdır; kapanış elemanı, zarf/kapak ve kart ayrı katmanlar; kart home'daki karta dönüşür; `closure.png` kare tuvalde büyük çizilir; yeri kesim geometrisine bağlanır (`manifest.closure`, docs/11 §7.1).
4. Sayfa koreografisi (`MOTION.scenes`): her sayfada öğeler sırayla girer. Story: Yuvarlak gemi lombozu (porthole) çerçeveler, kenardan kayar (three round brass portholes stacked down the page in a gentle zig-zag (left, right, left) on the soft sea-mist page, a few shells and sea glass between them); telefonda foto penceresi ≥ 38vw (sığmazsa basamaklı/alt alta düzen, comp sapması olarak yazılır — docs/11 §9). Parçacıklar `MOTION.accents` (§8: tür başına dosya ve yol). Details/rsvp: kart, satırlar ve buton sırayla.
5. Foto alanları: `hero_portrait` (card_small penceresi), `story_1..3` (frame_portrait), `venue` (frame_landscape); kutu ve maske `windows.json`'dan (§5.6, §9). PAKET 2 fotoğrafı yoksa yer tutucu.
6. Tasarıma özel ek parçalar (comp'taki ilgili öğe bunlardan kurulur, kodla çizilmez — K21): `wave.png` — Açılış dalgası.
7. Fontlar: Allison + Lora (Google Fonts link'i; repoya font dosyası girmez). Tarih motor biçimiyle (`May 15, 2027`). Link blokları `data-if="urls.*"` ile linksiz kalkar — "link will be added soon" diyen ölü düğme yok (§4).
8. Testler ve önizleme (§13): `platform/tests/theme-coastal-seaside.test.ts`; `theme-check --theme coastal-seaside` (5 genişlik, kısa telefonlar, akışlar, ağırlık, MP4); `platform/previews/g420/` (W1 comp | tema karşılaştırmaları dahil).

## Bitti sayılması için
- [ ] docs/11 §15 kontrol listesi tamam (atlanan madde Sonuç'ta gerekçesiyle)
- [ ] `npm test`, `npm run typecheck`, `npm run build` (trace-check) geçti; `tests/theme-coastal-seaside.test.ts` (§13.2)
- [ ] `theme-check --theme coastal-seaside` hatasız; `previews/g420/` + `compare_<sayfa>_390.jpg` qa-kontrol incelemesinden geçti
- [ ] Sonuç dürüst: açılış ve story tarifi, comp sapmaları, denenmeyenler (gerçek iPhone/Safari, yayın), sorunlu GPT parçaları

## Sonuç
**Yapıldı (claude-G420, dal `claude/g420-tema`):** `platform/themes/coastal-seaside/` — `theme.json` (5 sayfa, 5 foto alanı,
oranlar manifest `box_px`'ten, 71 copy anahtarı), `content.demo.json` (koleksiyon kaydının birebir kopyası), 5 sayfa,
`site.css` (45 987 B), `site.js` (35 444 B), `thank-you.css`, `build_images.py`, `README.md` (comp öğe haritası + sapmalar),
`img/` (53 WebP + maskeler + og + favicon, klasör 2,3 MB); `platform/tests/theme-coastal-seaside.test.ts` (37 test);
`platform/previews/g420/` (sayfa görüntüleri, `compare_<sayfa>_390.jpg`, `compare_closure.jpg`, kesim önizlemeleri,
`opening_390x844.mp4`, `checks.json`, `final/`). Ortak dosyaya dokunulmadı; tema sayısını sayan ortak test kırılmadı.

- **Açılış:** dokununca suluboya dalga (GPT `wave.png`) ekranın sol dışından sağ dışına doğrusal hızla geçer, zarfın önünden
  ve kabuğun altından; ön kenarı kabuğa varınca deniz tarağı + sicim dalgayla aynı hızda (hafif zıplayıp dönerek) ekrandan
  taşınır; ardından dalgalı V kapak menteşesinde kalkar (90°'de astarlı açık kapağa devreder), kart cepten gelgit gibi yavaş
  yükselir, öne gelir ve view transition ile home kartına uçar (dokun → home 4,48 s; parçacık yok — cümle yalnız dalgayı anıyor).
- **Story:** üç pirinç lomboz zikzak (sol, sağ, sol); her biri kendi ekran kenarından ±24° dönerek kayıp yerine oturur, sonra
  el yazısı başlığı yazılır; her lombozun yanında bir GPT kumsal parçası (ay salyangozu, deniz camı, deniz yıldızı). Telefonda
  da zikzak: çerçeve 52vw, foto penceresi 40vw (≥ 38vw).
- **Kesimler:** kapak `kapak_kes("v")` (renk); ön cep için `cep_kes` geometrik V'ye düştü → temaya özel `cep_cizgi` (kâğıdın
  kendi vurgu çizgisi: düz taban y 1003 + 2. derece yan kanatlar, artık medyanı 2,7 / 2,4 px); örtüşme ≤ 0,01; hiza (kit_check)
  sol +0,10 · sağ +0,49 · alt +1,11 % (dönüşüm yok). Kapanış çapası kapak ucu, ölçü W1.1'den (`manifest.closure.comp`).
- **Comp sapmaları** (README'de tabloyla): geri sayım kutuları → sade rakam (K21); W1.1 "Tap to open" altındaki dalga kıvrımı ve
  W1.5'teki nokta/kıvrım süsleri çizilmedi (yerine GPT kabuk sırası ya da boşluk); RSVP hapının altın kenarı yok; card_small
  comp'takinden uzun (yazı lombozun altında); story lombozları dik oval (GPT parçası); RSVP kartındaki kabuk sicimle birlikte
  (tek GPT parçası); geniş ekranda story zikzakı daha küçük çerçeveyle.
- **Teknik onarım (çizim yok):** bilgi ve davet kartının düz kâğıdındaki renkli kum benekleri (katalog ve W1.4/W1.5'te yok;
  metin satırlarının altına düşüp theme-check piksel testini bozuyordu) yalnız düz kâğıt üzerinde çevre medyanıyla dolduruldu
  (`benek_temizle`, kabuk/ot/dalga dokunulmadı); 3 dilimli kartların orta bandı gerilmiyor, bant + dikey aynası `repeat-y`
  döşeniyor; card_small'ın benekleri tasarım gereği kaldı, yalnız `free_zone` ölçümünde süzülüyor.

**Komutlar (2026-10-15, bu konteyner, Chromium/Playwright):**
- `kit_check --paket 5` 24/24 (hiza geçti), `--paket 2` 5/5.
- `build_images.py`: denetimler geçti (pencereler şeffaf, kroma yeşili 0, örtüşme ≤ 0,01), klasör 2,3 MB.
- `npm test` 993/993 (theme-coastal-seaside 37/37, tarayıcı testi atlanmadı; QA sonrası tema testi yeniden 37/37), `npm run typecheck` temiz, `npm run build` temiz
  (trace-check 16 tema).
- `theme-check --theme coastal-seaside --stress`: **128 geçti, 0 hata, 0 uyarı**. İlk görünüm 390×844 DPR 3: index 897 KB,
  home 910 KB (yer tutucu); örnek fotoğraflarla index 981 KB, home 1335 KB (sınır 1,5 MB). Azaltılmış hareket 157 ms.
  (QA düzeltmelerinden sonraki son tur; üç tarayıcı denetimi de yeniden koşuldu.)
- `g051-browser --theme coastal-seaside` 44/44; `final-smoke --theme coastal-seaside` 45/45.
- Kendi QA: 360×640, 390×844, 430×932, 844×390, 1280×800 ekran görüntülerine ve açılış karelerine (150–4300 ms) bakıldı;
  bulunan sorunlar düzeltildi (story başlığının ekran dışına taşması, masaüstünde kıyı bandının "Tap to open" ve sayacın altına
  girmesi, stretched kart bandında benek çizgileri, home lombozlarının kayarken yazıyı ekran dışına taşıması).
- qa-kontrol incelemesi (oturum içi, salt okunur, `compare_*`, README, site.css; raporu repoda yok — 2026-10-16 qa-kontrol bu
  "geçti"yi doğrulayamadı ve orta bulgular buldu, aşağıda "qa-kontrol 2026-10-16"): oturum notuna göre başka tema düzeni yok, kodla çizim yok,
  atlanan comp öğesi gerekçeli. İki önemli bulgu düzeltildi: (1) `sea` kırpımının sağ kenarında kumul otu/kabuk kalıntısı →
  kırpımlar daraltıldı (`mist` x 420–880, kıyı x 0–600); (2) iç sayfalarda ilk ekranın kıyısı içeriğin ortasından geçiyordu →
  story/details/rsvp ilk ekranı yalnız sis, kıyı sayfa sonunda (README'de sapma). Küçük bulgular README'ye işlendi (home
  kapanışında iki GPT dalgasının üst üste binmesi, lomboz biçimi, compare_closure yönü); index'te zarf ile kıyı arasındaki
  ~100 px boşluk bilinçli (ipucu kıyının üstünde kalsın).

**Denenmedi:** gerçek iPhone/Safari ve Android Chrome, Vercel yayını, gerçek alıcı fotoğrafları (farklı oran/ışık), yavaş ağ.

**Sorunlu GPT parçaları / önerilen gpt-gorsel görevi:**
- `frame_portrait.png`: pencere dik oval (0,77), katalog "a perfectly round window" diyor ve W1.3 tam daire. Öneri
  (`tools/katalog.py` `WEB[20]` `cerceve`/`pencere`): "the window is a PERFECT CIRCLE (equal width and height), the brass ring
  of even thickness all around; square-ish canvas use: draw the porthole centered, do not stretch to the 2:3 canvas".
- `info_card.png`, `invitation_card.png`: kâğıda renkli kum benekleri serpilmiş (katalog "soft-white textured card"); şimdilik
  onarıldı. Öneri: prompt'a "plain soft-white paper, no colored speckles or dots on the writing area".
- `card_small.png` comp'taki kareye yakın kartın aksine 2:3 uzun; sorun değil, sapma olarak yazıldı.

**Entegratöre notlar:** `PROJECT_STATE.json` / `COLLECTION_STATUS.md` güncellenmedi (entegratör dosyası). `platform/previews/g420/`
≈ 43 MB (g408 41 MB ile benzer).

### qa-kontrol 2026-10-16 (G101 oturum B)
- **Kapalı zarfta kart yazısı zarfın altından görünüyor (orta, öncelik 1):** `.card-slot` kırpması `inset(… 1% …)` idi; `env_closed` %98,52'de bitiyor ve alt kenarı yumuşak → 390'da y≈503–508 arasında kart yazısı şeridi. Kırpma %4'e çekildi (kart cebin içinde; açılırken cep zaten %49,9–100'ü örtüyor). 360×640, 375×553, 390×844, 430×932, 768, 1280, teşekkür ve stres kayıtlarında zarfın alt kenarı büyütülüp bakıldı: şerit yok. Açılış kareleri (0,8–3,5 s) bozulmadı.
- **Stres/teşekkür hâlinde yazı kıyı köpüğüne biniyor (orta):** home hero: `site.js` `shore()` — telefonda hero yazılarının en altı kıyının üstünü (sea-460'ın alt %27'si) geçerse zemin resmi o kadar aşağı kayar; açılan üst şerit görselin kendi üst rengiyle (`.hero-bg` yarı yükseklik zemini) dikişsiz. Demo hâli değişmedi. Kapanışlar: `.shore-end::before` telefonda da `100% auto` (sabit yükseklikli kıyı bandı sayfa dibinde; uzun metin üstte kalır). `stress_home_360`, `stress_ty_home_360`, `stress_rsvp_360` Read ile bakıldı: yazı köpükte değil.
- **Fold boşluğu (orta, ortak):** `.sched-row`'dan `data-fold` kaldırıldı.
- **"qa GEÇTİ" iddiası (düşük):** yukarıdaki Sonuç'ta "oturum içi, raporu repoda yok, doğrulanamadı" olarak düzeltildi.
- Test: `theme-coastal-seaside.test.ts` yeni kurallar + kırpma/kıyı testi. Dosya boyları: site.js 35 829 B (bütçe 35 840 — yorumlar kısaltıldı, sınırda), site.css 46 055 B.
- Komutlar (2026-10-16, düzeltmelerden sonra): `theme-check --theme coastal-seaside --stress` **128 geçti / 0 hata / 0 uyarı**; `g051-browser` **44/44**; `final-smoke` **45/45**; `npm test` **1210/1210**, `typecheck` temiz, `build` + trace-check temiz. İlk görünüm 390×844 DPR 3: index 897 KB, home 911 KB (yer tutucu); örnek fotoğrafla 982 / 1335 KB.
- **Denenmedi:** gerçek iPhone/Safari ve Android Chrome (özellikle `overflow-x: clip` ve yatay kaydırma), Vercel yayını, gerçek alıcı fotoğrafları, yavaş ağ. Düzeltmeler qa-kontrol'e yeniden incelettirilmedi (alt-ajan bu oturumda kullanılmadı).

## Günlük
- 2026-10-13 blokaj: K22 (kullanıcı, 2026-10-13): videodan çıkıldı, ürün yalnız mobil öncelikli website. Yeni website standardı pilotla (G035) belirlenince yeniden tanımlanacak
- 2026-10-13 yeniden tanımlandı (K22–K24, G033)
- 2026-10-15 alindi: claude-G420
- 2026-10-15 bitti, incelemeye gönderildi
- 2026-10-15 entegratör onayladı
