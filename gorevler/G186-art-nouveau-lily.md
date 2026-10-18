---
id: G186
baslik: 37 Art Nouveau Lily — yeni tasarım (3. dalga), platform teması (GPT parçalarından önce), coming kaydı
rol: claude-kod
durum: inceleme
alan: claude-G186
oncelik: 2
bagimli: [G168, G175]
yazar: [platform/themes/art-nouveau-lily/, collections/37_Art_Nouveau_Lily/, platform/tests/theme-art-nouveau-lily.test.ts, platform/previews/g186/, platform/lib/marketing/config.ts, platform/lib/marketing/designs.ts, platform/lib/marketing/i18n.ts, platform/lib/i18n/dict/market/, platform/lib/i18n/dict/panel/, platform/lib/i18n/dict/site/, platform/lib/audio/catalog.ts, platform/lib/claim/demo-map.ts, platform/lib/print/layouts.ts, platform/public/print/art-nouveau-lily/, platform/tests/g085-designs.test.ts, platform/tests/g093-designs.test.ts, platform/tests/g094-designs.test.ts, platform/tests/g097-designs.test.ts, platform/tests/g138-extras.test.ts, platform/tests/g175-openings.test.ts, tools/katalog.py, tools/etsy_upload.py, tools/tests/test_etsy_upload.py, gorevler/G186-art-nouveau-lily.md]
---

## Amaç
`docs/24_YENI_TASARIMLAR.md` 3. dalga satır 37. İlk sayfa kapalı **zarf** (K23 sıkı, 2026-10-18); zarfın türü, kapanması ve
açılış koreografisi 01–32'den farklı; iç sayfaların bileşenleri ve hareket imzası yeni. GPT parçaları gelmeden kurulur
(geçici görsel = mevcut temaların düz doku kırpımları, şekil çizilmez — K21), GPT istemleri tam yol/ölçü ile yazılır.
Satış durumu `coming`. Koordinatör: session_01HP9ZrJ8mhZnigbvsvUQ4pR. Dal `claude/g186-art-nouveau-lily`; main/PR/yayın yok.

## Talimat (koordinatör)

GÖREV: G186 — 37 Art Nouveau Lily (`platform/themes/art-nouveau-lily/`, `collections/37_Art_Nouveau_Lily/`). Görev dosyası: `gorevler/G186-art-nouveau-lily.md` (başlarken `durum: alindi`, bitince `durum: inceleme` + "Sonuç" bölümünü doldur).

DAL: `claude/zealous-fermi-hy1o40`'tan (0b65f4ce) `claude/g186-art-nouveau-lily` aç; yalnız oraya push et. PR açma, main'e dokunma, yayın yok, Etsy'ye bir şey gönderme.

ÖNCE OKU: AGENTS.md, CLAUDE.md, `docs/24_YENI_TASARIMLAR.md` (Ortak kurallar + 2. dalga ekleri + **3. dalga** bölümü, satır 37), `docs/11_TEMA_STANDARDI.md`, örnek tema `platform/themes/celestial-observatory/` ve onun görev raporu `gorevler/G168-celestial-observatory.md` (aynı iş kalıbı: geçici görsel, GPT_PROMPTS, kuru deneme, kayıtlar, testler), katalog kapağı `platform/components/marketing/InvitationCover.tsx`.

