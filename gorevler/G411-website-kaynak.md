---
id: G411
baslik: Tasarım 11 Boho Pampas Terracotta — platform teması
rol: claude-kod
durum: inceleme
alan: claude-local-G411
oncelik: 3
bagimli: [G211, G038, G046, G052]
yazar: [platform/themes/boho-pampas-terracotta/, platform/tests/theme-boho-pampas-terracotta.test.ts, platform/previews/g411/]
---

## Amaç
Tasarım 11'i platformda tema olarak kurmak (K24, `docs/10_SITE_PLATFORMU.md`): kapalı zarf açılış sayfası → home → story, details, rsvp; yalnız bu tasarımın GPT parçalarıyla (K21), kişisel metin HTML'de. **Kurallar `docs/11_TEMA_STANDARDI.md`'dedir; bu görev metniyle çelişirse docs/11 geçerlidir.**

## Girdiler
- Tema standardı: `docs/11_TEMA_STANDARDI.md` — bütünü; zarf tipi **kapaklı zarf** → §7.1 + §7.3; bitti tanımı §13, kontrol listesi §15
- Platform sözleşmesi: `platform/README.md` (işaretler, RSVP form sözleşmesi, `#site-data`); çalışan örnek `platform/themes/blush-garden-rose/` — **yalnız** işaret/RSVP/`#site-data`/oturum anahtarı kullanımı için; yerleşimi, aralıkları, süs konumları ve zamanlaması bu temaya taşınmaz (docs/11 §8). G035 kaynağı (`collections/03_Blush_Garden_Rose/website/`) örnek değildir
- GPT çıktıları (G211): `collections/11_Boho_Pampas/assets/gpt/comps/` (W1, yerleşim referansı, satılmaz; yalnız sade adlar — `_vN` denemedir), `parts/` (katmanlar), `photos/` (örnek fotoğraflar)
- İçerik `collections/11_Boho_Pampas/content.demo.json`, renk `collections/11_Boho_Pampas/palette.json`, özet `collections/11_Boho_Pampas/DESIGN_BRIEF.md`
- Araçlar: `tools/parts_prep.py` (geçici klasöre; docs/11 §5.3), `python3 tools/kit_check.py collections/11_Boho_Pampas --paket 5`, `node scripts/theme-check.cjs --theme <slug>` (G052)

- **G211 açık kusurları:** çerçeve pencerelerinde koyu/yarı saydam lekeler → pencere kodla tam maske (parts_prep `leke_doldur`); paket 3 oturumda tamamlandı, parçalar arası tutarlılığı (zarf/kapanış/açık zarf) hiza kontrolüyle doğrula.

