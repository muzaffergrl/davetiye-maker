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
**Yapıldı (2026-10-14, wf-tema02; inceleme düzeltmeleri aynı gün).** `platform/themes/dusty-blue-champagne/` (theme.json,
content.demo.json = koleksiyon kaydı birebir, 5 sayfa, site.css 44 781 B ve site.js 34 912 B — ikisi de 1 KB = 1000 B okumasıyla
da bütçenin altında —, build_images.py, README.md, img/ 50 dosya; klasör 1,80 MB), `platform/tests/theme-dusty-blue-champagne.test.ts`
(§13.2'nin 23 maddesi + zarf, VT, story, home, qa dersleri, tasarım aralığı, inceleme düzeltmeleri: 30 test), `platform/previews/g402/`.
Ayrıntı ve ölçümler tema `README.md`'sinde.

- **Açılış:** dokununca tozlu mavi mum mühür kopup (0 ms) dönerek ekranın altından düşer, V kapak yukarı açılır, altın damask
  astar görünür, kart ön cebin arkasından yükselir; bu sırada tek okaliptüs yaprağı kartın yanından süzülür (accent_1 × 1,
  `fall`; her açılışta tam bir yaprak, fotoğrafın üstünden geçmez), kart belirgin biçimde öne gelir (%3,5 yukarı, × 1,09, büyüyen
  gölge) ve hâlâ hareket ederken view transition ile home hero kartına uçar (dokun → home **3,9 s**, theme-check 3 919 ms; Skip her
  an). Mühür kapaktan ayrı katman (`carried_by_flap: false`), yeri V ucuna bağlı, boyu W1.1 comp'tan (`compare_closure.jpg`).
- **Story:** üç anlık baskı sırayla (her biri kendi sahnesi) yandan/alttan uçup hafif taşmayla −4,5° / +4° / −2,5° oturur,
  başlıklar baskının alt kenar boşluğuna yazılır; 2. baskının çerçevesi aynalı (dalı sağ üstte), önceki baskı sonrakinin üstünde.
  Telefonda basamaklı sütun (pencere 50vw ≥ 38vw), ≥ 760 px'te comp dizilişi.

**G402 incelemesi (17 bulgu) — yapılanlar:**
1. **Hero kümesi düz çizgiyle kesiliyordu (yüksek, iki bulgu):** `.hero-bg` artık yalnız yanlarda kırpar (`overflow-x: clip`), alt
   küme kendi alfasıyla nav bandının 8 px üstünde biter (`bottom: 24px`, maske yok); 1280'de de kesik yok. Sayfa sonu kümeleri
   de bandın 8 px üstünde biter (`--navpad` + 24 px). Kısa telefon/yatayda küme küçülür, sayaç/ipucu yazısına binmez.
   Platformun önizleme çubuğu hero'dan düşülür (`--bar`). **theme-check'e ölçüm eklendi** (`theme_check.clusters`, yalnız bu
   kümeyi bildiren temalarda): kırpan ata yalnız ekran/sayfa kenarında olabilir; ilk ekranda ve sayfa sonunda nav bandının altına
   giren küme hata. README ve bu Sonuç'taki eski "kesilmiyor" iddiası yanlıştı; düzeltildi.
2. **Nav bandı kümeyi biçiyordu:** yukarıdaki (a) seçeneği: küme bandın 8 px üstünde (ilk ekran ve sayfa sonu).
3. **Hero hiyerarşisi (01'e benziyordu):** W1.2 oranları — kart `min(42vw, 30svh, 250px)` (390'da 164 px, −2,5° eğik), isimler
   390'da 64 px, kart–isim arası hava; ≥ 1024 px iki sütun (kart solda 240–340 px, isimler 1280'de 88 px). İlk ekran kuralı
   3 kayıt × 13 boyutta yeniden ölçüldü: yarım parça yok, isimler ≥ 36 px.
4. **Açılış sonu bekleme:** `forward` okunur (%3,5 yukarı, × 1,09), `rise` 140 ms erken, `go` 4 200 → 3 650 ms (forward başlangıcı +
   550 ms, kart hareket ederken); dokun → home 4,4–4,9 s → 3,9 s.
