---
id: G405
baslik: Tasarım 05 Mediterranean Lemon — platform teması
rol: claude-kod
durum: inceleme
alan: wf-tema05
oncelik: 2
bagimli: [G205, G038, G046, G052]
yazar: [platform/themes/mediterranean-lemon/, platform/tests/theme-mediterranean-lemon.test.ts, platform/previews/g405/]
---

## Amaç
Tasarım 05'i platformda tema olarak kurmak (K24, `docs/10_SITE_PLATFORMU.md`): kapalı zarf açılış sayfası → home → story, details, rsvp; yalnız bu tasarımın GPT parçalarıyla (K21), kişisel metin HTML'de. **Kurallar `docs/11_TEMA_STANDARDI.md`'dedir; bu görev metniyle çelişirse docs/11 geçerlidir.**

## Girdiler
- Tema standardı: `docs/11_TEMA_STANDARDI.md` — bütünü; zarf tipi **kapaklı zarf** → §7.1 + §7.3; bitti tanımı §13, kontrol listesi §15
- Platform sözleşmesi: `platform/README.md` (işaretler, RSVP form sözleşmesi, `#site-data`); çalışan örnek `platform/themes/blush-garden-rose/` — **yalnız** işaret/RSVP/`#site-data`/oturum anahtarı kullanımı için; yerleşimi, aralıkları, süs konumları ve zamanlaması bu temaya taşınmaz (docs/11 §8). G035 kaynağı (`collections/03_Blush_Garden_Rose/website/`) örnek değildir
- GPT çıktıları (G205): `collections/05_Lemon_Mediterranean/assets/gpt/comps/` (W1, yerleşim referansı, satılmaz; yalnız sade adlar — `_vN` denemedir), `parts/` (katmanlar), `photos/` (örnek fotoğraflar). **G205 açık kusurları (Sonuç):** iki çerçevenin yeşil penceresinde yarı saydam lekeler → pencere dikdörtgeni kodla tam saydam/tam maske yapılır (parts_prep `leke_doldur`); yatay çerçeve penceresi ≈ 1,87:1 (hedef 3:2) → mekân fotoğrafı bu orana `object-fit: cover` kırpılır, kırpım önizlemede kontrol edilir; zarf hizası ±%1 içinde
- İçerik `collections/05_Lemon_Mediterranean/content.demo.json`, renk `collections/05_Lemon_Mediterranean/palette.json`, özet `collections/05_Lemon_Mediterranean/DESIGN_BRIEF.md`
- Araçlar: `tools/parts_prep.py` (geçici klasöre; docs/11 §5.3), `python3 tools/kit_check.py collections/05_Lemon_Mediterranean --paket 5`, `node scripts/theme-check.cjs --theme <slug>` (G052)

