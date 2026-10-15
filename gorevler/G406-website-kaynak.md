---
id: G406
baslik: Tasarım 06 Art Deco Black-Tie — platform teması
rol: claude-kod
durum: inceleme
alan: claude-G406
oncelik: 3
bagimli: [G206, G038, G046, G052]
yazar: [platform/themes/art-deco-black-tie/, platform/tests/theme-art-deco-black-tie.test.ts, platform/previews/g406/]
---

## Amaç
Tasarım 06'i platformda tema olarak kurmak (K24, `docs/10_SITE_PLATFORMU.md`): kapalı zarf açılış sayfası → home → story, details, rsvp; yalnız bu tasarımın GPT parçalarıyla (K21), kişisel metin HTML'de. **Kurallar `docs/11_TEMA_STANDARDI.md`'dedir; bu görev metniyle çelişirse docs/11 geçerlidir.**

## Girdiler
- Tema standardı: `docs/11_TEMA_STANDARDI.md` — bütünü; zarf tipi **gatefold, iki kapı** → §7.1 + §7.4; bitti tanımı §13, kontrol listesi §15
- Platform sözleşmesi: `platform/README.md` (işaretler, RSVP form sözleşmesi, `#site-data`); çalışan örnek `platform/themes/blush-garden-rose/` — **yalnız** işaret/RSVP/`#site-data`/oturum anahtarı kullanımı için; yerleşimi, aralıkları, süs konumları ve zamanlaması bu temaya taşınmaz (docs/11 §8). G035 kaynağı (`collections/03_Blush_Garden_Rose/website/`) örnek değildir
- GPT çıktıları (G206): `collections/06_Art_Deco_Noir/assets/gpt/comps/` (W1, yerleşim referansı, satılmaz; yalnız sade adlar — `_vN` denemedir), `parts/` (katmanlar), `photos/` (örnek fotoğraflar)
- İçerik `collections/06_Art_Deco_Noir/content.demo.json`, renk `collections/06_Art_Deco_Noir/palette.json`, özet `collections/06_Art_Deco_Noir/DESIGN_BRIEF.md`
- Araçlar: `tools/parts_prep.py` (geçici klasöre; docs/11 §5.3), `python3 tools/kit_check.py collections/06_Art_Deco_Noir --paket 5`, `node scripts/theme-check.cjs --theme <slug>` (G052)

- **G206 açık kusurları:** iki çerçevenin yeşil penceresinde yarı saydam/koyu lekeler → pencere kodla tam maske (parts_prep `leke_doldur`); zarf (kapı) hizası UYARI (sol kat +1,43%, sağ kat -1,60%) → manifest.stage.align ile düzelt.

