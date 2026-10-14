---
id: G402
baslik: Tasarım 02 Dusty Blue & Champagne — platform teması
rol: claude-kod
durum: inceleme
alan: wf-tema02
oncelik: 3
bagimli: [G202, G038, G046, G052]
yazar: [platform/themes/dusty-blue-champagne/, platform/tests/theme-dusty-blue-champagne.test.ts, platform/previews/g402/]
---

## Amaç
Tasarım 02'i platformda tema olarak kurmak (K24, `docs/10_SITE_PLATFORMU.md`): kapalı zarf açılış sayfası → home → story, details, rsvp; yalnız bu tasarımın GPT parçalarıyla (K21), kişisel metin HTML'de. **Kurallar `docs/11_TEMA_STANDARDI.md`'dedir; bu görev metniyle çelişirse docs/11 geçerlidir.**

## Girdiler
- Tema standardı: `docs/11_TEMA_STANDARDI.md` — bütünü; zarf tipi **kapaklı zarf** → §7.1 + §7.3; bitti tanımı §13, kontrol listesi §15
- Platform sözleşmesi: `platform/README.md` (işaretler, RSVP form sözleşmesi, `#site-data`); çalışan örnek `platform/themes/blush-garden-rose/` — **yalnız** işaret/RSVP/`#site-data`/oturum anahtarı kullanımı için; yerleşimi, aralıkları, süs konumları ve zamanlaması bu temaya taşınmaz (docs/11 §8). G035 kaynağı (`collections/03_Blush_Garden_Rose/website/`) örnek değildir
- GPT çıktıları (G202): `collections/02_Dusty_Blue/assets/gpt/comps/` (W1, yerleşim referansı, satılmaz; yalnız sade adlar — `_vN` denemedir), `parts/` (katmanlar), `photos/` (örnek fotoğraflar)
- İçerik `collections/02_Dusty_Blue/content.demo.json`, renk `collections/02_Dusty_Blue/palette.json`, özet `docs/09_TASARIM_KATALOGU.md` (satır 02) ve `collections/02_Dusty_Blue/COLLECTION_STATUS.md`
- Araçlar: `tools/parts_prep.py` (geçici klasöre; docs/11 §5.3), `python3 tools/kit_check.py collections/02_Dusty_Blue --paket 5`, `node scripts/theme-check.cjs --theme <slug>` (G052)

