---
id: G413
baslik: Tasarım 13 Enchanted Forest Storybook — platform teması
rol: claude-kod
durum: inceleme
alan: claude-G413
oncelik: 3
bagimli: [G213, G038, G046, G052]
yazar: [platform/themes/enchanted-forest-storybook/, platform/tests/theme-enchanted-forest-storybook.test.ts, platform/previews/g413/]
---

## Amaç
Tasarım 13'i platformda tema olarak kurmak (K24, `docs/10_SITE_PLATFORMU.md`): kapalı zarf açılış sayfası → home → story, details, rsvp; yalnız bu tasarımın GPT parçalarıyla (K21), kişisel metin HTML'de. **Kurallar `docs/11_TEMA_STANDARDI.md`'dedir; bu görev metniyle çelişirse docs/11 geçerlidir.**

## Girdiler
- Tema standardı: `docs/11_TEMA_STANDARDI.md` — bütünü; zarf tipi **kitap kapağı** → §7.1 + §7.5; bitti tanımı §13, kontrol listesi §15
- Platform sözleşmesi: `platform/README.md` (işaretler, RSVP form sözleşmesi, `#site-data`); çalışan örnek `platform/themes/blush-garden-rose/` — **yalnız** işaret/RSVP/`#site-data`/oturum anahtarı kullanımı için; yerleşimi, aralıkları, süs konumları ve zamanlaması bu temaya taşınmaz (docs/11 §8). G035 kaynağı (`collections/03_Blush_Garden_Rose/website/`) örnek değildir
- GPT çıktıları (G213): `collections/13_Enchanted_Forest/assets/gpt/comps/` (W1, yerleşim referansı, satılmaz; yalnız sade adlar — `_vN` denemedir), `parts/` (katmanlar), `photos/` (örnek fotoğraflar)
- İçerik `collections/13_Enchanted_Forest/content.demo.json`, renk `collections/13_Enchanted_Forest/palette.json`, özet `collections/13_Enchanted_Forest/DESIGN_BRIEF.md`
- Araçlar: `tools/parts_prep.py` (geçici klasöre; docs/11 §5.3), `python3 tools/kit_check.py collections/13_Enchanted_Forest --paket 5`, `node scripts/theme-check.cjs --theme <slug>` (G052)

