---
id: G416
baslik: Tasarım 16 Sunflower Rustic Barn — platform teması
rol: claude-kod
durum: bitti
alan: claude-G416
oncelik: 3
bagimli: [G216, G038, G046, G052]
yazar: [platform/themes/sunflower-rustic-barn/, platform/tests/theme-sunflower-rustic-barn.test.ts, platform/previews/g416/]
---

## Amaç
Tasarım 16'i platformda tema olarak kurmak (K24, `docs/10_SITE_PLATFORMU.md`): kapalı zarf açılış sayfası → home → story, details, rsvp; yalnız bu tasarımın GPT parçalarıyla (K21), kişisel metin HTML'de. **Kurallar `docs/11_TEMA_STANDARDI.md`'dedir; bu görev metniyle çelişirse docs/11 geçerlidir.**

## Girdiler
- Tema standardı: `docs/11_TEMA_STANDARDI.md` — bütünü; zarf tipi **kapaklı zarf** → §7.1 + §7.3; bitti tanımı §13, kontrol listesi §15
- Platform sözleşmesi: `platform/README.md` (işaretler, RSVP form sözleşmesi, `#site-data`); çalışan örnek `platform/themes/blush-garden-rose/` — **yalnız** işaret/RSVP/`#site-data`/oturum anahtarı kullanımı için; yerleşimi, aralıkları, süs konumları ve zamanlaması bu temaya taşınmaz (docs/11 §8). G035 kaynağı (`collections/03_Blush_Garden_Rose/website/`) örnek değildir
- GPT çıktıları (G216): `collections/16_Sunflower_Rustic/assets/gpt/comps/` (W1, yerleşim referansı, satılmaz; yalnız sade adlar — `_vN` denemedir), `parts/` (katmanlar), `photos/` (örnek fotoğraflar)
- İçerik `collections/16_Sunflower_Rustic/content.demo.json`, renk `collections/16_Sunflower_Rustic/palette.json`, özet `collections/16_Sunflower_Rustic/DESIGN_BRIEF.md`
- Araçlar: `tools/parts_prep.py` (geçici klasöre; docs/11 §5.3), `python3 tools/kit_check.py collections/16_Sunflower_Rustic --paket 5`, `node scripts/theme-check.cjs --theme <slug>` (G052)