5. **Zemin:** geniş/yatay ekranda `paper_wide-755` (bg_page'in en geniş çiçeksiz bandı; 1280'de × 1,7) %60 + dikişsiz `bg_tile`
   kendi ölçüsünde (q 85). `bg_page-*` ve `mist-640` artık üretilmiyor (test: img/ içindeki her görsel bir sayfa/CSS/JS'te
   kullanılıyor). **Kısmen:** "≥ 800 px kâğıt" — kaynakta 755 px'ten geniş çiçeksiz bant yok; büyütmek ayrıntı eklemezdi.
6. **Yatay telefon açılışı:** kapalı zarf dikeyde ortalı; dokununca isimler solarken sahne ortaya ve kart sığacak kadar aşağı
   kayar; kartın üstü ≥ 12 px (ölçüm 844×390: 15 px). Genel kural: yükselen kart her boyutta ekranın üstüne ≥ 12 px uzak (sahne
   gerekirse aşağı kayar; 7 boyut × 2 kayıtta ≥ 13 px). theme-check'in "kapalı zarf ekranda" denetimi artık manifest'teki
   `stage.closed_obj.box_pct` kutusunu ölçer (sahnenin boş kart odası değil; kutu yoksa eskisi gibi `.stage`).
7. **Eğrelti tonu:** `florals_br` H 25–45° doygunluk × 0,74, parlaklık × 1,04 (0,61 → 0,48; `florals_tl` × 0,86 → 0,525);
   `manifest.cleanup.florals_*.fern_grade`. Renk düzeltmesi, çizim değil.
8. **Zarfın altında 1 px kart şeridi:** `card-slot` kırpması altta %1,2.
9. **Story dalı başlığa biniyordu:** 2. baskının çerçevesi aynalı (yalnız görsel; pencere/maske/foto/başlık ona göre), bindirme
   −9vw → −6vw, önceki baskı üstte.