TASARIM ÖZETİ (docs/24 satırı esas): Kapalı zarf/açılış: Krem zarf, kapağı altın kıvrımlı (whiplash) art nouveau çerçeve ve vitray zambak; vitraydan ışık süpürür, kapak çiçek açar gibi açılır. Foto sunumu: Vitray pencere kemerleri; ışık geçtikçe renkler canlanır. Dekor ailesi: Zambak, tavus tüyü değil (24'ten ayrı), kıvrımlı altın çizgiler, vitray, mozaik altın. Teknik: Mucha tarzı poster + vitray. Font hedefi: oturum seçer: Art Nouveau başlık yazısı + zarif el yazısı (06 Art Deco'nun Poiret/Cinzel'inden ayrı). Palet: sage-gold-cream-lilac. Hareket imzası: Işığın vitraydan süpürmesi, çizgilerin akarak çizilmesi, çiçek açılır gibi kapak.

ŞARTLAR:
1. **K23 sıkı:** ilk sayfa kapalı ZARF. Düzen katalog kapağıyla uyumlu (üstte "Together with their families" + isimler, ortada zarf, altta tarih · yer + "Tap to open", köşede Skip). Dokununca zarf kendi mekaniğiyle SIRAYLA açılır (her nesne ayrı katman, ayrı hareket; tüm ekranı zoom/fade yetmez), kart yükselir → asıl içerik yeni sayfada (home); ek sayfalar (story/details/rsvp) home'dan. Zarf türü/kapanması/koreografisi 01–32'nin V kapak + mum mühür zarfına benzememeli. `designs.ts` açılış cümlesi "Your guests tap the envelope. …" ile başlar (openingObject = envelope).
2. **K21:** Claude şekil/dekor ÇİZMEZ. Geçici görsel = mevcut temaların düz doku/kâğıt kırpımları (CSS tonlama, maske, kırpma serbest; çizim yok). Bütün dekor parçaları için `collections/37_Art_Nouveau_Lily/assets/gpt/GPT_PROMPTS.md`: İngilizce prompt, her parçanın TAM yolu + dosya adı, ölçü, şeffaflık, #00FF00 pencereler (PAKET 5 website katmanları, PAKET 2 kurgu çift fotoğrafları — gerçek kişiye benzemez, PAKET 6 basılı davetiye ön/arka). `assets/gpt/kuru_sekil.json` + `python3 tools/gpt_kuru_deneme.py --tema art-nouveau-lily --sekil …` GEÇMELİ.
3. Klasik, romantik, zengin, geniş beğeni; ultra-minimal yok. Mobile-first 360–430 px, `prefers-reduced-motion`, CSP (yalnız temanın JS'i). Font dosyası pakete konmaz; 01–32'de kullanılmamış Google Fonts çifti seç.
4. Platform özelliklerinin hepsi: G138 içerik blokları, G127 harita, G126 ses kancaları (`lib/audio/catalog.ts`), G128 RSVP alanları, G144 dil etiketleri (yeni site metinleri `lib/i18n/dict/site/*` 4 dilde), G139 basılı davetiye (`lib/print/layouts.ts` composed + `public/print/art-nouveau-lily/`), G075 teşekkür modu, alt menü için scroll-padding.
5. Demo içerik kurgu (isimler, mekân kurgu, gerçek şehir olabilir; tarih `Month D, YYYY`; URL/medya null); demo pini başka temada olmayan şehir. Kültürel temada semboller yaygın ve saygılı, dini simge yok.
6. Kayıtlar (her biri ADDITIVE, numara sırasıyla; 33–38 paralel oturumlarda aynı dosyalara ekliyor, birleştirmeyi koordinatör yapar): `config.ts` `status: 'coming'` + `price: '[PRICE]'`; `designs.ts` DESIGN_COPY + DESIGN_STYLES; `lib/marketing/i18n.ts` OPENING_THINGS gerekirse; market/panel dict 4 dil (I18N_STRICT=1 yeşil); `lib/claim/demo-map.ts`; `tools/katalog.py` EK_TEMALAR satırı (6 eksen + hareket; `katalog.py kontrol` ✓); sayı/liste testleri (g085/g093/g094/g097 coming listeleri, g138 tema sayısı, g175 `MARKETING.designs.length` ve COMING_OPENINGS — 'envelope'). `collections/37_Art_Nouveau_Lily/`: DESIGN_BRIEF.md, COLLECTION_STATUS.md (`editable_draft`), content.demo.json, package/listing/listing_v3.md taslak (K41; başlık ≤140, 13 etiket ≤20 karakter, fiyat yer tutucu).
7. Test: `platform/tests/theme-art-nouveau-lily.test.ts`. Koş: `cd platform && npm ci && rm -rf .next && npx tsc --noEmit && I18N_STRICT=1 npm test && npm run build`; `node scripts/theme-check.cjs --theme art-nouveau-lily --stress --compare none` (0 hata); `tests/g149-print-layout.test.ts`; `node scripts/i18n-missing.ts` 0 eksik; `python3 -m pytest tools/tests -q`. 390 px ekranlara ve açılış karelerine GÖZLE bak; küçük önizlemeler `platform/previews/g186/` (her biri ≤ 250 KB). Yapılmamış testi yapılmış yazma.
8. Başka oturumların dosyalarını ezme; `git pull --rebase` yerine taban dalını (`origin/claude/zealous-fermi-hy1o40`) birleştirerek güncel kal. Koordinatör sonradan G180 (tema performans standardı) birleştirmesi için mesaj atabilir; gelirse uygula.
9. Gizli bilgi, anahtar, şifre yazma. Ödeme/alan adı yok. Commit mesajında model adı yok.

BİTİŞ: dal push edildi; görev dosyasında Sonuç (yapılanlar, geçici görsel listesi, GPT bekleyen parça sayısı, kontrol komutları + sonuçları, denenmeyenler); `durum: inceleme`. Son mesajında 5 satırlık özet ver.

## Sonuç (2026-10-18, claude-G186)

### Yapılanlar
- **Tema** `platform/themes/art-nouveau-lily/` (README, `build_images.py`, `img/manifest.json`, 5 şablon, `site.css`,
  `site.js`, `parts.css` (üretilir), `thank-you.css`, `theme.json` 82 copy anahtarı, `content.demo.json`). Durum `coming`,
  fiyat `[PRICE]`.
- **Font:** Federant (Art Nouveau başlık yazısı: başlıklar, etiketler, düğmeler; yalnız latin — isimlerde kullanılmaz),
  Ephesis (zarif el yazısı: isimler, büyük başlıklar; latin-ext), Linden Hill (gövde; latin-ext). Üçü de 01–32'de yok;
  06'nın Poiret/Cinzel'inden ayrı.
- **Zarf sayfası (K23 sıkı, katalog kapağı düzeni):** adaçayı zemin; üstte host line ("Together with their families"),
  "Invite you to celebrate", isimler; ortada dik krem zarf; altta tarih · şehir, bölge ve "Tap to open"; köşede Skip.
  Zarf türü: ön yüzü **üç taç yaprağı kapak** (sol, sağ, orta) — uçları vitray zambak madalyonun altında buluşur; cebin
  üst kenarı ortada sivrilir. 01–21'in V kapak + mum mührüne ve 26'nın dört kare katına benzemez.
- **Açılış (3,55 s):** başlık ve alt satırlar kalkar (0–450 ms) → ışık bandı zarfı ve camı süpürür (100–1000) → madalyonun
  arkasında ışık parlar (300–1000) → madalyon kalkar (800–1300) → **iki yan yaprak** yan menteşelerinde dışa açılıp
  geriye kıvrılır (rotateY ∓122°, 1100–2000; 90°'de leylak astar yüzü devralır) → **orta yaprak** üst menteşesinde yukarı
  açılır (rotateX 128°, 1500–2400) → yapraklar kartın arkasına iner → kart cepten yükselir (2400–3050) → öne gelir
  (3050–3450) → home 3550 ms (VT `invite-card`). Arka, cep, üç yaprak (her biri ön + astar yüzlü tek 3B sarmalayıcı),
  madalyon, ışık ve kart ayrı katman. Ses: dokunuş 0, cam çanı 300, yapraklar 1100/1500, kart 2400, çan 3050
  (`lib/audio/catalog.ts`, Garden Waltz).
- **Foto sunumu:** bütün portreler (home kartı, tanıtım, Story'nin üç anı) 5:7 **vitray kemerde**; fotoğraf alacakaranlık
  camı gibi gri bekler, sahnesine gelince çapraz ışık bandı geçer ve renkleri canlanır (`--band` @property + filtre);
  kaydırınca daha yumuşak ışık camda dolaşır (`--p`). Mekân fotoğrafı da aynı ışıkla. Altın kıvrım çizgisi (GPT)
  başlık altlarında akan maskeyle "kendini çizer" (`--flow`). Metin adımları camdan geçen renk gibi bulanıklıktan
  netleşir. RSVP gönderilince 6 zambak yaprağı süzülür (yalnız GPT yaprağıyla).
- **Sayfalar:** home (Mucha afişi: mozaik hâle + zambak demetleri GPT bekliyor; kart, davet "Love in full bloom", tam ad
  yedeği, üç satır tarih, RSVP, geri sayım, takvim; tanıtım; gün; imza), story (sol–sağ–sol kemerler, Roma rakamı CSS
  sayaç), details (program, mekân, G127 harita, G138 blokları, travel, menü, registry, SSS), rsvp (G128 form, G069, G051),
  teşekkür modu (G075), G144 (iki yeni site metni 4 dilde), `scroll-padding-bottom`.
- **Demo:** Odette & Felix (Odette Claire Varenne, Felix Arthur Holm; O&F), Villa Mirelle Gardens (kurgu), Nancy, Grand Est,
  France, June 19, 2027, 4:00 PM; URL/medya `null`; demo pini Nancy (başka temada yok). Dini simge yok.
- **Koleksiyon** `collections/37_Art_Nouveau_Lily/`: DESIGN_BRIEF.md, COLLECTION_STATUS.md (`editable_draft`),
  content.demo.json, `assets/gpt/GPT_PROMPTS.md` (PAKET 5 W2.1–W2.14 tam yol/ölçü/şeffaflık; #00FF00 pencereler: kart ve
  vitray kemer; zarf katmanları tek 1000×1320 tuvalde üst üste; PAKET 2: 5 foto, kurgu çift; PAKET 6: ön/arka 1575×2175),
  `assets/gpt/kuru_sekil.json`, `package/listing/listing_v3.md` (taslak, K41; başlık 124 karakter, 13 etiket ≤ 20,
  fiyat `[PRICE]`).
- **Kayıtlar:** `config.ts` (`coming`, `[PRICE]`), `designs.ts` DESIGN_COPY ("Your guests tap the envelope. …") +
  DESIGN_STYLES (`classic`, `floral`), market + site sözlükleri 4 dilde, `lib/claim/demo-map.ts`, `lib/audio/catalog.ts`,
  `lib/print/layouts.ts` (composed: krem kâğıt + adaçayı şeritleri; `public/print/art-nouveau-lily/`), `tools/katalog.py`
  EK_TEMALAR (6 eksen + hareket), testler: g085/093/094/097 coming listesi (+art-nouveau-lily), g138 tema sayısı 33,
  g175 `MARKETING.designs.length` 33 + `'art-nouveau-lily': 'envelope'`. `lib/marketing/i18n.ts` OPENING_THINGS
  değişmedi (envelope zaten var).

### Geçici görsel (K21) — GPT bekleyen 16 parça (+ 5 foto, 2 baskı)
Krem kâğıt = 01'in düz `bg_tile`'ı kreme, adaçayı = 13'ün düz `bg_tile`'ı koyu adaçayına, leylak astar = 15'in düz
`bg_tile`'ı leylaka tonlandı (`tonla`). Zarf arkası = krem + leylak dikdörtgen; cep ve üç yaprak krem kâğıttan
`clip-path` ile **kesildi** (astar yüzleri aynalı kesim); og/favicon aynı kesimlerin montajı. Madalyon, kart çerçevesi,
vitray kemer, mozaik hâle, zambak demetleri, altın kıvrım çizgisi ve yaprak **yok** (`display:none`, `parts.css` gösterir).
Görünüm şu an sade; satış öncesi GPT parçaları + göz kontrolü şart.

### Kontroller (Linux, Node 22; taban `claude/zealous-fermi-hy1o40` 58ffb8f5 birleştirildikten sonra)
- `npm ci`, `rm -rf .next`, `npx tsc --noEmit` ✓; `I18N_STRICT=1 npm test` **1662/1665, 0 hata, 3 atlandı**; `npm run build` ✓
  (trace-check 34 tema). (Birleşmeden önce: 1659/1661, 0 hata.)
- `theme-check --theme art-nouveau-lily --stress --compare none` (birleşmeden önceki build): **112 geçti, 0 hata**, 1 uyarı
  (PAKET 2 yok → 03 fotoğrafları). İlk görünüm DPR 3: index 166 KB, home 129 KB (yer tutucu); fotoğraflı 269 / 345 KB.
  İlk koşu 43 hata vermişti (360 px'te uzun nav etiketi taşıyordu, adaçayı zemin "boyalı dekor" sayılıyordu, replay 43 px)
  → nav sarar/küçülür, `theme_check.backdrop` koyu zemine göre (dark_below 0, light_above 140), textlink 46 px.
- `g051-browser --theme art-nouveau-lily`: 44/44 ✓. `tests/g149-print-layout.test.ts` ✓; `theme-art-nouveau-lily.test.ts` 12/12.
- `node scripts/i18n-missing.ts` 0 eksik; `copy-manifest --check` ✓; `katalog.py kontrol` ✓ (11 ek kayıt).
- `python3 tools/gpt_kuru_deneme.py --tema art-nouveau-lily --sekil …/kuru_sekil.json`: **GEÇTİ 16/18** (okunmayan yalnız
  PAKET 6 ön/arka — bilerek elle).
- `python3 -m pytest tools/tests -q`: 110/111; tek hata `test_betikler[test_build_customer_guides.py]` benim
  `etsy_upload.py`'ye 37'yi eklememden geliyordu (o test `DESIGNS == 01..32` bekliyor ve yazma alanımda değil) → ekleme geri
  alındı, `etsy_upload.json` üretilmedi; sonra `test_build_customer_guides` ve `test_etsy_upload` ✓ (tam pytest yeniden
  koşulmadı).
- 390 px ekranlara ve açılış karelerine gözle baktım (`platform/previews/g186/`: 5 sayfa, açılış kareleri, stress index
  360, home 1280, checks.json; her biri ≤ 250 KB).

**Denenmedi:** gerçek iPhone/Safari (özellikle `@property` ve `preserve-3d` + `backface-visibility`) ve Android Chrome,
Vercel yayını, gerçek alıcı fotoğrafları, yavaş ağ, GPT parçalarıyla görünüm (yalnız nötr deneme görselleriyle build),
sesin duyulması, final-smoke.

### Önerilen (koordinatör)
- 33–38 birleşince `tools/etsy_upload.py` DESIGNS'a 37 satırı + `tests/test_build_customer_guides.py` ve
  `test_etsy_upload.py`'deki `01..32` beklentileri birlikte güncellenmeli; sonra `python3 tools/etsy_upload.py --designs 37`.
- START HERE (`build_customer_guides.py`) 37 için.

## Günlük
- 2026-10-18 koordinatör: görev açıldı, bulut oturumuna verildi.
- 2026-10-18 alındı (claude-G186), bitti, incelemeye gönderildi