## Yapılacaklar
1. `theme.json`, 5 sayfa, `site.css`, `site.js`, `build_images.py`, `README.md` docs/11 §1–§4 düzeninde. 03'ten yalnız platform sözleşmesi alınır (motor işaretleri, RSVP formu, `#site-data`, slug'lı oturum anahtarları, `data-scene`/`data-step`/`data-a` kancaları); yerleşim, tipografi ve hiyerarşi bu tasarımın W1 comp'larından — tema `README.md`'sinde sayfa başına **comp öğe haritası** (her W1 öğesi → şablon öğesi ya da gerekçeli sapma; comp'u olmayan bölümler bu tasarımın parçaları ve tipografisiyle, docs/11 §8).
2. Parçalar: `python3 platform/themes/art-deco-black-tie/build_images.py` → `parts_prep` **geçici klasöre** (`--prep-dir`; tema klasörüne, `img_src/`'ye ya da `assets/`'e asla — docs/11 §1, §5.3–§5.4), tip kesimleri (§7), maskeler, `free_zone`, yer tutucular, og; WebP + srcset genişlikleri (§5.1, §5.5). Yalnız bu tasarımın GPT parçaları; yeni şekil/dekor çizme (K21).
3. Zarf açılışı (`MOTION.envelope`, gatefold, iki kapı, docs/11 §7.1 + §7.4): On tap, the gold medallion clasp turns and lifts away, the two navy doors swing open to the sides like ballroom doors, and the card rises from the center pocket as a thin band of gold light sweeps across the screen. Katalog: Ortadan iki kanatlı açılan (gatefold) lacivert kapı; altın deco madalyon çözülür, kapılar yana açılır. Açılış cümlesindeki sıra, sayı ve yön bağlayıcıdır; kapanış elemanı, zarf/kapak ve kart ayrı katmanlar; kart home'daki karta dönüşür; `closure.png` kare tuvalde büyük çizilir; yeri kesim geometrisine bağlanır (`manifest.closure`, docs/11 §7.1).
4. Sayfa koreografisi (`MOTION.scenes`): her sayfada öğeler sırayla girer. Story: Basamaklı deco kemer çerçeveler, ışık süpürmesiyle belirir (three stepped gold art deco arch frames standing side by side like ballroom doorways, the middle one taller, a faint diagonal sweep of gold light crossing them); telefonda foto penceresi ≥ 38vw (sığmazsa basamaklı/alt alta düzen, comp sapması olarak yazılır — docs/11 §9). Parçacıklar `MOTION.accents` (§8: tür başına dosya ve yol). Details/rsvp: kart, satırlar ve buton sırayla.
5. Foto alanları: `hero_portrait` (card_small penceresi), `story_1..3` (frame_portrait), `venue` (frame_landscape); kutu ve maske `windows.json`'dan (§5.6, §9). PAKET 2 fotoğrafı yoksa yer tutucu.
6. Fontlar: Italiana + Josefin Sans (Google Fonts link'i; repoya font dosyası girmez). Tarih motor biçimiyle (`May 15, 2027`). Link blokları `data-if="urls.*"` ile linksiz kalkar — "link will be added soon" diyen ölü düğme yok (§4).
7. Testler ve önizleme (§13): `platform/tests/theme-art-deco-black-tie.test.ts`; `theme-check --theme art-deco-black-tie` (5 genişlik, kısa telefonlar, akışlar, ağırlık, MP4); `platform/previews/g406/` (W1 comp | tema karşılaştırmaları dahil).

## Bitti sayılması için
- [ ] docs/11 §15 kontrol listesi tamam (atlanan madde Sonuç'ta gerekçesiyle)
- [x] `npm test`, `npm run typecheck`, `npm run build` (trace-check) geçti; `tests/theme-art-deco-black-tie.test.ts` (§13.2)
- [ ] `theme-check --theme art-deco-black-tie` hatasız; `previews/g406/` + `compare_<sayfa>_390.jpg` qa-kontrol incelemesinden geçti
- [x] Sonuç dürüst: açılış ve story tarifi, comp sapmaları, denenmeyenler (gerçek iPhone/Safari, yayın), sorunlu GPT parçaları

## Sonuç
**Durum:** inceleme. Dal `worktree-agent-a6d2597089c6ebeb7` (main'e push yok; entegratör birleştirir).
**Açık kapı:** docs/11 §13.4'ün **qa-kontrol incelemesi yapılmadı**. Bu alt-ajan oturumunda alt-ajan başlatma aracı yoktu.
`compare_*` görselleri ve README'deki comp öğe haritası entegratörün qa-kontrol incelemesini bekliyor. Kendi QA turum aşağıda.

**Ne yapıldı**
- `platform/themes/art-deco-black-tie/`
  - `theme.json`: 5 sayfa, 5 foto alanı (`aspect` = manifest `box_px`), 71 copy anahtarı.
  - `content.demo.json`: koleksiyon kaydıyla bayt bayt aynı.
  - 5 sayfa, `site.css` (45 956 B), `site.js` (35 012 B), `thank-you.css`, `build_images.py`.
  - `README.md`: dosyalar, foto alanları, kesimler, koreografi, ilk ekranlar, sayfa başına comp öğe haritası ve sapmalar.
  - `img/`: 53 dosya; tema klasörü 1,85 MB.
- `platform/tests/theme-art-deco-black-tie.test.ts`: 36 test. §13.2'nin 1–24 maddeleri, G069, gatefold manifest/CSS/JS, açılış
  cümlesinin sırası, story merdiveni, zemin/ışık kuralları; tarayıcıda açık sahne ölçeği ve masaüstü story sırası.
- `platform/previews/g406/`
  - theme-check çıktıları: 5 sayfa × genişlikler, placeholder, range, stress, stress_ty.
  - `compare_<sayfa>_390.jpg` (W1 | tema) ve `compare_closure.jpg` (tema | W1.1, aynı dosya genişliği).
  - `opening_390x844.mp4`, `checks.json`, `final/` (final-smoke).

**Açılış:** Dokununca altın madalyon incisinin etrafında döner, büyüyerek ekranın üstünden kalkıp gider. İki lacivert kapı
menteşelerinde balo salonu kapıları gibi yanlara açılır (sol 0 → −90°, sağ 100 ms sonra). 90°'de yelpaze astarlı iç yüzler
devralır; sahne de açık dosyayı ekrana sığdıracak kadar küçülür. Kart orta cepten yükselirken ince, kenarsız bir altın ışık
bandı ekranı soldan sağa geçer. Kart öne gelir ve view transition ile home kartına uçar. Açılışta parçacık yok.
**Story:** Üç basamaklı deco kemer var: telefonda merdiven gibi sol–orta–sağ (ortadaki en büyük, pencere ≥ 43vw), ≥ 900 px'te
comp'un yan yana sırası. Her kemer görünüme girince karanlıktan ışığa döner ve üstünden kemer biçiminde maskeli eğik bir altın
ışık bandı geçer. Ardından başlık yazılır, küçük ayırıcı açılır.

**Comp'tan bilinçli sapmalar** (gerekçeleriyle README'de):
1. Story telefonda yan yana değil merdiven düzeninde: yan yana pencere ~25vw olurdu (< 38vw, §9).
2. Story'de kemerler arasındaki inci dizileri yok: GPT parçası yok (K21).
3. Geri sayım kutusuz, sade Italiana rakam: kutular CSS çerçeve olurdu (§5.7).
4. Order of the Day kartı:
   - GPT `info_card` dikey (comp'ta yatay); 3 dilimle uzuyor.
   - Satırlar "saat | etkinlik" düzeninde, yer etkinliğin altında (telefonda üç sütun sarardı).
5. Hero kartında comp gibi yalnız şehir (§3.2 `city_region` der).
   - Dar kartta iki satıra iner; 360×640'ta şehir düşer.
6. Nav süsü GPT divider'ı. Comp'u olmayan home bölümleri bu tasarımın parçalarıyla yapıldı:
   - `invitation_card`: deco tarih bloğu.
   - İki altın kapı: `frame_portrait` ve `frame_landscape`.
   - Kapanış: `decor_br`.

**Komutlar**
- `kit_check --paket 5`: 23/23 GEÇTİ ve 1 hiza UYARI (sol kat +1,43 · sağ kat −1,60 %).
  - UYARI'nın kaynağı: `tema_build.kat_bul` yanlış çizgiyi buluyor (aşağıda not 3).
  - Build'in alfa boşluğu ölçümüyle: +0,72 / −0,78 % → tamam. Ölçülen düzeltme `manifest.stage.align_fix`'te.
- `kit_check --paket 2`: 5/5.
- `build_images.py`: çıkış 0.
  - Pencere şeffaflığı: card, portrait ve landscape'te görünür piksel 0.
  - Yer tutucularda altın p99,9 ≤ 18.
- `copy-manifest --check`: 71 anahtar, işaretsiz metin yok.
- `npm test`: 618/618. Tek WARN, `_sample`'da teşekkür hâli olmaması (önceden de vardı).
- `npm run typecheck`: 0 hata. `npm run build` + trace-check: geçti (7 tema; rota başına en çok 562 KB tema dosyası).
- `theme-check --theme art-deco-black-tie --stress`: **128 geçti / 0 uyarı / 0 hata**.
  - İlk görünüm (DPR 3, yer tutucu): index 775 KB, home 768 KB.
  - Tohum fotoğraflarıyla: index 837 KB, home 1152 KB.
  - Dokun → home 4375 ms; reduced motion 230 ms; MP4 2455 KB.
- `g051-browser --theme art-deco-black-tie`: 44/44.
- `final-smoke --theme art-deco-black-tie`: **42/45**.
  - 3 HATA testin isim karşılaştırmasından geliyor: `innerText` CSS `text-transform`'u uygular. 06'nın deco isimleri büyük
    harf ("VIVIAN & CHARLES"), test ise büyük/küçük harfe duyarlı arıyor.
  - Aynı testin bu üç karşılaştırması duyarsız yapılmış geçici kopyası (repoda değil): 45/45 (aşağıda not 1).
- Bütün tarayıcı denetimleri PORT 3460'ta çalıştı.

**Kendi QA turum:** 360×640, 390×844, 430×932, 844×390 ve 1280 genişliklerinde bütün sayfalara baktım. Ayrıca W1
karşılaştırmaları, MP4 kareleri, teşekkür hâli (fotoğraflı/fotoğrafsız, stress) ve uzun isim stress'i incelendi. Düzeltilenler:
- Işınlar zarf başlığının üstünde sönüyor (`--re`).
- Köşe kümeleri köşelerinden büyüyor; yazıya ya da boyalı karta değerse küçülüyor, gerekirse gizleniyor (details 360×640).
- Kart kicker taşması giderildi.
- Parıltılarda yalnız transform kullanılıyor.
- Nav ve sayaç stress taşması giderildi (copy `max` 6/6/7/5, sayaç 7).
- Hero kartta "We're getting married" küçültüldü; 390'da "· Chicago" artık görünüyor.
- `bg_tile` dikişi giderildi. GPT karosu dikişsiz değildi; yatay ekran ve masaüstünde 640 px'te çizgi oluşuyordu.
- Story ve mekân ışık bandı sayfanın taşma genişliğini büyütüyordu (details tam sayfa 888 px). Bant artık `background-position`
  ile kayıyor ve kemer biçimiyle maskeli.

**Bilinen / kabul edilen**
- 360×640 ve 375×553'te story'nin ilk kemeri ve rsvp imza birimi ilk ekranın altından başlıyor (fold kuralı).
- Yatay telefonda iç sayfaların ilk ekranı başlık ve ilk satırlarla bitiyor.
- Italiana yalnız `latin` alt kümesiyle geliyor: latin-ext harfler Josefin Sans'a düşüyor. Italiana'nın ince yatay çizgileri DPR 1
  ekranda ~14 px'in altında kopuk görünüyor; DPR 3'te temiz.
- Kapı katmanları kaynakta 326–349 px: masaüstünde DPR 2'de hafif yumuşak.
- Açık dosyada kapı içleri, kapalı kapı yarılarından ~%7 geniş (yalnız açık hâlde fark ediliyor).

**Denenmedi:**
- Gerçek iPhone/Safari ve Android Chrome: `svh`, `mask`, `:has`, kesişen belge view transition, 3B `rotateY` ve
  `backface-visibility`, maskeli ışık bandı.
- Temanın Vercel'de yayını.
- Gerçek alıcı fotoğrafları (farklı oran ve ışık).
- Yavaş ağ.

**Sorunlu GPT parçaları ve önerilen prompt düzeltmeleri** (`tools/katalog.py` `WEB[06]` ya da ortak metin):
1. `frame_portrait` / `frame_landscape`: yeşil pencerede yarı saydam koyu lekeler var; yatay çerçevede pencerenin ortasında
   tam saydam bir delik var.
   - parts_prep `leke_doldur` ile çözüldü (`leke_px` 92 306 / 475 013).
   - Prompt: "the window is one flat opaque #00FF00 fill edge to edge, no shading, no holes".
2. `bg_tile` dikişsiz değil (sol kenar sağdan, üst kenar alttan açık). Build'de eğim düşülüp yarım kaydırmayla düzeltildi.
   - Prompt: "truly seamless: opposite edges continue each other, even lighting, no vignette or gradient".
3. Açık dosyanın kapı içleri kapalı kapı yarılarından ~%7 geniş; dosya tuvalin ~%42'sinde kaldığı için kapı katmanları düşük
   çözünürlüklü.
   - Prompt: "open-state door panels exactly as wide as the closed doors' halves; the folder fills ≥ 80 % of the canvas width".
4. Kemer penceresi ≈ 0,52:1 ("about 3:4" tutmadı); 2:3 fotoğraflar yanlardan kırpılıyor.
   - Prompt: "window aspect 3:4".
5. Story'deki inci dizisi için parça yok.
   - Önerilen gpt-gorsel görevi: `parts/pearl_string.png` (dikey inci dizisi + küçük altın deco halkalar, şeffaf), kemerlerin
     arasına (≥ 900 px sırası).

**Entegratöre notlar** (ortak dosyalar; değiştirilmedi):
1. `platform/tests/final-smoke.ts`: isimleri büyük/küçük harfe duyarsız karşılaştırın.
   - 186. satır: `(await page.locator('body').innerText()).toLowerCase().includes(names[0].toLowerCase())`
   - 196. satır: `names.every((n) => home.toLowerCase().includes(n.toLowerCase()))`
   - 352. satır: `/Elena/i.test(guestHome) && (!two || /Marco/i.test(guestHome))`
   - Bu üç değişiklikle 45/45.
2. `art-deco-black-tie` iki ortak teste eklenebilir (docs/11 §13.2 #24), geçici kopyalarla denendi:
   - `platform/tests/g068-copy.test.ts`: `THEMES` (51. satır), `COLLECTION` (`'06_Art_Deco_Noir'`), `DESIGN_KEYS` (`[]`).
     Kopyada geçti.
   - `platform/tests/g075-thank-you.test.ts`: `THEMES` (49) ve `COLLECTION` (54). 06'nın düğünü (18 Aralık 2027) varsayılan
     `now`'dan (233. satır, `new Date('2027-10-15')`) sonra olduğu için otomatik teşekkür modu açılmıyor. Değer
     `new Date('2028-01-15')` yapılınca 30/30 geçti (diğer temalar dahil).
3. `tools/tema_build.py` `dikis_bul` / `kat_bul`: 06 gatefold'unda yanlış çizgileri buluyor.
   - Dikiş: 752 (gerçek 768). Katlar: 465 / 1070 (gerçek 454 / 1083). kit_check'in hiza UYARI'sı da bundan.
   - Öneri: `build_images.py`'deki `dikis()` (kutu ortası ± %4 bandında en koyu yumuşatılmış sütun) ve `katlar()` (orta panelin
     basamaklı tepesi yanında kapı ile panel arasındaki alfa boşluğu) ortak modüle taşınsın (claude-kod görevi).

## Günlük
- 2026-10-13 blokaj: K22 (kullanıcı, 2026-10-13): videodan çıkıldı, ürün yalnız mobil öncelikli website. Yeni website standardı pilotla (G035) belirlenince yeniden tanımlanacak
- 2026-10-13 yeniden tanımlandı (K22–K24, G033)
- 2026-10-15 alindi: claude-G406
- 2026-10-15 bitti, incelemeye gönderildi