10. **Davet kartı isim levhası gibiydi:** **önerilen yol uygulanmadı** — davet kartının %39–60 bandının sol kenarında yaprak ve
    altın eğrelti var (%62'ye kadar), sağdaki eğrelti %55'te başlıyor; germek GPT yapraklarını sündürürdü. Yerine **davet seti**:
    ev sahibi satırı başlık → çiçekli kart (isimler, "&" ~0,8 ×) → altına sıkıştırılmış düz `info_card` (3 dilim) üstünde davet
    cümlesi, tarih bloğu, saat, dal, mekân. Metin artık kâğıtta.
11. (1 ile aynı.)
12. **Yaprak bazen hiç çıkmıyordu:** şerit seçimi geniş tarafı alır, boy (≥ 28 px) ve salınım şeride sığacak kadar küçülür;
    ölçüm 320/360/390/430/844×390'da 12/12 açılışta 1 yaprak, hiçbir karede foto penceresinde değil.
13. **60 karakterlik başlık dalın altında kalıyordu:** 9'daki düzen; 58–60 karakterlik iki satırlık başlıklarla 320/360/390/430/
    768/1280'de başlık bölgesi öteki baskılar gizlenip karşılaştırıldı: %0 örtülme.
14. **RSVP kapanışında asılı "·":** `.dot` span (bütün sayfalarda çıplak "·" yok; test).
15. **Süreç:** theme-check "content change" yaması artık "Maren & Jonah" (hiçbir demoda yok) → yanlış alarm yok; latin-ext
    doğrulandı (Google Fonts CSS'inde iki aile için de `latin-ext` bloğu). **qa-kontrol incelemesi yine yapılamadı:** bu
    oturumda da alt-ajan aracı yok; `compare_*_390.jpg` ve README haritası yalnız kendi gözümle karşılaştırıldı — §13.4 kapısı
    açık, entegratörün qa-kontrol koşturması gerekiyor.
16. **`venue.city`:** kart kopyası artık docs/11 §3.2'deki `venue.city_region` ("Charleston, South Carolina", dengeli iki satır;
    sığmazsa `fitCopy` düşürür).
17. **Boyut:** yorumlar kısaltıldı, yinelenen kurallar birleşti, renkler hex; site.css 44 781 B, site.js 34 912 B; test sınırı
    45 000 / 35 000 B.

**Comp sapmaları (README'de harita):** geri sayım kutuları yok (K21, sade rakam); story telefonda basamaklı (≥ 38vw); hero kartında
tarih ve şehir ayrı satırlar (`city_region`); ≥ 1024 px iki sütunlu hero (masaüstü comp yok); details'te standart gün · tarih başlığı
kartın içinde; home'daki davet seti, bölümler ve kapanış comp'suz bölümler (bu tasarımın parçaları); story'de baskılar arasındaki
küçük çiçek kümeleri yok (ayrı parça yok).

**Komutlar** (son hâlde; origin/main birleştirildikten sonra yeniden koşuldu): `npm ci` · `npm test` 496/496 · `npm run typecheck`
temiz · `npm run build` + trace-check (16 rota, 6 tema) · `theme-check --theme dusty-blue-champagne --stress` **116 geçti / 0 uyarı
/ 0 hata** · `g051-browser --theme` 44/44 · `final-smoke --theme` 45/45 · `kit_check --paket 5` 23/23, `--paket 2` 5/5, hiza
tamam (sol −0,20 · sağ +0,29 · alt +0,07 %) · `test_tema_build --hizli`, `test_kit_check`, `test_parts_prep` tamam ·
`build_images.py --out <geçici>` img/ ile bayt bayt aynı. İlk görünüm (390×844, DPR 3): index 917 KB / home 1012 KB yer
tutucuyla, 979 / 1147 KB örnek fotoğraflarla (≤ 1,5 MB). Kontrast (yeniden): küçük metin en düşük 4,69, büyük 4,41. Önizlemeler
`previews/g402/` (compare_<sayfa>_390, compare_closure, cuts_envelope, kısa/yatay/aralık/stres, opening_390x844.mp4, checks.json,
final/).

**Denenmedi:** gerçek iPhone/Safari ve Android Chrome (`svh`, `mask`, `overflow-x: clip`, `translate`, VT), Vercel yayını, gerçek
alıcı fotoğrafları, yavaş ağ (`go` 3,65 s'de başlar; yavaş ağda home daha geç gelir), qa-kontrol alt-ajanı (yukarıda).

**Sorunlu GPT parçaları → önerilen prompt eki (`tools/katalog.py` WEB[02] / ortak metin; görsel bu görevde üretilmedi):**
(1) bütün şeffaf parçalar: "crisp alpha edge; no glow, haze, soft shadow or coloured fringe outside the object; fully transparent
beyond 2 px of the edge"; (2) pencereler: "window exactly #00FF00 with a hard edge, no anti-aliased coloured ring"; (3)
envelope_open: "the open flap's fold line on exactly the same row as the closed envelope's top edge" (GPT ~23 px yukarıda çizdi);
(4) bg_tile: "seamless: left/right and top/bottom edges continue each other"; (5) florals_br: "champagne gold fern, low
saturation, the same tone as florals_tl". **Önerilen GPT işi (kullanıcı "gerekirse GPT'ye yaptıralım" dedi; entegratör açar):**
(a) `invitation_card_tall.png` — aynı çiçekli kart, köşe kümeleri yalnız sol üst ve sağ altta, ortada **tam genişlikte, dekorsuz
uzun kâğıt bandı** (kartın %40'ı): davet metni tek kartta, 3 dilimle uzayabilir; (b) `bg_page_wide.png` 1536 × 1024 çiçeksiz bokeh
kâğıt (masaüstü zemini için ≥ 1200 px temiz alan); (c) story için dalı farklı köşede/biçimde 2 çerçeve varyantı (comp'taki gibi).

## Günlük
- 2026-10-13 yeniden tanımlandı (K22–K24, G033)
- 2026-10-14 alindi: wf-tema02
- 2026-10-14 bitti, incelemeye gönderildi
- 2026-10-14 inceleme düzeltmeleri (17 bulgu; wf): hero/sayfa sonu kümeleri düz çizgiyle ve nav bandıyla kesilmiyor, W1.2 hero
  oranları + ≥ 1024 iki sütun, okunur forward + go 3,65 s (dokun → home 3,9 s), yatay açılış ortalı, deterministik yaprak, aynalı
  story baskısı, davet seti (info_card), geniş ekran kâğıdı + bg_tile, eğrelti tonu, card-slot kırpması, `.dot`, `city_region`,
  boyut payı; ortak `scripts/theme-check.cjs` + `scripts/lib/theme-env.ts` (inceleme istedi): "Jonah" yaması, `theme_check.clusters`
  kesik küme ölçümü, kapalı zarf ölçümü `stage.closed_obj`'a göre. theme-check 116/0/0. qa-kontrol alt-ajanı yine koşturulamadı.
- 2026-10-14 entegratör notu: G075 teşekkür modu main'de; bu temaya docs/11 §3.6 teşekkür hâli işaretleri eklenmeli (theme-check uyarı veriyor) — onaydan sonra G081'de toplu.