## Yapılacaklar
1. `theme.json`, 5 sayfa, `site.css`, `site.js`, `build_images.py`, `README.md` docs/11 §1–§4 düzeninde. 03'ten yalnız platform sözleşmesi alınır (motor işaretleri, RSVP formu, `#site-data`, slug'lı oturum anahtarları, `data-scene`/`data-step`/`data-a` kancaları); yerleşim, tipografi ve hiyerarşi bu tasarımın W1 comp'larından — tema `README.md`'sinde sayfa başına **comp öğe haritası** (her W1 öğesi → şablon öğesi ya da gerekçeli sapma; comp'u olmayan bölümler bu tasarımın parçaları ve tipografisiyle, docs/11 §8).
2. Parçalar: `python3 platform/themes/boho-pampas-terracotta/build_images.py` → `parts_prep` **geçici klasöre** (`--prep-dir`; tema klasörüne, `img_src/`'ye ya da `assets/`'e asla — docs/11 §1, §5.3–§5.4), tip kesimleri (§7), maskeler, `free_zone`, yer tutucular, og; WebP + srcset genişlikleri (§5.1, §5.5). Yalnız bu tasarımın GPT parçaları; yeni şekil/dekor çizme (K21).
3. Zarf açılışı (`MOTION.envelope`, kapaklı zarf, docs/11 §7.1 + §7.3): On tap, the pampas-and-palm tie slips off, the arch flap folds upward, and the card slides slowly up out of the arch like a rising sun while a pampas plume sways in from the side. Katalog: Kemer biçimli terrakota cep; kart kemerden yukarı kayar. Açılış cümlesindeki sıra, sayı ve yön bağlayıcıdır; kapanış elemanı, zarf/kapak ve kart ayrı katmanlar; kart home'daki karta dönüşür; `closure.png` kare tuvalde büyük çizilir; yeri kesim geometrisine bağlanır (`manifest.closure`, docs/11 §7.1).
4. Sayfa koreografisi (`MOTION.scenes`): her sayfada öğeler sırayla girer. Story: Terrakota ve kum renkli üst üste kemer şekilleri içinde, gökkuşağı gibi açılır (three separate tall arch frames standing side by side with clear space between them, the middle one tallest and slightly in front; each frame is made of two nested bands like a small boho rainbow and has its own photo window); telefonda foto penceresi ≥ 38vw (sığmazsa basamaklı/alt alta düzen, comp sapması olarak yazılır — docs/11 §9). Parçacıklar `MOTION.accents` (§8: tür başına dosya ve yol). Details/rsvp: kart, satırlar ve buton sırayla.
5. Foto alanları: `hero_portrait` (card_small penceresi), `story_1..3` (frame_portrait), `venue` (frame_landscape); kutu ve maske `windows.json`'dan (§5.6, §9). PAKET 2 fotoğrafı yoksa yer tutucu.
6. Fontlar: Sacramento + Josefin Slab (Google Fonts link'i; repoya font dosyası girmez). Tarih motor biçimiyle (`May 15, 2027`). Link blokları `data-if="urls.*"` ile linksiz kalkar — "link will be added soon" diyen ölü düğme yok (§4).
7. Testler ve önizleme (§13): `platform/tests/theme-boho-pampas-terracotta.test.ts`; `theme-check --theme boho-pampas-terracotta` (5 genişlik, kısa telefonlar, akışlar, ağırlık, MP4); `platform/previews/g411/` (W1 comp | tema karşılaştırmaları dahil).

## Bitti sayılması için
- [x] docs/11 §15 kontrol listesi tamam (atlanan madde Sonuç'ta gerekçesiyle)
- [x] `npm test`, `npm run typecheck`, `npm run build` (trace-check) geçti; `tests/theme-boho-pampas-terracotta.test.ts` (§13.2)
- [ ] `theme-check --theme boho-pampas-terracotta` hatasız; `previews/g411/` + `compare_<sayfa>_390.jpg` qa-kontrol incelemesinden geçti
- [ ] Sonuç dürüst: açılış ve story tarifi, comp sapmaları, denenmeyenler (gerçek iPhone/Safari, yayın), sorunlu GPT parçaları

## Sonuç
**2026-10-15 · claude-local-G411 — durum: inceleme (qa-kontrol kapısı AÇIK, aşağıda).** Görsel çizilmedi (K21): bütün görseller
tasarım 11'in GPT parçaları; kod yalnız kesti, maskeledi, ölçekledi, yerleştirdi.

**Dosyalar:** `platform/themes/boho-pampas-terracotta/` (`theme.json` 5 sayfa + 5 foto alanı + 75 standart copy anahtarı,
`content.demo.json` koleksiyon kaydının bayt bayt kopyası, `index/home/story/details/rsvp.html`, `site.css` 45 KB sınırı içinde,
`thank-you.css`, `site.js`, `build_images.py`, `README.md` — comp öğe haritası, zarf kesimi, sapmalar, sınırlar — `img/` 47 WebP +
maskeler + og + favicon + manifest; klasör 2,50 MB); `platform/tests/theme-boho-pampas-terracotta.test.ts` (29 test);
`platform/previews/g411/` (theme-check çıktıları, `compare_<sayfa>_390.jpg`, `compare_closure.jpg`, `cuts_envelope.jpg`,
`opening_390x844_frames.jpg`, `checks.json`).

**Açılış:** dokununca pampas-palmiye bağı kemer kapağın kenarından kayıp düşer → kemer kapak üst kenarında yukarı katlanır (90°'de
astarlı kemer omuzdan kalkar) → kart cepten yavaşça, doğan güneş gibi kemerin üstüne yükselir, bu sırada tek bir pampas tüyü soldan
sallanarak ön cebin üstünden geçer → kart öne gelir ve home kartına uçar (go 4140 ms). **Story:** üç kemer çerçeve, ortadaki en büyük
ve önde; her biri tabanından dışa doğru "gökkuşağı gibi" açılır (GPT çerçeveye clip-path daire), önce ortadaki, sonra yanındakiler,
sonra başlıklar yazılır; telefonda basamaklı (sol · sağ · sol, pencere 40vw), ≥ 720 px comp dizilişi.

**Kesim ve hiza:** kemer kapak `tema_build.kapak_kes("egri")` (renk, artık sd 0,7 px). `cep_kes("egri")` bu görselde geometrik yedeğe
düştü → temada kendi kemer cep kesimi (astar → ilk terrakota satırı + yan kanatlarda açık şerit, 4. derece, artık p50 0,26 px).
`kit_check --paket 5` 23/23 (hiza sol −0,29 · sağ +0,39 · alt +1,04 %), `--paket 2` 5/5. GPT açık zarfı ~200 px uzun çizmiş: açık
katmanlar dikeyde × 0,824 (açık boğum = kapalı omuz, alt kenarlar aynı; üst kenar farkı 9 px) — `manifest.stage.hinge_align`.
Kapanış comp'ta ölçüldü (yükseklik/zarf genişliği 0,730; uç = kapak kenarının en alt noktası) — `compare_closure.jpg` comp'la örtüşüyor.
Bağın ortası boş mühür değil → monogram yok (README'de gerekçe).

**Comp sapmaları (README haritasında):** geri sayım kutuları → sade rakam (K21); kart kopyası tarih+şehir tek satır yerine ayrı satır,
sığmazsa şehir/script düşer; story telefonda yan yana yerine basamaklı (≥ 38vw); home gün kutucuğunda program satırları kartın üstüne
değil yanına (uzun kayıtta 3 dilim kart alt pampasını satırlara taşıyordu); kısa telefonda (≤ 700 px) hero'nun sağ alt kümesi gizli
(geri sayıma biniyordu); telefonda zemin `bg_page`'in iki küme arası şeridi (alt kemer gölgeleri kırpılır).

**Komutlar:** tema testi 29/29; `copy-manifest --check` temiz (75 anahtar, işaretsiz metin yok); `npm run typecheck` temiz;
`npm run build` + trace-check geçti (tema dahil). `npm test` (origin/main üstüne rebase sonrası, symlink ön yüklemesiyle): **874 test, 861 geçti, 0 hata, 13 atlandı**. `g051-browser --theme` **44/44**.
`theme-check --theme boho-pampas-terracotta --stress --no-video` (3. tur, kurulu Chrome + playwright-core, port 3411): **102 geçti,
4 hata, 0 uyarı** — bütün sayfa/genişlik (360–1280), kısa telefon (zarf yazıları düz zeminde), ilk ekran, zorlama kaydı, teşekkür modu,
G068/G075, köşe kümesi, ağırlık denetimleri geçti. 4 hata: (1) `content change` — theme-check'in Windows'ta `c:` yolunu ESM URL'sine
çevirmemesi (araç hatası, tema değil); (2) azaltılmış hareket 2063 ms > 1500 (1. turda geçti); (3) envelope→home'da `invite-card`
bulunamadı (1. ve 2. turda geçti, kart opaklık 1 ile indi; 3. turda dokun→home 11,7 s sürdü — makinede aynı anda başka oturumların
build/test'i vardı, Chrome 4 s'yi aşan belgeler arası geçişi iptal eder); (4) draft preview'de `page.check` zaman aşımı (2. turda geçti;
statik önizlemede de radyo seçilebiliyor). 2–4 yük altındaki zamanlama akışları; sakin makinede yeniden koşulmalı.
3. turdan sonra yalnız köşe kümelerine 720 px varyant + açılış çizelgesi ≈ 0,3 s kısaltma yapıldı (tema testi yeniden 29/29), 4. tur
koşulmadı. İlk görünüm (390×844 DPR 3, 3. tur, 720 px'ten önce): index 1142 / home 1050 KB yer tutucuyla, 1242 / 1272 KB örnek
fotoğraflarla (≤ 1,5 MB); o turda `decor_tl-960` 224 KB idi (> 200 KB) → 720 px varyantı eklendi (135 KB). Dokun→home 5,7 s (1–2.
tur, yük altında, go 4,42 s iken; şimdi go 4,14 s). Kontrast boyalı zeminin koyu %5 pikseline göre: gövde 6,35:1, script 4,79:1,
küçük büyük harf 4,96:1, hap düğme 5,32:1.

**Denenmedi:** MP4 kaydı (ffmpeg ve Playwright video bileşeni bu makinede yok; indirme yapılmadı) → yerine `opening_390x844_frames.jpg`
kare dizisi; gerçek iPhone/Safari ve Android Chrome; Vercel yayını; gerçek alıcı fotoğrafları; yavaş ağ; `final-smoke --theme`.
**qa-kontrol kapısı (§13.4) yapılamadı:** alt-ajan haftalık kullanım sınırına takılıp incelemeyi bitiremedi → görev onaya gitmeden
qa-kontrol `compare_*_390.jpg` + README haritasını incelemeli.

**Sınırlar / GPT parçaları:** Josefin Slab yalnız `latin` (Latin-1 aksanları var; ł ş ğ yedek fonta düşer; isimler Sacramento'da
latin-ext). Zarf katmanları 648 px'te (GPT tuvali), DPR 3'te büyütülür. `frame_portrait`/`frame_landscape` pencere lekeleri parts_prep
`leke_doldur` ile tam maskelendi (kontrol geçti). Önerilen prompt düzeltmesi (`tools/katalog.py WEB[11]`, entegratör): açık zarfın kapalı
zarfla aynı yükseklikte ve aynı omuz çizgisinde çizilmesi ("the open pocket keeps the closed pocket's silhouette: same shoulders and
bottom edge") — şimdi ölçekle düzeltildi.
**Önerilen görevler (entegratör açar):** (a) `tests/g068-copy.test.ts` ve `tests/g075-thank-you.test.ts` THEMES listelerine
`boho-pampas-terracotta` eklensin (yazma alanım değil; eşdeğer denetimler tema testinde #24 ve G075 olarak var); (b) theme-check
`content change` akışının Windows `file://` düzeltmesi (claude-kod); (c) qa-kontrol G411 kapısı.

## Günlük
- 2026-10-13 blokaj: K22 (kullanıcı, 2026-10-13): videodan çıkıldı, ürün yalnız mobil öncelikli website. Yeni website standardı pilotla (G035) belirlenince yeniden tanımlanacak
- 2026-10-13 yeniden tanımlandı (K22–K24, G033)
- 2026-10-15 alindi: claude-local-G411
- 2026-10-15 bitti, incelemeye gönderildi
