---
id: G412
baslik: Tasarım 12 Tropical Destination — platform teması
rol: claude-kod
durum: inceleme
alan: claude-local-G412
oncelik: 3
bagimli: [G212, G038, G046, G052]
yazar: [platform/themes/tropical-destination/, platform/tests/theme-tropical-destination.test.ts, platform/previews/g412/]
---

## Amaç
Tasarım 12'i platformda tema olarak kurmak (K24, `docs/10_SITE_PLATFORMU.md`): kapalı zarf açılış sayfası → home → story, details, rsvp; yalnız bu tasarımın GPT parçalarıyla (K21), kişisel metin HTML'de. **Kurallar `docs/11_TEMA_STANDARDI.md`'dedir; bu görev metniyle çelişirse docs/11 geçerlidir.**

## Girdiler
- Tema standardı: `docs/11_TEMA_STANDARDI.md` — bütünü; zarf tipi **kapaklı zarf** → §7.1 + §7.3; bitti tanımı §13, kontrol listesi §15
- Platform sözleşmesi: `platform/README.md` (işaretler, RSVP form sözleşmesi, `#site-data`); çalışan örnek `platform/themes/blush-garden-rose/` — **yalnız** işaret/RSVP/`#site-data`/oturum anahtarı kullanımı için; yerleşimi, aralıkları, süs konumları ve zamanlaması bu temaya taşınmaz (docs/11 §8). G035 kaynağı (`collections/03_Blush_Garden_Rose/website/`) örnek değildir
- GPT çıktıları (G212): `collections/12_Tropical_Destination/assets/gpt/comps/` (W1, yerleşim referansı, satılmaz; yalnız sade adlar — `_vN` denemedir), `parts/` (katmanlar), `photos/` (örnek fotoğraflar)
- İçerik `collections/12_Tropical_Destination/content.demo.json`, renk `collections/12_Tropical_Destination/palette.json`, özet `collections/12_Tropical_Destination/DESIGN_BRIEF.md`
- Araçlar: `tools/parts_prep.py` (geçici klasöre; docs/11 §5.3), `python3 tools/kit_check.py collections/12_Tropical_Destination --paket 5`, `node scripts/theme-check.cjs --theme <slug>` (G052)