## Yapılacaklar
1. `theme.json`, 5 sayfa, `site.css`, `site.js`, `build_images.py`, `README.md` docs/11 §1–§4 düzeninde. 03'ten yalnız platform sözleşmesi alınır (motor işaretleri, RSVP formu, `#site-data`, slug'lı oturum anahtarları, `data-scene`/`data-step`/`data-a` kancaları); yerleşim, tipografi ve hiyerarşi bu tasarımın W1 comp'larından — tema `README.md`'sinde sayfa başına **comp öğe haritası** (her W1 öğesi → şablon öğesi ya da gerekçeli sapma; comp'u olmayan bölümler bu tasarımın parçaları ve tipografisiyle, docs/11 §8).
2. Parçalar: `python3 platform/themes/enchanted-forest-storybook/build_images.py` → `parts_prep` **geçici klasöre** (`--prep-dir`; tema klasörüne, `img_src/`'ye ya da `assets/`'e asla — docs/11 §1, §5.3–§5.4), tip kesimleri (§7), maskeler, `free_zone`, yer tutucular, og; WebP + srcset genişlikleri (§5.1, §5.5). Yalnız bu tasarımın GPT parçaları; yeni şekil/dekor çizme (K21).
3. Zarf açılışı (`MOTION.envelope`, kitap kapağı, docs/11 §7.1 + §7.5): On tap, the brass clasp unhooks and swings away, the moss-green cover swings open to the left like a storybook, the first page turns, and the card rises from the page while tiny fireflies glow up around it. Katalog: Kabartma çiçek bordürlü eski masal kitabı kapağı (yazısız); kapak açılır, sayfalar çevrilir. Açılış cümlesindeki sıra, sayı ve yön bağlayıcıdır; kapanış elemanı, zarf/kapak ve kart ayrı katmanlar; kart home'daki karta dönüşür; `closure.png` kare tuvalde büyük çizilir; yeri kesim geometrisine bağlanır (`manifest.closure`, docs/11 §7.1).
4. Sayfa koreografisi (`MOTION.scenes`): her sayfada öğeler sırayla girer. Story: Kitap sayfalarına yapıştırılmış fotoğraf köşelikli kartlar, sayfa çevrilince belirir (a single tall aged-cream storybook page (the same page as the details card) with three photo-cornered pictures mounted down it in a gentle zigzag — left, right, left — a tiny ivy sprig beside each, as if just revealed by a turning page); telefonda foto penceresi ≥ 38vw (sığmazsa basamaklı/alt alta düzen, comp sapması olarak yazılır — docs/11 §9). Parçacıklar `MOTION.accents` (§8: tür başına dosya ve yol). Details/rsvp: kart, satırlar ve buton sırayla.
5. Foto alanları: `hero_portrait` (card_small penceresi), `story_1..3` (frame_portrait), `venue` (frame_landscape); kutu ve maske `windows.json`'dan (§5.6, §9). PAKET 2 fotoğrafı yoksa yer tutucu.
6. Fontlar: Tangerine + IM Fell English (Google Fonts link'i; repoya font dosyası girmez). Tarih motor biçimiyle (`May 15, 2027`). Link blokları `data-if="urls.*"` ile linksiz kalkar — "link will be added soon" diyen ölü düğme yok (§4).
7. Testler ve önizleme (§13): `platform/tests/theme-enchanted-forest-storybook.test.ts`; `theme-check --theme enchanted-forest-storybook` (5 genişlik, kısa telefonlar, akışlar, ağırlık, MP4); `platform/previews/g413/` (W1 comp | tema karşılaştırmaları dahil).

## Bitti sayılması için
- [ ] docs/11 §15 kontrol listesi tamam (atlanan madde Sonuç'ta gerekçesiyle)
- [x] `npm test`, `npm run typecheck`, `npm run build` (trace-check) geçti; `tests/theme-enchanted-forest-storybook.test.ts` (§13.2)
- [ ] `theme-check --theme enchanted-forest-storybook` hatasız; `previews/g413/` + `compare_<sayfa>_390.jpg` qa-kontrol incelemesinden geçti
- [x] Sonuç dürüst: açılış ve story tarifi, comp sapmaları, denenmeyenler (gerçek iPhone/Safari, yayın), sorunlu GPT parçaları

## Sonuç
**2026-10-15 · claude-G413 · durum `inceleme`** (dal `worktree-agent-adcb78bc67c2011e8`; main'e push yok, entegratör birleştirir).

**Ne yapıldı.** `platform/themes/enchanted-forest-storybook/`: `theme.json` (71 copy anahtarı, foto alanları
`hero_portrait` 565/559 · `story_1..3` 549/720 · `venue` 782/505), 5 sayfa (index, home, story, details, rsvp), `site.css`
(45,7 KB), `site.js` (35,2 KB), `thank-you.css`, `content.demo.json`, `build_images.py`, `README.md` (sayfa başına comp öğe
haritası + sapmalar, ölçümler), `img/` (WebP + srcset, 2,38 MB, manifest). Test `platform/tests/theme-enchanted-forest-storybook.test.ts`
(38 test). Önizlemeler `platform/previews/g413/`. Yalnız G213 GPT parçaları (K21); yeni şekil/dekor çizilmedi, font dosyası
yok (Google Fonts: Tangerine 700 + IM Fell English), görsel üretilmedi. `parts_prep` yalnız `/tmp/claude-0/G413/prep`'e.
`kit_check --paket 5` 23/23 (kitap hizası: sırt +0,23 · üst −0,10 · alt +0,29 · sağ +0,20 %), `--paket 2` 5/5.

**Açılış (kitap, docs/11 §7.1 + §7.5).** Dokununca pirinç toka menteşesinde kalkıp kancadan çıkar ve sağa savrulup düşer →
yosun yeşili kapak sırtında sola açılır (0 → −90°, astarlı iç yüz −90 → 0°), bu sırada açık çift sayfa ortalanır ve sığacak
kadar küçülür → ilk sayfa çevrilir (yaprak + aynası) → kart sayfadan kalkar, aynı anda 7 GPT ateş böceği kartın iki yanından
yanıp sönerek yükselir → kart öne gelir (× 1,4) ve view transition ile home kartına uçar. Dokun → home 4,5 s (theme-check
ölçümü 4806 ms); Skip her an. Katmanlar ayrı: `book-cover-in · book-page · card · book-turn (leaf + leaf-back) · book-cover ·
closure`; toka yeri `manifest.closure` (comp ölçüsü, kesim geometrisine bağlı).

**Story.** Uzun eski-krem kitap sayfası (info_card, 3 dilim) sayfa çevrilir gibi yerine oturur; üç köşelikli resim sırayla
sayfaya bastırılır (sol, sağ, sol), her birinin yanında eğrelti filizi ve ateş böceği, sonra alt yazı. Telefonda resim
sayfanın %62'si (foto penceresi 390 px'te ≈ 39,8vw ≥ 38vw), alt alta zikzak; ≥ 720 px'te comp'taki gibi üst üste biner.

**Comp sapmaları** (ayrıntı README "Comp öğe haritası"): köşe kümeleri GPT'nin L biçimli kümeleri (comp'taki ağaç gövdesi
parçalarda yok); toka comp'takinden ~%10 basık; geri sayım kutuları ve RSVP hapındaki dallar çizilmedi (sade rakam / arayüz
hapı); story'de telefonda bindirme yerine alt alta zikzak; "küçük sarmaşık dalı" yerine eğrelti filizi (tek dal parçası yok);
details'te mekân adı/yeri kartın altında (frame_landscape penceresi kartın %82'sine iniyor, yazı yeri yok); home'daki kasaba
satırı `venue.city` (comp gibi; §3.2 `city_region` der, 05/08 ile aynı); nav her sayfada aynı sabit bant.

