---
id: G404
baslik: Tasarım 04 Vintage Airmail Love Letter — platform teması
rol: claude-kod
durum: inceleme
alan: wf-tema04
oncelik: 2
bagimli: [G204, G038, G046, G052]
yazar: [platform/themes/vintage-airmail-love-letter/, platform/tests/theme-vintage-airmail-love-letter.test.ts, platform/previews/g404/]
---

## Amaç
Tasarım 04'i platformda tema olarak kurmak (K24, `docs/10_SITE_PLATFORMU.md`): kapalı zarf açılış sayfası → home → story, details, rsvp; yalnız bu tasarımın GPT parçalarıyla (K21), kişisel metin HTML'de. **Kurallar `docs/11_TEMA_STANDARDI.md`'dedir; bu görev metniyle çelişirse docs/11 geçerlidir.**

## Girdiler
- Tema standardı: `docs/11_TEMA_STANDARDI.md` — bütünü; zarf tipi **kapaklı zarf** → §7.1 + §7.3; bitti tanımı §13, kontrol listesi §15
- Platform sözleşmesi: `platform/README.md` (işaretler, RSVP form sözleşmesi, `#site-data`); çalışan örnek `platform/themes/blush-garden-rose/` — **yalnız** işaret/RSVP/`#site-data`/oturum anahtarı kullanımı için; yerleşimi, aralıkları, süs konumları ve zamanlaması bu temaya taşınmaz (docs/11 §8). G035 kaynağı (`collections/03_Blush_Garden_Rose/website/`) örnek değildir
- GPT çıktıları (G204): `collections/04_Vintage_Airmail/assets/gpt/comps/` (W1, yerleşim referansı, satılmaz; yalnız sade adlar — `_vN` denemedir), `parts/` (katmanlar), `photos/` (örnek fotoğraflar)
- İçerik `collections/04_Vintage_Airmail/content.demo.json`, renk `collections/04_Vintage_Airmail/palette.json`, özet `collections/04_Vintage_Airmail/DESIGN_BRIEF.md`
- Araçlar: `tools/parts_prep.py` (geçici klasöre; docs/11 §5.3), `python3 tools/kit_check.py collections/04_Vintage_Airmail --paket 5`, `node scripts/theme-check.cjs --theme <slug>` (G052)