## Yapılacaklar
1. `theme.json`, 5 sayfa, `site.css`, `site.js`, `build_images.py`, `README.md` docs/11 §1–§4 düzeninde. 03'ten yalnız platform sözleşmesi alınır (motor işaretleri, RSVP formu, `#site-data`, slug'lı oturum anahtarları, `data-scene`/`data-step`/`data-a` kancaları); yerleşim, tipografi ve hiyerarşi bu tasarımın W1 comp'larından — tema `README.md`'sinde sayfa başına **comp öğe haritası** (her W1 öğesi → şablon öğesi ya da gerekçeli sapma; comp'u olmayan bölümler bu tasarımın parçaları ve tipografisiyle, docs/11 §8).
2. Parçalar: `python3 platform/themes/tropical-destination/build_images.py` → `parts_prep` **geçici klasöre** (`--prep-dir`; tema klasörüne, `img_src/`'ye ya da `assets/`'e asla — docs/11 §1, §5.3–§5.4), tip kesimleri (§7), maskeler, `free_zone`, yer tutucular, og; WebP + srcset genişlikleri (§5.1, §5.5). Yalnız bu tasarımın GPT parçaları; yeni şekil/dekor çizme (K21).
3. Zarf açılışı (`MOTION.envelope`, kapaklı zarf, docs/11 §7.1 + §7.3): On tap, the brass snap pops open and the plumeria tab swings away, the wallet flap flips up to reveal the palm-leaf liner, and a luggage-tag card slides up while a monstera leaf and a white plumeria drift across the screen. Katalog: Palmiye desenli astarlı seyahat cüzdanı; çıtçıt açılır, bavul etiketi kartlar kayar. Açılış cümlesindeki sıra, sayı ve yön bağlayıcıdır; kapanış elemanı, zarf/kapak ve kart ayrı katmanlar; kart home'daki karta dönüşür; `closure.png` kare tuvalde büyük çizilir; yeri kesim geometrisine bağlanır (`manifest.closure`, docs/11 §7.1).
4. Sayfa koreografisi (`MOTION.scenes`): her sayfada öğeler sırayla girer. Story: İpli eski bavul etiketleri (yazısız), sallanarak dizilir (three kraft luggage tags hanging from their twine strings in a row at slightly different heights, gently swinging, palm leaves peeking in from the edges); telefonda foto penceresi ≥ 38vw (sığmazsa basamaklı/alt alta düzen, comp sapması olarak yazılır — docs/11 §9). Parçacıklar `MOTION.accents` (§8: tür başına dosya ve yol). Details/rsvp: kart, satırlar ve buton sırayla.
5. Foto alanları: `hero_portrait` (card_small penceresi), `story_1..3` (frame_portrait), `venue` (frame_landscape); kutu ve maske `windows.json`'dan (§5.6, §9). PAKET 2 fotoğrafı yoksa yer tutucu.
6. Fontlar: Dancing Script + Raleway (Google Fonts link'i; repoya font dosyası girmez). Tarih motor biçimiyle (`May 15, 2027`). Link blokları `data-if="urls.*"` ile linksiz kalkar — "link will be added soon" diyen ölü düğme yok (§4).
7. Testler ve önizleme (§13): `platform/tests/theme-tropical-destination.test.ts`; `theme-check --theme tropical-destination` (5 genişlik, kısa telefonlar, akışlar, ağırlık, MP4); `platform/previews/g412/` (W1 comp | tema karşılaştırmaları dahil).

## Bitti sayılması için
- [ ] docs/11 §15 kontrol listesi tamam (atlanan madde Sonuç'ta gerekçesiyle)
- [ ] `npm test`, `npm run typecheck`, `npm run build` (trace-check) geçti; `tests/theme-tropical-destination.test.ts` (§13.2)
- [ ] `theme-check --theme tropical-destination` hatasız; `previews/g412/` + `compare_<sayfa>_390.jpg` qa-kontrol incelemesinden geçti
- [ ] Sonuç dürüst: açılış ve story tarifi, comp sapmaları, denenmeyenler (gerçek iPhone/Safari, yayın), sorunlu GPT parçaları

## Sonuç
**Yapılan (claude-local-G412, 2026-10-15).** `platform/themes/tropical-destination/` (theme.json + 71 copy anahtarı, content.demo.json = koleksiyon kaydı birebir, 5 sayfa, site.css 44,2 KB, site.js 33,8 KB, thank-you.css, build_images.py, README.md comp öğe haritasıyla, img/ — klasör 2,0 MB), `platform/tests/theme-tropical-destination.test.ts` (33 test, §13.2'nin 24 maddesi + tasarıma özel), `platform/previews/g412/` (theme-check çıktıları, compare_*_390.jpg, compare_closure.jpg, checks.json).

- **Açılış**: dokununca pirinç çıtçıt patlar, plumerialı sekme topun çevresinde savrulup ekranın sağından çıkar → yuvarlak kapak kayışıyla menteşede kalkar, palmiye astarlı iç yüz devralır → bavul etiketi kart cepten yukarı kayar, bir monstera (soldan) ve bir beyaz plumeria (sağdan) ekranı geçer → kart öne gelir, home'a VT ile uçar (go 4,18 s).
- **Story**: üç ipli kraft etiket (yazısız) ipinin tepesinden sallanarak tek tek yerine oturur ve hafifçe sallanmaya devam eder; telefonda zikzak sütun (pencere 42vw), ≥ 720 px comp'taki gibi tek sıra, üç yükseklik.
- **Kesimler (K21, çizim yok)**: `tema_build.kapak_kes("egri")` yuvarlak kapağın dik yanlarında ve kayış sütunlarında yanıldığı için tema kendi kesimini yapar (elips uydurma + iz, kayış deri renginden kapak katmanına); ön cep "gülümseme" eğrisi astar renginden; kit_check hiza GEÇTİ (sol/sağ +%0,20, alt 0), açık katmanlar katlanma satırına ölçülen dönüşümle oturtuldu; kapanış comp'tan ölçülen oranla kapak ucuna bağlandı (`manifest.closure`, compare_closure.jpg).
- **Comp sapmaları** (README'de gerekçeli): geri sayım sade rakam; altın palmiye ikonu yerine GPT plumeria + 1 px kıl çizgi; telefonda story zikzak; ev davet kartı `info_card` (invitation_card'ın süsleri çapraz köşelerde, 3 dilimle uzatılamıyor → temaya alınmadı); W1.4 satır arası kıl çizgiler yok; telefonda details/rsvp başındaki sağ alt küme gizli (kartın arkasında yarım kalıyordu); 2. etikette palmiye yaprağı yerine monstera.

**Testler.** `kit_check --paket 5` 23/23 (+hiza GEÇTİ), `--paket 2` 5/5. `npm test` (Windows, junction ön yüklemesiyle) 629 testten 620 geçti, 8 atlandı, 1 hata = bu temanın testindeki eski regex — düzeltildi, `theme-tropical-destination.test.ts` 33/33; push öncesi tam koşu aşağıda. `npm run typecheck` temiz. `npm run build` + trace-check geçti (7 tema). `theme-check --theme tropical-destination --stress --no-video` (playwright-core 1.64.1 + kurulu Chrome 155, geçici klasörde; repo dışı): **105 geçti, 0 uyarı, 1 hata** — hata "content change" akışı: theme-check.cjs Windows'ta `C:\…` mutlak yolunu ESM import ediyor (`ERR_UNSUPPORTED_ESM_URL_SCHEME`), tema değil araç hatası; aynı davranış tema testindeki #5 ile sunucu tarafında doğrulandı. Önceki turlarda bulunan ve düzeltilen: home kısa telefonda giriş öncesi dönük etiketin ekran kenarını aşması, tarih ayracının "kırpılmış metin" sayılması, en-GB uzun tarihin dar etikette taşması, açık zarfta "Replay" altına giren küme. Makine %100 CPU'dayken (başka oturumlar) bir turda VT/skip akışları zaman aşımına düştü; son turda hepsi geçti. İlk görünüm (390×844, DPR 3): index 852 KB, home 758 KB; tohum fotoğraflarıyla 945 / 940 KB (sınır 1,5 MB). Zarf → home 4,8 s (go 4,18 s + yükleme). `g051-browser --theme tropical-destination`: 44/44. qa-kontrol (§13.4): index, home, story, rsvp, kapanış GEÇTİ; details "kart altı boş" bulgusu (kart en az ham parça boyundaydı) ve README notları düzeltildi, düzeltilmiş hâl yeniden incelettirilmedi.

**Denenmedi.** Gerçek iPhone/Safari ve Android Chrome; temanın Vercel'de yayını; gerçek alıcı fotoğrafları (farklı oran/ışık); yavaş ağ; MP4 açılış kaydı (`opening_390x844.mp4` yok: makinede ffmpeg ve Playwright video bileşeni yok; açılış kare kare Web Animations `currentTime` ile denetlendi).

**Sorunlu GPT parçaları.** `invitation_card`: süsler çapraz köşelerde, tam genişlikte düz yatay bant yok → 3 dilimle uzatılamıyor. Zarf katmanları kaynakta en çok ~567 px (DPR 3'te hafif büyütme). `kapak_kes("egri")` eğri+kayışlı kapakta yanıldı (araç geliştirmesi önerisi).

**Önerilen görevler (entegratör açar).** (1) gpt-gorsel: `invitation_card_long.png` — tam genişlikte düz kağıt bandı olan uzun kart (süsler yalnız üstte ve altta) ya da süssüz kart + ayrı köşe kümeleri (`tools/katalog.py` `WEB[12]` `ekler`). (2) claude-kod: `scripts/theme-check.cjs` inline modül importlarında `pathToFileURL` (Windows'ta "content change" akışı). (3) claude-kod: `tema_build.kapak_kes("egri")`'ye kayış/sap sütunlarını dışlama + dik yan yaylar için elips ön bilgisi.

## Günlük
- 2026-10-13 blokaj: K22 (kullanıcı, 2026-10-13): videodan çıkıldı, ürün yalnız mobil öncelikli website. Yeni website standardı pilotla (G035) belirlenince yeniden tanımlanacak
- 2026-10-13 yeniden tanımlandı (K22–K24, G033)
- 2026-10-15 alindi: claude-local-G412
- 2026-10-15 bitti, incelemeye gönderildi
