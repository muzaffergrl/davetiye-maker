---
id: G038
baslik: Tasarım 03 Blush Garden Rose'u platform teması yap
rol: claude-kod
durum: inceleme
alan: wf-platform
oncelik: 1
bagimli: [G035, G037]
yazar: [platform/themes/blush-garden-rose/, platform/tests/theme-blush-garden-rose.test.ts, platform/scripts/seed.ts, platform/scripts/screenshot.cjs, platform/scripts/theme-check.cjs, platform/previews/g038/, platform/README.md, tools/parts_prep.py, tools/tests/test_parts_prep.py]
---

## Amaç
G035 statik demosunu `platform/themes/blush-garden-rose/` temasına çevirmek; içerik ve fotoğraflar platformdan gelsin.

## Yapılacaklar
1. Sayfaları tema motorunun işaretlerine bağla; kişisel metin şablonda kalmasın.
2. Foto alanları + boş durum yer tutucuları; açılış şovu ve sıralı animasyonlar korunur.
3. Demo içerikle tohum sitede 360/390/430/768/1280 karşılaştırma: G035 ile aynı görünüm.

## Bitti sayılması için
- [x] Tohum site G035 ile görsel olarak aynı (bilinçli farklar aşağıda); içerik değiştirilince sayfada değişiyor (test)

## Sonuç
**Yapıldı (wf-platform, 2026-10-13).** Durum: yerelde çalışan ve test edilen platform teması; **hiçbir yere yayınlanmadı**.
Ayrıntı: `platform/README.md` → "Tema: blush-garden-rose (G038)" ve `platform/themes/blush-garden-rose/README.md`.

- **Tema** `platform/themes/blush-garden-rose/`: `theme.json` (5 sayfa; foto alanları `hero_portrait` 567/595,
  `story_1..3` 626/868, `venue` 1172/681 — oranlar pencere kutusundan), 5 sayfa, `site.css`, `site.js`, `img/` (47 WebP,
  3 pencere maskesi, `manifest.json`), `build_images.py`. Kişisel her değer sunucuda motor işaretleriyle doluyor
  (`data-field`, başlık/açıklama/OG `data-text`/`data-attr-content`, program `data-repeat`, boş alanlar `data-if`,
  isteğe bağlı bloklar + nav'daki Story linki `data-optional`); JS kapalıyken de isimler/başlık doğru.
- **G037 entegrasyon notları uygulandı:** `site.js` içeriği `#site-data`'dan okur, kişisel metne dokunmaz (`CONTENT` yalnız
  `#site-data` yokken `DEV_CONTENT` + küçük tarayıcı içi işleyici); yönlendirme/prefetch `data.pages`'tan; speculation
  rules URL yazmaz, sunucunun çevirdiği "Enter" linkine seçiciyle bakar; `.has-photo` yerine `[data-photo-state]`; foto
  anahtarları `theme.json`'dan (`data-photo`); JS'teki tema görselleri betiğin kendi adresine göre çözülür; sessionStorage
  anahtarları site başına (`:<slug>`, bütün siteler aynı origin'de); `<noscript>` içindeki link motorca çevrilmediği için
  `.nojs-only` öğeye çevrildi. Açılış şovu, sıralı `MOTION`, Skip, reduced motion, view transition, geri dönüşte açık zarf +
  Replay korunuyor.
- **Mekân çerçevesi (G047):** `frame_landscape.png` `tools/parts_prep.py` ile işlendi. parts_prep yarı saydam "bulut
  lekesini" bırakıyordu (frame_landscape ve arch_frame; card_small temiz) → **parts_prep düzeltildi** (`leke_doldur`:
  pencereye bağlı yarı saydam/yeşilimsi pikseller, kutudaki yeşil ve gölgede koyulaşmış yeşil cepler, içte kalan delikler;
  yalnız pencere kutusu + 4 px; büyük opak ada korunur + uyarı) + test `test_bulut_lekesi` (eski sürümde kaldığı
  doğrulandı). Üç pencerede de tam pencere 0 görünür piksel, çıktının hiçbir yerinde görünür yeşil yok; pencere dışı
  piksel değişmedi. `build_images.py` bunu WebP çıktısında da denetliyor; görseller baştan üretimde bayt bayt aynı çıkıyor.