## Yapılacaklar
1. `theme.json`, 5 sayfa, `site.css`, `site.js`, `build_images.py`, `README.md` docs/11 §1–§4 düzeninde. 03'ten yalnız platform sözleşmesi alınır (motor işaretleri, RSVP formu, `#site-data`, slug'lı oturum anahtarları, `data-scene`/`data-step`/`data-a` kancaları); yerleşim, tipografi ve hiyerarşi bu tasarımın W1 comp'larından — tema `README.md`'sinde sayfa başına **comp öğe haritası** (her W1 öğesi → şablon öğesi ya da gerekçeli sapma; comp'u olmayan bölümler bu tasarımın parçaları ve tipografisiyle, docs/11 §8).
2. Parçalar: `python3 platform/themes/vintage-airmail-love-letter/build_images.py` → `parts_prep` **geçici klasöre** (`--prep-dir`; tema klasörüne, `img_src/`'ye ya da `assets/`'e asla — docs/11 §1, §5.3–§5.4), tip kesimleri (§7), maskeler, `free_zone`, yer tutucular, og; WebP + srcset genişlikleri (§5.1, §5.5). Yalnız bu tasarımın GPT parçaları; yeni şekil/dekor çizme (K21).
3. Zarf açılışı (`MOTION.envelope`, kapaklı zarf, docs/11 §7.1 + §7.3): On tap, the little wax seal pops off, the perforated tear strip rips away along the top edge from left to right, and the cream letter card slides up out of the envelope while a pressed flower flutters down. Katalog: Kenarları kırmızı-lacivert çizgili hava postası zarfı; şerit yırtılarak açılır, mektup kayar. Açılış cümlesindeki sıra, sayı ve yön bağlayıcıdır; kapanış elemanı, zarf/kapak ve kart ayrı katmanlar; kart home'daki karta dönüşür; `closure.png` kare tuvalde büyük çizilir; yeri kesim geometrisine bağlanır (`manifest.closure`, docs/11 §7.1).
4. Sayfa koreografisi (`MOTION.scenes`): her sayfada öğeler sırayla girer. Story: Tırtıklı kenarlı pul ve kartpostal kartları, masaya tek tek düşer (three large perforated postage-stamp frames scattered at slight angles across an old wooden writing desk, as if dropped one by one, a faint inky postmark ring (no letters or numbers) overlapping one corner); telefonda foto penceresi ≥ 38vw (sığmazsa basamaklı/alt alta düzen, comp sapması olarak yazılır — docs/11 §9). Parçacıklar `MOTION.accents` (§8: tür başına dosya ve yol). Details/rsvp: kart, satırlar ve buton sırayla.
5. Foto alanları: `hero_portrait` (card_small penceresi), `story_1..3` (frame_portrait), `venue` (frame_landscape); kutu ve maske `windows.json`'dan (§5.6, §9). PAKET 2 fotoğrafı yoksa yer tutucu.
6. Tasarıma özel ek parçalar (comp'taki ilgili öğe bunlardan kurulur, kodla çizilmez — K21): `bg_desk.png` — Story sayfası zemini — eski yazı masası.
7. Fontlar: Homemade Apple + Special Elite (Google Fonts link'i; repoya font dosyası girmez). Tarih motor biçimiyle (`May 15, 2027`). Link blokları `data-if="urls.*"` ile linksiz kalkar — "link will be added soon" diyen ölü düğme yok (§4).
8. Testler ve önizleme (§13): `platform/tests/theme-vintage-airmail-love-letter.test.ts`; `theme-check --theme vintage-airmail-love-letter` (5 genişlik, kısa telefonlar, akışlar, ağırlık, MP4); `platform/previews/g404/` (W1 comp | tema karşılaştırmaları dahil).

## Bitti sayılması için
- [ ] docs/11 §15 kontrol listesi tamam (atlanan madde Sonuç'ta gerekçesiyle)
- [ ] `npm test`, `npm run typecheck`, `npm run build` (trace-check) geçti; `tests/theme-vintage-airmail-love-letter.test.ts` (§13.2)
- [ ] `theme-check --theme vintage-airmail-love-letter` hatasız; `previews/g404/` + `compare_<sayfa>_390.jpg` qa-kontrol incelemesinden geçti
- [ ] Sonuç dürüst: açılış ve story tarifi, comp sapmaları, denenmeyenler (gerçek iPhone/Safari, yayın), sorunlu GPT parçaları

## Sonuç
**2026-10-14 · ikinci QA (KOŞULLU, 7 ÖNEMLİ bulgu) düzeltmesi (claude-kod) — durum: inceleme.** Bağımsız QA'nın 7 zorunlu
bulgusu düzeltildi ve **QA'nın kendi betikleriyle** (`m1_nav` … `m8_corner`, aynı boyutlar, demo / aralık / zorlama + taslak
önizleme kopyaları) yeniden ölçüldü. Çizim yok (K21): yalnız yerleşim/CSS/JS; görseller değişmedi.

| # | Bulgu (QA) | Ne yapıldı | Önce → sonra (QA betiği) |
|---|---|---|---|
| 1 | Hero sağ alt kümesi yazının altında; `hidden` `.corner { display: block }`'a yeniliyordu, çarpışma blok kutusuyla | `corner`: küme yerinde (`bottom: 26px`), yalnız ilk ekranın sonunu kesecekse nav'ın 8 px üstüne; hero'nun **satır kutularına** (`Range` dikdörtgenleri; hap ve kart kutusu) boyalı kenarı (`EDGE`: `decor_br` / `decor_tl` yüksekliğin 24'te biri başına sol / sağ boyalı uç, α ≥ 40) 3 px'ten yakınsa %6 adımlarla küçülür, < 64 px **`display: none`**. Test boyutlarına aralık 360×640, zorlama 375×812 / 384×854 eklendi | `m8`: 297 yüklemenin 47'sinde "gizli" küme yazının altında (aralık 360×640 mekân %14,4, zorlama 384×854 tarih %52,9, 375×812 isimler %17,7) → `m2` home, aynı 99 boyut × 3 kayıt = 297 yükleme: **> %2 olan 0**, hero yazısında 0 (en yüksek %0,14: sayfa sonundaki imza, foot kümesi). Küme 225 yüklemede küçülür (medyan %78), 10'unda kalkar (320–340 px) |
| 2 | Hero isimlerinin kuyrukları tarih satırını kesiyor | İsimlerin altında `.34em` (sıkı düzende, satır aralığı 1,28: `.4em`) boşluk; tarihin üst boşluğu kalktı; 375×553 demo ilk ekrana yine sığsın diye sıkı düzende mekân/geri sayım/hap aralıkları 2 px, `is-long` geri sayımı 22 → 6 px | `m7` (18 boyut × 3 kayıt × 5 sayfa = 270 ekran): home'da 1280×650 %10,0, 1366×657 %9,9, 1280×800 %3,5 … 320×568 %2,8 → **home 0 isabet**. Kalan el yazısı → yazı: story "Our Story" → kicker ≤ %0,57, RSVP isimleri → "With love," ≤ %0,66 (ikisi de ≤ %2 kenar yumuşatma; önce de vardı) |
| 3 | Zarf sayfası ve iç sayfa başları kümelere değiyor; önizleme çubuğu hesaba katılmıyor | `envFit`: iki köşe kümesi kicker, isimler ve "Tap to open"ın satır kutularına göre küçülür (`giveWay`); iç sayfa baş kümesi başın yazılarına göre; önizleme çubuğu: `site.js` `--bar`, CSS `--vh = 100svh − bar` (zarf sayfası, hero yüksekliği, yatay hero kartı, `.page-bg`, details/rsvp mektup genişliği) | `m3` (18 boyut × 3 + önizleme 360×640 / 390×844 / 390×690 / 844×390 / 1280×650 × 3 = 69): önce aralık 320×568 kicker %2,14, 340×720 kicker %4,1 / ipucu %2,1, 360×740 ipucu %3,0, önizleme 390×844 ipucu %12,8 → **69/69 %0**, en yakın boyalı piksel 6 px, ipucu ve kapalı zarf 69/69 ekranda (zarf kümeleri 138 yerleşimin 18'inde küçülür, en çok %22). `m2` details 320×568 aralık "WEDNESDAY" %4,8 → 0. `m1` önizleme (6 boyut × 3 kayıt × 4 sayfa): önce home 844×390 kart nav'ın altında (3 kayıt), details/rsvp `.page-bg` kümesi nav bandında (18 ekran) → **0 / 0** |
| 4 | RSVP: imza katlanınca büyük boş kâğıt | Katlamadan önce ritim sıkılaşır (`.tight`: hap, sicim, satır araları; hap ≥ 44 px), sonra mektup daralır (`--cw` ≥ 225 px: isimler ≥ 18 px, her şey oranla). `--sg` (yalnız imzayı küçültüp daraltan, satır ekleyen) kalktı. Yine sığmazsa tek katlama ve üstündeki boşluk sütunun aralarına dağılır (≤ 72 px/ara) | `m1` 72 RSVP ilk ekranı: önce 320×568 her kayıt 149 / 223 px (ilk ekran boşluğu / mektup içi aralık), zorlama 360×640 211/285, 375×667 235/309, zorlama masaüstleri 1024×768 … 1440×900 316–392 / 390–465, yatay 12–27 / 80–95 → **53 ekranda imza + mühür ilk ekranda** (320×568 demo, zorlama 1024×768, 1280×720/800, 1366×768, 1440×900, 1536×753, 1920×1080 dahil; isimler ≥ 18,7 px), **19 katlama**: ilk ekranda ≤ 14 px, mektup içinde 85–93 px (zorlama 1280×650 / 1366×657 de). İstisna: önizleme 844×390'da "We can't wait" satırı da katlanır (hap → nav 35 px, arada sicim; sicim → satır 82 px) |
| 5 | Details "Order of the Day"de çift katlama (bayat ikinci itme) | Kök neden: `[data-pack].packed` listenin `space-evenly`'sine yeniliyordu (eşit özgüllük, sonraki kural) → `.paper [data-pack].packed`; bir birim itilince sayfadaki öteki itmeler silinir (sayfada tek katlama); katlananın üstündeki boşluk listenin aralarına dağılır | Önce aralık 375×667 148 + 87 px, 1280×650 154 + 87, 1366×657 173 + 94, önizleme 390×844 168 + 92 / zorlama 227 + 69 → `m1` 288 ekranın hiçbirinde bir iç sayfada > 72 px'lik ikinci itme yok; 375×667 aralık: ilk ekran 9 px, mektup içi 87 px |
| 6 | Açılış çiçeği küçük telefonlarda çoğu kez yok (§8 cümlesi bağlayıcı) | `flightPath` artık boş dönmez: şerit çiçek + salınımı taşımıyorsa ikisi şeride göre küçülür (≥ 36 px), şerit yoksa zarf gövdesinin üstünden düşer (`over: '.env-open'`; kart orada gövdenin arkasında) | `m4` (normal hareket): önce 320×568 0/6, 360×640 2/6, 390×844 4/6 → **9 boyut × demo/aralık × 4 deneme = 72/72**, fotoğrafın üstünde 0 kare; dokun → home 3,75–3,95 s |
| 7 | Story başlık bloğu krem yazı kontrastı düşük; README iddiası yanlış | Başlık ve kicker yazı genişliğinde kutu; kicker 12,5 → 14 px; her krem yazının (başlık, kicker, giriş, foto başlıkları) arkasında kenarsız koyu gölge (`::before`, `radial-gradient(closest-side, rgba(30,16,6,.55) 60%, 0)`, §5.7); README düzeltildi | QA'nın `contrast_detail` ölçümü (yazı saydam, öğe kutusunun en kötü %5'i, gölgesiz / gölgeli): önce kicker 2,25 / 2,69 (390×844), 1,74 (1280×720), giriş 2,73 / 3,28, başlıklar 2,8 / 3,2, "Our Story" 2,4 / 2,8 → 390×844, 1280×720, 360×640, 1440×900, 844×390'da en düşük: "Our Story" **5,48** / 6,91, kicker **5,81** / 6,86, giriş **4,81** / 5,83, başlıklar **5,71** / 5,75 |

**Küçük notlar:** kapanış çiçekleri artık "Replay the envelope"ın altından başlar (yol 1,6 çiçek boyu yukarıdan başlıyordu;
`m6` 6 boyut × 3 kayıt kapanış: önce 18 koşunun 8'inde "Replay", isimler ya da tarih satırının arkasından geçiyordu → 0); README'deki
"yalnız alttaki bantta" artık doğru. Details W1.4 mekân fotoğrafı sapması README haritasına yazıldı (comp'ta mektubun hemen
altında, ilk ekranda; temada takvimden sonra, ilk ekranın altında). `invitation_card-960.webp` 193 KB (§6: ≥ 150 KB
gerekçe): home mektubunun `::after` alt dilimi, DPR ≥ 2'de ilk görünümde iner (CSS zemini `lazy` olamaz); hava postası
çizgisi ve kâğıt dokusu 960 px'te; ≤ 200 KB sınırının altında ve home ilk görünümü ≤ 1,5 MB (aşağıda). Yatay telefonda
varış çiçekleri isimlerin **arkasından** geçer (katman `z-index: 0`, yazı 1) — değiştirilmedi.

**Önceki turun düzeltilen iddiaları:** "küme 64 px altında gizlenir" (gizlenmiyordu: `hidden` CSS'e yeniliyordu); "kontrast
5 sayfa × 390×844 / 1280×720 hepsi ≥ 4,5:1, en düşük 4,75:1" (yanlış: masadaki krem yazıda en kötü %5 1,74–2,8:1 idi);
"RSVP imzası … 144 px boş kâğıt … 253–386 px" (asıl değerler QA'nın 149–392 px'i; şimdi ≤ 14 px); "details tek katlama"
(çift katlama vardı).

**Kontroller:** `npm test` **562/562** (temanın dosyası 32/32: yeni tarayıcı testi — hero ve zarf yazısı kümede değil, isimler tarihte değil, RSVP'de boş kâğıt yok, tek katlama, açılış çiçeği her telefonda — ve yeni statik iddialar), `npm run typecheck` temiz, `npm run build` + trace-check (16 rota, 6 tema). `theme-check --theme vintage-airmail-love-letter --stress --no-video` (port 42037) **117 geçti, 0 hata, 2 uyarı** (G075 teşekkür modu, G068 düzenlenebilir metinler → G081); ara koşu bir hata buldu (375×553 demo: isimlerin yeni alt boşluğu yüzünden geri sayım ilk ekranın altına katlanıyordu, theme-check demo'da katlamayı kabul etmez) → sıkı düzende isimler `.4em`, mekân 0 / geri sayım ve hap 4 px, `is-long` geri sayımı 6 px; dokun → home 3 806 ms; ilk görünüm (390×844, DPR 3) index 922 / home 1 234 KB yer tutucuyla, 1 016 / 1 416 KB örnek fotoğraflarla (≤ 1,5 MB; ≥ 150 KB: `invitation_card-960` 193 KB ve `decor_br-760` 179 KB, ikisi ≤ 200 KB). `g051-browser --theme …` **44/44** (port 42038), `final-smoke --theme …` **45/45** (port 42039; `previews/g404/final/` yenilendi). Bütçe: `site.js` **35 807 B** (≤ 35 840; girinti 1 boşluk, birleştirilmiş tanımlar — davranış aynı), `site.css` **46 032 B** (≤ 46 080; satır başı girintisi ve yorumlar kısaldı). Ölçüm betikleri (QA'nınkiler, port/yol uyarlandı) ve ham çıktılar geçici klasörde.

**Önizlemeler (`previews/g404/`):** `qa2_before_after_phone_1.jpg`, `qa2_before_after_phone_2.jpg`, `qa2_before_after_wide.jpg`
(önce = QA'nın bulduğu `site.js`/`site.css`, sonra = bu tur; aynı sunucu ve veri); yeni `final_*`: home 360×640 aralık,
384×854 zorlama, 1280×650; index 340×720 aralık; details 375×667 aralık (kaydırılmış: tek katlama); rsvp 320×568, 360×640
zorlama, 1280×800 zorlama; story 390×844; `final_opening_320x568.jpg` (dokunduktan 2 s sonra çiçek); önceki 12 `final_*` bu
turun görünümüyle yeniden çekildi; theme-check PNG'leri (`<sayfa>_<genişlik>.png`, `stress_*`, `range_*`),
`compare_<sayfa>_390.jpg` ve `checks.json` bu turun theme-check'inden; `final/` bu turun final-smoke'undan.
`opening_390x844.mp4` ilk turdan (açılış yolu değişmedi: yalnız çiçeğin şeridi/boyu; yeni video yok).

**Açık noktalar (dürüst):** bu turun bağımsız QA / qa-kontrol incelemesi bekliyor (durum `inceleme`). Hero kümesi telefonlarda
çoğunlukla küçük (geometri ihtiyatlı: el yazısının bütün satır kutusu + 3 px), 320–340 px'te 10 yüklemede yok. El yazısı → yazı
temasları %0 değil, ≤ %0,66 (story başlığı → kicker, RSVP isimleri → "With love,"). Story 360×640'ta katlanan ilk çerçevenin
posta damgası ilk ekranın son 1 px'inde (önceden de; dekor). Yatay telefonda varış çiçekleri isimlerin arkasından geçer.
Denenmedi: gerçek iPhone/Safari ve Android Chrome, Vercel yayını, gerçek alıcı fotoğrafları, yavaş ağ.

**2026-10-14 · inceleme + QA turu (claude-kod; önceki inceleme aşaması disk dolunca düşmüştü) — durum: inceleme.** Tema
standarda (docs/11 §15), W1 comp'larına ve G405/G402 QA derslerine karşı yeniden incelendi, bulunan her şey düzeltildi ve
ölçüldü. Görsel çizilmedi (K21): yalnız yerleşim/CSS/JS; görseller yine bu tasarımın GPT parçaları (`build_images.py`'ye yalnız
`theme_check.clusters` eklendi; yeniden koşulunca 55 görsel bayt bayt aynı). Ölçüm: tema motoruyla render + Playwright
(azaltılmış hareket, Google Fonts yüklü, örnek fotoğraflar), betikler ve ham çıktılar geçici klasörde.

| # | Bulgu (önem) | Ne yapıldı | Önce → sonra |
|---|---|---|---|
| 1 | **İç sayfalarda nav çizgisi yazıyı/çerçeveyi kesiyor (yüksek; ders 3).** story'de her boyutta ilk pul çerçevesi nav'ın altında yarım (yatayda "Our Story" başlığı), details'te program satırı / takvim düğmeleri, rsvp'de isimler, mühür, masaüstü form satırları | `site.js` `folds()`: `[data-fold]` birimleri (story başlık/kicker/giriş/her çerçeve/sıra, details kicker/başlık/her program satırı/takvim/mekân/dress/linkler/SSS, rsvp başlık/son tarih/hap/bekleme/imza/form, sayfa sonu bölümleri). Nav çizgisini kesen ya da nav bandında başlayan ilk birim için: esnek sütun toplanır (`[data-pack]`), baş yükselir (`[data-lift]`, ≤ üst boşluğun %35'i, köşe kümesi onunla küçülür), imza küçülür, olmazsa birim ilk ekranın altından başlar. Yatay/geniş ekranda details/rsvp mektubu ilk ekrana göre (`--cw`), başı kısa (köşe yanında) | Ölçüt: kutusu nav'ın üstünü kesen ya da nav bandında başlayan her yazı, bağlantı, foto alanı, çerçeve/kart/mühür görseli. 4 sayfa × 17 boyut (320×568 … 1920×1080, yatay 667×375 / 844×390, 1280×650/720/800, 1366×657/768) × demo/aralık/zorlama: **önce** story 51/51, details 29/51, rsvp 43/51 ekranda yarım parça; **sonra 204/204 temiz** (home dahil), yatay kaydırma yok, en küçük yazı ≥ 11 px |
| 2 | **Story masaüstü (yüksek; ders 4):** 1280×650 / 1366×657'de ilk ekranda hiç çerçeve yok (başlık + boş masa); 720–900 px yükseklikte bir çerçeve nav çizgisinde yarım; 2 + 1 ızgara tek çerçeveyi yalnız bırakıyordu; telefonda çerçeve 72vw ile ilk ekrana hiç sığmıyordu | ≥ 720 px'te üç çerçeve **tek sıra** (yüksek / alçak / orta, comp'un dağınık dizilişi tek satırda; README'de sapma), sıra tek fold birimi; `tiles` `--fw`'yi sıra nav'ın üstünde bitecek en büyük değere ikili aramayla ayarlar (≥ 160 px; sığmazsa sıra bütün katlanır, bir ekrana sığacak boyda). Telefonda çerçeve 64vw, ilk ekrana sığdırmak için pencere ≥ 38vw'ye kadar küçülür (başın yükselmesiyle), olmazsa katlanır; başlıklar çerçeveden 40 px geniş olabilir | Sonra: 768×1024, 1024×768, 1280×650/720/800, 1366×657/768, 1440×900, 1920×1080 × demo/aralık = **3/3 çerçeve ilk ekranda**, sıra nav'ın üstünde (altında 18–52 px masa; 768×1024 148, 1920×1080 146), pencere 156–325 px. Telefon: 360×640, 375×667, 390–430 px'te ilk çerçeve + başlığı ilk ekranda (pencere 45,4–54,7vw); katlanan: 320×568 (ve aralık kaydıyla 360×640), yatay telefon (ilk ekran başlık + giriş) |
| 3 | **Köşe kümeleri (yüksek; ders 1):** hero ve sayfa sonu `decor_br` alttan %16 maske ile soluyor, hero'da nav bandına 19 px giriyordu (204/204 ekranda maske; ölçülen her ekranda nav bandında) | Maskeler kaldırıldı (parça sapları doğal bitiyor, kesik değil); hero kümesi nav zemininin 8 px üstünde biter (`bottom: 26px`), hero ilk ekrandan uzunsa `corner` yükseltir ve kümenin **boyalı** kenarı (sekizde bir yükseklik başına sol kenar profili, `decor_br-480`'den ölçüldü) hero parçalarına değiyorsa %6 adımlarla küçültür (< 64 px gizler); sayfa sonu kümeleri 8 px üstte; `manifest.theme_check.clusters = ".corner"` (theme-check artık kesik/nav bandı denetler) | Sonra: 204 ekranda maske 0, nav bandında küme 0, kırpan ata yalnız ekran kenarı |
| 4 | **Zarf sayfası (orta; ders 7):** "Tap to open" 22/51 ekranda ekran dışında — yatay telefonda aralık/zorlama isimleriyle (388–410 px / 375–390), 1280×650 ve 1366×657'de demo ile bile; masaüstünde zorlama ile; telefonda uzun isimler köşe kümesinin sicimine biniyordu | `envFit`: ipucu ilk ekranın 6 px üstünde bitene kadar önce zarf (`--ok` ≥ 0,64), sonra isimler (≥ 20 px) küçülür; yatay/geniş ekranda isim sütunu iki küme arasında (`100vw − 1,6 × küme`); telefonda isimlere 5vw iç boşluk (sicimden uzak) | Sonra: 17 boyut × 3 kayıt = **51/51 ipucu ekranda**, zarf ekranda |
| 5 | **RSVP imzası (orta; ders 5):** 390×844'te mühür nav'ın altında (demo dahil); aralık isimleriyle 360/375 px'te isimler kesik. Kök neden ayrıca: `fitPaper` bant yuvarlaması (−0,004 tolerans; `offsetHeight` yukarı yuvarlanınca 390 px'te fazladan bir çizgi bandı: mektup 558 → 635 px) | Bant toleransı 1,5 px; mektup + mühür ilk ekrana sığacak boyda (`--cw`, ≥ 270 px; W1.5'teki gibi bütün mektup görünür); "With love," + isimler `.sig` birimi, mühürle birlikte ölçülür, katlanmadan önce `--sg` 1 → 0,72 (yazı, satır aralığı, alt boşluk, mühür); masaüstünde tek sütun (form altında) | Sonra imza + mühür ilk ekranda: demo ve aralık **28/34** — her dikey telefonda ≥ 360 px ve her masaüstünde (aralık 390×844: isimler 27,5 px, `--sg` .96; 360×640: 18,1 px), boş kâğıt 0; zorlama 5/17 (390–430 px, 768×1024, 1920×1080). Katlanan: 320×568 (144 px boş kâğıt), yatay telefon (7–22 px), zorlama 360/375 px (207/230 px) ve ≥ 1024 px masaüstlerinde (253–386 px: 40 karakterlik isimler sığmıyor; küçülen imza theme-check'in kâğıt testinde mektubun alt köşesindeki lekelere girdiği için daralıyor, `--sg` ile) |
| 6 | **İç sayfalar düz (orta; ders 2):** details/rsvp yalnız düz `bg_tile` + üstte tek küme; masaüstünde iki yan boş | `.page-bg` (100svh): home'daki harita çizgili parşömen (telefon) / bulanık sayfa (yatay) + damga; yatay/geniş ekranda sağ altta `decor_br` (nav'ın 8 px üstünde). Story'nin masası zaten atmosfer | `final_details_1280x720.jpg`, `final_rsvp_1280x720.jpg` |
| 7 | **Parçacıklar (orta; ders 6):** varış ve kapanış çiçekleri `z-index: 30` sabit katmanda isimlerin, geri sayımın, kapanış yazısının üstünden geçiyordu | Katman bölümün içinde (`.hero`, `.closing`), `z-index: 0` (yazılar 1), taşanı kırpılır; varışta iki unutmabeni fotoğrafın yanındaki şeritten yalnız fotoğrafın altına kadar (`to: 'avoid'`), kapanışta "Replay the envelope"ın altındaki bantta (`from`). Açılıştaki tek çiçek değişmedi (ekranda yazı yok) | 390×844 / 1280×720: katman `.hero` / `.closing` içinde, z 0, `overflow: hidden`; kapanış çiçekleri 225–323 px (yazı ~180 px'te biter) |
| 8 | **Comp sapmaları (düşük):** hero isimleri iki satır ("Margot / & Henry"; W1.2 tek satır); RSVP hapı açık periwinkle (#3D4F7A), comp'unki koyu lacivert | `fitNames` sığıyorsa (%86'ya kadar) tek satır; hap `--navy` #2B3753 (paletin `deep`'i koyulaştırılmış, etiket 10,8:1) | 390×844: isimler tek satır 40,5 px; `compare_home_390.jpg` |
| 9 | Doğrulanan, değişiklik gerekmeyen | Foto pencereleri DPR 3'te örnek fotoğraflarla: yeşil/pembe saçak yok, yarı saydam leke yok (ders 9). Kontrast boyalı zeminde (yazı saydam tam sayfa görüntüsünde satır başına zeminin en kötü %5'i, gölgesiz): 5 sayfa × 390×844 / 1280×720 hepsi ≥ 4,5:1, en düşük 4,75:1 (ders 10). Açılış kareleri: mühür 0 ms'de zıplar ve sola yuvarlanır, şerit 360–1220 ms soldan sağa yırtılır, kart 1,2 s'de zarftan kayar, tek unutmabeni kartın yanından (139 karede fotoğrafın üstünde 0), Skip her an (ders 8); koreografi değişmedi → **yeni video yok** (`opening_390x844.mp4` ilk turdan) | — |
| 10 | **Bu turun theme-check bulguları (düzeltildi):** taslak önizlemede (üstte platform çubuğu) hero'nun sol üst kümesi `scene-bg`'nin üst kenarında düz çizgiyle kesiliyordu; zorlama kaydında 390 px'te küçülen imza mektubun alt köşe lekelerine biniyordu (%1,2); zarf → home geçişinde nav etiketleri ilk karede yoktu (2 uyarı); G068 birleşince: home → zarf dönüşünde eski nav zarfın üstünde sönüyordu (2 uyarı) | Hero zemini yalnız yanlarda kırpar (`overflow: clip visible`); `.sig` küçüldükçe daralır (`(1 − --sg) × 36cqw`, `free_zone`'un alt satırları içinde); `::view-transition-new(site-nav):only-child { animation: none; }` ve `::view-transition-old(site-nav):only-child { animation: none; opacity: 0; }` (01 gibi) | Son koşu: aşağıda |

**Kontroller (iki origin/main birleştirmesinden sonra — ikincisi G068 data-copy + theme-check — bu worktree):** `npm ci`; `npm run build` +
trace-check (16 rota, 6 tema); `npm run typecheck` temiz; `npm test` **552/552** (ilk birleştirmeden sonra 539/539) (temanın 31 testi; yeni: maskesiz kümeler, fold birimleri, `--sg`, envFit,
bölüm içi parçacıklar, bant toleransı, story sırası + **tarayıcı testi**: story/details/rsvp × 375×667, 390×844, 844×390,
1366×657 × demo/zorlama nav'ın altında yarım parça yok; story 1280×650/720/800, 1366×768 × demo/aralık 3/3 çerçeve; rsvp aralık
360×640 … 1280×800 imza + mühür ilk ekranda; zarf 667×375 / 844×390 / 1280×650 × aralık/zorlama ipucu ekranda — önceki ölçümde bu
boyutların hepsi kural dışıydı). `theme-check --theme vintage-airmail-love-letter --stress --no-video`
(port 41991, çıktı geçici klasörde; son koşu ikinci birleştirmeden sonra) **117 geçti, 0 hata, 2 uyarı** (G075 teşekkür modu ve G068
düzenlenebilir metinler bu temada yok → G081); bilinen "content change" `IdentityMismatchError` bu koşularda yaşanmadı, akış
geçti; dokun → home 3 818 ms, azaltılmış hareket 153 ms; ilk görünüm
(390×844, DPR 3) index 922 / home 1 234 KB yer tutucuyla, 1 016 / 1 416 KB örnek fotoğraflarla (≤ 1,5 MB); dokunma hedefleri
≥ 44 px. Bu turun theme-check koşuları önce 2 hata + 2 uyarı, birleştirmeden sonra 2 yeni uyarı buldu; düzeltildi (#10).
`g051-browser --theme …` **44/44** (port 41992), `final-smoke --theme …` **45/45** (port 41993; ikisi de son birleştirmeden sonra; misafir ekranları `previews/g404/final/01–06` yenilendi).
Bütçe (KiB okuması, docs/11 §6): `site.js` 35 824 B (≤ 35 840; IIFE bir girinti sola, yorumlar kısaltıldı — gerekçeler README'de),
`site.css` 46 078 B (≤ 46 080). Tema klasörü 2,54 MB.

**Önizlemeler (`previews/g404/`):** `compare_<sayfa>_390.jpg` (W1 | tema) ve `checks.json` bu turun theme-check'inden;
`final_*.jpg` (12 ilk ekran: zarf 667×375 aralık / 844×390 zorlama, home 390×844 demo/aralık, story 375×667 / 1280×650 /
1366×768 aralık, details 844×390 / 1280×720, rsvp 360×640 aralık / 390×844 aralık / 1280×720); `qa_before_after_phone.jpg`,
`qa_before_after_wide.jpg` (önce | sonra); `final/01–06` misafir ekranları ve `final/checks.json` bu turun final-smoke'undan. Öteki theme-check PNG'leri (`<sayfa>_<genişlik>.png`, `stress_*`, `range_*`,
`opening_390x844.mp4`) **ilk turdan** — güncel görünüm compare_* + final_*.

**Açık noktalar (dürüst):** qa-kontrol alt-ajan incelemesi bu oturumda da yapılamadı (alt-ajan aracı yok) → §13.4 kapısı
açık, durum `inceleme` kalıyor; bağımsız QA'nın kendi ölçümüyle yeniden kontrolü gerekir. Kuralın bedeli: katlanan birimin
üstünde boş kâğıt/masa (sayılar #2 ve #5'te; en büyükleri zorlama kaydında). Yatay telefonda story ilk ekranı yalnız başlık +
giriş. 320 px zarf sayfasında zorlama isimleriyle "YOU ARE INVITED" kümenin unutmabenisine çok yakın. G075 teşekkür modu ve G068 düzenlenebilir
metinler (`theme.json` `copy` yok: theme-check "94 fixed texts" uyarısı) bu temada yok — ikisi de G081'in kapsamı. Denenmedi: gerçek iPhone/Safari ve Android Chrome (`svh`, `mask`, `clip-path` animasyonu, `:has`,
`ResizeObserver`, belgeler arası VT), Vercel yayını, gerçek alıcı fotoğrafları, yavaş ağ.

İlk tur metninde (aşağıda) artık geçersiz olanlar: `site.css` 44,6 KB / `site.js` 35,4 KB (şimdi 46 078 / 35 824 B),
"30 test" (şimdi 31), "telefonda zikzak tek sütun (pencere 56,8vw)" (şimdi 64vw çerçeve, ≥ 38vw), "≥ 720 px'te comp dizilişi"
(şimdi tek sıra), "kümeler düz kenarla kesilmez" (maskeyle soluyorlardı; şimdi bütün), "qa-kontrol incelemesi yapılmadı" (hâlâ yapılmadı).

**İlk tur — yapıldı (wf-tema04, 2026-10-14).** Durum: yerelde çalışan ve test edilen platform teması (`/start?theme=vintage-airmail-love-letter`
çalışır: tema klasöründen keşfedilir, `content.demo.json` = koleksiyon kaydı); **hiçbir yere yayınlanmadı**, görsel üretilmedi.
Ayrıntı: `platform/themes/vintage-airmail-love-letter/README.md` (dosyalar, foto alanları, görsel hattı + GPT kusur temizliği,
açılış/koreografi, home ilk ekranı, sayfa başına comp öğe haritası, bilinen sınırlar).

**Dosyalar:** `platform/themes/vintage-airmail-love-letter/` (`theme.json`, `content.demo.json`, 5 sayfa, `site.css` 44,6 KB,
`site.js` 35,4 KB, `build_images.py`, `README.md`, `img/` 50 WebP + 3 maske + og + favicon + `manifest.json`; klasör 2,54 MB),
`platform/tests/theme-vintage-airmail-love-letter.test.ts` (30 test: §13.2'nin 23 maddesi + zarf geometrisi, açılış cümlesi,
VT, story masası, mektup bandı, qa dersleri, srcset/lazy), `platform/previews/g404/` (5 sayfa × genişlikler, kısa/yatay/aralık/
stres görüntüleri, `compare_<sayfa>_390.jpg`, `compare_closure.jpg`, `cuts_envelope.jpg`, `opening_390x844.mp4`, `final/`,
`checks.json`).

**Açılış (tek cümle):** dokununca lavantalı balmumu mühür şeritten fırlayıp sola yuvarlanır, delikli şerit üst kenar boyunca
soldan sağa yırtılır (bağlı şerit soldan kırpılır, yırtılan parça yırtılma noktasında kalkıp uçar), krem mektup kartı zarftan
yukarı kayar ve öne gelir, bu sırada tek bir kuru unutmabeni kartın yanından (fotoğrafın üstünden değil) süzülerek düşer; 3,6 s'de
kart view transition ile home'daki karta dönüşür (ölçülen dokun → home 3,9–4,1 s). **Story (tek cümle):** yazı masasında (bg_desk
+ aynası, dikişsiz `repeat-y`) üç pul kenarlı çerçeve ekrana girdikçe tek tek, eğik ve derin gölgeyle masaya düşer, birincisine
posta damgası vurulur, yanlarına küçük pul ve unutmabeni bırakılır, başlıklar el yazısıyla yazılır; telefonda zikzak tek sütun
(pencere 56,8vw ≥ 38vw, yan kaydırma yok), ≥ 720 px'te comp dizilişi.

**Çözülen sorunlar (01/03 dersleri, bu tasarımda):** kapalı/açık hiza ölçülen ölçek + ötelemeyle (kit_check alt +%1,56 → sonra
±%0,13); gövde kapalı zarfın pikseli (açılırken doku/pul atlamaz); mühür ve monogram comp oranıyla şeridin merkezinde
(`compare_closure.jpg`); mektupların hava postası çizgileri **gerilmez**: tek çizgi periyodu (192 px) bant dosyası olarak tekrarlanır,
`fitPaper` tam banda yuvarlar; kartlardaki ve kâğıt karosundaki GPT pas noktaları yalnız yazı alanında yumuşatıldı (çizim yok);
yer tutucular temiz parşömen (en koyu 193–212 ≥ 170); ilk ekran: her parça nav'ın üstünde biter ya da tamamen altından başlar
(demo 360×640 hap 534/nav 567, 375×553 466/480, 844×390 290/323, 667×375 280/308; isimler ≥ 36 px), yatay telefon ızgarası;
kümeler düz kenarla kesilmez; dokunma dikdörtgeni yok; metin ≥ 11 px; parçacıklar fotoğrafların dışında; kart inince bekleme yok
(`arriveDelay` 0); MP4 beyazla başlamaz (ilk kare ort. 210,183,153); kontrast token'larda ≥ 4,5:1 (testte hesaplanır).

**Comp'tan bilinçli sapmalar (README haritasında gerekçeleriyle):** geri sayım kutuları → sade daktilo rakam (K21); story
başlıkları çerçevenin kâğıdında değil altında, masada (frame_portrait penceresi çerçevenin %80'i; 60 karakter sığmaz); story
telefonda zikzak; comp'taki mürekkep hokkası, dolma kalem, zarf köşesi, cipsofila demetleri ayrı parça olmadığı için yok (lamba
ışığı yalnız kenarsız CSS ışığı); hero kartının yanındaki cipsofila dalı yerine accent_2 unutmabeni; nav çizgisinin ortasındaki
minik çiçek yok; dress code yan çizgileri yerine sicim; mühürlerde monogram (comp'ta boş); Homemade Apple comp'taki ince
kaligrafiden geniş (isimler daha çok sarar, `fitNames` küçültür). Comp'u olmayan home bölümleri (mektup, "Inside this letter",
kapanış) bu tasarımın parçalarıyla.

**Komutlar ve sayılar (merge sonrası, Node 22):** `npm ci`; `npm test` 378 test: 376 geçti, 0 hata, 2 atlandı (temanın dosyası
30/30); `npm run typecheck` temiz (build'den sonra; öncesinde eski `.next/types` origin'deki silinen `app/page.js`'i arıyordu);
`npm run build` + trace-check: 16 rota 4 temanın şablonlarını izliyor (bu tema dahil, rota başına ≤ 219 KB), varlık rotası 166
dosya. `theme-check --theme vintage-airmail-love-letter --stress`: merge **öncesi** 114 geçti / 0 hata / 0 uyarı; merge
**sonrası** 108 geçti / **1 hata** / 0 uyarı — hata temada değil: "content change" akışı (`scripts/theme-check.cjs`
`editAndPublish`) yayınlanmış demo sitenin isim/tarihini değiştirip yayınlıyor, G060'ın düzenleme hakkı kuralı bunu artık
reddediyor (`IdentityMismatchError`: "the draft's names or date need a confirmed change before publishing"; ayrı betikle aynen
üretildi). Her tema için geçerli; düzeltme `scripts/` (bu görevin yazma alanı dışı) → önerilen görev aşağıda. Temanın içerik
değişimi node testinde (#5) ve merge öncesi tarayıcı koşusunda geçti; `details_390_changed_content.png` o koşudan.
İlk görünüm (390×844, DPR 3): index 921 KB / home 1233 KB yer tutucuyla, 1014 / 1414 KB örnek fotoğraflarla (≤ 1,5 MB);
azaltılmış hareket → home 314 ms; dokunma hedefleri ≥ 44 px. `g051-browser --theme …` 44/44, `final-smoke --theme …` 44/44
(`previews/g404/final/`). `kit_check --paket 5` 24/24 (+ hiza uyarısı, build düzeltir), `--paket 2` 5/5. Python:
`test_tema_build.py --hizli`, `test_parts_prep.py`, `test_parts_prep_paket5.py`, `test_kit_check.py` tamam.

**qa-kontrol:** bu oturum bir iş akışı alt-ajanı; alt-ajan başlatma aracı yok, **qa-kontrol incelemesi yapılmadı**. Yerine
`compare_*_390.jpg` ve `compare_closure.jpg` kendim gözden geçirdim (sonuç: comp öğeleri yukarıdaki sapmalar dışında yerinde;
düzeltilen iki şey: el yazısında kelime arası dar — "OurStory" — `word-spacing`, home'daki günün mektubunda satırlar üstte
toplanıp alt yarı boştu — ortalandı). Kapı (docs/11 §13.4) için qa-kontrol incelemesi entegratörde bekliyor.

**Denenmedi:** gerçek iPhone/Safari ve Android Chrome (`svh`, `mask`, `clip-path` animasyonu, view transition), temanın
Vercel'de yayını, gerçek alıcı fotoğrafları (farklı oran/ışık), yavaş ağ, `latin-ext` harfli isimler (Homemade Apple yalnız
`latin`; ł/ő/ş el yazısında yedek fonta düşer — README sınırı).

**Sorunlu GPT parçaları ve önerilen prompt düzeltmesi (`tools/katalog.py` `WEB[04]` / ortak metin):**
- `envelope_open`: kapalının düzenlemesi ama ~25 px aşağıda, %0,5 geniş → "same canvas, same scale and position as
  envelope_closed; only the tear strip is torn away".
- Bütün şeffaf parçalar: gövde alfası 253, çevrede alfa 1–5 "bulut" → "fully opaque object (alpha 255), crisp alpha edge, no
  semi-transparent haze around it".
- Pencereler (`frame_*`, `card_small`): saf/tam opak #00FF00 değil, yarı saydam leke ve gölge → "flat fully opaque #00FF00 window,
  no shadow or texture inside".
- `invitation_card`, `info_card`, `card_small`, `bg_tile`: yazı alanında pas noktaları/kahve lekeleri → "aging only at the
  edges; the writing area is clean, even paper".
- `bg_desk`: dikişsiz değil (üstte ışık huzmesi) → "seamlessly tileable vertically, even lighting, no light beam at an edge"
  (şimdilik aynalanmış karo).
- `frame_portrait`: pencere çerçevenin %80'i; comp'taki gibi başlık kâğıtta isteniyorsa "wide paper margin below the window for a
  handwritten caption". Story'nin hokka/kalem/zarf köşesi isteniyorsa ayrı `desk_props` parçası.

**Önerilen görevler (entegratör açar):** (1) claude-kod: `scripts/theme-check.cjs` `editAndPublish` (ve varsa `final-smoke`/
`g051-browser` benzerleri) G060 kimlik hakkıyla uyumlu olsun — değişikliği onaylayan/hakkı veren yol (`grantIdentityChanges` +
panelin onay adımı) ile yayınlasın; şu an her temada "content change" kırmızı. (2) qa-kontrol: G404 `compare_*` incelemesi.
(3) gpt-gorsel: yukarıdaki prompt düzeltmeleri.

## Günlük
- 2026-10-13 blokaj: K22 (kullanıcı, 2026-10-13): videodan çıkıldı, ürün yalnız mobil öncelikli website. Yeni website standardı pilotla (G035) belirlenince yeniden tanımlanacak
- 2026-10-13 yeniden tanımlandı (K22–K24, G033)
- 2026-10-14 alindi: wf-tema04
- 2026-10-14 bitti, incelemeye gönderildi
- 2026-10-14 entegratör notu: docs/11 §3.6 teşekkür hâli bu temada yok (G081'de toplu).
- 2026-10-14 inceleme + QA turu (claude-kod): ilk ekran–nav kuralı 204/204, story masaüstü sırası, RSVP imza + mühür, bütün kümeler, iç sayfa zemini, bölüm içi parçacıklar, zarf ipucu; npm test 552/552, theme-check 117/0/2 (uyarılar G081), g051 44/44, final-smoke 45/45; durum inceleme (qa-kontrol bekliyor)
- 2026-10-14 ikinci QA (KOŞULLU, 7 ÖNEMLİ) düzeltildi (claude-kod): hero kümesi (`display: none`, satır kutuları, boyalı kenar), isim kuyrukları, zarf/baş kümeleri + önizleme çubuğu (`--vh`), RSVP boş kâğıt (sıkı ritim, `--cw` ≥ 225, katlama boşluğu dağıtılır), details tek katlama, açılış çiçeği her telefonda, story kontrastı; QA betikleriyle yeniden ölçüldü; npm test 562/562, theme-check 117/0/2, g051 44/44, final-smoke 45/45; durum inceleme
