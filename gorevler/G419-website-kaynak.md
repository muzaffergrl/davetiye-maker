---
id: G419
baslik: Tasarım 19 Midnight Garden — platform teması
rol: claude-kod
durum: inceleme
alan: claude-G419
oncelik: 3
bagimli: [G219, G038, G046, G052]
yazar: [platform/themes/midnight-garden/, platform/tests/theme-midnight-garden.test.ts, platform/previews/g419/]
---

## Amaç
Tasarım 19'i platformda tema olarak kurmak (K24, `docs/10_SITE_PLATFORMU.md`): kapalı zarf açılış sayfası → home → story, details, rsvp; yalnız bu tasarımın GPT parçalarıyla (K21), kişisel metin HTML'de. **Kurallar `docs/11_TEMA_STANDARDI.md`'dedir; bu görev metniyle çelişirse docs/11 geçerlidir.**

## Girdiler
- Tema standardı: `docs/11_TEMA_STANDARDI.md` — bütünü; zarf tipi **kapaklı zarf** → §7.1 + §7.3; bitti tanımı §13, kontrol listesi §15
- Platform sözleşmesi: `platform/README.md` (işaretler, RSVP form sözleşmesi, `#site-data`); çalışan örnek `platform/themes/blush-garden-rose/` — **yalnız** işaret/RSVP/`#site-data`/oturum anahtarı kullanımı için; yerleşimi, aralıkları, süs konumları ve zamanlaması bu temaya taşınmaz (docs/11 §8). G035 kaynağı (`collections/03_Blush_Garden_Rose/website/`) örnek değildir
- GPT çıktıları (G219): `collections/19_Midnight_Garden/assets/gpt/comps/` (W1, yerleşim referansı, satılmaz; yalnız sade adlar — `_vN` denemedir), `parts/` (katmanlar), `photos/` (örnek fotoğraflar)
- İçerik `collections/19_Midnight_Garden/content.demo.json`, renk `collections/19_Midnight_Garden/palette.json`, özet `collections/19_Midnight_Garden/DESIGN_BRIEF.md`
- Araçlar: `tools/parts_prep.py` (geçici klasöre; docs/11 §5.3), `python3 tools/kit_check.py collections/19_Midnight_Garden --paket 5`, `node scripts/theme-check.cjs --theme <slug>` (G052)

