---
id: G054
baslik: tools/tema_build.py ortak tema yardımcıları + kit_check zarf hiza denetimi (docs/11 §14 #1–#2)
rol: claude-kod
durum: inceleme
alan: wf-hazirlik
oncelik: 1
bagimli: [G046]
yazar: [tools/tema_build.py, tools/kit_check.py, tools/tests/, platform/themes/blush-garden-rose/, docs/11_TEMA_STANDARDI.md]
---

## Amaç
19 tema aynı görüntü hattını kullanacak; 03'ün `build_images.py`'sindeki genel parçalar ortak modüle taşınır, zarf tiplerine göre
kesimler eklenir, kapalı/açık zarf hizası GPT çıktısında denetlenir.

## Yapılacaklar
1. `tools/tema_build.py`: webp + srcset türevleri + manifest, pencere maskesi, serbest bölge ölçümü, yer tutucu, og kırpımı (1200×630),
   hiza ölçümü; kesimler: genel eğri kapak kenarı, ön cep (düz/eğri), gatefold dikişi, kitap sırtı/kapak, kese ağız yayı, aydınger kılıf şeridi.
   Her kesim sahte görsellerle testli; başarısızsa açık uyarı + geometrik yedek.
2. 03'ün `build_images.py`'si ortak modülü kullanır; çıktısı **bayt bayt aynı** kalır (ya da fark gerekçeli, görsel olarak aynı).
3. `kit_check --paket 5`: `envelope_closed` ↔ `envelope_open` (ve sarılı kapanış) gövde sınır kutusu karşılaştırması (±%1,5 uyarı, > %4 hata).
4. 03 için `og-1200x630.jpg` (web_hero'dan, alt hizalı kırpım, yazısız) ve `favicon.png` (ribbon_bow'dan) üret; tema klasörüne koy.
5. docs/11'de ilgili bölümleri güncelle.

## Bitti sayılması için
- [x] Testler geçiyor; 03 teması değişmeden yeniden üretiliyor; hiza denetimi 03 parçalarında çalışıyor

## Sonuç
**Yapılan (dosyalar)**
- `tools/tema_build.py` (yeni): ortak tema görsel hattı — `webp` (çıktı klasörü parametre), `manifest_yaz`, `klasor_boyutu`
  (≤ 3 MB), `prep_hazirla` (parts_prep → geçici klasör; tema klasörü reddedilir), `pencere`, `kaydet_olculeri`, `foto_alani`
  (pencere kaydı + maske + kaynak/WebP şeffaflık denetimi), `pencere_maskesi`, `serbest_bolge`, `kapla`, `yer_tutucu`,
  `bulanik_fon`, `bilesenler`, `og_kirp`/`og_kaydet`, `ikon`, `pencere_seffaf_mi`, `yesil_gorunur`/`yesil_denetle`, `ortusme`,
  hiza (`alfa_kutusu`, `kat_bul`, `hiza_olc`, `kapanis_hiza`, `hiza_ozet`) ve kesimler: `kapak_kes` ("v" = 03'ün kesimi;
  "egri" = biçimden bağımsız iz, zarftan dar kapak), `cep_kes` ("v" = G035 kesimi, tutmazsa `parts_prep.cep_kes`; "duz";
  "egri"; kenar bandı — açık kesik şeridi / altın çizgi — cebe dahil), `dikis_bul` + `kapi_kes` (dikiş, katlanma çizgileri,
  orta cep), `kitap_kes` (oluk/sırt), `kese_kes` (ağız yayı), `kilif_serit` (aydınger kılıf üst şeridi), `serit_farki` (04).
  Her kesim kenarı bulamazsa `method: "geometrik"` + `warnings` ile geometrik yedeğe düşer.
- `tools/kit_check.py`: zarf hizası (`envelope_closed` ↔ `envelope_open` website parçaları, PAKET 4/5; tipe göre değişmeyen
  kenarlar; sarılı kapanışta `closure.png` uçları); ≤ %1,5 GEÇTİ, ≤ %4 UYARI (geçti sayılır), > %4 KALDI, parça yok ATLANDI;
  `--hiza`, `--zarf-tipi`; zarf tipi kapalı zarfın prompt başlığından (`beklenenler` artık `baslik` da döndürüyor).
- `platform/themes/blush-garden-rose/build_images.py`: G035 modülü artık içe aktarılmıyor, hepsi `tema_build`'den; `--out`;
  yeni çıktılar `img/og-1200x630.jpg` (129 KB; `web_hero` alt hizalı 1.91:1 kırpım `[0, 218, 1536, 806]`, yazısız, zarf +
  fiyonk tam — gözle bakıldı) ve `img/favicon.png` (28 KB; `ribbon_bow` 180 px şeffaf kare; 16/32 px'te beyaz/koyu/pembe
  zeminde gözle bakıldı); manifest'e `og`, `favicon`, `align`, `checks` (+ kesimlerde `method`); açık zarf katman örtüşme
  denetimi (fark 0) ve tema klasörü ≤ 3 MB denetimi.
- Tema `README.md` (yeniden üretim, hiza notu, og/favicon), `docs/11` (§0, §1, §3.1, §5.1–§5.4 ortak modül tablosu, §7.1 hiza
  aracı, §7.2 araç sütunu, §7.3–§7.7, §13.1, §14 #1/#2/#6, §15).
- Testler: `tools/tests/test_tema_build.py` (yeni) — her kesim sahte görselle hem bulunan (kenar bilinen geometriye ±1,5–3 px;
  kenar bandı: 3 px şerit / 1 px çizgi / şeritsiz) hem yedek yolu (açık uyarı + geometrik), `ortusme` ≤ 0,01, hiza
  tamam/uyarı/hata, Kaydet ölçeği (1254×1881 kaynak), ölçekli mod, sarılı kapanış, og/ikon/bileşen; son adım 03'ü `--out`
  ile yeniden üretip `img/` ile bayt bayt karşılaştırır. `test_kit_check.py`'ye hiza testi (kapak, gatefold başlıktan, sarılı
  kapanış, ATLANDI, `--hiza`, `--zarf-tipi`).

**03 değişmeden yeniden üretiliyor:** G054 öncesi `img/` kopyasıyla sha256: 47 webp + 3 `mask_*.png` = 50/50 bayt bayt aynı.
`manifest.json`: eski içerik yeninin alt kümesi (hiçbir değer değişmedi); eklenenler yalnız `pocket.cut.method`,
`env_cflap.cut.method`, `og`, `favicon`, `align`, `checks`. Tema klasörü 2,90 MB (2 904 356 bayt, `du -sb`) ≤ 3 MB.

**Hiza ölçümleri**
- 03 (`kit_check collections/03_Blush_Garden_Rose --paket 4` → 21/21; `--hiza` → 1/1): parçaları PAKET 4'te (G030 pilotu) ve
  kapalı 1024×1024 / açık 1024×1536 **farklı tuvalde** → `olcekli`: gövdeler eşit genişliğe getirilince açık gövde tuvalin
  **−%4,55**'i kadar kısa → UYARI (farklı tuvalde hata eşiği uygulanmıyor; prompt üst üste çizim istememişti). G038 bunu
  `site.css` `.env-closed`'u dikeyde ~%5 basarak oturtmuş (ölçek 0,900 / 0,857). `--paket 5` 03'te "Kaydet satırı yok" verir
  (03'ün website parçaları PAKET 4'te; docs/11 §5.2'ye yazıldı).
- 01: `main`'de W2 parçası yok → `--paket 5` 5/23, hiza ATLANDI. Birleşmemiş `origin/codex/g201-olive-ivory-website-assets`
  dalındaki W2 parçaları geçici kitte (repoya girmedi) denendi: `--paket 5` 23/24 (yalnız `closure_sprig.png` yok), hiza
  **GEÇTİ: sol +0,29 · sağ −0,39 · alt −0,65 %** (GPT raporundaki "alt kenar 9 px farklı" ile tutarlı: 10 px). Aynı parçalarda
  `kapak_kes("v")` dantel kenarı izledi (renk, 221+222 nokta); `cep_kes("v")`'de G035 yöntemi lifli kağıtta tutmadı (artık
  ~16 px) → ikinci yöntem `parts_prep.cep_kes` tuttu (kenar [10, 479] · [460, 811] · [909, 479]); gözle bakıldı, uç yakınında
  ince bir astar kıymığı olabilir — G401 önizlemesinde kontrol edilmeli.

**Komutlar ve sayılar:** `test_tema_build.py` tam (03 yeniden üretimi dahil, ~40 s) geçti; `test_kit_check`, `test_kit_build`,
`test_md_to_pdf`, `test_mockup_compose`, `test_parts_prep`, `test_parts_prep_paket5` geçti. `platform/`: `npm ci`, `npm test`
230/230, `npm run typecheck` temiz, `npm run build` + trace-check (17 rota, 2 tema). `next start` üzerinde
`/themes/blush-garden-rose/img/og-1200x630.jpg` 200 `image/jpeg`, `favicon.png` 200 `image/png`, `manifest.json` 404.

**Denenmedi / sınırlar (dürüst)**
- Kapı, kitap, kese, kılıf, eğri kapak/cep kesimleri yalnız **sahte görsellerle** denendi; bu tiplerin gerçek GPT parçası yok.
  Eşikler 03/01 ışığına ve sahte görsellere göre; her G4NN kesim önizlemesine bakmalı, `warnings` varsa Sonuç'a yazmalı.
- `og:image` / `<link rel="icon">` etiketleri sayfalarda **yok** — motor tarafı G055 (dosyalar `img/og-1200x630.jpg`,
  `img/favicon.png`). Sosyal ağ önizlemesi ve gerçek tarayıcı sekmesi denenmedi. `favicon.png` şeffaf: iOS ana ekran ikonu
  yapılırsa şeffaf alan siyah görünür (G055 kararı).
- 03 şablonları ve CSS'i değişmediği, görseller bayt bayt aynı kaldığı için `theme-check` (Playwright) yeniden koşturulmadı.
- Sarılı kapanış ölçümü sarma ekseninin uçlarını ölçer; eksenden taşan fiyonk/dal "taşma" gösterebilir (gözle bakılır).

**Önerilen (entegratör):** G055 etiketleri bu yollardan yazsın; 01 W2 parçaları birleşince `kit_check --paket 5` yeniden
koşturulsun (`closure_sprig.png` eksik — gpt-gorsel).

**İnceleme düzeltmeleri (2026-10-13, wf-hazirlik; G052–G055 incelemesinin bulguları)**
- **`tema_build.cep_kes` çökmesi (orta, doğrulandı):** 2°+ eğik gövdede ya da gövdenin yanında ayrı bir yaprak varken hiçbir satır
  sütun açıklığının %97'sine ulaşmıyor → `IndexError` (3° eğik ve yapraklı sahte görselde yeniden üretildi; 2°'de tutuyordu). Şimdi
  gövde = en büyük opak bölge, üst = %97 satırı ya da `_govde` medyanı + **uyarı** ("gövde üstü sütun açıklığından bulunamadı …");
  kesim yine renk/yedek yollarından. `kapak_kes`, `cep_kes`, `bilesenler` girdiyi RGBA'ya çeviriyor (RGB parça artık
  `IndexError` vermiyor). `tara` tuvalin üstüne taşan pencerede boş dilim okumuyor. Test `test_saglam`: 2/3° eğik gövde (v/duz/egri),
  20 px solunda yaprak (kenar yine doğru), RGB girdi (cep, kapak), 3° eğik açık gatefold (`kapi_kes`), RGB `bilesenler`.
  `test_tema_build.py` tam koşu: **03 yeniden üretimi 53 dosya bayt bayt aynı**, tema klasörü 2,91 MB.
