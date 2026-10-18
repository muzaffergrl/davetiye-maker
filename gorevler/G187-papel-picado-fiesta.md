---
id: G187
baslik: 38 Papel Picado Fiesta — yeni tasarım (3. dalga), platform teması (GPT parçalarından önce), coming kaydı
rol: claude-kod
durum: bitti
alan: claude-G187
oncelik: 2
bagimli: [G168, G175]
yazar: [platform/themes/papel-picado-fiesta/, collections/38_Papel_Picado_Fiesta/, platform/tests/theme-papel-picado-fiesta.test.ts, platform/previews/g187/, platform/lib/marketing/config.ts, platform/lib/marketing/designs.ts, platform/lib/marketing/i18n.ts, platform/lib/i18n/dict/market/, platform/lib/i18n/dict/panel/, platform/lib/i18n/dict/site/, platform/lib/audio/catalog.ts, platform/lib/claim/demo-map.ts, platform/lib/print/layouts.ts, platform/public/print/papel-picado-fiesta/, platform/tests/g085-designs.test.ts, platform/tests/g093-designs.test.ts, platform/tests/g094-designs.test.ts, platform/tests/g097-designs.test.ts, platform/tests/g138-extras.test.ts, platform/tests/g175-openings.test.ts, tools/katalog.py, tools/etsy_upload.py, tools/tests/test_etsy_upload.py, gorevler/G187-papel-picado-fiesta.md]
---

## Amaç
`docs/24_YENI_TASARIMLAR.md` 3. dalga satır 38. İlk sayfa kapalı **zarf** (K23 sıkı, 2026-10-18); zarfın türü, kapanması ve
açılış koreografisi 01–32'den farklı; iç sayfaların bileşenleri ve hareket imzası yeni. GPT parçaları gelmeden kurulur
(geçici görsel = mevcut temaların düz doku kırpımları, şekil çizilmez — K21), GPT istemleri tam yol/ölçü ile yazılır.
Satış durumu `coming`. Koordinatör: session_01HP9ZrJ8mhZnigbvsvUQ4pR. Dal `claude/g187-papel-picado-fiesta`; main/PR/yayın yok.

## Talimat (koordinatör)

GÖREV: G187 — 38 Papel Picado Fiesta (`platform/themes/papel-picado-fiesta/`, `collections/38_Papel_Picado_Fiesta/`). Görev dosyası: `gorevler/G187-papel-picado-fiesta.md` (başlarken `durum: alindi`, bitince `durum: inceleme` + "Sonuç" bölümünü doldur).

DAL: `claude/zealous-fermi-hy1o40`'tan (0b65f4ce) `claude/g187-papel-picado-fiesta` aç; yalnız oraya push et. PR açma, main'e dokunma, yayın yok, Etsy'ye bir şey gönderme.

ÖNCE OKU: AGENTS.md, CLAUDE.md, `docs/24_YENI_TASARIMLAR.md` (Ortak kurallar + 2. dalga ekleri + **3. dalga** bölümü, satır 38), `docs/11_TEMA_STANDARDI.md`, örnek tema `platform/themes/celestial-observatory/` ve onun görev raporu `gorevler/G168-celestial-observatory.md` (aynı iş kalıbı: geçici görsel, GPT_PROMPTS, kuru deneme, kayıtlar, testler), katalog kapağı `platform/components/marketing/InvitationCover.tsx`.

TASARIM ÖZETİ (docs/24 satırı esas): Kapalı zarf/açılış: Kraft zarf, renkli kâğıt kesim (papel picado) kemer bant; bant çözülür ve bayraklar gökyüzüne dizilir, kapak açılır, kart yükselir, ampul dizisi yanar. Foto sunumu: Renkli kâğıt kesim çerçeveler; rüzgârda hafifçe sallanır (30'un çinisinden ve 13'ün polaroidinden ayrı). Dekor ailesi: Papel picado bayrakları, bugenvil, terrakota, ampul dizileri, işlemeli kumaş. Teknik: canlı kâğıt kesim + fotogerçekçi. Font hedefi: oturum seçer: el boyaması tabela başlık + sıcak serif gövde. Palet: fiesta-multicolor-terracotta. Hareket imzası: Bayrakların rüzgârda dalgalanması (CSS dalga), ampullerin sırayla yanması, kemer bandın çözülmesi.

