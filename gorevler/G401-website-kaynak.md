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
- [ ] `theme-check --theme olive-ivory` hatasız; `previews/g401/` + `compare_<sayfa>_390.jpg` qa-kontrol incelemesinden geçti
      — theme-check hatasız (85/85); **qa-kontrol incelemesi yapılmadı** (bu oturumda alt-ajan aracı yoktu; Sonuç'a bak)
- [x] Sonuç dürüst: açılış ve story tarifi, comp sapmaları, denenmeyenler (gerçek iPhone/Safari, yayın), sorunlu GPT parçaları

## Sonuç
**Yapıldı (wf-tema01, 2026-10-13).** Durum: yerelde çalışan ve test edilen platform teması; **hiçbir yere yayınlanmadı**.
Ayrıntı: `platform/themes/olive-ivory/README.md` (dosyalar, foto alanları, görsel hattı + GPT kusur temizliği, açılış/koreografi,
sayfa başına comp öğe haritası, bilinen sınırlar).

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
**Story:** üç yuvarlak köşeli, altın çerçeveli portre kartı elden yelpaze gibi açılır (her kart dik ve ortada başlar, kendi eğimine
döner), başlığı altına yazılır; ≥ 720 px'te comp'taki yelpaze (orta dik ve yüksek, yanlar ±8°), telefonda basamaklı.
**Parçacıklar:** açılışta 2 zeytin yaprağı (`across`), home'a varışta 3 yasemin çiçeği süzülür, RSVP kapanışında 2 çiçek + 1 yaprak.

**Comp sapmaları** (gerekçeleri README'deki comp haritasında):
- home geri sayımı: comp'taki dört kutu yerine sade rakam + etiket (kutular CSS çerçeve olurdu; K21, §5.7).
- story telefonda: yan yana yelpazede pencere ~85 px kalıyordu (< 38vw, §9) → basamaklı (−6°, +5°, −4°), pencere 43vw.
- story başlıkları kartın üstünde değil altında (görev cümlesi; 60 karakterlik başlık kart kenarına sığmaz).
- details program satırları arasındaki GPT dalın iki yanındaki çizgiler yok; 6+ satırda yalnız boşluk.
- mühürde monogram var (comp'ta boş oval) — `initials` alanı.
- comp'u olmayan bölümler (davet kartı, takvime ekle, "More about the day" vinyetleri, yanıt formu, SSS, kapanış) bu tasarımın
  parçaları ve tipografisiyle.

**Test edildi:**
- `kit_check --paket 5` 23/23, `--paket 2` 5/5.
- `npm test` **287/287** (origin/main birleştirmesinden sonra; yeni `tests/theme-olive-ivory.test.ts` 24 test: §13.2'nin 23 maddesi + zarf/kapanış geometrisi);
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
