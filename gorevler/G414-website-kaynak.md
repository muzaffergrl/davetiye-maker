---
id: G414
baslik: Tasarım 14 Ivory Lace & Pearls — platform teması
rol: claude-kod
durum: bitti
alan: claude-G414
oncelik: 3
bagimli: [G214, G038, G046, G052]
yazar: [platform/themes/ivory-lace-pearls/, platform/tests/theme-ivory-lace-pearls.test.ts, platform/previews/g414/]
---

## Amaç
Tasarım 14'i platformda tema olarak kurmak (K24, `docs/10_SITE_PLATFORMU.md`): kapalı zarf açılış sayfası → home → story, details, rsvp; yalnız bu tasarımın GPT parçalarıyla (K21), kişisel metin HTML'de. **Kurallar `docs/11_TEMA_STANDARDI.md`'dedir; bu görev metniyle çelişirse docs/11 geçerlidir.**

## Girdiler
- Tema standardı: `docs/11_TEMA_STANDARDI.md` — bütünü; zarf tipi **gatefold, iki kapı** → §7.1 + §7.4; bitti tanımı §13, kontrol listesi §15
- Platform sözleşmesi: `platform/README.md` (işaretler, RSVP form sözleşmesi, `#site-data`); çalışan örnek `platform/themes/blush-garden-rose/` — **yalnız** işaret/RSVP/`#site-data`/oturum anahtarı kullanımı için; yerleşimi, aralıkları, süs konumları ve zamanlaması bu temaya taşınmaz (docs/11 §8). G035 kaynağı (`collections/03_Blush_Garden_Rose/website/`) örnek değildir
- GPT çıktıları (G214): `collections/14_Ivory_Lace_Pearl/assets/gpt/comps/` (W1, yerleşim referansı, satılmaz; yalnız sade adlar — `_vN` denemedir), `parts/` (katmanlar), `photos/` (örnek fotoğraflar)
- İçerik `collections/14_Ivory_Lace_Pearl/content.demo.json`, renk `collections/14_Ivory_Lace_Pearl/palette.json`, özet `collections/14_Ivory_Lace_Pearl/DESIGN_BRIEF.md`
- Araçlar: `tools/parts_prep.py` (geçici klasöre; docs/11 §5.3), `python3 tools/kit_check.py collections/14_Ivory_Lace_Pearl --paket 5`, `node scripts/theme-check.cjs --theme <slug>` (G052)

