---
id: G418
baslik: Tasarım 18 Wildflower Meadow Vellum — platform teması
rol: claude-kod
durum: bitti
alan: claude-G418
oncelik: 3
bagimli: [G218, G038, G046, G052]
yazar: [platform/themes/wildflower-meadow-vellum/, platform/tests/theme-wildflower-meadow-vellum.test.ts, platform/previews/g418/]
---

## Amaç
Tasarım 18'i platformda tema olarak kurmak (K24, `docs/10_SITE_PLATFORMU.md`): kapalı zarf açılış sayfası → home → story, details, rsvp; yalnız bu tasarımın GPT parçalarıyla (K21), kişisel metin HTML'de. **Kurallar `docs/11_TEMA_STANDARDI.md`'dedir; bu görev metniyle çelişirse docs/11 geçerlidir.**

## Girdiler
- Tema standardı: `docs/11_TEMA_STANDARDI.md` — bütünü; zarf tipi **vellum kılıf** → §7.1 + §7.7; bitti tanımı §13, kontrol listesi §15
- Platform sözleşmesi: `platform/README.md` (işaretler, RSVP form sözleşmesi, `#site-data`); çalışan örnek `platform/themes/blush-garden-rose/` — **yalnız** işaret/RSVP/`#site-data`/oturum anahtarı kullanımı için; yerleşimi, aralıkları, süs konumları ve zamanlaması bu temaya taşınmaz (docs/11 §8). G035 kaynağı (`collections/03_Blush_Garden_Rose/website/`) örnek değildir
- GPT çıktıları (G218): `collections/18_Wildflower_Vellum/assets/gpt/comps/` (W1, yerleşim referansı, satılmaz; yalnız sade adlar — `_vN` denemedir), `parts/` (katmanlar), `photos/` (örnek fotoğraflar)
- İçerik `collections/18_Wildflower_Vellum/content.demo.json`, renk `collections/18_Wildflower_Vellum/palette.json`, özet `collections/18_Wildflower_Vellum/DESIGN_BRIEF.md`
- Araçlar: `tools/parts_prep.py` (geçici klasöre; docs/11 §5.3), `python3 tools/kit_check.py collections/18_Wildflower_Vellum --paket 5`, `node scripts/theme-check.cjs --theme <slug>` (G052)

