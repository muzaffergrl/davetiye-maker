---
id: G046
baslik: Tema standardı belgesi + GPT website parça listesi (Paket W)
rol: claude-kod
durum: inceleme
alan: wf-tema
oncelik: 2
bagimli: [G038]
yazar: [docs/11_TEMA_STANDARDI.md, gorevler/roller/gpt-gorsel.md]
---

## Amaç
19 tasarımın her biri bu standartla tema olur: dosya yapısı, işaretler, koreografi ayarı, foto alanları, performans
sınırları; GPT'nin her tema için üreteceği parça listesi (tek nesne/tek görsel, gölgesiz, aynı ışık; birbirine
oturması gereken parçalar tek görselden kesilir).

## Sonuç
**Yapılan (wf-tema, 2026-10-13):**
- `docs/11_TEMA_STANDARDI.md` (yeni): 19 tasarımın G4NN teması olması için standart, gerçek temadan çıkarıldı
  (`platform/themes/blush-garden-rose/`: theme.json, 5 şablon, site.css, site.js `MOTION`/`ENVELOPE_GEOMETRY`, build_images.py,
  img/manifest.json; `tools/parts_prep.py`, `tools/katalog.py` `WEB`/`ZARF_TIPI`, PAKET 5 prompt'ları 06/09/13/18 + 04/11/12).
  Bölümler: hat özeti; klasör düzeni (tema klasörüne kaynak PNG/`img_src` girmez — `./themes/**/*` 16 rotanın Vercel paketine
  giriyor); `theme.json` alanları + sabit foto anahtarları; temanın `content.demo.json`'ı; sayfa sayfa zorunlu motor işaretleri,
  RSVP form sözleşmesi, `#site-data`/sayfa haritası, G051'in yolda olan işaretleri; sabit yazılmayacaklar tablosu + serbest tasarım
  metni; görsel hattı (PAKET 5 parçası → img/ dosyası/genişlik tablosu, kit_check, parts_prep'in yaptığı/yapmadığı, build_images
  sorumlulukları ve hata veren denetimler, srcset/sizes, maskeler, CSS'te izinli "ışık ve arayüz" / yasak "dekor" sınırı);
  performans bütçesi (ilk görünüm ≤ 1,5 MB DPR 3, 03'ün ölçülen değerleriyle); **zarf tipine göre açılış** (kapak V / eğri kapak /
  kemer cep / cüzdan / yırtma şeridi / gatefold kapı / kitap / kese / vellum kılıf: GPT parçaları, Claude'un kestiği parçalar,
  katman sırası, `MOTION.envelope` anahtarları, araç durumu; 90° el değiştirme ve `rotateX/Y` yön tablosu; sahne = kaynak tuval,
  `kirpma` ofsetiyle hiza, ±%1,5 hiza denetimi); `MOTION` biçimi ve tasarıma özgü koreografi kuralları; foto alanı ve yer tutucu;
  erişilebilirlik + reduced motion; view transition, geri dönüş, bfcache, slug'lı `sessionStorage`; tipografi/taşma/latin-ext;
  G4NN bitti tanımı (komutlar, `tests/theme-<slug>.test.ts` 15+2 test, theme-check genişlikleri/kısa telefonlar/akışlar,
  `previews/g4NN/` dosyaları, dürüst Sonuç şablonu); bilinen boşluklar → önerilen görevler; kontrol listesi.
- `gorevler/roller/gpt-gorsel.md` → "Website paketi (Paket 5)": standardın gösterdiği eksik GPT kuralları eklendi —
  birbirine oturan çiftlerde **hiza kontrolü** (yarı saydam üst üste bakış), **kesilecek kenarların görünür olması** (kapak serbest
  kenarı, gatefold dikişi, kitap kenarı/sırtı, kese ağzı, ön cep kenarı; nesne üstündeki temas gölgesi serbest), **ışıma/hâle yok**,
  **`web_hero` = paylaşım görseli** (zarf + kapanış altta boşlukla tam, üst %20 sakin).
- Parça listesi kararı: PAKET 5'in 17 parçası (+ tasarıma özel ekler) her temanın ihtiyacını karşılıyor; 03'ün kullandığı her
  görselin karşılığı var. **Yeni dosya gerekmiyor; eksikler kural** (yukarıdaki 4 madde). *(İnceleme düzeltmesi: genel liste
  için doğru, ama 01'in açılışı mührün altından kayan dalı ayrı parça olarak istiyor → `closure_sprig.png` eklendi; docs/11 §5.1.)*

**Kontrol edilen / ölçülen:** 03 teması dosya boyları (site.js 28 KB, site.css 38 KB, klasör 2,7 MB, en büyük WebP'ler) ve
`previews/g038/checks.json` (ilk görünüm index 1018 KB / home 706 KB, açılış 4451 ms) belgeye bu değerlerle girdi. 03'ün
`web_hero.png`'sine 1.91:1 kırpım çizgileri çizilip gözle bakıldı: alt hizalı kırpımda zarf + fiyonk tam kalıyor (og dosyası
üretilmedi). Motor davranışları kaynaktan doğrulandı: `og:image` `origin` ile mutlak oluyor, `<link href>` tema yoluna çevriliyor,
`data-format="amp"` var, `site-data.pages` kapalı sayfaları da içeriyor, `themeFieldUse` an sayısını işaretlerden okuyor.
19 koleksiyonun hiçbirinde henüz PAKET 5 W2 parçası yok → prompt düzeltmeleri şimdi ucuz. *(İnceleme düzeltmesi: 01'de W1
comp'ları var — G201 `alindi`, 44a30ab; W2 henüz başlamadı.)*

**Denenmedi / sınırlar (dürüst):** belge bir standart; gatefold, kitap, kese ve kılıf açılışları ile genel eğri kapak/kese ağzı
kesimleri **uygulanmadı, tarayıcıda denenmedi** — `rotateY` yön tablosu CSS dönüşüm matematiğinden çıkarıldı, yalnız kapak
(`rotateX`) 03'te çalışıyor. ±%1,5 / %4 hiza eşikleri, 250 KB/35 KB/45 KB sınırları ve 3,2–5 s açılış aralığı 03'ten türetilmiş
hedeflerdir, başka tasarımda ölçülmedi. Kod değişmedi; yine de `platform/`'da `npm test` (197/197 geçti), `npm run typecheck` (temiz),
`npm run build` (+ trace-check: 16 rota, 2 tema) koşuldu. Playwright `theme-check` koşulmadı (tema değişmedi).

**Önerilen prompt düzeltmeleri** — *G046 incelemesinde dördü de uygulandı (`tools/katalog.py` `ISIK`, `KESIM_KENARI`, W2.3/W2.5/
web_hero, ortak talimat; 19 `GPT_PROMPTS.md` yeniden üretildi)* (`tools/katalog.py` ortak metinleri ya da `ZARF_TIPI`, sonra `python3 tools/katalog.py paket5`;
19 dosya elle düzenlenmedi):
1. W2.3 `envelope_closed` (bütün tipler): *"The edges where this piece will be cut must read clearly: the free edge of the flap
   (folder: the center seam where the two doors meet; book: the cover's outer edge and the spine; pouch: the gathered mouth) is a
   crisp line with a slight contact shade on the object itself — this is not a cast shadow."*
2. W2.5 `envelope_open`: *"The top edge of the front pocket (pouch: the front rim of the mouth) is a crisp, clearly visible edge
   against the liner."* + Kontrol: "envelope_closed üstüne yarı saydam konunca değişmeyen gövde çakışıyor" (sarılı `closure`
   Kontrol'üne de aynı cümle).
3. Ortak talimat bloğu ("Instructions for GPT") ve şeffaf parça kuyruğu: *"No glow, halo, light rays or haze outside the object's
   outline — the website adds light effects."* (13'ün ateş böceği accent'inde zaten var; genelleştirme).
4. W2.17/W2.18 `web_hero`: *"This image is also cropped to 1200×630 for link previews: keep the closed {zarf_kisa} with its
   {kapanis_kisa} completely visible with at least 5% empty margin below it, and keep the top 20% to background and decor only."*

**Önerilen görevler** (entegratör açar; ayrıntı `docs/11` §14):
- claude-kod: `tools/tema_build.py` ortak modülü (webp/manifest, maske, serbest bölge, yer tutucu, og kırpımı, hiza ölçümü; genel
  eğri kapak kenarı, eğri ön cep, gatefold dikişi, kitap sırtı, kese ağız yayı, şerit farkı kesimleri).
- claude-kod: `kit_check --paket 5`'e kapalı/açık zarf (ve sarılı kapanış) hiza denetimi.
- claude-kod (ilk G4NN'den önce): `scripts/theme-check.cjs --theme <id>` genelleştirmesi (font listesi sayfadan, kart ↔ `free_zone`
  manifest'ten, başlıklar `data-text`'ten, W1 comp karşılaştırması, çıktı `previews/<görev>/`).
- entegratör: G401–G420 (G403 hariç) `yazar:` alanına `platform/tests/theme-<slug>.test.ts` ve `platform/previews/g4NN/`; G406
  vb. 2. adımdaki "`--out <tema klasörü>/img_src`" → geçici klasör; Girdiler'e `docs/11` §7 (zarf tipi).
- claude-metin: 01, 02, 04–20 `content.demo.json`'larına `story` (intro + "First hello", "The proposal", "Forever begins").
- claude-kod: blush-garden-rose'a `og:image` (`web_hero` alt hizalı kırpım) + favicon (`ribbon_bow`).
- claude-kod: tema görsellerini yalnız tema varlık rotasının Vercel paketine izlemek (diğer rotalara `*.html`/`*.json`) ya da
  derlemede `public/`'e kopyalamak (20 tema × ~2,7 MB her fonksiyona giriyor; Aşama 2 varyantlarıyla 250 MB sınırına yaklaşır).

## Günlük
- 2026-10-13 alindi: wf-tema
- 2026-10-13 bitti, incelemeye gönderildi
- 2026-10-13 inceleme bulguları düzeltildi (wf-fix-tema): docs/11 G051 işaretleri zorunlu (§3.2/§3.3/§3.5, test 18–22, §15), öncelik satırı (görev metni < docs/11, G035 örnek değil), tam ad yedeği, guest_policy yok + mühür monogramı kararı, tipe göre hiza kenarları, sahne kutusu/boyu formülü + kapı/kitap ölçeği, kapanış çapası, kapakla taşınan kapanış, MOTION.accents biçimi, comp öğe haritası + qa kapısı, CSS çerçeve yasağı, 3 dilim/≥38vw, zorlama kaydı, saf yardımcılar, parts_prep cep uyarısı, fotoğraflı ölçüm; katalog: G4NN şablonu (yazar + test/previews, bağımlı G052, img_src/ölü link/03 kopyası kalktı) → 19 görev, 4 prompt düzeltmesi + 01 closure_sprig + 04 kesim kenarı → 19 GPT_PROMPTS.md; açıldı G052 (theme-check --theme), G053 (demo kayıtları); G201'e not. Ürün kararı açık: şema/panel uzunluk sınırları (docs/11 §14 #10).