## Yapılacaklar
1. `theme.json`, 5 sayfa, `site.css`, `site.js`, `build_images.py`, `README.md` docs/11 §1–§4 düzeninde. 03'ten yalnız platform sözleşmesi alınır (motor işaretleri, RSVP formu, `#site-data`, slug'lı oturum anahtarları, `data-scene`/`data-step`/`data-a` kancaları); yerleşim, tipografi ve hiyerarşi bu tasarımın W1 comp'larından — tema `README.md`'sinde sayfa başına **comp öğe haritası** (her W1 öğesi → şablon öğesi ya da gerekçeli sapma; comp'u olmayan bölümler bu tasarımın parçaları ve tipografisiyle, docs/11 §8).
2. Parçalar: `python3 platform/themes/mediterranean-lemon/build_images.py` → `parts_prep` **geçici klasöre** (`--prep-dir`; tema klasörüne, `img_src/`'ye ya da `assets/`'e asla — docs/11 §1, §5.3–§5.4), tip kesimleri (§7), maskeler, `free_zone`, yer tutucular, og; WebP + srcset genişlikleri (§5.1, §5.5). Yalnız bu tasarımın GPT parçaları; yeni şekil/dekor çizme (K21).
3. Zarf açılışı (`MOTION.envelope`, kapaklı zarf, docs/11 §7.1 + §7.3): On tap, the lemon tie slips loose and rolls away, the white flap opens upward to reveal the blue-and-white tile liner, and the card rises while a lemon branch sways in from the top corner and a blossom drifts down. Katalog: Çini desenli astarlı beyaz zarf; kapak açılırken limon dalı içeri doğru sallanır. Açılış cümlesindeki sıra, sayı ve yön bağlayıcıdır; kapanış elemanı, zarf/kapak ve kart ayrı katmanlar; kart home'daki karta dönüşür; `closure.png` kare tuvalde büyük çizilir; yeri kesim geometrisine bağlanır (`manifest.closure`, docs/11 §7.1).
4. Sayfa koreografisi (`MOTION.scenes`): her sayfada öğeler sırayla girer. Story: Fiyonk dilimli (scalloped) kenarlı çerçeveler, çini panolar gibi döner (three scalloped tile-framed portraits standing perfectly straight in a gentle staggered column down the page (left, right, left) like painted tile panels set into a sunlit white plaster wall, not overlapping); telefonda foto penceresi ≥ 38vw (sığmazsa basamaklı/alt alta düzen, comp sapması olarak yazılır — docs/11 §9). Parçacıklar `MOTION.accents` (§8: tür başına dosya ve yol). Details/rsvp: kart, satırlar ve buton sırayla.
5. Foto alanları: `hero_portrait` (card_small penceresi), `story_1..3` (frame_portrait), `venue` (frame_landscape); kutu ve maske `windows.json`'dan (§5.6, §9). PAKET 2 fotoğrafı yoksa yer tutucu.
6. Fontlar: Allura + Playfair Display (Google Fonts link'i; repoya font dosyası girmez). Tarih motor biçimiyle (`May 15, 2027`). Link blokları `data-if="urls.*"` ile linksiz kalkar — "link will be added soon" diyen ölü düğme yok (§4).
7. Testler ve önizleme (§13): `platform/tests/theme-mediterranean-lemon.test.ts`; `theme-check --theme mediterranean-lemon` (5 genişlik, kısa telefonlar, akışlar, ağırlık, MP4); `platform/previews/g405/` (W1 comp | tema karşılaştırmaları dahil).

## Bitti sayılması için
- [ ] docs/11 §15 kontrol listesi tamam (atlanan madde Sonuç'ta gerekçesiyle)
- [x] `npm test`, `npm run typecheck`, `npm run build` (trace-check) geçti; `tests/theme-mediterranean-lemon.test.ts` (§13.2)
- [ ] `theme-check --theme mediterranean-lemon` hatasız; `previews/g405/` + `compare_<sayfa>_390.jpg` qa-kontrol incelemesinden geçti
- [x] Sonuç dürüst: açılış ve story tarifi, comp sapmaları, denenmeyenler (gerçek iPhone/Safari, yayın), sorunlu GPT parçaları

## Sonuç
**2026-10-14 · qa-kontrol kapısı düzeltmeleri (claude-kod, `work-mediterranean-lemon-qa`) — durum: inceleme.**
**qa-kontrol kararı: KOŞULLU** (worktree 7aa9f39; kapı üç ÖNEMLİ must_fix şartıyla açık, önerilen etiket `review_pending`).
Üçü düzeltildi ve QA'nın kendi ölçüm yöntemiyle (m1: kutusu nav'ın üstünü geçip ilk ekranın altında başlamayan her yazı,
bağlantı, foto alanı, kart/çerçeve görseli) yeniden ölçüldü. Görsel çizilmedi (K21); yalnız yerleşim, yol ve konum değişti.

| # | QA bulgusu | Ne yapıldı | Doğrulama (bu worktree) |
|---|---|---|---|
| 1 (önemli) | details + rsvp ilk ekranında nav çizgisi kart yazısını kesiyor (10 boyut × demo/aralık/zorlama, 1280×800 dahil); story 568×320 giriş paragrafı; README/Sonuç'taki "yatayda üst boşluk 52 px — kart başlığı nav'ın üstünde biter" yanlış | `site.js` `folds` birim birim: `[data-fold]` birimleri — details: kart başlığı, **her program satırı**, takvim çifti, mekân fotoğrafı; rsvp: başlık, "Kindly reply by" + tarih, hap, çizgiler + bekleme satırı, **"With love," + isimler + limon bağı birlikte** (bağ imza biriminin içine taşındı, `top: calc(100% + 10.72cqw)` = eski yeri), form başlığı ve her form satırı; story: alt başlık, giriş, panolar. Nav çizgisini kesen **ilk** birim için ilk bölüm en çok 40 px (üst boşluğun %34'ü) yukarı alınır; yetmezse birim ilk ekranın 6 px altından başlar (kart 3 dilimle uzar, ilk ekranda boş kâğıt nav'ın altına iner). Kısa yatayda kartlar daralır, kart başlığı nav'ın üstünde biter (details `(100svh − 162px) × 1,98`, rsvp `(100svh − 128px) × 1,97`). Masaüstü (≥ 1024 px) RSVP **tek sütun**: yan yana formun satırları her ekranda nav'ın altından geçiyordu; kart `(100svh − 232px) × .58` (≤ 440 px) bağıyla ilk ekranda, form altında. Masaüstü details/rsvp üst boşluğu `clamp(76px, 12svh, 140px)`. README'deki yanlış cümle kaldırıldı, yerine bu kural yazıldı | m1 betiği (QA'nınkiyle aynı öğe seçimi): story/details/rsvp × 14 boyut (QA'nın 10 telefon boyutu + 768×1024, 1024×768, 1280×800, 1440×900) × demo/aralık/zorlama = **126 ilk ekran, 0 yarım öğe** (birleştirme öncesi ve sonrası iki kez), yatay kaydırma yok, en küçük yazı 11 px, konsol hatası yok. Önce (aynı betik, demo): 42 ekranın 28'i düşüyordu |
| 2 (önemli) | Açılış çiçeği ("a blossom drifts down") çoğu telefonda hiç doğmuyor: şerit kart kenarı +%3 ile sahne kenarı −%3 − çiçek arasında 0–8 px | Şerit kartın sağ kenarının **%3 içinden** (kartın beyaz kenarı; fotoğraf penceresi kenardan %11 içeride biter) zarfın sağ kenarının %1 içine; çiçek 46–54 px ama sahnenin en çok %16'sı → şerit her boyutta sahnenin ≥ %8'i. Yol sahne yüksekliğinin %27 → %52'si (merkez kapağın kenarından astara iner). Tür, sayı, yön aynı (accent_2 × 1, aşağı) | MutationObserver ile `.accent-layer img` sayımı: 13 boyut (320×568 … 932×430, 768×1024, 1280×800) × 10 deneme → 129/130; tek "kaçan" 1280×800'ün ilk denemesiydi ve ölçüm betiğimin hatasıydı (ekran görüntüsü sayfa home'a geçtikten sonra okunuyordu) — düzeltilmiş betikle 1280×800 ve 1024×768 10/10, zorlama kaydı 5 boyut × 5 = 25/25; birleştirme sonrası 13 boyut × 5 = 65/65. Hiçbir koşuda çiçek fotoğraf penceresine girmedi; merkezi 0,65–1,25 s mavi astarın üstünde (telefonlarda 0,70–1,15 s) |
| 3 (önemli) | Masaüstü ve yatay tablette story ilk ekranı yarı boş (1280×800'de 371 px, 1024×768'de 339 px) | ≥ 1024 px yatay (≥ 621 px yükseklik): üç pano **tek basamaklı sırada** (yüksek, alçak, yüksek) başlığın altında; `site.js` `tiles` panoları (≥ 190 px, en çok 320 px) sıra nav'ın üstünde bitene kadar küçültür; masaüstünde başlık `clamp(72px, 12svh, 104px)`, başlıklar 34 px ve panodan 28 px geniş taşabilir (tek satır). 720–1023 px iki sütunda orta pano `align-self: start` + kenar boşluğu (önce `center`: fold itişi yarıya iniyor, 768×1024 ve 1440×900'de pano nav'ın altında yarım kalıyordu). Comp sapması README haritasında | Boş bant 1024×768 / 1280×800 / 1440×900 / 1920×1080: 8 / 15 / 9 / 11 px (önce 339 / 371 px); üç pano ve başlıklar ilk ekranda; demo ve zorlama kaydı |

QA'nın küçük notlarından bu turda kapananlar: story `f-bloom2` nav kenarında yarım → %83'ten %76'ya; rsvp 390×844'te limon
bağının nav'a 4 px girmesi (lift); rsvp 1280'de sağ kümenin yarı saydam form panelinin arkasından görünmesi (tek sütun);
details 390'da kart ile takvim arasındaki ~130 px boşluk (lift ile takvim ilk ekranda). Dokunulmayanlar: `env_pocket` üst
köşelerindeki kobalt kırıntı (katman sırasında görünmüyor), index'te `decor_br-960` (gerekçe aşağıda #19), rsvp 390'da kartın
bağı ile sağ alt küme limonlarının yakınlığı, home varışında 360×640'ta parçacık doğmaması (cümlede yok).
Bedeli: telefon/yatayda program satırı ya da imza ilk ekranın altına itildiğinde kaydırınca kartın içinde 60–150 px boş kâğıt
kalır (QA kuralının bilinçli karşılığı; aralık ve zorlama kayıtlarında daha sık). Kısa telefonlarda story ilk ekranı başlık +
giriş + duvar olarak kalır (pano 64vw, foto penceresi ≥ 38vw şartı sığmasına izin vermiyor; QA bunu bulgu saymadı).
Bütçe (KiB okuması): `site.js` 35 804 B (IIFE gövdesi bir girinti sola, yorumlar kısaldı), `site.css` 46 039 B (aynı "tam
doldur" kuralları birleşti) — ikisinde de pay ≤ 41 B.

**Kontroller (origin/main birleştirmesi sonrası, bu worktree):** `npm ci`; `npm test` 497/497 (temanın 35 testi; yeni test: iç sayfa fold birimleri, lift, masaüstü
story sırası, çiçek şeridi); `npm run typecheck` temiz; `npm run build` + trace-check geçti (6 tema); `theme-check --theme
mediterranean-lemon --stress` **116 geçti, 0 hata, 0 uyarı** (`previews/g405/` yeniden üretildi; dokun → home 4,51 s; ilk görünüm
DPR 3: index 877 / home 884 KB, fotoğraflarla 971 / 1141 KB; MP4 ilk karesi 218,217,205); `g051-browser --theme mediterranean-lemon` 44/44; `final-smoke --theme mediterranean-lemon` 45/45 (`previews/g405/final/`); `kit_check
--paket 5` 23/23 (hiza sol −0,20 · sağ +0,49 · alt +0,85 %), `--paket 2` 5/5; `validate_content` GEÇTİ, tema demo kaydı
koleksiyonunkiyle bayt bayt aynı; `tools/tests` 9/9 geçti (`test_kit_build` de artık geçiyor). Ölçüm betikleri ve çıktıları
geçici klasörde (m1, m7); kanıt sayfaları `previews/g405/qa3_*.jpg`.
**Denenmedi:** gerçek iPhone/Safari ve Android Chrome (`svh`, `:has`, `backdrop-filter`, belgeler arası VT), Vercel yayını, yavaş
ağ, gerçek alıcı fotoğrafları; qa-kontrol'ün yeniden kontrolü (bu oturumda alt ajan yok) — **görev onaya gitmemeli, qa-kontrol
hedefli yeniden kontrolü** (m1 iç sayfalar × 10 boyut × 3 kayıt + 1280×800 / 1024×768; çiçek ≥ 10 denemede; theme-check
--stress; README/Sonuç'taki iki iddia) yapmalı.

**2026-10-14 · inceleme düzeltmeleri (claude-kod, `work-mediterranean-lemon-fix`) — durum: inceleme (qa-kontrol kapısı açık).**
İncelemenin 22 bulgusu tek tek yeniden üretilip doğrulandı: 19'u düzeltildi, 1'i "değişiklik gerekmez" kaydı, 1'i (qa-kontrol)
bu oturumda yapılamadı, 1'i (theme-check "content change") temanın dışında ve G064 ile zaten çözülmüş. Bütün görseller yine
GPT parçaları; yeni şekil/dekor çizilmedi (K21) — çini çiçeği `frame_portrait`'ten **kırpım**.

| # | Bulgu | Ne yapıldı |
|---|---|---|
| 1, 13 (yüksek) | Hero'nun sağ alt limon kümesi düz yatay çizgiyle kesiliyor (nav bandı / hero sonu) | Küme hero'nun içinde **bütün**: negatif `bottom` ve sönme maskesi kaldırıldı; `bottom` = max(22 px, hero sonu − ilk ekran + nav + 2) → ilk ekranda nav'ın üstünde biter, kaydırınca hiçbir yerde kesilmez (yalnız sağda ekran kenarı). `scripts/theme-check.cjs` yazma alanımda değil → istenen "kırpılan küme" denetimi tema testinde (köşe kümesi kurallarında `mask`/`clip-path` yok; hero kümesi negatif `bottom`suz) ve kendi ölçümümde |
| 2 (yüksek) | story/details/rsvp ilk ekranı düz fildişi | `.page-bg` (100svh): `wall` / `wall_wide` (alt %26 maskeyle söner) + bütün `decor_tl` + `decor_br` (nav'ın üstünde biter) + 3 serbest parça; story'de pano başına iki duvar parçası, karşılıklı; ≥ 1024 px `wall_wide` + sağda `decor_br`; `wash-end` sonda kaldı |
| 3 (orta) | Çiçek parçacıkları isimlerin, kapanış satırının, form alanlarının üstünden geçiyor | Varış ve kapanışta katman bölümün içinde ve **metnin arkasında** (`host`, `.accent-layer.in-host`); yollar yazı sütununun/fotoğrafın yanındaki şeritlerden (`avoid`), şerit yoksa yazının altındaki banttan; kapanışınki yalnız `.closing` kutusunda, forma uzanmaz |
| 4 (orta) | Nav saydam, içerik etiketlerden görünüyor; nav çizgisi takvim haplarını / yatayda başlıkları kesiyor | Etiket satırı `.96–.97` + `backdrop-filter: blur(8px)`; iç sayfalarda `[data-fold]` (details takvim çifti, story panoları nav çizgisini keserse ilk ekranın altından başlar); yatayda iç sayfa üst boşluğu 52 px; nav ortasında ve dress code üstünde `tile_flower` (frame_portrait'in çini karosundan kırpım, `build_images.py` `cini_cicegi`) |
| 5 (orta) | Limon bağı fırıldak gibi 300° dönüp zarfın üstünde sönüyor | Üç vuruş: gevşer (0–350 ms, %5 aşağı, ≤ 7°) → zarfın alt kenarına düşer → yarıçapa uygun yuvarlanır (zarf üstünde ≤ 150°) → ekranın sağından çıkar, zarfın üstünde **sönmez**; kapak 680 ms'de kalkar (bağ çekildikten sonra) |
| 6 (orta) | Kart cepte beklerken yüzler 1 s cep kenarıyla kesiliyor | Kart cepte `top: 60,755 %` (fotoğraf penceresinin ≤ %6'sı görünür; `CARD_PHOTO_ABOVE`), `out`/`front` −97,838 / −94,838 % → çıkış ve öne gelme konumları değişmedi |
| 7 (orta) | Story köşelerinde tek limon "çıkartma" gibi | W1.3 buketi: GPT `divider` (limon + çiçek + yaprak) çerçeve genişliğinin %58'i, ±26°, dış alt köşede + bir accent_2 çiçeği; foto penceresine değmez. Buket ekran kenarından taşar; `.tiles` (tam genişlik) yalnız yatayda kırpar → yalnız ekran kenarı keser |
| 8 (düşük) | Hero kümesi küçük, hap açık mavi iOS düğmesi gibi | Küme `min(58vw, 30svh, 320px)` (comp ≈ %45 genişlik), sağdan taşar; hap koyu kobalt emaye `#2A5DA8 → #1C3F80`, dar gölge, en az 150 px |
| 9 (düşük) | Açılıştaki çiçek fildişi sıvada görünmüyor | 46–54 px, `origin: 'liner'`: kart kenarı ile zarf kenarı arasındaki şeritte kobalt çini astarın üstünden (≥ 0,8 s mavi zeminde); sayı 1, yön aşağı |
| 10 (düşük) | İç sayfalar 01'in yeniden boyanmışı gibi | 2 + 4 ile: iç sayfa duvarı, nav ve dress code'da çini çiçeği. Geri sayım ayırıcısına çiçek konmadı (sade Didone rakamlar yeterli; karar) |
| 11 (düşük) | Masaüstü: hero kartı küçük, iç sayfaların sağı boş | ≥ 1024 px ve ≥ 621 px yükseklikte hero kartı `47svh × .709` (en çok 290 px); iç sayfalarda `wall_wide` + `decor_br` |
| 12 (düşük) | Doğrulanmış olanlar | Değişiklik gerekmez; zarf hizası (kit_check), pencere temizliği, yer tutucular, MP4 ilk karesi yeniden kontrol edildi |
| 14 (yüksek) | Yatay telefonda "Tap to open" ekran dışında (aralık / zorlama kaydı) | `envFit`: sahnenin boş üstü ölçülen başlığın altına (`--pt`), ipucu ilk ekranda bitmiyorsa sahne küçülür (`--ok` ≥ 0,6); yatayda isim sütunu köşe kümelerinin arasında. 9 görünüm (568×320 … 932×430 dahil) × demo/aralık/zorlama: sahne üstü ≥ 0, ipucu ekranda (932×430 aralık 410/430, 568×320 zorlama 311/320) |
| 15 (orta) | 320 px'te "SECONDS" yaprağın üstünde | ≤ 359 px'te geri sayım aralığı 12 px, harf aralığı .14em; ayrıca `decor()` her kümenin 16 × 16 yaprak haritasını (alfa) yazı kutularıyla karşılaştırır, çakışırsa küme küçülür / gizlenir |
| 16 (orta) | Home "The Day" panosunda program satırı yok (docs/11 §3.2) | `.pl-sched`: `data-repeat="schedule"` ilk 4 satır `label · time`; testte |
| 17 (orta) | qa-kontrol incelemesi yapılmadan inceleme | **Yapılamadı**: bu oturumda alt ajan başlatma aracı yok. `compare_*_390.jpg`'leri kendim W1 ile karşılaştırdım; kapı **açık**, görev onaya gitmemeli |
| 18 (düşük) | theme-check "content change" her temada düşüyor | Temanın dışında (`scripts/theme-check.cjs`); G064 ile çözülmüş — bu koşularda "changed content" akışı geçti; yeni görev gerekmedi |
| 19 (düşük) | İlk görünümde ≥ 150 KB WebP'ler; site.css boyutu | `decor_*` 720 varyantı: home 390×844 DPR 3'te 720'leri yükler (121 / 114 KB). index'te `decor_br-960` (187 KB) hâlâ yüklenir: küme 241,8 CSS px = 725 cihaz pikseli (720 %0,7 kısa; 393–430 px telefonlarda da 960 gerekir) — gerekçe: kümenin keskinliği, sayfa toplamı 877 KB ≤ 1,5 MB. Boyutlar KiB okunur (docs/11 §6; tema testi de KiB okur): site.css 45 941 B = 44,86 KiB (≤ 45 KiB = 46 080 B), site.js 35 831 B = 34,99 KiB (≤ 35 KiB = 35 840 B — **9 B pay**; sonraki eklemeden önce sıkıştırma gerekir) |
| 20 (düşük) | `home-invite` son adımı 3040 ms, `sway-*` 2200 ms | `cal` 2860 ms, `sway-*` 1800 ms (docs/11 §8) |
| 21 (düşük) | Zorlama kaydında `&` 8,4 px; hero çiçeği isimlere değiyor | `.amp` `max(11px, .5em)`; `decor()` yazıya / karta / çerçeveye değen `.float`'ı gizler |
| 22 (düşük) | Kart kopyası `venue.city` (docs/11 `venue.city_region`), kasaba boşsa "·" kalıyor | README comp haritasında **sapma** olarak yazıldı (W1.2 yalnız kasabayı yazar); kasaba boşsa ayırıcı da gizlenir (`.kicker:has(.cc-city[data-empty]) .sep`) |

Bu turun kendi theme-check hataları (düzeltildi): story buketleri 360–430 px'te ekran kenarından taşıyor ve kırpan ata yok
(`.tiles { overflow-x: clip }`); taslak önizlemede davet kartı piksel testi %100 "dekor üstünde" — sayfa geneli
`scroll-behavior: smooth` yüzünden theme-check'in `scrollTo(0, 0)`'ı 250 ms'de bitmiyor, yapışkan "Preview" şeridi kart
görüntüsünün ortasına düşüyordu → yumuşak kaydırma yalnız RSVP'nin `#reply` atlaması için (`html:has(#reply)`, azaltılmış
harekette kapalı). Ölçüm (5 sayfa × 11 görünüm × demo/aralık/zorlama = 165 ilk ekran; yazı-gizli / dekor-gizli fark): hiçbir
yazı satırının altında dekor pikseli yok. Açılış kareleri: gevşeme / düşme / yuvarlanma / çıkış ve astar üstündeki çiçek görüldü.

**Kontroller (origin/main birleştirmesi sonrası, 2026-10-14):** `npm ci`; `npm test` 481 test, 479 geçti, 0 hata (2 atlandı;
temanın 34 testi dahil); `npm run typecheck` temiz; `npm run build` + trace-check geçti; `theme-check --theme mediterranean-lemon
--stress` **116 geçti, 0 hata, 0 uyarı** (taslak önizleme, nav VT 390×844 / 360×640, değişen içerik dahil; `previews/g405/`
yeniden üretildi); `g051-browser` 44/44; `final-smoke` 45/45 (`previews/g405/final/`); `kit_check --paket 5` 23/23, `--paket 2` 5/5
(hiza sol −0,20 · sağ +0,49 · alt +0,85 %); `tools/tests` hepsi geçti, yalnız `test_kit_build.py` düşüyor — 02 koleksiyonunda
`moment_*.jpg` yok (bu görevle ilgisiz, önceden de böyle). İlk görünüm (390×844, DPR 3): index 877 KB · home 884 KB (yer tutucu),
örnek fotoğraflarla 971 / 1141 KB. Dokun → home 4,1–4,4 s (makine yükü; bu koşuda başka ajanın theme-check'i de çalışıyordu).
Tema klasörü 2,30 MB (≤ 3 MB). Bir ara koşuda "nav VT 390×844" bir kez düştü; aynı akışı 8 kez ayrı koştum, hep 0,00 % fark —
yük altında zamanlama kaynaklı tek seferlik sonuç olarak not edildi, son koşuda geçti.
**Denenmedi:** gerçek iPhone/Safari ve Android Chrome (`:has`, `backdrop-filter`, `svh`, belgeler arası VT), yayın, qa-kontrol.

İlk tur metninde (aşağıda) artık geçersiz olanlar: "gezinme ve dress code'daki çini çiçeği yok" (artık var), story "köşelerinde
küçük limon" (artık `divider` buketi), "site.css (45,5 KB)", "30 test" (şimdi 34), ilk görünüm ağırlıkları (yukarıdaki satır).

**2026-10-14 · wf-tema05 (claude-kod) — durum: inceleme.** Ayrıntı ve comp öğe haritası: `platform/themes/mediterranean-lemon/README.md`.

**Ne yapıldı**
- `platform/themes/mediterranean-lemon/`: `theme.json` (5 sayfa, 5 foto anahtarı; oranlar manifest `box_px`), `content.demo.json`
  (koleksiyon kaydının birebir kopyası), `index/home/story/details/rsvp.html`, `site.css` (45,5 KB), `site.js` (`MOTION`,
  `ENVELOPE_GEOMETRY`, `fitNames`/`fold`/`fitCopy`, `DEV_CONTENT`), `build_images.py`, `README.md`, `img/` (WebP + maskeler + og +
  favicon + `manifest.json`). Klasör 2,05 MB (≤ 3 MB); kaynak PNG / `img_src` / önizleme yok.
- `platform/tests/theme-mediterranean-lemon.test.ts` (30 test: §13.2'nin 23 maddesi bu temaya uyarlanmış + kapanışın kapaktan ayrı
  oluşu, zarf/landing/replay, telefon zemini + yer tutucular + yeşil denetimi, story pano düzeni, home, tasarım aralığı, rotalar,
  gizlilik). `platform/previews/g405/`: theme-check çıktıları (5 genişlik, kısa telefonlar, yatay, aralık, zorlama, yer tutucu,
  değişen içerik, yanıt gönderildi), `compare_<sayfa>_390.jpg` (W1 | tema), `opening_390x844.mp4`, `compare_closure.jpg`,
  `cuts_envelope.jpg`.
- **Açılış** (kapaklı zarf, §7.1 + §7.3; katalog cümlesindeki sıra): dokununca limon bağı gevşer ve V'nin ucundan düşüp sağa
  **yuvarlanarak** gider (kapaktan ayrı katman, 0–1,3 s) → beyaz fisto kapak menteşede kalkar (560 ms'de), 90°'de çini astarlı açık
  kapağa el değiştirir ve yukarı açılır → kart cepten yükselirken sol üst köşedeki limon dalı içeri sallanır (dal sahnenin kendi
  `decor_tl` katmanı) ve tek limon çiçeği (accent_2 × 1, `drift`) kartın yanından süzülür → kart öne gelir (× 1,04) → VT ile home
  kartına. Dokun → home 4,12 s; Skip her an; reduced motion'da dokunuş animasyonsuz doğrudan home'a geçer.
- **Story:** üç çini çerçeveli portre basamaklı sütunda (sol, sağ, sol), dimdik, üst üste binmeden; her biri görünüme girince dış
  kenarı üzerinde 72°'den dönerek duvara oturur (`turn-l`/`turn-r`), sonra başlık ve duvardaki yaprak/çiçek. Telefonda pano 64vw,
  pencere **38,7vw**; ≥ 720 px comp'un iki sütunlu basamağı.

**GPT parçaları (G205) — sorunlar ve kodla çözüm (çizim yok)**
1. frame_portrait / frame_landscape pencerelerinde yarı saydam koyu lekeler → `leke_doldur`; `manifest.checks.windows_transparent` hepsi 0.
2. Pencere çevresinde pembe/kırmızı ayrıştırma saçağı, yatay çerçevede pencereye taşan dal ucunda kırmızı saçak → çerçeve/yaprak
   renginden temizlik (README "GPT kusurları").
3. Yatay çerçeve penceresi ≈ 1,86:1 (hedef 3:2) → `object-fit: cover`; örnek `venue.jpg` ile önizlemede kontrol edildi (villa, teras, deniz görünüyor).
4. Kapak kesimi: `tema_build.kapak_kes("v")` beyaz→mavi düşüşünü bulup kobalt fisto çizgisinin **üstünden** keserdi → bu temada
   en alt kobalt pikseline göre kesim (sıçrama ≤ 24 px, eksik sütun ≤ %3 sert denetim). Ön cep: `cep_kes("v")` sivri V buldu, parça
   trapez → `trapez_cep_kes` (astarın en alt renkli pikseli, alt zarf doğruları).
5. Açık zarf kapalıdan ~%1 geniş, ~%3 uzun → ölçülen ölçek + öteleme (`manifest.stage.align_fix`); kit_check hiza sol −0,20 ·
   sağ +0,49 · alt +0,85 % (±%1 içinde).
6. `tema_build.yesil_gorunur` canlı limon yapraklarını "görünür #00FF00" sayıyor → tema içi `kroma_yesil` (parlak kroma yeşili her
   WebP'de 0); tema_build sayıları manifest'te açık yazılı. **Sapma**, gerekçe README'de.
7. frame_portrait'in altında başlık boşluğu yok (W1.3'te başlık çerçevenin içinde) → başlık panonun altında, duvarda.
- **Önerilen prompt düzeltmeleri (gpt-gorsel, G205 revizyonu ya da sonraki 05 turu):** frame_landscape penceresi tam 3:2;
  pencere kenarında #00FF00/pembe saçak ve yarı saydam leke bırakmamak; W1.2 gezinme ortasındaki ve W1.4 dress code üstündeki küçük
  çini çiçeği için ayrı `tile_flower` parçası; W1.3 köşelerindeki limon + çiçek demeti için `accent_bouquet`; açık ve kapalı zarf
  aynı tuval ölçüsünde (açık gövde ~%3 uzun geliyor).

**Comp sapmaları** (README haritası): geri sayım kutuları yerine sade Didone rakam (kutular CSS çerçeve olurdu, K21); gezinme ve
dress code'daki çini çiçeği yok (parça yok); details satır arası dalın iki yanındaki çizgiler yok; story başlığı panonun altında ve
telefonda tek sütun basamaklı; telefon zemini bg_page'in çiçeksiz kırpımlarından (2:3 tuval telefonda kümeleri keserdi); home'da
comp'u olmayan bölümler (davet kartı, takvim, iki çini pano, kapanış) bu tasarımın parçalarıyla.

**Kontroller (bu worktree, 2026-10-14)**
- `kit_check --paket 5` 23/23, `--paket 2` 5/5 (hiza sol −0,20 · sağ +0,49 · alt +0,85 %).
- `build_images.py`: pencere şeffaflığı: bütün çerçeve/kart WebP'lerinin penceresinde 0 görünür piksel, parlak kroma yeşili 0, kapak kesimi sıçrama 23 px
  (≤ 24), cep kenarının > 3 px altında 1 astar noktası, yer tutucular en koyu ≥ 175 / sarı-yeşil ≤ 24.
- `npm test` 329/329 (temanın 30 testi dahil), `npm run typecheck` temiz, `npm run build` + trace-check geçti (birleştirme öncesi).
- `theme-check --theme mediterranean-lemon --stress`: **114 geçti, 0 hata, 0 uyarı** (360/390/430/768/1280; 360×640, 375×553,
  844×390, 667×375; tasarım aralığı + §12 zorlama kaydı; yer tutucu, değişen içerik, taslak, yanıt akışı; MP4). Bir önceki koşuda
  story köşe limonları 360–430 px'te kenardan 2–3 px taşıyordu → panolar 1,5vw içeri alındı, yeniden koşuldu.
- `tests/g051-browser.ts --theme mediterranean-lemon` 44/44; `tests/final-smoke.ts --theme mediterranean-lemon` 42/42
  (`previews/g405/final/`).
- İlk görünüm (390×844, DPR 3): index 937 KB · home 1007 KB (yer tutucu; ≤ 1,5 MB); örnek fotoğraflarla index 1031 KB · home 1263 KB.
  `opening_390x844.mp4` ilk karesi beyaz değil (ortalama 218, 217, 205).
- Kontrast (kendi ölçümüm; metnin arkasındaki oluşmuş piksellerin medyanı ve en kötü %10'u, 390 / 844×390 / 1280): görünen her metin
  ≥ 4,5:1 (büyük el yazısı ≥ 3:1); beyaz yazı / kobalt hap 5,5–7,9:1.
- Aksanlı isimler: "Zoë Łucja Ağır & Matías Søren Çelik" Allura + Playfair Display latin-ext alt kümeleriyle çiziliyor (elle
  denendi; theme-check kayıtlarında aksanlı ad yok).

- **origin/main ile birleştirme sonrası (G060 panel v2, G061 pazarlama dahil):** `npm ci`, `npm test` 378/378 (G404 de
  birleşince 408/408), `npm run typecheck` temiz, `npm run build` + trace-check (5 tema; bu tema dahil) geçti; `g051-browser` 44/44, `final-smoke` 44/44 (`previews/g405/final/`
  yeni panel ekranlarıyla yenilendi). `theme-check --stress --no-video` (çıktı geçici klasöre): 107 geçti, **1 hata "content
  change"** — G064 Sonuç'ta belgelenen ortak sorun: kontrol yayınlanmış demo sitenin isim ve tarihini değiştirip yeniden yayınlıyor,
  G060'ın kimlik koruması `publishSite`'ta `IdentityMismatchError` ile reddediyor (temadan bağımsız; `scripts/theme-check.cjs`
  yazma alanımda değil). Birleştirme öncesi aynı akış geçiyordu (114/0).

**qa-kontrol:** ayrı `qa-kontrol` alt ajanı çalıştırılmadı (bu oturumda alt ajan başlatma aracı yoktu). `compare_*_390.jpg`'leri
kendim W1 ile karşılaştırdım (yerleşim, tipografi, süs konumları tutuyor; sapmalar yukarıda). Bitti şartındaki "qa-kontrol
incelemesinden geçti" maddesi bu yüzden **açık**; inceleme aşamasında yapılmalı.

**Denenmedi:** gerçek iPhone/Safari ve Android Chrome (`svh`, `mask`, `:has`, belgeler arası view transition), Vercel yayını,
gerçek alıcı fotoğrafları (farklı oran/ışık), yavaş ağ.

**Önerilen yeni görevler**
- claude-kod (theme-check, G052 hattı): "home first screen" akışı ilk ekranın altındaki sahneleri açmadan (revealAll yok) kart
  piksel testini yapıyor; opaklıkla giren kartta kartın değil zeminin pikselleri ölçülüyor → sahte "card text over painted decor".
  Bu tema kartları hep opak girerek atlattı; düzeltme: pageChecks'ten önce revealAll ya da `.in` beklemek.
- claude-kod: stres/aralık kayıtlarına aksanlı isim (latin-ext) eklemek; §15'teki "aksanlı isim fontu" maddesi şimdilik elle
  kontrol ediliyor (bu temada "Zoë Łucja Ağır & Matías Søren Çelik" Allura + Playfair latin-ext ile çiziliyor).
- gpt-gorsel: yukarıdaki prompt düzeltmeleri.

## Günlük
- 2026-10-13 blokaj: K22 (kullanıcı, 2026-10-13): videodan çıkıldı, ürün yalnız mobil öncelikli website. Yeni website standardı pilotla (G035) belirlenince yeniden tanımlanacak
- 2026-10-13 yeniden tanımlandı (K22–K24, G033)
- 2026-10-14 alindi: wf-tema05
- 2026-10-14 bitti, incelemeye gönderildi
- 2026-10-14 inceleme düzeltmeleri (22 bulgu: 19 düzeltildi, 1 değişiklik gerekmez, qa-kontrol yapılamadı, content change G064'te çözülmüş); theme-check --stress 116/0/0, g051 44/44, final-smoke 45/45; durum inceleme, qa-kontrol kapısı açık
- 2026-10-14 qa-kontrol: KOŞULLU (3 önemli must_fix: iç sayfalarda nav çizgisi yazıyı kesiyor, açılış çiçeği telefonlarda doğmuyor, masaüstü story ilk ekranı yarı boş) → üçü düzeltildi (fold birimleri + lift, çiçek şeridi, masaüstü üç pano sırası, RSVP masaüstü tek sütun); m1 126/126, çiçek 129/130 (+ düzeltilmiş betikle 20/20, zorlama 25/25), theme-check --stress 116/0/0, g051 44/44, final-smoke 45/45, npm test 497/497; durum inceleme, qa-kontrol yeniden kontrolü bekliyor