## Yapılacaklar
1. `theme.json`, 5 sayfa, `site.css`, `site.js`, `build_images.py`, `README.md` docs/11 §1–§4 düzeninde. 03'ten yalnız platform sözleşmesi alınır (motor işaretleri, RSVP formu, `#site-data`, slug'lı oturum anahtarları, `data-scene`/`data-step`/`data-a` kancaları); yerleşim, tipografi ve hiyerarşi bu tasarımın W1 comp'larından — tema `README.md`'sinde sayfa başına **comp öğe haritası** (her W1 öğesi → şablon öğesi ya da gerekçeli sapma; comp'u olmayan bölümler bu tasarımın parçaları ve tipografisiyle, docs/11 §8).
2. Parçalar: `python3 platform/themes/wildflower-meadow-vellum/build_images.py` → `parts_prep` **geçici klasöre** (`--prep-dir`; tema klasörüne, `img_src/`'ye ya da `assets/`'e asla — docs/11 §1, §5.3–§5.4), tip kesimleri (§7), maskeler, `free_zone`, yer tutucular, og; WebP + srcset genişlikleri (§5.1, §5.5). Yalnız bu tasarımın GPT parçaları; yeni şekil/dekor çizme (K21).
3. Zarf açılışı (`MOTION.envelope`, vellum kılıf, docs/11 §7.1 + §7.7): On tap, the wildflower label peels away, the frosted vellum sleeve slides down off the card and fades, and the card lifts up as a few colored-pencil petals flutter across the screen. Katalog: Yarı saydam vellum sargı, kır çiçeği etiketiyle; vellum kayarak çıkar, kart görünür. Açılış cümlesindeki sıra, sayı ve yön bağlayıcıdır; kapanış elemanı, zarf/kapak ve kart ayrı katmanlar; kart home'daki karta dönüşür; `closure.png` kare tuvalde büyük çizilir; yeri kesim geometrisine bağlanır (`manifest.closure`, docs/11 §7.1).
4. Sayfa koreografisi (`MOTION.scenes`): her sayfada öğeler sırayla girer. Story: Vellum üstüne basılmış çiçek siluetleriyle örtülü kartlar; vellum kalkınca foto belirir (three portrait photo cards in a gentle row, each half covered by a frosted vellum sheet printed with white wildflower silhouettes that is lifting away from the bottom to reveal the photo); telefonda foto penceresi ≥ 38vw (sığmazsa basamaklı/alt alta düzen, comp sapması olarak yazılır — docs/11 §9). Parçacıklar `MOTION.accents` (§8: tür başına dosya ve yol). Details/rsvp: kart, satırlar ve buton sırayla.
5. Foto alanları: `hero_portrait` (card_small penceresi), `story_1..3` (frame_portrait), `venue` (frame_landscape); kutu ve maske `windows.json`'dan (§5.6, §9). PAKET 2 fotoğrafı yoksa yer tutucu.
6. Tasarıma özel ek parçalar (comp'taki ilgili öğe bunlardan kurulur, kodla çizilmez — K21): `vellum_overlay.png` — Vellum örtü (story fotoğraflarının üstü).
7. Fontlar: Satisfy + Spectral (Google Fonts link'i; repoya font dosyası girmez). Tarih motor biçimiyle (`May 15, 2027`). Link blokları `data-if="urls.*"` ile linksiz kalkar — "link will be added soon" diyen ölü düğme yok (§4).
8. Testler ve önizleme (§13): `platform/tests/theme-wildflower-meadow-vellum.test.ts`; `theme-check --theme wildflower-meadow-vellum` (5 genişlik, kısa telefonlar, akışlar, ağırlık, MP4); `platform/previews/g418/` (W1 comp | tema karşılaştırmaları dahil).

## Bitti sayılması için
- [ ] docs/11 §15 kontrol listesi tamam (atlanan madde Sonuç'ta gerekçesiyle)
- [ ] `npm test`, `npm run typecheck`, `npm run build` (trace-check) geçti; `tests/theme-wildflower-meadow-vellum.test.ts` (§13.2)
- [ ] `theme-check --theme wildflower-meadow-vellum` hatasız; `previews/g418/` + `compare_<sayfa>_390.jpg` qa-kontrol incelemesinden geçti
- [ ] Sonuç dürüst: açılış ve story tarifi, comp sapmaları, denenmeyenler (gerçek iPhone/Safari, yayın), sorunlu GPT parçaları

## Sonuç
**Durum:** tema kuruldu, bütün komutlar yeşil; qa-kontrol incelemesi (docs/11 §13.4 kapısı) bu oturumda yapılamadı — alt-ajan aracı yoktu → entegratör `compare_*` + README comp öğe haritasını qa-kontrol'e incelettirmeli.

**Dosyalar:** `platform/themes/wildflower-meadow-vellum/` (theme.json — 71 copy anahtarı, content.demo.json = koleksiyon kaydı birebir, 5 sayfa, site.css 45 078 B, site.js 35 357 B, thank-you.css, build_images.py, README.md — comp öğe haritası + sapmalar + ölçümler, img/ 45 WebP + maskeler + og + favicon + manifest; klasör ~1,8 MB), `platform/tests/theme-wildflower-meadow-vellum.test.ts` (38 test: §13.2'nin 24 maddesi + kılıf/story/zemin/ilk ekran/tarayıcı/G075), `platform/previews/g418/` (theme-check çıktıları, compare_<sayfa>_390.jpg, compare_closure.jpg, cuts_sleeve.jpg, stage_closed/open.jpg, opening_390x844.mp4, final/).

**Açılış (kılıf, docs/11 §7.7):** dokununca kır çiçeği etiketi üst kenarından soyulur (alt kenarı etrafında izleyiciye doğru kalkar, yukarı-yana gidip söner), kılıfın ağzı açılır (yalnız üst şerit takası), buzlu vellum kılıf karttan aşağı kayıp söner, arkasındaki kart netleşip kalkar ve 4 renkli kalem gelincik yaprağı ekranı soldan/sağdan salınarak geçer; kart öne gelip view transition ile home kartına uçar (dokun → home 4110 ms; Skip her an; azaltılmış harekette 308 ms doğrudan home).
**Story:** üç pamuk foto kartı (telefonda hafif basamaklı ve elle bırakılmış gibi eğik sütun, ≥ 720 px comp'un düz üçlü sırası); her kartın üstündeki GPT vellum örtüsü (`vellum_overlay`) alt kenarından izleyiciye doğru kalkıp gider, foto belirir, alt yazı yazılır.

**Kesimler / parçalar:** kapalı ve açık kılıf aynı tuvalde ve alfaları birebir aynı; fark yalnız ön panel kenarında (RGB). `tema_build.kilif_serit` yalnız alfaya baktığı için 7 px'lik anlamsız şerit bulurdu → temanın `serit_bul`'u RGB + alfa farkıyla kesti (y 659, kılıfın %18'i, `method: renk`, örtüşme ≤ 0,01). Hiza: sol −0,10 · sağ 0 · alt 0 % (dönüşüm yok). Etiket: docs/11 §7.1 kılıf kuralıyla (çapa = ön panel kenarının ortası, görselden; boyut 0,2715 × kılıf ve kayma W1.1'den); GPT'nin Kısım 2 talebiyle çizdiği 1:1 yer (0,2985, +0,13) `manifest.closure.gpt_canvas`'ta karşılaştırma için. Kılıf GPT'den opak geldi → CSS grup opaklığı .8 + arkadaki kartta hafif blur. bg_tile dikişi onarıldı (2,71 → 2,03). Görsel üretilmedi, şekil/dekor çizilmedi (K21).

**Comp sapmaları (README'de tablo):** dört kutulu geri sayım → sade rakam (K21); kart yazısında yalnız şehir (comp gibi; §3.2 `city_region`); story telefonda sütun (≥ 38vw kuralı) ve comp'un "yarı kalkmış örtü" son hâli tutulmadı (yüzleri kapatırdı; örtü kalkıp gider); kartlar arası küçük dallar yerine GPT accent'leri; RSVP imzası dalın sağında değil ortada, dalın üstünde (uzun isimler yapraklara binerdi); kılıftaki kart comp'takinden dar (card_small oranı); kılıf opaklığı .8 (§7.7 .82–.9'un hemen altı, comp "~80 %").

**Komutlar (2026-10-15, worktree dalı, PORT 3460):**
- `kit_check --paket 5` 24/24 (hiza GEÇTİ), `--paket 2` 5/5
- `build_images.py` hatasız (pencere şeffaflığı 0, kroma yeşili 0, klasör 1,78 MB)
- `npm test` 983/983 geçti; `npm run typecheck` temiz; `npm run build` + trace-check temiz (16 tema)
- `tests/theme-wildflower-meadow-vellum.test.ts` 38/38; ortak g068/g069/g075 testleri temayı `design-themes.ts`'ten alıyor, geçti (ortak dosyada değişiklik gerekmedi)
- `theme-check --theme wildflower-meadow-vellum --stress`: 128 geçti, 0 hata, 0 uyarı
- `g051-browser --theme wildflower-meadow-vellum`: 44/44 · `final-smoke --theme wildflower-meadow-vellum`: 45/45
- İlk görünüm 390×844 DPR 3: index 587 KB / home 929 KB (yer tutucu); örnek fotoğrafla 710 / **1454 KB** (sınıra yakın; lazy görseller erken iniyor)
- Kendi QA turum: 360×640, 375×553, 390×844, 430, 768, 1280, 844×390 (kapalı/açık zarf, home, iç sayfalar), stress + teşekkür hâli görüntüleri ve MP4 kareleri gözle incelendi; düzeltilenler: hero kartı büyütüldü (kart yazısı düşmesin), info kartı satırları daldan uzak sütuna alındı (stress'te dekor üstü metin hatası), masaüstü kılıf büyütüldü, azaltılmış harekette vellum `visibility` ile gizli (theme-check "her adım opaklık 1").

**Denenmedi:** gerçek iPhone/Safari ve Android Chrome, Vercel yayını, gerçek alıcı fotoğrafları (farklı oran/ışık), yavaş ağ; qa-kontrol incelemesi (yukarıda).

**Sorunlu GPT parçaları / önerilen düzeltmeler:**
- `envelope_open.png` "gently flared" ama alfa olarak kapalının aynısı (fark yalnız ön kenar 13 px); hareket küçük ama çalışıyor. Yeniden üretim gerekmez.
- `closure.png` 214 px (Kısım 2'de kılıf tuvalinde küçük çizildi): DPR 3 telefonda hafif büyütülüyor. Önerilen (düşük öncelik) gpt-gorsel: etiketi kare tuvalde büyük ayrı bir dosya olarak da kaydet.
- Satisfy yalnız `latin` (latin-ext yok): ş/ğ/ł gibi harfler yedek fonta düşer — katalog fontu korundu, README'de sınır.

**Entegratöre not:** `tools/tema_build.kilif_serit` yalnız alfa farkına bakıyor; 18'in GPT kılıflarında fark RGB'de. Ortak modüle RGB farkı eklemek (önerilen claude-kod görevi) — tema kendi `serit_bul`'unu kullanıyor, acil değil. Ortak dosyada değişiklik yapılmadı.

## Günlük
- 2026-10-13 blokaj: K22 (kullanıcı, 2026-10-13): videodan çıkıldı, ürün yalnız mobil öncelikli website. Yeni website standardı pilotla (G035) belirlenince yeniden tanımlanacak
- 2026-10-13 yeniden tanımlandı (K22–K24, G033)
- 2026-10-15 alindi: claude-G418
- 2026-10-15 bitti, incelemeye gönderildi
- 2026-10-15 entegratör onayladı