## Yapılacaklar
1. `theme.json`, 5 sayfa, `site.css`, `site.js`, `build_images.py`, `README.md` docs/11 §1–§4 düzeninde. 03'ten yalnız platform sözleşmesi alınır (motor işaretleri, RSVP formu, `#site-data`, slug'lı oturum anahtarları, `data-scene`/`data-step`/`data-a` kancaları); yerleşim, tipografi ve hiyerarşi bu tasarımın W1 comp'larından — tema `README.md`'sinde sayfa başına **comp öğe haritası** (her W1 öğesi → şablon öğesi ya da gerekçeli sapma; comp'u olmayan bölümler bu tasarımın parçaları ve tipografisiyle, docs/11 §8).
2. Parçalar: `python3 platform/themes/ivory-lace-pearls/build_images.py` → `parts_prep` **geçici klasöre** (`--prep-dir`; tema klasörüne, `img_src/`'ye ya da `assets/`'e asla — docs/11 §1, §5.3–§5.4), tip kesimleri (§7), maskeler, `free_zone`, yer tutucular, og; WebP + srcset genişlikleri (§5.1, §5.5). Yalnız bu tasarımın GPT parçaları; yeni şekil/dekor çizme (K21).
3. Zarf açılışı (`MOTION.envelope`, gatefold, iki kapı, docs/11 §7.1 + §7.4): On tap, the pearl clasp unhooks and slips away, the lace-covered doors part slowly to the sides like a lifted veil, and the card rises from the satin center while a strand of tiny pearls glints. Katalog: Dantel kaplı fildişi gatefold; inci tokalı kopça açılır, dantel kanatlar aralanır. Açılış cümlesindeki sıra, sayı ve yön bağlayıcıdır; kapanış elemanı, zarf/kapak ve kart ayrı katmanlar; kart home'daki karta dönüşür; `closure.png` kare tuvalde büyük çizilir; yeri kesim geometrisine bağlanır (`manifest.closure`, docs/11 §7.1).
4. Sayfa koreografisi (`MOTION.scenes`): her sayfada öğeler sırayla girer. Story: Oyma fildişi oval çerçeveler, inci dizisiyle iner (three carved ivory-white oval frames, each hanging from a fine strand of pearls, descending to slightly different heights); telefonda foto penceresi ≥ 38vw (sığmazsa basamaklı/alt alta düzen, comp sapması olarak yazılır — docs/11 §9). Parçacıklar `MOTION.accents` (§8: tür başına dosya ve yol). Details/rsvp: kart, satırlar ve buton sırayla.
5. Foto alanları: `hero_portrait` (card_small penceresi), `story_1..3` (frame_portrait), `venue` (frame_landscape); kutu ve maske `windows.json`'dan (§5.6, §9). PAKET 2 fotoğrafı yoksa yer tutucu.
6. Fontlar: Mrs Saint Delafield + Bodoni Moda (Google Fonts link'i; repoya font dosyası girmez). Tarih motor biçimiyle (`May 15, 2027`). Link blokları `data-if="urls.*"` ile linksiz kalkar — "link will be added soon" diyen ölü düğme yok (§4).
7. Testler ve önizleme (§13): `platform/tests/theme-ivory-lace-pearls.test.ts`; `theme-check --theme ivory-lace-pearls` (5 genişlik, kısa telefonlar, akışlar, ağırlık, MP4); `platform/previews/g414/` (W1 comp | tema karşılaştırmaları dahil).

## Bitti sayılması için
- [ ] docs/11 §15 kontrol listesi tamam (atlanan madde Sonuç'ta gerekçesiyle)
- [ ] `npm test`, `npm run typecheck`, `npm run build` (trace-check) geçti; `tests/theme-ivory-lace-pearls.test.ts` (§13.2)
- [ ] `theme-check --theme ivory-lace-pearls` hatasız; `previews/g414/` + `compare_<sayfa>_390.jpg` qa-kontrol incelemesinden geçti
- [ ] Sonuç dürüst: açılış ve story tarifi, comp sapmaları, denenmeyenler (gerçek iPhone/Safari, yayın), sorunlu GPT parçaları

## Sonuç
**Durum: tema çalışıyor, bütün komutlar hatasız; qa-kontrol karşılaştırma kapısı (docs/11 §13.4) açık — aşağıda.**
Dal `worktree-agent-ad3a257607e7f1f46` (claude-G414, 2026-10-15).

**Ne yapıldı (dosyalar).** `platform/themes/ivory-lace-pearls/`: `theme.json` (5 sayfa, 5 foto anahtarı, 71 copy anahtarı),
`index.html` · `home.html` · `story.html` · `details.html` · `rsvp.html`, `site.css` (45,9 KB), `site.js` (35,3 KB),
`thank-you.css`, `content.demo.json` (= koleksiyon kaydı, bayt bayt), `build_images.py` (`tools/tema_build.py` ile), `README.md`
(dosyalar, foto alanları, görsel hattı, koreografi, ilk ekranlar, 5 sayfanın comp öğe haritası + sapmalar, sınırlar), `img/`
(build çıktısı, klasör ~1,8 MB ≤ 3 MB). `platform/tests/theme-ivory-lace-pearls.test.ts` (36 test). `platform/previews/g414/`
(theme-check çıktısı, `compare_<sayfa>_390.jpg` ×5, `compare_closure.jpg`, `opening_390x844.mp4`, `final/`).

**Açılış (tek cümle):** dokununca inci broş çözülüp izleyiciye doğru kalkar ve dikiş boyunca aşağı kayıp söner, iki dantel
kapı birlikte menteşelerinde yavaşça yanlara aralanıp tül kaldırılır gibi hafifçe kalkar (90°'de dantel astarlı iç yüzler
devralır), kart saten ortadaki cepten yükselirken "Tap to open"ın altındaki ince inci dizisinde (GPT divider) kenarsız bir ışık
bandı parlar; kart öne gelip view transition ile home kartına uçar (MOTION: dokun → home 4,25 s; ölçülen 4478 ms; Skip her an;
reduced motion 221 ms'de animasyonsuz home). Broş kapılarla taşınmaz; yeri W1.1 ölçüsüyle dikişe bağlı (`manifest.closure`).
**Story (tek cümle):** üç oyma fildişi oval çerçeve kendi inci dizilerinde yukarıdan iner ve dizinin tepesi etrafında hafifçe
salınarak durur, sonra oyma ve incilerin üstünden maskeli bir ışık bandı geçer; dizi uzunlukları farklı (GPT dizisi üstten
`--cut` .16 / 0 / .07 kırpılır) → ≥ 900 px'te comp'un sırası (dizilerin tepeleri bir hizada, soldaki oval en yüksekte,
ortadaki en aşağıda), telefonda zikzak sol-sağ-sol, her çerçeve 58vw (foto penceresi 38,9vw ≥ 38vw).

**Comp'tan bilinçli sapmalar** (ayrıntı README "Comp öğe haritası"): (1) story telefonda zikzak, yan yana değil (docs/11 §9:
yan yana pencere ~20vw olurdu); (2) çerçeveler arasındaki küçük süsler yok (zikzakta yer kalmıyor; ilk ekranda inci damla +
yaprak var); (3) comp'taki ince çizgi + baklava ayırıcı yerine GPT `divider` (inci dizisi + fiyonk) — açılıştaki "strand of tiny
pearls" bu; (4) geri sayım kutusuz sade Bodoni (kutular CSS çerçeve olurdu, K21 §5.7); (5) RSVP hapı comp'unkinden koyu (fildişi
yazı ≥ 4,5:1 kontrast); (6) home kartı yalnız şehir (`venue.city`, comp gibi; §3.2 `city_region` der); (7) details'ta yer
`venue.city_region_country`. Monogram kullanılmıyor (broşun ortası inci, boş mühür değil).

**Komutlar (sayılar):**
- `kit_check --paket 5`: 23/23 + hiza UYARI (üst +0,59 · sol kat +1,99 · sağ kat −2,51 %) → parça başına ölçülen dönüşüm
  (`manifest.stage.align_fix`), sonra katlar/menteşeler/üst/alt **0 px**; `--paket 2`: 5/5.
- `build_images.py`: denetimler geçti (pencereler tam şeffaf, yeşil yok, kesimler kaynakla örtüşüyor ≤ 0,01).
- `npm test` **632/632**; `npm run typecheck` temiz; `npm run build` + trace-check geçti (7 tema); tema testi 36/36.
- Entegratörün ana daldaki ortak testleri (`design-themes.ts` + g068-copy, g069-rsvp, g075-thank-you; geçici kopyayla koşuldu,
  silindi, commit'e girmedi): **56/56**, ivory-lace-pearls dahil.
- `copy-manifest.ts --theme ivory-lace-pearls --check`: 71 anahtar, işaretsiz metin yok.
- `theme-check --theme ivory-lace-pearls --stress`: **128 geçti / 0 uyarı / 0 hata** (5 sayfa × 360/390/430/768/1280, kısa
  telefonlar 360×640 · 375×553 · 390×690 · 844×390 · 667×375, akışlar, zorlama kaydı 71 anahtar max'ta + teşekkür hâli, MP4).
  İlk görünüm (390×844, DPR 3): index **854 KB**, home **759 KB** (yer tutucu); tohumlanmış örnek fotoğraflarla index **986 KB**,
  home **1293 KB**. Dokunmatik hedefler ≥ 44 px. MP4 2510 KB.
- `g051-browser --theme ivory-lace-pearls` (PORT 3460): **44/44**. `final-smoke --theme ivory-lace-pearls` (PORT 3460): **45/45**
  (`previews/g414/final/`).
- Not: theme-check koşusundan sonra tek bir CSS satırı değişti (home hero'nun sis zemini alta doğru solar —
  `.hero-bg::before` maske); ardından tema testi, g051, final-smoke ve 390 ekran görüntüsüyle doğrulandı, theme-check yeniden
  koşulmadı (yalnız zemin katmanı; metin/yerleşim değişmedi).
- Kendi QA'm: 360/390/430 + yatay, W1 karşılaştırmaları, uzun isim/metin zorlaması, foto penceresi kayması (maskeler
  `windows.json`'dan), kapı parçalarının hizası (`compare_closure.jpg` + açılış kareleri), açılış sırası MP4 karelerinden, teşekkür
  hâli (`stress_ty_*`).

**Açık kapı:** docs/11 §13.4 "compare_* + comp öğe haritası qa-kontrol incelemesi" yapılmadı — bu oturumda alt-ajan başlatma
aracım yok. Entegratör `qa-kontrol`'e `platform/previews/g414/compare_*_390.jpg`, `compare_closure.jpg` ve tema README'sinin
"Comp öğe haritası" bölümünü incelettirmeli; o zamana kadar §15'teki ilgili madde işaretsiz.

**Denenmedi:** gerçek iPhone/Safari ve Android Chrome (`svh`, `mask`, `:has`, belgeler arası view transition, 3B `rotateY` +
`backface-visibility`, `clip-path` + `aspect-ratio` ile kırpılan diziler); temanın Vercel'de yayını; gerçek alıcı fotoğrafları
(farklı oran/ışık); yavaş ağ.

**Sorunlu GPT parçaları + önerilen prompt düzeltmeleri** (`tools/katalog.py` `WEB[14]` / kapı tipi ortak metni):
1. `envelope_open`: orta panel kapalı dosyadan **%9,7 dar** (644 / 713 px), kapı içleri kapalı kapı yarılarıyla aynı → parça
   başına dönüşümle çözüldü, bedeli cep danteli yatayda %10,7 gerildi (telefonda okunmuyor). Öneri: "In the open gatefold the
   center panel is exactly as wide as the closed folder, and each inner door panel exactly half of it; same canvas, same scale and
   same top/bottom edges as envelope_closed."
2. `frame_landscape`: yeşil pencerede saydam/koyu leke (`leke_px` 11 200) → parts_prep doldurdu, WebP'lerde pencere tam şeffaf.
   Öneri: "the window is one flat pure #00FF00 area, no shadow, gradient or smudge inside it."
3. `bg_tile` dikişsiz değil → 06'nın yöntemiyle onarıldı (eğim düşme + yarım kaydırılmış kenar). Öneri: "seamlessly tileable on
   all four edges, no vignette, no directional light".
4. Kapı katmanları kaynakta 358–370 px genişlikte (dosya 713 px): DPR 3'te hafif büyütülüyor. Öneri: envelope tuvalinde dosya
   ≥ 1100 px genişlikte.

**Entegratöre notlar (ortak dosyalar; değiştirilmedi):**
- `tools/tema_build.py:879` `cep_kes(bicim="duz")` (ve `kapi_kes`, satır 1089): düz cep kenarının üstüne çıkan köşe dantelini
  aykırı sayıp cebin dışında (kartın arkasında) bırakıyor. Öneri: `bicim="dantel"` — her sütunda gövdenin düz kâğıdından aşağı
  inip ilk kalıcı renk sapması kenar, kenar bantları (altın çizgi) atlanır, 7 sütun medyanı, düz çizginin ±6 px'i tek satıra;
  hazır uygulama `platform/themes/ivory-lace-pearls/build_images.py` `cep_dantel()` (taşınabilir).
- Bu dalın `tests/g068-copy`, `g069-rsvp`, `g075-thank-you` testlerinde tema listesi elle; ana daldaki `tests/design-themes.ts`
  (`builtDesignThemes()`) temayı birleşince kendiliğinden kapsıyor — ek değişiklik gerekmiyor (ana dal sürümleriyle 56/56).
- `PORT=3460` ile koşan g051/final-smoke ortak 3312/3316/3321'i kullanmadı.

**Önerilen görevler:** (a) qa-kontrol: G414 compare_* incelemesi (yukarıdaki kapı); (b) gpt-gorsel: 14 `envelope_open` orta panel
genişliği (öneri 1) — gelince `build_images.py`'de `align_fix` yeniden ölçülür; (c) claude-kod: `tema_build.cep_kes` dantel
modu (yukarıda).

## Günlük
- 2026-10-13 blokaj: K22 (kullanıcı, 2026-10-13): videodan çıkıldı, ürün yalnız mobil öncelikli website. Yeni website standardı pilotla (G035) belirlenince yeniden tanımlanacak
- 2026-10-13 yeniden tanımlandı (K22–K24, G033)
- 2026-10-14 entegratör notu (G214 onayı): frame_landscape ve frame_portrait yeşil pencerelerinde saydam/pembe leke var → build'de pencere doldurma (parts_prep) şart; closed↔open hiza UYARI (kapı kanatları ±2,5%) → manifest.stage.align ile düzelt. envelope_closed iki kanatlı kapı (kapi tipi), closure inci broş 1254 kare.
- 2026-10-15 alindi: claude-G414
- 2026-10-15 bitti, incelemeye gönderildi
- 2026-10-15 entegratör onayladı
- 2026-10-15 entegratör: W1 karşılaştırmaları incelendi — tasarıma sadık; ortak testler 14 ile geçti (g068 13/13, g075 48/48, g069 13/13). Onaylandı.