## Yapılacaklar
1. `theme.json`, 5 sayfa, `site.css`, `site.js`, `build_images.py`, `README.md` docs/11 §1–§4 düzeninde. 03'ten yalnız platform sözleşmesi alınır (motor işaretleri, RSVP formu, `#site-data`, slug'lı oturum anahtarları, `data-scene`/`data-step`/`data-a` kancaları); yerleşim, tipografi ve hiyerarşi bu tasarımın W1 comp'larından — tema `README.md`'sinde sayfa başına **comp öğe haritası** (her W1 öğesi → şablon öğesi ya da gerekçeli sapma; comp'u olmayan bölümler bu tasarımın parçaları ve tipografisiyle, docs/11 §8).
2. Parçalar: `python3 platform/themes/midnight-garden/build_images.py` → `parts_prep` **geçici klasöre** (`--prep-dir`; tema klasörüne, `img_src/`'ye ya da `assets/`'e asla — docs/11 §1, §5.3–§5.4), tip kesimleri (§7), maskeler, `free_zone`, yer tutucular, og; WebP + srcset genişlikleri (§5.1, §5.5). Yalnız bu tasarımın GPT parçaları; yeni şekil/dekor çizme (K21).
3. Zarf açılışı (`MOTION.envelope`, kapaklı zarf, docs/11 §7.1 + §7.3): On tap, the silver seal cracks and falls away, the black flap opens slowly, warm golden candlelight spills out from inside, and the card rises out of the darkness into the glow. Katalog: Siyah zarf, gümüş mühür; kapak açılınca içeriden sıcak ışık sızar. Açılış cümlesindeki sıra, sayı ve yön bağlayıcıdır; kapanış elemanı, zarf/kapak ve kart ayrı katmanlar; kart home'daki karta dönüşür; `closure.png` kare tuvalde büyük çizilir; yeri kesim geometrisine bağlanır (`manifest.closure`, docs/11 §7.1).
4. Sayfa koreografisi (`MOTION.scenes`): her sayfada öğeler sırayla girer. Story: Oymalı yaldızlı barok çerçeveler, karanlıktan mum ışığıyla aydınlanır (three ornate gilded baroque frames on a black wall in a staggered salon arrangement, a soft warm candle glow on the wall behind each frame (the frames themselves lit from the upper left)); telefonda foto penceresi ≥ 38vw (sığmazsa basamaklı/alt alta düzen, comp sapması olarak yazılır — docs/11 §9). Parçacıklar `MOTION.accents` (§8: tür başına dosya ve yol). Details/rsvp: kart, satırlar ve buton sırayla.
5. Foto alanları: `hero_portrait` (card_small penceresi), `story_1..3` (frame_portrait), `venue` (frame_landscape); kutu ve maske `windows.json`'dan (§5.6, §9). PAKET 2 fotoğrafı yoksa yer tutucu.
6. Fontlar: Playfair Display SC + Cormorant SC (Google Fonts link'i; repoya font dosyası girmez). Tarih motor biçimiyle (`May 15, 2027`). Link blokları `data-if="urls.*"` ile linksiz kalkar — "link will be added soon" diyen ölü düğme yok (§4).
7. Testler ve önizleme (§13): `platform/tests/theme-midnight-garden.test.ts`; `theme-check --theme midnight-garden` (5 genişlik, kısa telefonlar, akışlar, ağırlık, MP4); `platform/previews/g419/` (W1 comp | tema karşılaştırmaları dahil).

## Bitti sayılması için
- [ ] docs/11 §15 kontrol listesi tamam (atlanan madde Sonuç'ta gerekçesiyle)
- [ ] `npm test`, `npm run typecheck`, `npm run build` (trace-check) geçti; `tests/theme-midnight-garden.test.ts` (§13.2)
- [ ] `theme-check --theme midnight-garden` hatasız; `previews/g419/` + `compare_<sayfa>_390.jpg` qa-kontrol incelemesinden geçti
- [ ] Sonuç dürüst: açılış ve story tarifi, comp sapmaları, denenmeyenler (gerçek iPhone/Safari, yayın), sorunlu GPT parçaları

## Sonuç
**Ne yapıldı (claude-G419, dal `claude/g419-tema`):** `platform/themes/midnight-garden/` (theme.json, content.demo.json =
koleksiyon kaydı birebir, 5 sayfa, site.css, site.js, thank-you.css, build_images.py, README.md + comp öğe haritası, img/ build
çıktısı ~1,9 MB), `platform/tests/theme-midnight-garden.test.ts` (38 test), `platform/previews/g419/` (sayfa görüntüleri,
`compare_<sayfa>_390.jpg`, `compare_closure.jpg`, kesim önizlemeleri, `opening_390x844.mp4`, `checks.json`, `final/`).
Platform iskeleti (motor işaretleri, RSVP/G051/G069/G075/G068, fold/fit kodu, test iskeleti) 08 winter-evergreen'den; görünüş,
tipografi (Playfair Display SC + Cormorant SC + Cormorant Garamond), renk, süs konumları, açılış, story ve zamanlama bu tasarımın
W1 comp'larından.

- **Açılış:** dokununca gümüş mühür (aynı GPT parçasının iki kopyası, tek düz çizgiyle `clip-path` — çatlak çizilmez) çatlar,
  iki yarısı ayrı yönlere dönerek düşüp ekrandan çıkar; siyah kapak yavaşça (1,18 s) açılır; içeriden sıcak altın mum ışığı
  (kenarsız CSS ışığı, §5.7) taşar; kart karanlıktan (brightness .18 → 1) ışığa yükselir, öne gelir, VT ile home kartına uçar.
  Dokun → home 4762 ms. Cümlede parçacık yok → `accents.open = []`. Mühürde monogram (`initials`, pişirilmez).
- **Story:** üç barok yaldızlı çerçeve "salon" dizilişinde; her biri görünüme girince arkasındaki duvarda mum ışığı ısınır ve
  çerçeve + foto neredeyse siyahtan aydınlanır (`kindle`). Telefonda alt alta ama dönüşümlü sola/sağa (pencere 41,2vw ≥ 38vw),
  ≥ 720 px comp'un iki sütunlu salonu.
- **Comp sapmaları** (README'de gerekçeli): geri sayım kutusuz sade rakam (K21); story telefonda iki sütun yerine dönüşümlü tek
  sütun (§9); çerçeve diplerindeki çiçek demetleri yok (GPT'de ayrı parça değil); mekân çerçevesi comp'tan kare (GPT
  `frame_landscape` 1,53:1 pencere); RSVP başlık altı elmas süs yerine GPT gül dalı; hero kartında yalnız şehir (comp'a uyuldu);
  mühürde monogram (comp'ta boş); kısa telefonda "Tap to open" arkasında kenarsız koyu okunabilirlik hâlesi.
- **Görsel hattı:** kapak `kapak_kes("v")` renk; ön cep tema içi yukarıdan tarama (alt kanadın düz üstü + yan kanatlar;
  `cep_kes("v")`/parts_prep tek V uydurup astar şeridi alıyordu), astar içi 0 px; hiza sol 0,00 · sağ −0,10 · alt +0,13 %
  (dönüşüm yok); kapanış W1.1'den ölçüldü (genişlik/zarf 0,1492), `compare_closure.jpg` örtüşüyor. Davet kartında temiz bant
  yalnız %48,2–50,4 → bant ayrı dosya, kendi boyunda `repeat-y` (esnetilmez). Telefon zemini `night`: kümesiz düz gece karası
  (dikeyde × 2 ölçekli, dokusuz) + mum ışığının alt yarısı — ışık ekranın alt dörtte birinde kalır.

**Komut sonuçları (2026-10-15):** `kit_check --paket 5` 23/23, `--paket 2` 5/5 · `npm test` 994/994 · `npm run typecheck` temiz ·
`npm run build` + trace-check temiz (16 tema) · `theme-check --theme midnight-garden --stress` 128 geçti / 0 hata / 0 uyarı ·
`g051-browser --theme midnight-garden` 44/44 · `final-smoke --theme midnight-garden` 45/45 · `copy-manifest --check` temiz
(71 anahtar). İlk görünüm 390×844 DPR 3: index 718 KB, home 949 KB (yer tutucu); tohumlanmış fotoğrafla 808 / 1423 KB.
Azaltılmış hareket 201 ms. site.js 35 550 B, site.css 46 041 B.

**Kendi QA turum:** 360/390/430/768/1280, 375×553, 667×375, 844×390, zorlama kaydı ve teşekkür hâli görüntülerine ve MP4
karelerine baktım; düzeltilenler: rsvp mührü kart öğesinin dışına (monogram "kart metni" sayılıyordu), ışık katmanı ekran
kenarından taşıyordu, "Tap to open" kısa telefonda mum ışığı üstündeydi (zemin yeniden kuruldu + hâle), teşekkür başlığı
360'ta kart kâğıdından taşıyordu (`fitCopy` son adım: tarih düşer), home 375×553'te isim 31 px, masaüstü story ızgarasında
itilen çerçeve öncekini yukarı çekiyordu (yayılan öğe kaldırıldı). **qa-kontrol incelemesi:** 5 sayfa + kapanış KABUL, ret sebebi
yok; önemli bulgu (details kartında fold'un bıraktığı boşluk) → program satırları fold birimi olmaktan çıkarıldı; küçük not
(story başlığı 3. çerçeveye yakın) → aralık açıldı; diğer küçük notlar (kümelerin kart/panel arkasından taşması) kabul.

**Denenmedi:** gerçek iPhone/Safari ve Android Chrome (`svh`, `mask`, `:has`, `mix-blend-mode`, çapraz belge VT), Vercel
yayını (görevin işi değil), gerçek alıcı fotoğrafları, yavaş ağ.

**Sorunlu GPT parçaları:** engelleyici yok. `frame_landscape` comp'taki geniş yatay çerçeveden kare (pencere 1,53:1) — kabul;
istenirse önerilen gpt-gorsel görevi: "frame_landscape ~2.2:1 window, as in W1.4". `invitation_card`'da köşe çiçekleri ve yan
kıvrımlar arasında yalnız ~32 px temiz bant var (tekrarla çözüldü); öneri (katalog ortak metni): davet kartında ortada en az
%15 boyunda süssüz düz bant.

**Entegratöre notlar:** ortak dosyaya dokunulmadı; tema sayısını sayan ortak testler kırılmadı (düzeltme gerekmedi).
`gorevler/PANO.md` commit'lenmedi.

## Günlük
- 2026-10-13 blokaj: K22 (kullanıcı, 2026-10-13): videodan çıkıldı, ürün yalnız mobil öncelikli website. Yeni website standardı pilotla (G035) belirlenince yeniden tanımlanacak
- 2026-10-13 yeniden tanımlandı (K22–K24, G033)
- 2026-10-14 entegratör notu: frame_portrait penceresinin sağ yarısında koyu leke → build'de pencere doldurma şart.
- 2026-10-15 alindi: claude-G419
- 2026-10-15 bitti, incelemeye gönderildi