- **İsteğe bağlı iyileştirme yapıldı:** kapalı zarfın kapağı tırtıklı kenarı izlenerek ayrı katman (`env_cflap`) kesildi;
  açılışta menteşesinde 3D kalkıyor (0→90°), sonra açık zarfın kapağı (−90→0°) devralıyor. Kare kare incelendi; eski
  "erime"den daha fiziksel → tutuldu.
- **RSVP:** iş sırasında G042 main'e girdi ve sözleşmesi "tema 03'ün preview-only düğmesi bu formla değiştirilir" diyordu →
  `rsvp.html`'e platform formu (`/rsvp/form.js`, `data-rsvp-*`, `method="post"`, 4 durum paneli) temanın tipografisiyle
  eklendi; kartın RSVP düğmesi forma kaydırıyor.
- **Seed:** `npm run seed` → `/clara-and-julian` bu temayla, 03 demo içeriği + `assets/gpt/photos/` örnek fotoğrafları
  (adaptörle yükleniyor, Pillow ile JPEG q84'e yeniden kodlanıyor; `--no-photos`, `--photos`, `--photo-max`).
  `scripts/screenshot.cjs` (G037 duman testi) `_sample` temasına sabitlendi.
- **G035'ten bilinçli farklar:** mekân GPT yatay çerçevede; kapak kalkışı; RSVP formu; 4+ program satırında sıkışık kart
  düzeni (1–6 satır ölçüldü); nav'da Story `our_story` kapalıyken gizli.

**Test edildi:**
- `npm test` 147/147 (main'deki G039/G042/G045 ile birlikte; yeni `tests/theme-blush-garden-rose.test.ts` 12 test: her alan = içerik kaydı (bağımsız
  biçimlendirme), şablonlarda kişisel metin yok, içerik değişikliği her sayfada (isimler, tarih, saat dilimi, bölgesiz şehir,
  4 satırlı program, story), foto `user`/`placeholder` durumu ve güvensiz URL, isteğe bağlı bloklar, linkler, RSVP form
  sözleşmesi, önizleme anahtarı, site.js sözleşmesi, gerçek rotalar + CSP hash'leri + RSVP API'siyle kayıt);
  `npm run typecheck` temiz; `npm run build` temiz; `python3 tools/tests/test_parts_prep.py` (+ G033'ün paket5 testi) geçti.
- `node scripts/theme-check.cjs` (`next start` + Chromium): **56/56**. 5 sayfa × 360/390/430/768/1280: yatay kayma yok,
  ekran dışı metin yok, bütün görseller yüklü, konsol/CSP hatası yok, her alan ve `<title>` = kayıt, kart metni GPT kartının
  düz kağıdında (`free_zone`); fotoğrafsız sitede yer tutucu + "Your photo here"; zarf → home (4,5 s, kart geçiş işareti) →
  nav ile story; geri → açık zarf + Replay; Skip; reduced motion (≈0,5 s); site başına oturum anahtarı; taslak önizlemede
  anahtar akış boyunca korunuyor; sayaç hedefi 2027-05-15 20:00 UTC + saat taklidiyle "today/after"; eksik harita linki
  bildirim veriyor, istek yok; RSVP yanıtı (yes, 2 kişi) bu siteye kaydedildi ve teşekkür paneli çıktı, önizlemede
  hiçbir POST yok; veride içerik değişince (isimler, tarih, mekân, 4 program satırı) yeniden yüklenen her sayfa yeni kaydı
  gösteriyor; ilk açılış (390×844, DPR 3, yer tutucularla) index 1018 KB, home 706 KB. Dış istek yalnız Google Fonts.
  `npm run screenshot` (_sample) 32/32. Tema dosyaları statik sunucuda (platformsuz) da önizleniyor.
  G045'in `tests/claim-browser.ts`'i gerçek temayla 45/45: `/start?theme=blush-garden-rose` canlı demo (önizleme kipi,
  RSVP göndermez) + sahiplenilen sitede panel açılıyor. (Son koşuda kontrol betiğindeki bir tıklama, bağlantı sabit alt
  menünün altında kaldığı için bir kez yanlış sonuç verdi; bağlantı tıklamadan önce ortalanıyor, sonra 56/56.)
- Görsel karşılaştırma: `previews/g038/compare_*_390.jpg` (G035 | G038) — mekân bölümü ve RSVP formu dışında aynı.

**Önizlemeler** (`platform/previews/g038/`): 5 sayfa 390 px + index/home 360/430/768/1280 + details 1280, yer tutucu
hâlleri, `details_390_changed_content.png`, `rsvp_390_reply_sent.png`, `compare_*_390.jpg`, `opening_390x844.mp4`
(dokun → kapak kalkar → kart → home → davet → story → details/mekân), `checks.json`.

**Test edilmedi / yapılmadı:** gerçek iPhone/Safari ve Android cihaz (yalnız Chromium mobil emülasyonu); Firefox/Safari'de
view transition yerine solma yolu yalnız kodda; JS kapalı tarayıcıda gerçek gezinme (yalnız sunucu çıktısı test edildi);
ekran okuyucu; yavaş ağ; ilk açılış ağırlığı örnek fotoğraflarla ölçülmedi (yer tutucularla ölçüldü; seed fotoğrafı
hero ≈ 277 KB ekler); Vercel/Supabase yayını (proje açılmadı); panelden (G039) bu temayla uçtan uca fotoğraf kırpma akışı
(panel tarafı `theme.json` oranlarını okuyabiliyor, `parseAspect` "567/595" biçimini kabul ediyor — tarayıcıda denenmedi).

**Bilinen sınırlar:** program 7+ satırda Details kartına sığmaz; 3'ten fazla story başlığı gösterilmez (3 çerçeve);
`og:image` yok (ayrı GPT paylaşım görseli gerekiyor); `previews/g038` ≈ 19 MB.

**Önerilen görevler:** gpt-gorsel — tasarım 03 paylaşım görseli (OG, 1200×630, kişisel metin pişirilmeden) ·
claude-qa — gerçek telefonda (iOS Safari + Android Chrome) tema + RSVP formu · G046 için: bu tema standardın örneği
(`themes/blush-garden-rose/README.md`, `scripts/theme-check.cjs` kontrol listesi).

### İnceleme düzeltmeleri (2026-10-13, bağımsız inceleme bulguları)
- Misafir sitesinde "Your photo here" yok: etiket yalnız önizlemede (`html[data-preview="true"]`); panel yayın öncesi boş foto yerlerini listeler.
- Link blokları yalnız linkleriyle (`data-if="urls.*"`): ölü "View map / Where to stay / View registry" düğmesi yok; Travel notu
  artık olmayan "ipuçları"nı vaat etmiyor. `rsvp.method` dolu → RSVP sayfası 404, ona giden düğme/linkler kalkar.
- Kısa telefonlar (360×640, 375×553, 390×690): arka plan ortadan büyütülür, zarf yazıları çiçeğe değmiyor; "Replay the opening" yumuşak
  zeminli + 44 px; Skip ve "Replay the envelope" ≥ 44 px. Önce/sonra: `previews/g038/review_short_phones_{before,after}.jpg`;
  `theme-check.cjs` yazı altındaki zemini ölçer (eski CSS'le başarısız, yenisiyle geçer).
- RSVP: yanıttan sonra kapanış metni gizlenir (reddeden misafire "We can't wait…" yok). Foto alt metni içerikten. Şablon yorumları
  çıktıdan siliniyor, `site-data` içerik kaydını taşımıyor (kapalı bölümler kaynakta görünmüyor).
- Test: `npm ci`, `npm test` (197/197), `npm run typecheck`, `npm run build` (+ yeni postbuild `trace-check`) temiz; `theme-check.cjs` 68/68, `panel-browser.ts` 72/72, `claim-browser.ts` 50/50, `rsvp-browser.ts` 25/25 (hepsi geçici klasöre, kayıtlı previews değişmedi); `tools/tests/*.py` 6/6. Gerçek telefon, gerçek Vercel/Blob ve canlı yayın **denenmedi**.
- Yapılmadı: gerçek cihazda (iOS Safari çubukları) görsel kontrol; paylaşım görseli hâlâ yok.

## Günlük
- 2026-10-13 alindi: wf-platform
- 2026-10-13 bitti, incelemeye gönderildi
- 2026-10-13 inceleme bulguları düzeltildi (yer tutucu etiketi, link blokları, RSVP kapalı, kısa telefon, alt, yorumlar) — wf-fix
