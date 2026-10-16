---
id: G101
baslik: Tasarım 15–20 temaları — qa-kontrol bulgularının düzeltilmesi (docs/11 §13.4)
rol: claude-kod
durum: hazir
alan:
oncelik: 1
bagimli: [G415, G416, G417, G418, G419, G420]
yazar: [platform/themes/cherry-blossom-spring/, platform/themes/sunflower-rustic-barn/, platform/themes/emerald-gold-estate/, platform/themes/wildflower-meadow-vellum/, platform/themes/midnight-garden/, platform/themes/coastal-seaside/, platform/tests/theme-cherry-blossom-spring.test.ts, platform/tests/theme-sunflower-rustic-barn.test.ts, platform/tests/theme-emerald-gold-estate.test.ts, platform/tests/theme-wildflower-meadow-vellum.test.ts, platform/tests/theme-midnight-garden.test.ts, platform/tests/theme-coastal-seaside.test.ts, platform/previews/g415/, platform/previews/g416/, platform/previews/g417/, platform/previews/g418/, platform/previews/g419/, platform/previews/g420/, gorevler/G415-website-kaynak.md, gorevler/G416-website-kaynak.md, gorevler/G417-website-kaynak.md, gorevler/G418-website-kaynak.md, gorevler/G419-website-kaynak.md, gorevler/G420-website-kaynak.md]
---

## Amaç
qa-kontrol (2026-10-16) altı temada comp kapısını GEÇTİ dedi; her birinde orta bulgular var → düzelt, yeniden ölç, Sonuç'ları dürüstleştir.
İki oturuma bölünür: **A = 15, 16, 17** · **B = 18, 19, 20** (her oturum yalnız kendi temalarının yollarına yazar).

## Bulgular (qa-kontrol raporu)
**Ortak (15, 16, 17, 18, 20) — orta:** `stress_details_360.png`'de Order of the Day kartında program satırları arasında ~130 px boş kâğıt:
`folds` kuralı program satırını ilk ekranın altına itiyor. **Düzeltme:** `.sched-row`'lar `data-fold` birimi olmaktan çıkar — 19'daki
çözüm (`git log --grep "G419: qa-kontrol"`; `platform/themes/midnight-garden/`).

**15 cherry-blossom-spring**
- Düşük: `range_home_375x553.png` isimler 4 satır; mekân/geri sayım/RSVP ilk ekranın altında → `fitNames` 375×553'te 2–3 satıra küçültsün, RSVP ilk ekranda.
- Düşük: `stress_home_375x553.png` h1 tamamen ilk ekranın altında → h1 en az ilk satırıyla ilk ekranda başlasın.

**16 sunflower-rustic-barn**
- Orta: story 390×844 ilk ekranın yarısı boş (giriş cümlesi ile ahşap duvar arasında ~450 px krem) → duvar ilk ekranda başlasın; ilk ip giriş cümlesinin hemen altında, `fold` ilk çerçeveyi itmesin.
- Düşük: home/story/details kapanışında ahşap masa bandının üst kenarı sert düz çizgi → iç sayfalardaki yumuşak maske bandın üstüne de.
- Düşük: Sonuç'taki "qa-kontrol karşılaştırma kapısı geçti (3 tur)" iddiası doğrulanamadı → düzelt.

**17 emerald-gold-estate**
- Düşük: `stress_home_375x553.png` h1 ilk ekranın altında; RSVP 375×553'te ilk ekranın altında → 15'teki gibi.
- Düşük: başlık fontunda TH bağı ("TOGETꞪER") → başlıklarda `font-variant-ligatures: no-common-ligatures`.

**18 wildflower-meadow-vellum**
- Düşük: story'de sağdaki accent "Story" başlığının "y"sine değiyor → accent başlık kutusundan uzak / gizleme kuralı başlığı da kapsasın.
- Düşük: story'de bulanık çayır bandı sayfa ortasında (2. çerçevenin arkasında); RSVP kapanışında "Replay the opening" düşük kontrast → iç sayfalarda çayır bandı yalnız sayfa sonunda (20'deki gibi).

**19 midnight-garden**
- Orta: home tam sayfa görüntüleri ekrandan ~%24 geniş (446/483/533/852 px) — muhtemelen `.fr-box::before` mum ışığı (`left/right: -38%`); iOS Safari'de yatay kaydırma riski → ışığı kırpan kapsayıcı (`.home-frames { overflow: clip }`) ya da taşmayı %0'a indir. Sonra `document.documentElement.scrollWidth === innerWidth` doğrula (360/390/430/768). theme-check bunu yakalamıyor → entegratöre not.
- Düşük: Sonuç'taki "qa-kontrol KABUL" iddiası doğrulanamadı → düzelt.