- **03 home davet kartı (yüksek, doğrulandı):** 20+ karakterlik tam ad (`.nm` `cqw`'de, her genişlikte) tarihi/mekânı alt çiçeklere,
  35 karakterlik ad kartın dışına itiyordu; 78 karakterlik mekân demo isimleriyle de çiçeğe biniyordu (piksel testiyle 360–768'de
  ölçüldü). `site.css`: `.invite` Details kartı gibi docs/11 §9 3 dilim (üst %0–42 kırpılmış `<img>`, düz bant %42–66 `::before`
  gerilir, alt %66–100 `::after`; çizim yok), metin akışta %35,2'den, sütun en çok %88, mekân + şehir en çok %64, son satır
  görüntünün en çok %81,5 satırı, `overflow-wrap: break-word`. Demo kaydında kart görüntünün kendi boyunda (390 px'te 570/569,
  360 px'te 528/521 px). `g055-browser`: 24/35/40 karakter tam ad, 78/80 karakter mekân, uzun host line, demo × 5 genişlik → her
  satır düz kâğıtta.
- **03 home tanıtımı (orta, doğrulandı):** `.teaser .sched-line` `nowrap` 360 px'te etiketi ve "Will You Join Us?"u sağdan
  kesiyordu. Satır artık kendi altına sarar (asılı girinti; ≥ 768 px'te girintisiz), `.tx` `min-width: 0`. Demo düzeni aynı (360 px
  ekran görüntüsüyle karşılaştırıldı).
- **docs/11 (orta, doğrulandı):** §1 (Vercel izleme G055 sonrası, 03 2,9 MB), §2.1 (kopya birebir, story dahil; intro + tarih),
  §3.1 (motorun yazdığı etiketler: og:image mutlak + type/size + **og:image:alt/twitter:image:alt**, ikon; "dosyaya sahip" kuralı;
  apple-touch-icon yok), §3.2 story satırı (`<span data-field="story.intro"></span> <span class="nowrap" data-field="date"></span>.`
  **zorunlu**), details (program ≤ 10), §6/§9 (türevli `srcset` + şablonun `sizes`'ı korunur → yanlış `sizes` alıcı fotoğrafında da
  büyük türevi indirtir; seed türevsiz), §9 uzun kart (03'ün iki kartı örnek; uzayan kart piksel testiyle), §12 (şema sınırları,
  zorlama kaydı = `theme-check --stress`, 03'ün durumu), §13.1 (`--theme/--out/--compare/--stress`, port), §13.2 #6/#16/#17 + yeni
  #23 (story girişi + tarih), §13.3 (kırpılan metin, kart piksel testi, zorlama kaydı, `theme_check` tablosu), §14 (#3/#5/#6/#7/#9/#10
  yapıldı; yeni #12 katalog ozet, #13 GPT_PROMPTS, #14 og odak, #15 03 stres), §15. Tema `README.md`: uzayan kartlar, program ≤ 10,
  og notu.
- **Yapılmadı:** og görselinin yatay odağı (`og_kirp`, düşük): 03'ün `og-1200x630.jpg`'sini yeniden üretmek ikili dosyanın üzerine
  yazmak olurdu; docs/11 §14 #14'e öneri. `og:image:alt` motor tarafında yapıldı (G055).
- **03 `--stress` (yeni ölçüm, düzeltilmedi):** home/story/details geçiyor; index (40 karakterlik ilk adlar zarf başlığını uzatıp
  zarfı ve "Tap to open"ı ekran altına itiyor, isimler köşe çiçeklerinde) ve rsvp (`.rsvp-text .sign` `nowrap` ekrandan taşıyor)
  geçmiyor → docs/11 §12, §14 #15 (önerilen görev, claude-kod: 03 teması).
- **Komutlar:** `python3 tools/tests/test_tema_build.py` (tam, 03 yeniden üretimi dahil) geçti; `test_kit_check`, `test_parts_prep`,
  `test_parts_prep_paket5` geçti. `platform/`: `npm test` 258/258, typecheck, build; `theme-check --theme blush-garden-rose` 74/74
  (video dahil, çıktı geçici klasöre — `previews/g038` değişmedi), `g055-browser` 138/138, `final-smoke` 42/42, `g051-browser`
  44/44. `site.css` 43 KB (≤ 45), tema klasörü 2,91 MB. Denenmedi: gerçek telefon/Safari; uzayan davet kartının gerilen kâğıt
  dokusu DPR 3'te yakından (Details kartındaki gibi dikey liflenme beklenir; 1× ve 2× ekran görüntülerinde ek yeri görünmedi).

## Günlük
- 2026-10-13 alindi: wf-hazirlik
- 2026-10-13 bitti, incelemeye gönderildi
- 2026-10-13 inceleme düzeltmeleri (wf-hazirlik): tema_build cep_kes eğik/yapraklı/RGB parçada çökmüyor (uyarı), 03 davet kartı 3 dilim, tanıtım satırı sarıyor, docs/11 G052–G055'e göre güncel
- 2026-10-13 bitti, incelemeye gönderildi
- 2026-10-13 son denetim (wf-hazirlik, temiz origin/main worktree): tools/tests 7/7 (test_tema_build: 03 yeniden üretimi 53 dosya bayt bayt aynı, 2,91 MB); kit_check 03 --paket 4 21/21 + hiza UYARI −4,55 % (olcekli), 03 --paket 5 'Kaydet satırı yok' (beklenen), 01 --paket 5 5/23 (W2 parçaları main'de yok) — Sonuç'la tutarlı; docs/11 §15 '22 madde' → 23