## Yapılacaklar
1. `theme.json`, 5 sayfa, `site.css`, `site.js`, `build_images.py`, `README.md` docs/11 §1–§4 düzeninde. 03'ten yalnız platform sözleşmesi alınır (motor işaretleri, RSVP formu, `#site-data`, slug'lı oturum anahtarları, `data-scene`/`data-step`/`data-a` kancaları); yerleşim, tipografi ve hiyerarşi bu tasarımın W1 comp'larından — tema `README.md`'sinde sayfa başına **comp öğe haritası** (her W1 öğesi → şablon öğesi ya da gerekçeli sapma; comp'u olmayan bölümler bu tasarımın parçaları ve tipografisiyle, docs/11 §8).
2. Parçalar: `python3 platform/themes/dusty-blue-champagne/build_images.py` → `parts_prep` **geçici klasöre** (`--prep-dir`; tema klasörüne, `img_src/`'ye ya da `assets/`'e asla — docs/11 §1, §5.3–§5.4), tip kesimleri (§7), maskeler, `free_zone`, yer tutucular, og; WebP + srcset genişlikleri (§5.1, §5.5). Yalnız bu tasarımın GPT parçaları; yeni şekil/dekor çizme (K21).
3. Zarf açılışı (`MOTION.envelope`, kapaklı zarf, docs/11 §7.1 + §7.3): On tap, the dusty blue wax seal breaks free and falls away, the V flap opens upward to reveal the gold damask liner, and the card rises from behind the front pocket while a single eucalyptus leaf drifts down. Katalog: Fildişi V kapaklı zarf, pudra mavisi mum mühür; desenli astar görünür, kart cebin arkasından yükselir. Açılış cümlesindeki sıra, sayı ve yön bağlayıcıdır; kapanış elemanı, zarf/kapak ve kart ayrı katmanlar; kart home'daki karta dönüşür; `closure.png` kare tuvalde büyük çizilir; yeri kesim geometrisine bağlanır (`manifest.closure`, docs/11 §7.1).
4. Sayfa koreografisi (`MOTION.scenes`): her sayfada öğeler sırayla girer. Story: Üç anlık baskı (instant print) sırayla uçarak yerleşir (three instant-photo prints scattered across the page at gentle angles, touching only at their white borders so every green window stays fully visible, as if each had just flown in and settled one after another); telefonda foto penceresi ≥ 38vw (sığmazsa basamaklı/alt alta düzen, comp sapması olarak yazılır — docs/11 §9). Parçacıklar `MOTION.accents` (§8: tür başına dosya ve yol). Details/rsvp: kart, satırlar ve buton sırayla.
5. Foto alanları: `hero_portrait` (card_small penceresi), `story_1..3` (frame_portrait), `venue` (frame_landscape); kutu ve maske `windows.json`'dan (§5.6, §9). PAKET 2 fotoğrafı yoksa yer tutucu.
6. Fontlar: Pinyon Script + Cormorant Garamond (Google Fonts link'i; repoya font dosyası girmez). Tarih motor biçimiyle (`May 15, 2027`). Link blokları `data-if="urls.*"` ile linksiz kalkar — "link will be added soon" diyen ölü düğme yok (§4).
7. Testler ve önizleme (§13): `platform/tests/theme-dusty-blue-champagne.test.ts`; `theme-check --theme dusty-blue-champagne` (5 genişlik, kısa telefonlar, akışlar, ağırlık, MP4); `platform/previews/g402/` (W1 comp | tema karşılaştırmaları dahil).

## Bitti sayılması için
- [ ] docs/11 §15 kontrol listesi tamam (atlanan madde Sonuç'ta gerekçesiyle)
- [ ] `npm test`, `npm run typecheck`, `npm run build` (trace-check) geçti; `tests/theme-dusty-blue-champagne.test.ts` (§13.2)
- [ ] `theme-check --theme dusty-blue-champagne` hatasız; `previews/g402/` + `compare_<sayfa>_390.jpg` qa-kontrol incelemesinden geçti
- [ ] Sonuç dürüst: açılış ve story tarifi, comp sapmaları, denenmeyenler (gerçek iPhone/Safari, yayın), sorunlu GPT parçaları

## Sonuç
**Yapıldı (2026-10-14, wf-tema02).** `platform/themes/dusty-blue-champagne/` (theme.json, content.demo.json = koleksiyon kaydı
birebir, 5 sayfa, site.css 45 664 B (≤ 45 KiB), site.js 35 558 B (≤ 35 KiB), build_images.py, README.md, img/ 52 dosya; klasör 1,92 MB),
`platform/tests/theme-dusty-blue-champagne.test.ts` (§13.2'nin 23 maddesi + zarf, VT, story, home, qa dersleri, tasarım aralığı:
29 test), `platform/previews/g402/`. Ayrıntı ve ölçümler tema `README.md`'sinde.

- **Açılış:** dokununca tozlu mavi mum mühür kopup (0 ms) dönerek ekranın altından düşer, V kapak yukarı açılır, altın damask
  astar görünür, kart ön cebin arkasından yükselir; bu sırada tek okaliptüs yaprağı kartın yanından süzülür (accent_1 × 1,
  `fall`, fotoğrafın üstünden geçmez), kart öne gelir ve view transition ile home hero kartına uçar (dokun → home 4,2 s; ölçülen
  4,6 s; Skip her an). Mühür kapaktan ayrı katman (`carried_by_flap: false`), yeri V ucuna bağlı, boyu W1.1 comp'tan
  (`compare_closure.jpg`).
- **Story:** üç anlık baskı sırayla (her biri kendi sahnesi) yandan/alttan uçup hafif taşmayla −4,5° / +4° / −2,5° oturur,
  başlıklar baskının alt kenar boşluğuna yazılır; baskılar yalnız beyaz kenarlarından biner. Telefonda basamaklı sütun (pencere
  50vw ≥ 38vw), ≥ 760 px'te comp dizilişi.
- **GPT kusurları build'de temizlendi (çizim yok):** geniş yarı saydam hâle/sis (zarf ~90 px, kartlar ~140 px), suluboya
  kümelerde renk saçağı, divider'da turuncu/yeşil ışıma, pencere çevresinde ayrıştırma saçağı, WebP kenar saçağı; görünür yeşil
  0 px. bg_tile dikişsiz değildi (640 px'te 1 px ek izi) → yarım kaydırma harmanı. Telefon zemini bg_page'in çiçeksiz bandı +
  kümeler ayrı katman. Kapak kesimi altın kenarın **altından** (tema_build.kapak_kes altın çizginin üstünden kesiyordu), ön cep
  alttan tarama (cep_kes yan kanatlarda astar şeridi bırakıyordu), açık katmanlar menteşeye × 0,959. Yer tutucular leke yok
  (en koyu 196–224 ≥ 175). `build_images.py` yeniden koşturuldu: img/ bayt bayt aynı.
- **Comp sapmaları (README'de harita):** geri sayım kutuları yok (K21, sade rakam); story telefonda basamaklı (≥ 38vw); hero
  kartında tarih ve şehir iki satır; details'te standart gün · tarih başlığı kartın içinde; home'daki davet kartı, bölümler ve
  kapanış comp'suz bölümler (bu tasarımın parçaları); story'de baskılar arasındaki küçük çiçek kümeleri yok (ayrı parça yok).
- **qa dersleri:** ilk ekran kuralı 3 kayıt (demo, tasarım aralığı, §12 stres) × 10 boyutta (320×568, 360×640, 375×553, 375×667,
  390×844, 568×320, 667×375, 740×360, 844×390, 932×430) ölçüldü — nav'ın altında yarım parça yok, isimler ≥ 36 px (home ve
  zarf), zarf + "Tap to open" ekranda (uzun isimde zarf küçülür, `fitEnv`); kısa yatay düzen; kümeler düz çizgiyle kesilmiyor;
  tap highlight saydam; metin ≥ 11 px (tabanlar yukarı yuvarlanır); parçacıklar fotoğraf/yüz üstüne düşmez; açılıştan sonra
  bekleme yok (`arriveDelay` 0); yana kaydırma yok; MP4 ilk karesi beyaz değil (ortalama 202,206,209); kontrast ölçüldü (küçük
  metin en düşük 4,60, büyük 4,27; mühürdeki monogram süs, 3,6, `aria-hidden`); dar ekranda "Saturday ·" asılı nokta yok.

**Komutlar:** `npm test` 328/328 · `npm run typecheck` temiz · `npm run build` + trace-check (16 rota, 4 tema) ·
`theme-check --theme dusty-blue-champagne --stress` 113 geçti / 0 uyarı / 3 hata — üçü **yanlış alarm**: denetimin "content
change" yaması 2. ismi "Theo" yapıyor, bu demonun 2. ismi de "Theo" (aynı değişiklik "Jonah" ile kendi koşumda denendi: beş
sayfada eski demo sözcüğü yok) · `g051-browser --theme` 44/44 · `final-smoke --theme` 42/42 · `kit_check --paket 5` 23/23,
`--paket 2` 5/5, hiza tamam (sol −0,20 · sağ +0,29 · alt +0,07 %) · `test_tema_build --hizli`, `test_kit_check`,
`test_parts_prep` tamam. İlk görünüm (390×844, DPR 3): index 916 KB / home 1010 KB yer tutucuyla, 977 / 1145 KB örnek
fotoğraflarla (≤ 1,5 MB). Önizlemeler `previews/g402/` (compare_<sayfa>_390, compare_closure, cuts_envelope, kısa/yatay/aralık/
stres, opening_390x844.mp4, checks.json, final/).

**Denenmedi:** gerçek iPhone/Safari ve Android Chrome (`svh`, `mask`, `overflow: clip`, VT), Vercel yayını, gerçek alıcı
fotoğrafları, yavaş ağ. **qa-kontrol incelemesi yapılmadı:** bu oturumda alt-ajan aracı yoktu; `compare_*` görselleri ve README
haritası yalnız kendi gözümle karşılaştırıldı — §13.4 kapısı inceleme aşamasında qa-kontrol'e bırakıldı.

**Sorunlu GPT parçaları → önerilen prompt eki (`tools/katalog.py` WEB[02] / ortak metin):** (1) bütün şeffaf parçalar:
"crisp alpha edge; no glow, haze, soft shadow or coloured fringe outside the object; fully transparent beyond 2 px of the
edge"; (2) pencereler: "window exactly #00FF00 with a hard edge, no anti-aliased coloured ring"; (3) envelope_open: "the open
flap's fold line on exactly the same row as the closed envelope's top edge" (GPT ~23 px yukarıda çizdi); (4) bg_tile:
"seamless: left/right and top/bottom edges continue each other". **Önerilen görev:** theme-check "content change" yamasında
demolarda olmayan isim (ör. "Jonah") — G402'nin 3 yanlış alarmı.

## Günlük
- 2026-10-13 yeniden tanımlandı (K22–K24, G033)
- 2026-10-14 alindi: wf-tema02
- 2026-10-14 bitti, incelemeye gönderildi