**20 coastal-seaside**
- **Orta (öncelik 1):** index kapalı zarfta kartın el yazısı alt kuyrukları zarfın altından ~3 px şerit görünüyor (390'da y≈503, x≈75–235; teşekkür modunda da) → kapalı hâlde `.env .card` cep tabanında `clip-path` ile kırp ya da kartın altını gövdenin içine çek (16 bunu kendi temasında çözdü).
- Orta: stres/teşekkür hâlinde yazı kıyı köpüğüne biniyor (`stress_home_360` geri sayım, `stress_ty_home_360` şehir, `stress_rsvp_360` kapanış) → kıyı bandı içerik uzadıkça aşağı itilsin ya da yazının arkasına kenarsız açık okunurluk hâlesi.
- Düşük: Sonuç'taki qa "GEÇTİ" iddiası doğrulanamadı → düzelt.

## Bitti sayılması için
- Her bulgu kapandı (ya da gerekçeli "kalıyor"); her tema için `theme-check --theme <id> --stress` 0 hata, `g051-browser` ve `final-smoke` yeşil, `npm test`/typecheck/build yeşil.
- Önce/sonra görüntüleri `platform/previews/g41N/` (yeniden üretilen compare/stress dosyaları) — ilgili bölgeye Read ile bakıldı.
- Her temanın görev dosyası Sonuç'una "qa-kontrol 2026-10-16: bulgular + düzeltmeler" eklendi; doğrulanamayan "qa geçti" cümleleri düzeltildi.

## Sonuç

### Oturum B (18, 19, 20)
Dal `claude/g101b-qa`. Ayrıntı her temanın görev dosyasında ("qa-kontrol 2026-10-16").

| Bulgu | Durum |
|---|---|
| 20 kapalı zarfta kart şeridi (öncelik 1) | **kapandı** — `.card-slot` alt kırpma %1 → %4 (`env_closed` %98,5'te bitiyor, alt kenarı yumuşak); 7 ekran boyu + teşekkür + stres büyütülüp bakıldı |
| 19 home yatay taşma | **kapandı** — `.frames-sec { overflow-x: clip }`; ek: stres/teşekkür zarf sayfasında ipucu hâlesi taşması → `.env-page { overflow-x: clip }`. 5 sayfa × 360/390/430/768 × demo/stres/teşekkür: `documentElement.scrollWidth` ve `body.scrollWidth` = `innerWidth` |
| 20 yazı kıyı köpüğünde | **kapandı** — home: `site.js` `shore()` kıyıyı uzun yazının altına kaydırır; kapanışlar: sabit yükseklikli kıyı bandı |
| 18, 20 fold boşluğu | **kapandı** — `.sched-row` `data-fold` değil (19'daki gibi) |
| 18 story accent / başlık | **kapandı** — `decor()` h1 kutusu script kuyrukları için yatayda 0,15em genişler (accent başlık yanında gizlenir) |
| 18 çayır bandı sayfa ortasında; RSVP "Replay" kontrastı | **kapandı** — iç sayfa `.page-bg` yalnız sis; çayır sayfa sonunda; kapanış çayırı yazının altından başlar + sis hâlesi |
| 19, 20 doğrulanamayan "qa geçti" | **düzeltildi** (G419/G420 Sonuç, 19 README tablosu) |

Komutlar (üç tema ayrı ayrı): `theme-check --stress` 128/0/0 (×3) · `g051-browser` 44/44 (×3) · `final-smoke` 45/45 (×3) · `npm test`
1210/1210 · `typecheck` temiz · `build` + trace-check temiz. Önizlemeler `previews/g418|g419|g420/` yeniden üretildi.
Açık: 20'nin `site.js`'i 35 829 B (bütçe 35 840) — sonraki değişiklik yorum kısaltmadan sığmaz. Gerçek iOS Safari denenmedi.

**Entegratöre not — theme-check 19'daki taşmayı neden yakalamadı (ortak dosyaya dokunulmadı):**
1. `hscroll` = `document.documentElement.scrollWidth - innerWidth` (`scripts/theme-check.cjs` 343, 389). Tema `html { overflow-x: clip }`
   koyunca bu değer her zaman 0; taşan kutu `body.scrollWidth`'te (446 vs 360) ve Playwright `fullPage` görüntüsünün eninde görünüyor.
2. "Kırpılmamış taşan öğe" (`bleed`) taraması `querySelectorAll('body *')` ile yalnız öğeleri gezer; taşan şey bir **sözde öğe**
   (`.fr-box::before`), listede yok. (Görünür öğelerden taşan köşe süsleri `overflow:hidden` atalarla kırpıldığı için doğru sayılıyor.)
3. Öneri (claude-kod): `hscroll`'a `document.body.scrollWidth` (ve `scrollingElement`) ekle ya da `fullPage` görüntü eni ≠ viewport → hata;
   gerekirse `scrollTo(9999, y)` sonrası `scrollX > 0`. Bu tek denetim 19'u ve zarf sayfasındaki ipucu hâlesini yakalardı.

## Günlük
- 2026-10-16 açıldı (entegratör; qa-kontrol raporu)
