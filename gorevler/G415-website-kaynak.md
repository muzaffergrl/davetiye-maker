---
id: G415
baslik: Tasarım 15 Cherry Blossom Spring — platform teması
rol: claude-kod
durum: bitti
alan: claude-G415
oncelik: 3
bagimli: [G215, G038, G046, G052]
yazar: [platform/themes/cherry-blossom-spring/, platform/tests/theme-cherry-blossom-spring.test.ts, platform/previews/g415/]
---

## Amaç
Tasarım 15'i platformda tema olarak kurmak (K24, `docs/10_SITE_PLATFORMU.md`): kapalı zarf açılış sayfası → home → story, details, rsvp; yalnız bu tasarımın GPT parçalarıyla (K21), kişisel metin HTML'de. **Kurallar `docs/11_TEMA_STANDARDI.md`'dedir; bu görev metniyle çelişirse docs/11 geçerlidir.**

## Girdiler
- Tema standardı: `docs/11_TEMA_STANDARDI.md` — bütünü; zarf tipi **kapaklı zarf** → §7.1 + §7.3; bitti tanımı §13, kontrol listesi §15
- Platform sözleşmesi: `platform/README.md` (işaretler, RSVP form sözleşmesi, `#site-data`); çalışan örnek `platform/themes/blush-garden-rose/` — **yalnız** işaret/RSVP/`#site-data`/oturum anahtarı kullanımı için; yerleşimi, aralıkları, süs konumları ve zamanlaması bu temaya taşınmaz (docs/11 §8). G035 kaynağı (`collections/03_Blush_Garden_Rose/website/`) örnek değildir
- GPT çıktıları (G215): `collections/15_Cherry_Blossom/assets/gpt/comps/` (W1, yerleşim referansı, satılmaz; yalnız sade adlar — `_vN` denemedir), `parts/` (katmanlar), `photos/` (örnek fotoğraflar)
- İçerik `collections/15_Cherry_Blossom/content.demo.json`, renk `collections/15_Cherry_Blossom/palette.json`, özet `collections/15_Cherry_Blossom/DESIGN_BRIEF.md`
- Araçlar: `tools/parts_prep.py` (geçici klasöre; docs/11 §5.3), `python3 tools/kit_check.py collections/15_Cherry_Blossom --paket 5`, `node scripts/theme-check.cjs --theme <slug>` (G052)