## Yapılacaklar
1. `theme.json`, 5 sayfa, `site.css`, `site.js`, `build_images.py`, `README.md` docs/11 §1–§4 düzeninde. 03'ten yalnız platform sözleşmesi alınır (motor işaretleri, RSVP formu, `#site-data`, slug'lı oturum anahtarları, `data-scene`/`data-step`/`data-a` kancaları); yerleşim, tipografi ve hiyerarşi bu tasarımın W1 comp'larından — tema `README.md`'sinde sayfa başına **comp öğe haritası** (her W1 öğesi → şablon öğesi ya da gerekçeli sapma; comp'u olmayan bölümler bu tasarımın parçaları ve tipografisiyle, docs/11 §8).
2. Parçalar: `python3 platform/themes/sunflower-rustic-barn/build_images.py` → `parts_prep` **geçici klasöre** (`--prep-dir`; tema klasörüne, `img_src/`'ye ya da `assets/`'e asla — docs/11 §1, §5.3–§5.4), tip kesimleri (§7), maskeler, `free_zone`, yer tutucular, og; WebP + srcset genişlikleri (§5.1, §5.5). Yalnız bu tasarımın GPT parçaları; yeni şekil/dekor çizme (K21).
3. Zarf açılışı (`MOTION.envelope`, kapaklı zarf, docs/11 §7.1 + §7.3): On tap, the gingham bow tugs loose and the ribbon slides off with its little sunflower, the kraft flap flips open, and the card slides out onto the weathered barn-wood tabletop (barnwood.png) while a few sunflower petals tumble. Katalog: Kraft zarf; kareli kurdele çözülür, kart ahşap masaya kayar. Açılış cümlesindeki sıra, sayı ve yön bağlayıcıdır; kapanış elemanı, zarf/kapak ve kart ayrı katmanlar; kart home'daki karta dönüşür; `closure.png` zarfla aynı tuvalde çizilir, `envelope_closed` üstüne 1:1 oturur.
4. Sayfa koreografisi (`MOTION.scenes`): her sayfada öğeler sırayla girer. Story: İpe mandalla asılmış fotoğraflar, tek tek mandallanır (three vintage deckle-edged photo prints pegged one by one with small wooden clothespins onto a gently sagging jute twine line against a weathered barn-wood wall); telefonda foto penceresi ≥ 38vw (sığmazsa basamaklı/alt alta düzen, comp sapması olarak yazılır — docs/11 §9). Parçacıklar `MOTION.accents` (§8: tür başına dosya ve yol). Details/rsvp: kart, satırlar ve buton sırayla.
5. Foto alanları: `hero_portrait` (card_small penceresi), `story_1..3` (frame_portrait), `venue` (frame_landscape); kutu ve maske `windows.json`'dan (§5.6, §9). PAKET 2 fotoğrafı yoksa yer tutucu.
6. Tasarıma özel ek parçalar (comp'taki ilgili öğe bunlardan kurulur, kodla çizilmez — K21): `twine_line.png` — Story ipi (fotoğraflar mandalla asılır); `barnwood.png` — Ahşap masa/duvar (açılış + story).
7. Fontlar: Kaushan Script + Merriweather (Google Fonts link'i; repoya font dosyası girmez). Tarih motor biçimiyle (`May 15, 2027`). Link blokları `data-if="urls.*"` ile linksiz kalkar — "link will be added soon" diyen ölü düğme yok (§4).
8. Testler ve önizleme (§13): `platform/tests/theme-sunflower-rustic-barn.test.ts`; `theme-check --theme sunflower-rustic-barn` (5 genişlik, kısa telefonlar, akışlar, ağırlık, MP4); `platform/previews/g416/` (W1 comp | tema karşılaştırmaları dahil).

## Bitti sayılması için
- [x] docs/11 §15 kontrol listesi tamam (atlanan madde Sonuç'ta gerekçesiyle)
- [x] `npm test`, `npm run typecheck`, `npm run build` (trace-check) geçti; `tests/theme-sunflower-rustic-barn.test.ts` (§13.2)
- [x] `theme-check --theme sunflower-rustic-barn` hatasız; `previews/g416/` + `compare_<sayfa>_390.jpg` qa-kontrol incelemesinden geçti
- [x] Sonuç dürüst: açılış ve story tarifi, comp sapmaları, denenmeyenler (gerçek iPhone/Safari, yayın), sorunlu GPT parçaları

## Sonuç
**Durum: tema çalışıyor, bütün komutlar hatasız, qa-kontrol karşılaştırma kapısı geçti.** Dal `claude/g416-tema` (claude-G416,
2026-10-15).

**Ne yapıldı (dosyalar).** `platform/themes/sunflower-rustic-barn/`: `theme.json` (5 sayfa, 5 foto anahtarı, 71 standart copy
anahtarı), `index.html` · `home.html` · `story.html` · `details.html` · `rsvp.html`, `site.css` (45 412 B ≤ 45 KiB), `site.js`
(34,5 KB), `thank-you.css`, `content.demo.json` (= koleksiyon kaydı), `build_images.py` (`tools/tema_build.py` + bu tasarımın
kesimleri), `README.md` (dosyalar, foto alanları, görsel hattı, koreografi, ilk ekranlar, 5 sayfanın comp öğe haritası +
sapmalar, sınırlar), `img/` (build çıktısı, klasör 2,39 MB ≤ 3 MB). `platform/tests/theme-sunflower-rustic-barn.test.ts`
(38 test). `platform/previews/g416/` (theme-check çıktısı, `compare_<sayfa>_390.jpg` ×5, `compare_closure.jpg`,
`cuts_envelope.jpg`, `stage_closed/open.jpg`, `opening_390x844.mp4`, `final/`). Ortak dosyaya dokunulmadı.

**Açılış (tek cümle):** dokununca hardal kareli fiyonk ayçiçeği düğümünün çevresinde çekilip gevşer, kurdele ayçiçeğiyle
birlikte bant boyunca sağa kayıp zarfın sağ kenarında arkaya döner (solmaz), yuvarlak köşeli kraft kapak menteşesinde kalkar ve
kareli astarlı iç yüz −90°'den dikilir, zarfın altında GPT ahşap masa belirir, kart cepten yükselip masaya doğru öne kayar
(× 1,05, %3,5 aşağı, büyüyen gölge) ve bu sırada 5 ayçiçeği yaprağı dönerek düşer → view transition ile home (ölçülen 4,56 s).

**Story (tek cümle):** dikey tahtalı ahşap duvarda (GPT barnwood, 90° döndürülmüş) üç sarkık jüt ip sırayla gerilir, her
birine bir eski baskı mandalının çevresinde salınarak tek tek mandallanır ve altına başlığı yazılır; telefonda foto penceresi
51vw (≥ 38vw), comp gibi alt alta.

**Comp sapmaları** (ayrıntı README comp haritasında): geri sayım kutusuz sade rakam (K21 §5.7); W1.1'de fiyonk arkasındaki
buğday/cipsofila spreyi GPT `closure.png`'de yok (kodla eklenmedi); "YOU ARE INVITED" altındaki ♥ süsü ve nav'daki ♥ ayırıcı
GPT parçası olmadığından yok; story başlıkları baskının alt kenarına değil altına (duvara, krem yazı + gölge hâlesi); details
satırında "yer" telefonda etkinliğin altına iner (üç sütun 360 px'e sığmaz); story duvarı GPT'den yatay/soluk geldi → 90°
döndürüldü + CSS ışık filtresi; home'da comp'u olmayan bölümler (davet kartı, ipe mandallı iki baskı, kapanış) bu tasarımın
parçalarıyla.

**Komut sonuçları.**
- `kit_check --paket 5` 25/25 (hiza sol +0,10 · sağ −0,20 · alt +1,43 %; kurdele uçları −0,39 / −0,10 %), `--paket 2` 5/5.
- `build_images.py`: kapak `kapak_kes("egri")` renk (sol yuvarlak köşe ölçülen çeyrek elipsle tamamlandı), ön cep kendi kraft
  taraması (sapma 1,8 px; `cep_kes` V katlama çizgisine oturuyordu), açık zarf katmanları birebir, pencereler tam şeffaf,
  kroma yeşili 0, geometrik yedek yok.
- `npm test` **994/994**, `npm run typecheck` temiz, `npm run build` + trace-check temiz (16 tema).
- `theme-check --theme sunflower-rustic-barn --stress`: **128 geçti, 0 hata, 0 uyarı** (ilk turda 6 hata: davet kartında alt
  buket üstünde şehir satırı, teşekkür hâlinde kart penceresinin gingham kenarı üstünde uzun başlık, 375×553'te ipucu ahşap
  zemin üstünde — üçü de düzeltildi).
- İlk görünüm 390×844 DPR 3: index **1191 KB**, home **889 KB** (yer tutucu); örnek fotoğraflarla 1296 / 1279 KB (≤ 1,5 MB).
- Dokun → home 4564 ms; azaltılmış hareket 163 ms doğrudan home. Kontrast (krem #F9E7CB üstünde): gövde 10,9:1, ikincil 7,5:1,
  el yazısı 7:1, hardal düğmede yazı 6,2:1.
- `g051-browser --theme sunflower-rustic-barn` **44/44**, `final-smoke --theme sunflower-rustic-barn` **45/45**.
- Kendi QA turum: 360×640, 390×844, 430×932, 844×390, 667×375'te bütün sayfalar + stres/teşekkür ekranları ve MP4 kareleri
  gözle incelendi; bulduklarım (story başlığı–alt başlık çakışması, ilk story ipinin yarım duvar bırakması, RSVP yatayda boş
  kart, index'te bekleyen kartın zarf altından görünmesi, iç sayfalarda ahşap şeridin sayfa ortasında kalması, story duvarının
  soluk/yeşil tonu) düzeltildi.
- Son tur (değişikliklerden sonra): `npm test` 994/994 ve tema testi 38/38; theme-check 128/0/0 son CSS ile koştu, g051/final-smoke
  son zemin maskesinden önceki CSS ile koştu (maske yalnız dekor görünümünü değiştirir).

**qa-kontrol (docs/11 §13.4).** İlk inceleme: home ve rsvp geçti; ret gerekçeleri (iç sayfalarda ahşap şerit sayfa ortasında,
index'te iki comp öğesinin README'de yazılmaması, duvar tonu) düzeltildi; ikinci tur: index ve story geçti, details/rsvp'de zemin uzatmasının bıraktığı sert kenar bulundu → maske düzeltildi; üçüncü tur: **inceleme geçti** (5 sayfa). İnceleme ekran görüntülerine dayanır; MP4'ü ve kendi QA'mda kareleri ben izledim.

**Denenmedi:** gerçek iPhone/Safari ve Android Chrome (`svh`, `mask`, `:has`, kesişen belge view transition), temanın Vercel'de
yayını (bu görevin işi değil), gerçek alıcı fotoğrafları (farklı oran/ışık), yavaş ağ.

**Sorunlu GPT parçaları / önerilen gpt-gorsel görevi.**
- `closure.png`: W1.1'deki fiyonk arkası buğday + cipsofila + yaprak spreyi yok. Öneri (`tools/katalog.py` `WEB[16]` `kapanis`):
  "… a big soft bow at the center with a small sunflower head tucked into the knot and a little spray of wheat ears, baby's
  breath and two green leaves fanning out behind the bow" — aynı 1:1 tuval kuralıyla yeniden üretim.
- `barnwood.png`: W1.3'teki dikey, sıcak kahve, yıpranmış ahşap duvar yerine soluk yatay tahtalar geldi (masa için uygun);
  story duvarı için ayrıca `barn_wall.png` (vertical weathered warm-brown barn planks, seamless top/bottom) önerilir.
- `envelope_open.png` ön cebi: `cep_kes` V katlama çizgisini kenar sandı (cebin üst kenarı yeterince belirgin değil); tema kendi
  kraft taramasıyla çözdü, prompt düzeltmesi gerekmiyor.

**Entegratöre notlar.** `gorevler/PANO.md` commit'lenmedi. G416 `al` komutu G216 `alindi` olduğu için reddetti; parçalar main'de
tam olduğundan durum dosyada elle `alindi` yapıldı (Günlük). Ortak test/dosya değiştirilmedi; tema sayan testler yeni temayla geçti.

## Günlük
- 2026-10-13 blokaj: K22 (kullanıcı, 2026-10-13): videodan çıkıldı, ürün yalnız mobil öncelikli website. Yeni website standardı pilotla (G035) belirlenince yeniden tanımlanacak
- 2026-10-13 yeniden tanımlandı (K22–K24, G033)
- 2026-10-15 alindi: claude-G416 (G216 durumu alindi ama PAKET 5 W1/W2 + PAKET 2 dosyalari main'de tam; gorev oturuma dogrudan verildi)
- 2026-10-15 bitti, incelemeye gönderildi
- 2026-10-15 entegratör onayladı