**Komut sonuçları.**
- `node --test tests/theme-enchanted-forest-storybook.test.ts`: 38/38 (npm test içinde)
- `npm test`: 634/634 · `npm run typecheck`: temiz · `npm run build`: geçti (trace-check 7 tema)
- `theme-check --theme enchanted-forest-storybook --stress`: 128 geçti · 0 hata · 0 uyarı (5 genişlik + kısa telefonlar + yatay, akışlar, stres kaydı, teşekkür hâli, ağırlık, MP4 `previews/g413/opening_390x844.mp4`)
- İlk ekran ağırlığı (yer tutucu / örnek fotoğraflı): index 938 KB / home 993 KB (yer tutucu) · index 1043 KB / home 1304 KB (örnek fotoğraf); sınır 1536 KB
- `g051-browser --theme` 44/44 · `final-smoke --theme` 45/45 (`previews/g413/final/`) — ikisi de son hâlde yeniden koşuldu
- `copy-manifest --check` temiz (71 anahtar). Kontrast: mürekkep 10,1:1 (sis 10,9), ink-soft 7,1, el yazısı mürekkebi 6,2,
  yosun 5,2, hap yazısı 5,0:1.
- Kendi QA turu: 390 tüm sayfalar, 360 uzun ad/stres tüm sayfalar, 430 story, yatay 844×390 tüm sayfalar, 768/1280
  index/home/details, açılış kareleri (390, 360×640, 844×390, MP4 karoları), teşekkür hâli stres ekranları. Düzeltilenler:
  kart yazısının köşelik üstüne binmesi, 360'ta resim/mekân taşması, uzun davet metninin alt süse inmesi, story'de ilk ekranda
  boş kâğıt bandı, köşe kümesinin kâğıt arkasında şerit kalması, aynalı geniş zeminin simetrik dikişleri, home ilk ekran
  ağırlığı (1547 → 1304 KB).

**Denenmeyenler.** Gerçek iPhone/Safari ve Android Chrome (`svh`, `mask`, `:has`, `cqw`, belgeler arası view transition, 3B
`rotateY` + `perspective`), Vercel yayını, gerçek alıcı fotoğrafları (farklı oran/ışık), yavaş ağ. qa-kontrol incelemesi
yapılmadı (bekliyor).

**Sorunlu GPT parçaları / önerilen gpt-gorsel görevleri** (hiçbiri blokaj değil; tema bugünkü parçalarla çalışıyor):
1. `closure` comp'takinden ~%10 basık (genişlikle ölçeklendi). Prompt düzeltmesi: *"…brass leaf clasp, drawn large and
   centred on a square transparent canvas, same proportions as the clasp in web_1_envelope.png (about 10 % taller relative
   to its width than the current parts/closure.png), no shadow baked outside the metal…"*
2. `frame_landscape` penceresi kartın altına kadar iniyor; comp'taki gibi mekân adı kartın içinde olamıyor. Prompt
   düzeltmesi: *"…landscape aged-paper book-page card with four photo corners; the photo window occupies only the top 70 %
   of the card, leaving a plain empty paper band (no text, no ornament) along the bottom 22 % for live text…"*
3. Tek başına küçük sarmaşık dalı parçası yok (story'de resim yanı; eğrelti filizi kullanıldı). Prompt: *"…a single tiny
   ivy sprig, 5–7 leaves on a thin curved stem, isolated on a transparent background, same painted storybook style…"*
4. Yazı tipleri yalnız `latin` (ł, ő, ğ, ş, ı yedeğe düşer) — önerilen claude-kod görevi: başlık için latin-ext'li eş seçimi.

**docs/11 §15.** Maddeler tamam; açık kalanlar: `compare_*` qa-kontrol incelemesi (yapılmadı, bekliyor) ve aksanlı isim fontu
(kontrol edildi: Tangerine + IM Fell English latin-ext vermiyor → yukarıdaki 4. madde).

**Entegratöre not (ortak dosyalar, dokunulmadı).** `platform/tests/g068-copy.test.ts` (`THEMES` 51. satır, `COLLECTION`
53–59, `DESIGN_KEYS` 61–) ve `platform/tests/g075-thank-you.test.ts` (`THEMES` 49, `COLLECTION` 50–56) bu temayı
listelemiyor; eklenecekler: THEMES'e `'enchanted-forest-storybook'`, COLLECTION'a `'enchanted-forest-storybook':
'13_Enchanted_Forest'`, DESIGN_KEYS'e `[]` (tasarıma özel copy anahtarı yok). Tema kendi testinde G068 ve G075 kurallarını
ayrıca sınıyor; ortak testler bugünkü hâliyle geçiyor (tema listede olmadığı için).

## Günlük
- 2026-10-13 blokaj: K22 (kullanıcı, 2026-10-13): videodan çıkıldı, ürün yalnız mobil öncelikli website. Yeni website standardı pilotla (G035) belirlenince yeniden tanımlanacak
- 2026-10-13 yeniden tanımlandı (K22–K24, G033)
- 2026-10-15 alindi: claude-G413
- 2026-10-15 bitti, incelemeye gönderildi