## Yapılacaklar
1. `theme.json`, 5 sayfa, `site.css`, `site.js`, `build_images.py`, `README.md` docs/11 §1–§4 düzeninde. 03'ten yalnız platform sözleşmesi alınır (motor işaretleri, RSVP formu, `#site-data`, slug'lı oturum anahtarları, `data-scene`/`data-step`/`data-a` kancaları); yerleşim, tipografi ve hiyerarşi bu tasarımın W1 comp'larından — tema `README.md`'sinde sayfa başına **comp öğe haritası** (her W1 öğesi → şablon öğesi ya da gerekçeli sapma; comp'u olmayan bölümler bu tasarımın parçaları ve tipografisiyle, docs/11 §8).
2. Parçalar: `python3 platform/themes/cherry-blossom-spring/build_images.py` → `parts_prep` **geçici klasöre** (`--prep-dir`; tema klasörüne, `img_src/`'ye ya da `assets/`'e asla — docs/11 §1, §5.3–§5.4), tip kesimleri (§7), maskeler, `free_zone`, yer tutucular, og; WebP + srcset genişlikleri (§5.1, §5.5). Yalnız bu tasarımın GPT parçaları; yeni şekil/dekor çizme (K21).
3. Zarf açılışı (`MOTION.envelope`, kapaklı zarf, docs/11 §7.1 + §7.3): On tap, the blossom twig loosens and drifts off, the curved grey flap lifts, and the card rises as a gentle flurry of cherry petals swirls up and floats across the screen. Katalog: Kiraz çiçeği astarlı açık gri zarf; kapak açılınca yapraklar uçuşur. Açılış cümlesindeki sıra, sayı ve yön bağlayıcıdır; kapanış elemanı, zarf/kapak ve kart ayrı katmanlar; kart home'daki karta dönüşür; `closure.png` kare tuvalde büyük çizilir; yeri kesim geometrisine bağlanır (`manifest.closure`, docs/11 §7.1).
4. Sayfa koreografisi (`MOTION.scenes`): her sayfada öğeler sırayla girer. Story: Yuvarlak (round) çerçeveler, yaprak gibi süzülerek iner (three round blossoming cherry-branch frames of different sizes drifting down the page in a gentle diagonal like falling petals); telefonda foto penceresi ≥ 38vw (sığmazsa basamaklı/alt alta düzen, comp sapması olarak yazılır — docs/11 §9). Parçacıklar `MOTION.accents` (§8: tür başına dosya ve yol). Details/rsvp: kart, satırlar ve buton sırayla.
5. Foto alanları: `hero_portrait` (card_small penceresi), `story_1..3` (frame_portrait), `venue` (frame_landscape); kutu ve maske `windows.json`'dan (§5.6, §9). PAKET 2 fotoğrafı yoksa yer tutucu.
6. Fontlar: Petit Formal Script + Noto Serif Display (Google Fonts link'i; repoya font dosyası girmez). Tarih motor biçimiyle (`May 15, 2027`). Link blokları `data-if="urls.*"` ile linksiz kalkar — "link will be added soon" diyen ölü düğme yok (§4).
7. Testler ve önizleme (§13): `platform/tests/theme-cherry-blossom-spring.test.ts`; `theme-check --theme cherry-blossom-spring` (5 genişlik, kısa telefonlar, akışlar, ağırlık, MP4); `platform/previews/g415/` (W1 comp | tema karşılaştırmaları dahil).

## Bitti sayılması için
- [ ] docs/11 §15 kontrol listesi tamam (atlanan madde Sonuç'ta gerekçesiyle)
- [ ] `npm test`, `npm run typecheck`, `npm run build` (trace-check) geçti; `tests/theme-cherry-blossom-spring.test.ts` (§13.2)
- [ ] `theme-check --theme cherry-blossom-spring` hatasız; `previews/g415/` + `compare_<sayfa>_390.jpg` qa-kontrol incelemesinden geçti
- [ ] Sonuç dürüst: açılış ve story tarifi, comp sapmaları, denenmeyenler (gerçek iPhone/Safari, yayın), sorunlu GPT parçaları

## Sonuç
**2026-10-15 · claude-G415 · durum `inceleme`** (dal `worktree-agent-a8d087759743840f0`; push yok, entegratör birleştirir;
dala `origin/main` iki kez birleştirildi, son c868502 sonrası main).

**Ne yapıldı.** `platform/themes/cherry-blossom-spring/`: `theme.json` (71 standart copy anahtarı; foto alanları
`hero_portrait` 535/531 · `story_1..3` 648/891 · `venue` 995/683), 5 sayfa, `site.css` (45 671 B), `site.js` (35 247 B),
`thank-you.css`, `content.demo.json` (koleksiyon kaydının birebir kopyası), `build_images.py`, `README.md` (sayfa başına comp öğe
haritası + sapmalar, ölçümler), `img/` (45 WebP + srcset, maskeler, og, favicon, manifest; klasör ~1,8 MB). Test
`platform/tests/theme-cherry-blossom-spring.test.ts` (38 test, tarayıcı ölçümü dahil). Önizlemeler `platform/previews/g415/`
(theme-check çıktıları, `compare_<sayfa>_390.jpg`, `compare_closure.jpg`, `cuts_envelope.jpg`, `cut_pocket_edge.jpg`,
`opening_sheet.png`, `opening_390x844.mp4`, `final/`). Yalnız G215 GPT parçaları (K21); şekil/dekor çizilmedi, font dosyası yok
(Google Fonts: Petit Formal Script + Noto Serif Display, ikisi de latin-ext), görsel üretilmedi. `parts_prep` yalnız
`/tmp/claude-0/G415/prep`'e. `kit_check --paket 5` 23/23 (hiza sol +0,10 · sağ 0,00 · alt 0,00 %), `--paket 2` 5/5.

**Açılış (kapak, yuvarlak kapak; docs/11 §7.1 + §7.3).** Dokununca kiraz dalı sapı çevresinde titreyip gevşer ve dönerek sağ
üste süzülüp ekrandan çıkar → yuvarlak gri kapak menteşesinde kalkar (90°'de astarlı açık kapak −90 → 0° devralır) → kart
cepten yükselirken 14 GPT yaprağı zarfın ön cebinden dönerek yükselip bir yana savrularak ekran boyunca süzülür (`swirl`) →
kart öne gelir (× 1,05) ve view transition ile home kartına uçar. Dokun → home 4,5 s (theme-check 4917 ms); Skip her an. Dal
kapaktan ayrı katman, yeri kesim geometrisine bağlı (`manifest.closure`, comp ölçüsü).

**Story.** Üç farklı boyda çiçekli çerçeve çaprazda (sol büyük, sağ küçük, sol orta); her biri görünüme girince yaprak gibi
yukarıdan bir yandan sallanarak süzülüp yerine oturur (`petal-l`/`petal-r`), sonra başlığı yazılır. Telefonda zikzak sütun
(çerçeve 64/52/58vw, foto penceresi 51/41/46vw ≥ 38vw); ≥ 720 px'te comp'un çaprazı.

**Comp sapmaları** (ayrıntı README): story çerçeveleri **oval** (GPT frame_portrait oval, comp'ta daire); telefonda çapraz
yerine zikzak sütun (38vw kuralı); geri sayım kutuları çizilmedi (sade rakam, K21); info_card'ın sol üst çiçekli dalı details
ve rsvp kartlarında görünür (comp kartlarında yok); hero kart kopyasında kasaba `venue.city` (comp gibi; 05/08/13 ile aynı);
davet kartı ve home çerçeveleri comp'suz bölümler, bu tasarımın parçalarıyla.

**Teknik onarımlar (çizim yok).** `kapak_kes("egri")` sol uçta ince dikey şerit bırakıyordu → `kapak_tekduze` (54 sütun).
`cep_kes("egri")` geometrik yedeğe düştü → temaya özgü `cep_gulumseme` (renk; 394/438 nokta, sapma 0,55 px). card_small ve
frame_portrait pencerelerindeki koyu yeşil gradyan parts_prep `leke_doldur` ile tam şeffaf (her WebP'de pencere 0 px).
Davet kartı WebP 258 KB → q 66 ile 116 KB.

**Komut sonuçları.**
- `node --test tests/theme-cherry-blossom-spring.test.ts`: 38/38
- Ortak testler (`design-themes.ts` üzerinden temayı kendiliğinden alıyor): g068-copy + g069-rsvp + g075-thank-you 112/112 (main
  birleşmeden önce koşuldu); main birleştikten sonra `npm test` 981/983 (2 atlanan: build çıktısı isteyen pazarlama testleri),
  0 hata · `npm run typecheck` temiz · `npm run build` + trace-check geçti (16 tema)
- `theme-check --theme cherry-blossom-spring --stress` (PORT 3480): 128 geçti · 0 hata · 0 uyarı. İlk koşuda 10 hata vardı
  (stres kaydında uzun host line davet kartının çelenk uçlarına biniyordu) → metin sütunu %28'den başlıyor, ilk satır %30–70;
  ikinci koşu temiz
- İlk görünüm (390×844, DPR 3): index 750 KB / home 803 KB (yer tutucu) · 847 / 1322 KB (örnek fotoğraf); sınır 1536 KB
- `g051-browser --theme` 44/44 · `final-smoke --theme` 45/45 (`previews/g415/final/`)
- `copy-manifest --check` temiz (71 anahtar). Kontrast (palet tokenları): mürekkep 9,7:1, ink-soft 6,6:1, el yazısı 8,2:1,
  rose 5,0:1, hap yazısı ≥ 5,0:1.
- Kendi QA turu: 390 bütün sayfalar (örnek fotoğraflı), 360×640 home, 360/390 stres (index, home, story, details, rsvp) ve
  teşekkür hâli stresi, 844×390 home, açılış kareleri (11 kare, `opening_sheet.png`) ve compare_*_390 W1 karşılaştırmaları.
  Düzeltilenler: davet kartının demo içerikle gereksiz uzaması (alt pay hesabı), tarih bloğunun sıkılaştırılması (gün · saat tek
  satır), details/rsvp başlığının info_card dalının altına alınması, stres kaydında çelenk üstü metin, accent_3'ün kullanılmayan
  dosya olarak çıkarılması.

**Denenmeyenler.** Gerçek iPhone/Safari ve Android Chrome (`svh`, `mask`, `:has`, `cqw`, belgeler arası view transition,
keyframe gecikmeleri), Vercel yayını, gerçek alıcı fotoğrafları (farklı oran/ışık), yavaş ağ. **qa-kontrol alt-ajan incelemesi
yapılmadı** (bu oturumda alt-ajan başlatma aracı yok; `compare_*` ve README comp haritası incelemeye hazır).

**Sorunlu GPT parçaları / önerilen gpt-gorsel görevi** (blokaj değil):
1. `frame_portrait` oval; W1.3 ve katalog "Yuvarlak (round) çerçeveler" diyor. Prompt düzeltmesi (`tools/katalog.py` `WEB[15]`):
   *"…frame_portrait: a perfectly ROUND (circular, 1:1) thin gold ring framed by blossoming cherry twigs and buds, drawn centred
   on a transparent canvas, flat #00FF00 circular window, no shadow outside the frame…"*
2. `info_card` sol üst köşesinde çiçekli dal var (W1.4/W1.5 kartları düz); isteğe bağlı: *"…info_card: plain deckle-edged ivory
   card with only a thin antique-gold inner border, no florals…"*
3. `invitation_card`'da tam genişlikte düz kâğıt bandı yalnız %54–55 (sağ çelenk %74'e iniyor): uzun içerikte gerilen bant
   dar. İsteğe bağlı: *"…keep the garland within the top 30 % and the lower-left branch within the bottom 25 %, leaving a
   plain paper band across the full width between them…"*

**docs/11 §15.** Maddeler tamam; açık kalan: `compare_*` qa-kontrol incelemesi (yapılmadı, bekliyor).

**Entegratöre not.** Ortak dosyaya dokunulmadı; ortak testler temayı `tests/design-themes.ts` ile kendiliğinden kapsıyor, tema
sayısı sayan bir ortak test kırılmadı. Disk: `platform/.next` silindi; `platform/node_modules` ana checkout'tan hardlink
(`cp -al`) ile kuruldu.

## Günlük
- 2026-10-13 blokaj: K22 (kullanıcı, 2026-10-13): videodan çıkıldı, ürün yalnız mobil öncelikli website. Yeni website standardı pilotla (G035) belirlenince yeniden tanımlanacak
- 2026-10-13 yeniden tanımlandı (K22–K24, G033)
- 2026-10-15 alindi: claude-G415
- 2026-10-15 bitti, incelemeye gönderildi
- 2026-10-15 entegratör onayladı