ŞARTLAR:
1. **K23 sıkı:** ilk sayfa kapalı ZARF. Düzen katalog kapağıyla uyumlu (üstte "Together with their families" + isimler, ortada zarf, altta tarih · yer + "Tap to open", köşede Skip). Dokununca zarf kendi mekaniğiyle SIRAYLA açılır (her nesne ayrı katman, ayrı hareket; tüm ekranı zoom/fade yetmez), kart yükselir → asıl içerik yeni sayfada (home); ek sayfalar (story/details/rsvp) home'dan. Zarf türü/kapanması/koreografisi 01–32'nin V kapak + mum mühür zarfına benzememeli. `designs.ts` açılış cümlesi "Your guests tap the envelope. …" ile başlar (openingObject = envelope).
2. **K21:** Claude şekil/dekor ÇİZMEZ. Geçici görsel = mevcut temaların düz doku/kâğıt kırpımları (CSS tonlama, maske, kırpma serbest; çizim yok). Bütün dekor parçaları için `collections/38_Papel_Picado_Fiesta/assets/gpt/GPT_PROMPTS.md`: İngilizce prompt, her parçanın TAM yolu + dosya adı, ölçü, şeffaflık, #00FF00 pencereler (PAKET 5 website katmanları, PAKET 2 kurgu çift fotoğrafları — gerçek kişiye benzemez, PAKET 6 basılı davetiye ön/arka). `assets/gpt/kuru_sekil.json` + `python3 tools/gpt_kuru_deneme.py --tema papel-picado-fiesta --sekil …` GEÇMELİ.
3. Klasik, romantik, zengin, geniş beğeni; ultra-minimal yok. Mobile-first 360–430 px, `prefers-reduced-motion`, CSP (yalnız temanın JS'i). Font dosyası pakete konmaz; 01–32'de kullanılmamış Google Fonts çifti seç.
4. Platform özelliklerinin hepsi: G138 içerik blokları, G127 harita, G126 ses kancaları (`lib/audio/catalog.ts`), G128 RSVP alanları, G144 dil etiketleri (yeni site metinleri `lib/i18n/dict/site/*` 4 dilde), G139 basılı davetiye (`lib/print/layouts.ts` composed + `public/print/papel-picado-fiesta/`), G075 teşekkür modu, alt menü için scroll-padding.
5. Demo içerik kurgu (isimler, mekân kurgu, gerçek şehir olabilir; tarih `Month D, YYYY`; URL/medya null); demo pini başka temada olmayan şehir. Kültürel temada semboller yaygın ve saygılı, dini simge yok.
6. Kayıtlar (her biri ADDITIVE, numara sırasıyla; 33–38 paralel oturumlarda aynı dosyalara ekliyor, birleştirmeyi koordinatör yapar): `config.ts` `status: 'coming'` + `price: '[PRICE]'`; `designs.ts` DESIGN_COPY + DESIGN_STYLES; `lib/marketing/i18n.ts` OPENING_THINGS gerekirse; market/panel dict 4 dil (I18N_STRICT=1 yeşil); `lib/claim/demo-map.ts`; `tools/katalog.py` EK_TEMALAR satırı (6 eksen + hareket; `katalog.py kontrol` ✓); sayı/liste testleri (g085/g093/g094/g097 coming listeleri, g138 tema sayısı, g175 `MARKETING.designs.length` ve COMING_OPENINGS — 'envelope'). `collections/38_Papel_Picado_Fiesta/`: DESIGN_BRIEF.md, COLLECTION_STATUS.md (`editable_draft`), content.demo.json, package/listing/listing_v3.md taslak (K41; başlık ≤140, 13 etiket ≤20 karakter, fiyat yer tutucu).
7. Test: `platform/tests/theme-papel-picado-fiesta.test.ts`. Koş: `cd platform && npm ci && rm -rf .next && npx tsc --noEmit && I18N_STRICT=1 npm test && npm run build`; `node scripts/theme-check.cjs --theme papel-picado-fiesta --stress --compare none` (0 hata); `tests/g149-print-layout.test.ts`; `node scripts/i18n-missing.ts` 0 eksik; `python3 -m pytest tools/tests -q`. 390 px ekranlara ve açılış karelerine GÖZLE bak; küçük önizlemeler `platform/previews/g187/` (her biri ≤ 250 KB). Yapılmamış testi yapılmış yazma.
8. Başka oturumların dosyalarını ezme; `git pull --rebase` yerine taban dalını (`origin/claude/zealous-fermi-hy1o40`) birleştirerek güncel kal. Koordinatör sonradan G180 (tema performans standardı) birleştirmesi için mesaj atabilir; gelirse uygula.
9. Gizli bilgi, anahtar, şifre yazma. Ödeme/alan adı yok. Commit mesajında model adı yok.

BİTİŞ: dal push edildi; görev dosyasında Sonuç (yapılanlar, geçici görsel listesi, GPT bekleyen parça sayısı, kontrol komutları + sonuçları, denenmeyenler); `durum: inceleme`. Son mesajında 5 satırlık özet ver.

## Sonuç (2026-10-18, claude-G187)

### Yapılanlar
- **Tema** `platform/themes/papel-picado-fiesta/` (README, `build_images.py`, `img/manifest.json`, 5 şablon, `site.css`,
  `site.js`, `parts.css` (üretilir, şimdilik `none yet`), `thank-you.css`, `theme.json` 82 copy anahtarı, `content.demo.json`).
- **Font:** Oleo Script (el boyaması tabela; isimler, başlıklar) + Alegreya (sıcak serif gövde) — 01–32'de yok.
- **İlk sayfa (K23 sıkı):** katalog kapağı düzeni ("Together with their families" + isimler, ortada zarf, altta tarih · şehir +
  "Tap to open", köşede Skip). Zarf **dikey kraft, düz (V olmayan) kapak, mühür yok**; kapağı altı papel picado bayrağından
  bir **kemer bant** tutar. Açılış (3,6 s, `MOTION.envelope` = `.is-opening` keyframe'leri): bant gevşer (250–750 ms) → altı
  bayrak tek tek (700 + i·110 ms, 700 ms) zarftan kalkıp isimlerin üstünde sarkık bir süs dizisine uçar (`layoutFlight()`
  her bayrağın hedefini `--tx/--ty/--r/--s` olarak yazar) ve **ayrı fazlarda CSS dalgasıyla** dalgalanır → düz kapak üst
  kenarında 3B `rotateX` 180° kalkıp astarını gösterir (1500–2150) → ampuller sırayla yanar + arkadan sıcak ışık (1900–3000;
  ampul yalnız GPT sprite'ı varsa) → kart cepten yükselir (2500) → öne gelir (3100) → home 3600 ms (VT `invite-card`).
  Cep, kapak dışı, kapak astarı, her bayrak, her ampul ve kart ayrı katman. Ses: bant ribbon 250, bayraklar whoosh 700,
  kapak paper 1500, ampuller chime 1900, kart slide 2500, chime 3100 (`lib/audio/catalog.ts`, Garden Waltz).
- **Foto sunumu:** bütün fotoğraflar üst kenarından asılı kâğıt kesim çerçevelerde (`.hang.frame`): sahnesine gelince düşüp
  sarkaç gibi sallanarak durur (`swing-in`), sonra esintide salınır (`breeze`); kaydırma hızı rüzgârı artırır (`--wind`,
  çerçeveler ve bayraklar eğilir, sonra durulur). Metin adımları bayrak gibi üst kenarından açılır (clip-path + küçük çırpınma).
- **Sayfalar:** home (süs dizisi + ampuller, krem kart, işlemeli kumaş kenarlı davet bandı "A fiesta of love", geri sayım,
  takvim, asılı çerçevede hikâye tanıtımı, terrakota bantta gün, imza), story (üç renk çerçeve sol–sağ–sol), details (kraft
  kâğıtta program, her satır başında sallanan küçük bayrak; geniş çerçevede mekân, G127 harita, G138 blokları, travel, menü,
  registry, SSS), rsvp (G128/G051/G069 form; gönderince bayraklar süzülerek düşer), teşekkür modu (G075), G144 (3 yeni site
  metni 4 dilde), alt menü için `scroll-padding-bottom`.
- **Demo:** Valeria & Diego (Valeria Isabel Ortega, Diego Andrés Navarro; V&D), Casa Bugambilia Courtyard (kurgu), San
  Antonio, Texas, April 24, 2027, 5:30 PM; URL/medya `null`; demo pini San Antonio (başka temada yok). Program/kıyafet G150
  sözlüğündeki ifadeler (Welcome drinks, Ceremony, Dinner & dancing, Late-night snacks, Cocktail attire).
- **Koleksiyon** `collections/38_Papel_Picado_Fiesta/`: `DESIGN_BRIEF.md`, `COLLECTION_STATUS.md` (`editable_draft`),
  `content.demo.json`, `assets/gpt/GPT_PROMPTS.md`, `assets/gpt/kuru_sekil.json`, `package/listing/listing_v3.md` (taslak,
  K41; başlık 123 karakter, 13 etiket ≤ 20, fiyat `[PRICE]`).
- **Kayıtlar (eklemeli):** `config.ts` (`coming`, `[PRICE]`, music-box'tan sonra), `designs.ts` `DESIGN_COPY` (açılış cümlesi
  "Your guests tap the envelope. …", openingObject = envelope; `OPENING_THINGS`'e ek gerekmedi) + `DESIGN_STYLES`
  (`destination`, `rustic`), market sözlükleri 4 dil (11 anahtar), site sözlükleri 4 dil (3 anahtar), panel değişmedi
  (envelope etiketleri vardı), `lib/audio/catalog.ts`, `lib/claim/demo-map.ts`, `lib/print/layouts.ts` (composed: krem kâğıt
  + bayrak süs dizisi; `public/print/papel-picado-fiesta/`), `tools/katalog.py` `EK_TEMALAR` (no=38, 6 eksen + hareket),
  testler: g085/093/094/097 coming listesi (+ papel-picado-fiesta), g138 tema sayısı 33, g175 `designs.length` 33 +
  `COMING_OPENINGS` 'envelope'; yeni `tests/theme-papel-picado-fiesta.test.ts` (12 test).

### Geçici görsel (K21) — GPT bekleyen
Kraft = 04'ün düz eski kâğıdı tonlandı; kireç duvar ve terrakota = 11'in düz kâğıdı; krem kâğıt ve altı tissue rengi =
18'in pamuk kâğıdı. Bayraklar ve foto paspartuları bu tissue kâğıtlardan **düz dikdörtgen kırpımlar** (kesim deseni yok);
zarf cebi/kapağı kraft, kapak astarı terrakota. Ampul, begonvil, işlemeli bant **yok** (gizli; `parts.css` gösterir).
og/favicon kapalı zarfın montajı. **GPT bekleyen: 29 dosya** (PAKET 5: 21 — W1–W14 [6 bayrak, 3 çerçeve dahil]; PAKET 2: 5;
PAKET 6: 2 + elle yerleşim). Görünüm şu an sade; satış öncesi GPT parçaları + göz kontrolü şart.

### Kontroller (Linux, Node 22)
- `npm ci`, `rm -rf .next`, `npx tsc --noEmit` ✓; `I18N_STRICT=1 npm test` **1661/1661 geçti, 0 hata, 0 atlandı**;
  `npm run build` ✓ (trace-check 34 tema, js-budget ✓).
- `theme-check --theme papel-picado-fiesta --stress --compare none`: **110 geçti, 0 hata**, 3 uyarı (PAKET 2 yok → 03
  fotoğrafları; home → zarf geri dönüşünde VT yok, "not checked"). İlk görünüm DPR 3: index 273 KB, home 260 KB (yer tutucu);
  fotoğraflı 364 / 453 KB. Reduced motion → home 115 ms. Açılış MP4'ü üretildi (repoya konmadı).
  Ara koşularda bulunup düzeltilenler: açık zeminde koyu tema zemin profili (manifest'ten kaldırıldı), `rotateX` metin
  açılımı dokunma alanını eziyordu (→ clip-path), sürekli sallanan çerçeve bağlantının kendisiydi (Playwright "stable"
  beklemesi → sabit `a` içinde), mobilde sallanan çerçeveler düzen görüntü alanını 392–421 px'e genişletip VT'yi
  "invalid state" ile atlatıyor ve nav'ı örtüyordu (→ `main{overflow-x:clip}`; şimdi her geçişte VT `ready`).
- `python3 tools/gpt_kuru_deneme.py --tema papel-picado-fiesta --sekil …/kuru_sekil.json`: **GEÇTİ 21/23** (okunmayan yalnız
  PAKET 6 ön/arka — bilerek elle). Prova `parts.css`: 19 kural (cep, kapak, astar, ampul, 3 çerçeve + geniş çerçeve pencere
  ölçümü, begonvil, nakış bandı); prova sonrası çerçeve kuralına kendi gölgesi eklendi (dikdörtgen gölge kalmasın).
- `tests/g149-print-layout.test.ts` ✓ (33 tasarım, 5×7 + A5); `python3 tools/katalog.py kontrol` ✓ (11 ek kayıt);
  `copy-manifest --check` ✓; `node scripts/i18n-missing.ts` 0 eksik; `python3 -m pytest tools/tests -q` **111 geçti**.
- 390 px ekranlara ve açılış karelerine baktım (`platform/previews/g187/`: index, açılış kareleri, home, story, details,
  rsvp, yanıt sonrası, stress index 360). İlk turda açılan kapak isimlerin üstüne biniyordu → kapak %36→%30, sahne kapak payı
  kadar aşağı; süs dizisi köşedeki ses/Skip düğmelerinden uzaklaştırıldı.

### Birleşme notları (koordinatöre)
- 33–37 oturumları aynı yerlere ekliyor: `config.ts` (music-box'tan sonra), `designs.ts`, market/site sözlükleri (site'ta
  "Open the envelope" ve "Together with their families" anahtarları büyük olasılıkla başka oturumlarda da var → **yinelenen
  anahtar** tsc hatası verir, birini silin), g085/093/094/097 coming listeleri (numara sırasıyla 33…38), g138 tema sayısı,
  g175 `designs.length` + `COMING_OPENINGS`, `katalog.py` (`# 3. dalga` yorumu bir kez), `layouts.ts`.
- `tools/etsy_upload.py` / `test_etsy_upload.py` ve `tools/build_customer_guides.py`'ye dokunulmadı: `DESIGNS` 01–32 ardışık
  denetleniyor; 33–38 birlikte eklenmeli (START HERE + etsy_upload.json ayrı görev, G175 gibi).
- `components/marketing/InvitationCover.tsx` (yazar listemde değil) 38'i içermiyor; `coming` iken katalogda görünmediği için
  gerekmez, `preview`'a alınırsa kapak satırı eklenmeli.

**Denenmedi:** gerçek iPhone/Safari ve Android Chrome (`rotate` + `transform` birlikte, keyframe içinde `var()`), Vercel
yayını, gerçek alıcı fotoğrafları, yavaş ağ, GPT parçalarıyla görünüm (yalnız kuru deneme), sesin duyulması, g051-browser ve
final-smoke (bu turda koşulmadı). G180 (tema performans standardı) mesajı gelmedi.

## Günlük
- 2026-10-18 koordinatör: görev açıldı, bulut oturumuna verildi.
- 2026-10-18 alındı: claude-G187
- 2026-10-18 bitti, incelemeye gönderildi
- 2026-10-18 entegratör onayladı
