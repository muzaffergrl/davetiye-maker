---
id: G182
baslik: 33 Marigold & Mehndi — yeni tasarım (3. dalga), platform teması (GPT parçalarından önce), coming kaydı
rol: claude-kod
durum: inceleme
alan: claude-G182
oncelik: 2
bagimli: [G168, G175]
yazar: [platform/themes/marigold-mehndi/, collections/33_Marigold_Mehndi/, platform/tests/theme-marigold-mehndi.test.ts, platform/previews/g182/, platform/lib/marketing/config.ts, platform/lib/marketing/designs.ts, platform/lib/marketing/i18n.ts, platform/lib/i18n/dict/market/, platform/lib/i18n/dict/panel/, platform/lib/i18n/dict/site/, platform/lib/audio/catalog.ts, platform/lib/claim/demo-map.ts, platform/lib/print/layouts.ts, platform/public/print/marigold-mehndi/, platform/tests/g085-designs.test.ts, platform/tests/g093-designs.test.ts, platform/tests/g094-designs.test.ts, platform/tests/g097-designs.test.ts, platform/tests/g138-extras.test.ts, platform/tests/g175-openings.test.ts, tools/katalog.py, tools/etsy_upload.py, tools/tests/test_etsy_upload.py, gorevler/G182-marigold-mehndi.md]
---

## Amaç
`docs/24_YENI_TASARIMLAR.md` 3. dalga satır 33. İlk sayfa kapalı **zarf** (K23 sıkı, 2026-10-18); zarfın türü, kapanması ve
açılış koreografisi 01–32'den farklı; iç sayfaların bileşenleri ve hareket imzası yeni. GPT parçaları gelmeden kurulur
(geçici görsel = mevcut temaların düz doku kırpımları, şekil çizilmez — K21), GPT istemleri tam yol/ölçü ile yazılır.
Satış durumu `coming`. Koordinatör: session_01HP9ZrJ8mhZnigbvsvUQ4pR. Dal `claude/g182-marigold-mehndi`; main/PR/yayın yok.

## Talimat (koordinatör)

GÖREV: G182 — 33 Marigold & Mehndi (`platform/themes/marigold-mehndi/`, `collections/33_Marigold_Mehndi/`). Görev dosyası: `gorevler/G182-marigold-mehndi.md` (başlarken `durum: alindi`, bitince `durum: inceleme` + "Sonuç" bölümünü doldur).

DAL: `claude/zealous-fermi-hy1o40`'tan (0b65f4ce) `claude/g182-marigold-mehndi` aç; yalnız oraya push et. PR açma, main'e dokunma, yayın yok, Etsy'ye bir şey gönderme.

ÖNCE OKU: AGENTS.md, CLAUDE.md, `docs/24_YENI_TASARIMLAR.md` (Ortak kurallar + 2. dalga ekleri + **3. dalga** bölümü, satır 33), `docs/11_TEMA_STANDARDI.md`, örnek tema `platform/themes/celestial-observatory/` ve onun görev raporu `gorevler/G168-celestial-observatory.md` (aynı iş kalıbı: geçici görsel, GPT_PROMPTS, kuru deneme, kayıtlar, testler), katalog kapağı `platform/components/marketing/InvitationCover.tsx`.

TASARIM ÖZETİ (docs/24 satırı esas): Kapalı zarf/açılış: Fuşya ipek zarf, altın lazer kesim paisley kılıfın içinde; kılıf yana kayar, püskül sallanır, kapak açılır, kart kadife-fuşya astardan yükselir; kadife çiçeği yaprakları süzülür. Foto sunumu: Jharokha (Rajasthan pencere kemeri) çerçeveler; fotoğrafın çevresinde kına deseni çizgi çizgi "çizilerek" belirir (GPT kına çizimi + maske). Dekor ailesi: Kadife çiçeği çelenkleri, kına desenleri, pirinç diya kandilleri, ipek püsküller. Teknik: zengin minyatür + fotogerçekçi ipek. Font hedefi: Yatra One? yerine Rozha One + Cormorant Infant. Palet: saffron-fuchsia-gold. Hareket imzası: Kılıf kayması, püskül sarkacı, kına çizgisinin akması, diya alevlerinin sırayla yanması.

ŞARTLAR:
1. **K23 sıkı:** ilk sayfa kapalı ZARF. Düzen katalog kapağıyla uyumlu (üstte "Together with their families" + isimler, ortada zarf, altta tarih · yer + "Tap to open", köşede Skip). Dokununca zarf kendi mekaniğiyle SIRAYLA açılır (her nesne ayrı katman, ayrı hareket; tüm ekranı zoom/fade yetmez), kart yükselir → asıl içerik yeni sayfada (home); ek sayfalar (story/details/rsvp) home'dan. Zarf türü/kapanması/koreografisi 01–32'nin V kapak + mum mühür zarfına benzememeli. `designs.ts` açılış cümlesi "Your guests tap the envelope. …" ile başlar (openingObject = envelope).
2. **K21:** Claude şekil/dekor ÇİZMEZ. Geçici görsel = mevcut temaların düz doku/kâğıt kırpımları (CSS tonlama, maske, kırpma serbest; çizim yok). Bütün dekor parçaları için `collections/33_Marigold_Mehndi/assets/gpt/GPT_PROMPTS.md`: İngilizce prompt, her parçanın TAM yolu + dosya adı, ölçü, şeffaflık, #00FF00 pencereler (PAKET 5 website katmanları, PAKET 2 kurgu çift fotoğrafları — gerçek kişiye benzemez, PAKET 6 basılı davetiye ön/arka). `assets/gpt/kuru_sekil.json` + `python3 tools/gpt_kuru_deneme.py --tema marigold-mehndi --sekil …` GEÇMELİ.
3. Klasik, romantik, zengin, geniş beğeni; ultra-minimal yok. Mobile-first 360–430 px, `prefers-reduced-motion`, CSP (yalnız temanın JS'i). Font dosyası pakete konmaz; 01–32'de kullanılmamış Google Fonts çifti seç.
4. Platform özelliklerinin hepsi: G138 içerik blokları, G127 harita, G126 ses kancaları (`lib/audio/catalog.ts`), G128 RSVP alanları, G144 dil etiketleri (yeni site metinleri `lib/i18n/dict/site/*` 4 dilde), G139 basılı davetiye (`lib/print/layouts.ts` composed + `public/print/marigold-mehndi/`), G075 teşekkür modu, alt menü için scroll-padding.
5. Demo içerik kurgu (isimler, mekân kurgu, gerçek şehir olabilir; tarih `Month D, YYYY`; URL/medya null); demo pini başka temada olmayan şehir. Kültürel temada semboller yaygın ve saygılı, dini simge yok.
6. Kayıtlar (her biri ADDITIVE, numara sırasıyla; 33–38 paralel oturumlarda aynı dosyalara ekliyor, birleştirmeyi koordinatör yapar): `config.ts` `status: 'coming'` + `price: '[PRICE]'`; `designs.ts` DESIGN_COPY + DESIGN_STYLES; `lib/marketing/i18n.ts` OPENING_THINGS gerekirse; market/panel dict 4 dil (I18N_STRICT=1 yeşil); `lib/claim/demo-map.ts`; `tools/katalog.py` EK_TEMALAR satırı (6 eksen + hareket; `katalog.py kontrol` ✓); sayı/liste testleri (g085/g093/g094/g097 coming listeleri, g138 tema sayısı, g175 `MARKETING.designs.length` ve COMING_OPENINGS — 'envelope'). `collections/33_Marigold_Mehndi/`: DESIGN_BRIEF.md, COLLECTION_STATUS.md (`editable_draft`), content.demo.json, package/listing/listing_v3.md taslak (K41; başlık ≤140, 13 etiket ≤20 karakter, fiyat yer tutucu).
7. Test: `platform/tests/theme-marigold-mehndi.test.ts`. Koş: `cd platform && npm ci && rm -rf .next && npx tsc --noEmit && I18N_STRICT=1 npm test && npm run build`; `node scripts/theme-check.cjs --theme marigold-mehndi --stress --compare none` (0 hata); `tests/g149-print-layout.test.ts`; `node scripts/i18n-missing.ts` 0 eksik; `python3 -m pytest tools/tests -q`. 390 px ekranlara ve açılış karelerine GÖZLE bak; küçük önizlemeler `platform/previews/g182/` (her biri ≤ 250 KB). Yapılmamış testi yapılmış yazma.
8. Başka oturumların dosyalarını ezme; `git pull --rebase` yerine taban dalını (`origin/claude/zealous-fermi-hy1o40`) birleştirerek güncel kal. Koordinatör sonradan G180 (tema performans standardı) birleştirmesi için mesaj atabilir; gelirse uygula.
9. Gizli bilgi, anahtar, şifre yazma. Ödeme/alan adı yok. Commit mesajında model adı yok.

BİTİŞ: dal push edildi; görev dosyasında Sonuç (yapılanlar, geçici görsel listesi, GPT bekleyen parça sayısı, kontrol komutları + sonuçları, denenmeyenler); `durum: inceleme`. Son mesajında 5 satırlık özet ver.

## Sonuç (2026-10-18, claude-G182)

### Yapılanlar
- **Tema** `platform/themes/marigold-mehndi/` (README, `build_images.py`, `img/manifest.json`, 5 şablon, `site.css`,
  `site.js`, `parts.css` (üretilir), `thank-you.css`, `theme.json` 83 copy anahtarı, `content.demo.json`).
- **İlk sayfa (K23 sıkı):** katalog kapağı düzeni — "Together with their families", "invite you to celebrate", isimler,
  ortada kapalı zarf, altında diya sırası (GPT), tarih · şehir, "Tap to open", köşede Skip. Zarf 01–32'nin V kapak + mum
  mühürlü zarfı **değil**: dikey fuşya ipek zarf, düz üst kapak, ortasına sarılı altın paisley **kılıf** kapağın alt
  kenarını tutar, kılıftan ipek **püskül** sarkar.
- **Açılış (3,65 s):** başlık kalkar (0–450) · püskül sarkaç gibi sallanıp söner (0–1400) · ipek üstünden ışık geçer ·
  kılıf önce hafifçe sola, sonra sağa kayıp çıkar (300–1250) · düz kapak üst kenarında 0→90° döner (1250–1630) ve
  **kadife iç yüzüne devreder** (−90→0°, 1630–2050; docs/11 §7.1) · astar ısınır (1500–2200) · kadife çiçeği yaprakları
  dönerek süzülür (GPT, 1600'den) · diya alevleri soldan sağa tek tek yanar (GPT, 1800–2800) · kart astardan yükselir,
  ayağı cebin arkasında (2500–3150) · öne gelir (3150–3550) · home (VT `invite-card`). Her nesne ayrı katman.
  Ses: püskül 0 `ribbon`, kılıf 300 `slide`, kapak 1250 `paper`, kart 2500 `slide`, öne 3150 `chime` (Evening Strings).
- **Foto sunumu:** jharokha kemeri (GPT pencere maskesiyle), foto alttan yukarı ıslak kına gibi akarak belirir
  (`@property --flow` maske), kemer çevresindeki kına `steps(11)` ile çizgi çizgi akar; mekân fotoğrafı soldan sağa.
  Metin adımları kılıf gibi yandan kayarak yerleşir. İmzalarda diya alevleri sırayla yanar; RSVP gönderilince kadife
  çiçeği yaprakları yağar.
- **Font:** Rozha One + **Yrsa** (docs/24'teki Cormorant Infant 17 Emerald Gold'da kullanıldığı için). 01–32'de yok.
- **Platform:** G138 blokları, G127 harita (pin Jaipur — başka temada yok), G126 ses, G128 RSVP (sorular, misafir
  adları), G144 dil (4 yeni site metni 4 dilde), G139 basılı davetiye (`composed`, safran kâğıt + fuşya ipek şerit,
  `public/print/marigold-mehndi/`), G075 teşekkür modu, alt menü için `scroll-padding-bottom`, reduced motion, CSP
  (yalnız `site.js` + `/rsvp/form.js`, Google Fonts).
- **Demo:** Anaya & Kabir (Anaya Mira Desai, Kabir Arun Sethi; A&K), Gulmohar Haveli Gardens (kurgu), Jaipur,
  Rajasthan, India, November 20, 2027, 6:00 PM; URL/medya `null`; program/kıyafet/SSS G150 sözlüğünden. Dini simge yok.
- **Kayıtlar:** `config.ts` `coming` + `[PRICE]`; `designs.ts` DESIGN_COPY ("Your guests tap the envelope. …",
  openingObject = envelope; `OPENING_THINGS` değişmedi) + DESIGN_STYLES `['classic','floral']`; market sözlükleri 4 dil;
  `audio/catalog.ts`; `claim/demo-map.ts`; `print/layouts.ts`; `tools/katalog.py` EK_TEMALAR 33; testler: g085/093/094/097
  coming listesi + `marigold-mehndi`, g138 tema sayısı 33, g175 `designs.length` 33 + `'marigold-mehndi': 'envelope'`.
- **Koleksiyon** `collections/33_Marigold_Mehndi/`: DESIGN_BRIEF.md, COLLECTION_STATUS.md (`editable_draft`),
  content.demo.json, `assets/gpt/GPT_PROMPTS.md` (PAKET 5 W2.1–W2.16 = 18 dosya, tam yol/ölçü/şeffaflık, #00FF00
  pencereler: jharokha + kart; PAKET 2 5 kurgu foto; PAKET 6 ön/arka 1575×2175), `assets/gpt/kuru_sekil.json`,
  `package/listing/listing_v3.md` (taslak, K41; başlık 125/140, 13 etiket ≤ 20).

### Geçici görsel (K21) — GPT bekleyen: 25 dosya (PAKET 5: 18, PAKET 2: 5, PAKET 6: 2)
İpek = 14'ün fildişi saten dokusu fuşyaya; kadife = 06'nın düz lacivert kâğıdı kadife-fuşyaya (zemin daha koyu); kâğıt =
18'in pamuk kâğıdı safran-fildişine tonlandı; altın = 17'nin mührünün düz metal yüzeyinden dikdörtgen kırpım. Zarf =
ipek dikdörtgenleri + düz altın bant (kılıf). Püskül, yapraklar, kemer, kına, diya/alev, çelenk, kına deseni **yok**
(`display:none`; `parts.css` gelince gösterir) — görünüm şu an sade, satış öncesi GPT parçaları + göz kontrolü şart.

### Kontroller (Linux, Node 22)
- `npm ci`, `rm -rf .next`, `npx tsc --noEmit` ✓; `I18N_STRICT=1 npm test` **1662/1662 geçti**; taban birleşmesinden (`origin/claude/zealous-fermi-hy1o40` f2051280, çakışmasız) sonra yeniden: `tsc` ✓, **1663 geçti, 0 hata, 3 atlandı (tabandaki atlananlar)**, `npm run build` ✓
  (trace-check 34 tema, js-budget ✓). İlk koşuda tek hata: demo SSS yanıtı ("30 minutes") G150 sözlüğünde yoktu →
  sözlükteki "20 minutes" cümlesi.
- `theme-check --theme marigold-mehndi --stress --compare none`: **112 geçti, 0 hata**, 1 uyarı (PAKET 2 yok → 03
  fotoğrafları). İlk koşuda 32 hata: 360 px'te uzun nav etiketi taşması → nav CSS düzeltildi. İlk görünüm DPR 3: index
  292 KB, home 145 KB (yer tutucu); fotoğraflı 382 / 337 KB.
- Göz kontrolü (390 px ekranlar + açılış kareleri, `platform/previews/g182/`, hepsi ≤ 250 KB): ilk koşuda home'da bazı
  metinler görünmüyordu — maske için kaydedilen `@property --ink` (yüzde) renk değişkeni `--ink` ile çakışıyordu →
  `--flow` olarak ayrıldı, tekrar bakıldı: tam. Açılış karelerinde sıra doğru (kılıf kayar → kapak döner → kadife iç
  yüz → kart yükselir → öne).
- `python3 tools/gpt_kuru_deneme.py --tema marigold-mehndi --sekil …/kuru_sekil.json`: **GEÇTİ 18/20** (okunmayan yalnız
  PAKET 6 ön/arka — bilerek elle).
- `tests/g149-print-layout.test.ts` ✓; `node scripts/i18n-missing.ts` 0 eksik; `copy-manifest --check` ✓;
  `python3 tools/katalog.py kontrol` ✓; `python3 -m pytest tools/tests -q` **111 geçti**.

### Denenmedi / açık
- Gerçek iPhone/Android, Vercel yayını, gerçek alıcı fotoğrafları, yavaş ağ, GPT parçalarıyla görünüm, sesin duyulması,
  g051-browser ve final-smoke.
- `components/marketing/InvitationCover.tsx` kapak kaydı yok (yazar listemde değil; `coming` katalogda görünmez —
  `preview`'a geçerken eklenmeli).
- **Önerilen görev:** START HERE + `etsy_upload.json` (G175 düzeni): `tools/etsy_upload.py` `DESIGNS`'e 33 eklemek
  `tools/tests/test_build_customer_guides.py`'yi de değiştirmeyi gerektiriyor (1–32 bekliyor; yazar listemde değil) —
  denedim, geri aldım. Taslak ilan `etsy_upload.py --check` kurallarından geçti (geçici kayıtla).

## Günlük
- 2026-10-18 koordinatör: görev açıldı, bulut oturumuna verildi.
- 2026-10-18 claude-G182: alındı; bitti, incelemeye gönderildi.
