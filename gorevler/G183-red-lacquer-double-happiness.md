---
id: G183
baslik: 34 Red Lacquer & Double Happiness — yeni tasarım (3. dalga), platform teması (GPT parçalarından önce), coming kaydı
rol: claude-kod
durum: inceleme
alan: claude-G183
oncelik: 2
bagimli: [G168, G175]
yazar: [platform/themes/red-lacquer-double-happiness/, collections/34_Red_Lacquer_Double_Happiness/, platform/tests/theme-red-lacquer-double-happiness.test.ts, platform/previews/g183/, platform/lib/marketing/config.ts, platform/lib/marketing/designs.ts, platform/lib/marketing/i18n.ts, platform/lib/i18n/dict/market/, platform/lib/i18n/dict/panel/, platform/lib/i18n/dict/site/, platform/lib/audio/catalog.ts, platform/lib/claim/demo-map.ts, platform/lib/print/layouts.ts, platform/public/print/red-lacquer-double-happiness/, platform/tests/g085-designs.test.ts, platform/tests/g093-designs.test.ts, platform/tests/g094-designs.test.ts, platform/tests/g097-designs.test.ts, platform/tests/g138-extras.test.ts, platform/tests/g175-openings.test.ts, tools/katalog.py, tools/etsy_upload.py, tools/tests/test_etsy_upload.py, gorevler/G183-red-lacquer-double-happiness.md]
---

## Amaç
`docs/24_YENI_TASARIMLAR.md` 3. dalga satır 34. İlk sayfa kapalı **zarf** (K23 sıkı, 2026-10-18); zarfın türü, kapanması ve
açılış koreografisi 01–32'den farklı; iç sayfaların bileşenleri ve hareket imzası yeni. GPT parçaları gelmeden kurulur
(geçici görsel = mevcut temaların düz doku kırpımları, şekil çizilmez — K21), GPT istemleri tam yol/ölçü ile yazılır.
Satış durumu `coming`. Koordinatör: session_01HP9ZrJ8mhZnigbvsvUQ4pR. Dal `claude/g183-red-lacquer-double-happiness`; main/PR/yayın yok.

## Talimat (koordinatör)

GÖREV: G183 — 34 Red Lacquer & Double Happiness (`platform/themes/red-lacquer-double-happiness/`, `collections/34_Red_Lacquer_Double_Happiness/`). Görev dosyası: `gorevler/G183-red-lacquer-double-happiness.md` (başlarken `durum: alindi`, bitince `durum: inceleme` + "Sonuç" bölümünü doldur).

DAL: `claude/zealous-fermi-hy1o40`'tan (0b65f4ce) `claude/g183-red-lacquer-double-happiness` aç; yalnız oraya push et. PR açma, main'e dokunma, yayın yok, Etsy'ye bir şey gönderme.

ÖNCE OKU: AGENTS.md, CLAUDE.md, `docs/24_YENI_TASARIMLAR.md` (Ortak kurallar + 2. dalga ekleri + **3. dalga** bölümü, satır 34), `docs/11_TEMA_STANDARDI.md`, örnek tema `platform/themes/celestial-observatory/` ve onun görev raporu `gorevler/G168-celestial-observatory.md` (aynı iş kalıbı: geçici görsel, GPT_PROMPTS, kuru deneme, kayıtlar, testler), katalog kapağı `platform/components/marketing/InvitationCover.tsx`.

TASARIM ÖZETİ (docs/24 satırı esas): Kapalı zarf/açılış: Kırmızı kâğıt zarf, altın varak 囍 ve ip-düğme kapama; ip düğmeden çözülerek döner, kapak kalkar, kâğıt kesim (jianzhi) şakayık pencere katlarından açılır. Foto sunumu: Ay kapısı (moon gate) yuvarlak çerçeveler; kâğıt kesim katmanların paralaksı. Dekor ailesi: Şakayık, kâğıt kesim desenleri, kırmızı lake, altın bulut motifleri, püsküllü düğüm. Teknik: kâğıt kesim + lake + altın varak. Font hedefi: Noto Serif Display + Ma Shan Zheng (yalnız 囍 için, metin İngilizce). Palet: lacquer-red-gold-cream. Hareket imzası: İpin düğmeden dönerek çözülmesi, kâğıt kesim katların açılması, altın bulutların süzülmesi.

ŞARTLAR:
1. **K23 sıkı:** ilk sayfa kapalı ZARF. Düzen katalog kapağıyla uyumlu (üstte "Together with their families" + isimler, ortada zarf, altta tarih · yer + "Tap to open", köşede Skip). Dokununca zarf kendi mekaniğiyle SIRAYLA açılır (her nesne ayrı katman, ayrı hareket; tüm ekranı zoom/fade yetmez), kart yükselir → asıl içerik yeni sayfada (home); ek sayfalar (story/details/rsvp) home'dan. Zarf türü/kapanması/koreografisi 01–32'nin V kapak + mum mühür zarfına benzememeli. `designs.ts` açılış cümlesi "Your guests tap the envelope. …" ile başlar (openingObject = envelope).
2. **K21:** Claude şekil/dekor ÇİZMEZ. Geçici görsel = mevcut temaların düz doku/kâğıt kırpımları (CSS tonlama, maske, kırpma serbest; çizim yok). Bütün dekor parçaları için `collections/34_Red_Lacquer_Double_Happiness/assets/gpt/GPT_PROMPTS.md`: İngilizce prompt, her parçanın TAM yolu + dosya adı, ölçü, şeffaflık, #00FF00 pencereler (PAKET 5 website katmanları, PAKET 2 kurgu çift fotoğrafları — gerçek kişiye benzemez, PAKET 6 basılı davetiye ön/arka). `assets/gpt/kuru_sekil.json` + `python3 tools/gpt_kuru_deneme.py --tema red-lacquer-double-happiness --sekil …` GEÇMELİ.
3. Klasik, romantik, zengin, geniş beğeni; ultra-minimal yok. Mobile-first 360–430 px, `prefers-reduced-motion`, CSP (yalnız temanın JS'i). Font dosyası pakete konmaz; 01–32'de kullanılmamış Google Fonts çifti seç.
4. Platform özelliklerinin hepsi: G138 içerik blokları, G127 harita, G126 ses kancaları (`lib/audio/catalog.ts`), G128 RSVP alanları, G144 dil etiketleri (yeni site metinleri `lib/i18n/dict/site/*` 4 dilde), G139 basılı davetiye (`lib/print/layouts.ts` composed + `public/print/red-lacquer-double-happiness/`), G075 teşekkür modu, alt menü için scroll-padding.
5. Demo içerik kurgu (isimler, mekân kurgu, gerçek şehir olabilir; tarih `Month D, YYYY`; URL/medya null); demo pini başka temada olmayan şehir. Kültürel temada semboller yaygın ve saygılı, dini simge yok.
6. Kayıtlar (her biri ADDITIVE, numara sırasıyla; 33–38 paralel oturumlarda aynı dosyalara ekliyor, birleştirmeyi koordinatör yapar): `config.ts` `status: 'coming'` + `price: '[PRICE]'`; `designs.ts` DESIGN_COPY + DESIGN_STYLES; `lib/marketing/i18n.ts` OPENING_THINGS gerekirse; market/panel dict 4 dil (I18N_STRICT=1 yeşil); `lib/claim/demo-map.ts`; `tools/katalog.py` EK_TEMALAR satırı (6 eksen + hareket; `katalog.py kontrol` ✓); sayı/liste testleri (g085/g093/g094/g097 coming listeleri, g138 tema sayısı, g175 `MARKETING.designs.length` ve COMING_OPENINGS — 'envelope'). `collections/34_Red_Lacquer_Double_Happiness/`: DESIGN_BRIEF.md, COLLECTION_STATUS.md (`editable_draft`), content.demo.json, package/listing/listing_v3.md taslak (K41; başlık ≤140, 13 etiket ≤20 karakter, fiyat yer tutucu).
7. Test: `platform/tests/theme-red-lacquer-double-happiness.test.ts`. Koş: `cd platform && npm ci && rm -rf .next && npx tsc --noEmit && I18N_STRICT=1 npm test && npm run build`; `node scripts/theme-check.cjs --theme red-lacquer-double-happiness --stress --compare none` (0 hata); `tests/g149-print-layout.test.ts`; `node scripts/i18n-missing.ts` 0 eksik; `python3 -m pytest tools/tests -q`. 390 px ekranlara ve açılış karelerine GÖZLE bak; küçük önizlemeler `platform/previews/g183/` (her biri ≤ 250 KB). Yapılmamış testi yapılmış yazma.
8. Başka oturumların dosyalarını ezme; `git pull --rebase` yerine taban dalını (`origin/claude/zealous-fermi-hy1o40`) birleştirerek güncel kal. Koordinatör sonradan G180 (tema performans standardı) birleştirmesi için mesaj atabilir; gelirse uygula.
9. Gizli bilgi, anahtar, şifre yazma. Ödeme/alan adı yok. Commit mesajında model adı yok.

BİTİŞ: dal push edildi; görev dosyasında Sonuç (yapılanlar, geçici görsel listesi, GPT bekleyen parça sayısı, kontrol komutları + sonuçları, denenmeyenler); `durum: inceleme`. Son mesajında 5 satırlık özet ver.

## Sonuç (2026-10-18, claude-G183)

### Yapılanlar
- **Tema** `platform/themes/red-lacquer-double-happiness/` (README, `build_images.py`, `img/manifest.json`, 5 şablon,
  `site.css`, `site.js`, `parts.css` (üretilir), `thank-you.css`, `theme.json` 82 copy anahtarı, `content.demo.json`).
- **İlk sayfa kapalı zarf (K23 sıkı)**, katalog kapağı düzeninde: üstte "Together with their families" + isimler, ortada
  dikey kırmızı kâğıt zarf (cepte altın 囍, ip-düğme kapama), altta tarih · şehir + "Tap to open", köşede Skip.
  **Açılış (3,7 s):** başlık çekilir (0–450) → kapak düğmesi iki tur dönerken ip çözülür, gövde düğmesi geri döner
  (0–900) → ip kayar ve düşer (450–1050) → kapak katından 180° kalkar, yarı yolda iç yüzüne döner (900–1550) → kart iki
  kâğıt kesim pencereye sarılı yükselir (1500–2200) → kırmızı pencere iki kanat dış kenarlarından açılır (2150–2750) →
  altın pencere (2550–3150) → altın bulutlar geçer (1200'den; GPT) → kart öne gelir, zarf aşağı çekilir (3150–3600) →
  home 3700 ms (VT `invite-card`). Arka, cep, 囍, kapak (iki yüz), iki düğme, ip, 4 pencere yarısı, kart, bulutlar ayrı
  katman. V kapak / mum mühür yok. Ses: ribbon 0, paper 900, slide 1500, paper 2150, paper 2550, chime 3150 (First Light).
- **İç sayfalar:** ay kapısı yuvarlak fotoğraflar; fotoğraf iki kırmızı kâğıt kapı kanadının yana kaymasıyla açılır
  (mekân fotoğrafı kafes kapılarla); iki kâğıt kesim katman kaydırmayla iki hızda kayar (`data-depth`); metin adımları
  üst kenarından katlanarak açılır (link taşıyan adımlar 44 px dokunma alanı için yalnız kayar); "Double happiness"
  başlığı, kâğıt kesim bordür ortadan açılır; imzada sallanan püsküllü düğüm; RSVP gönderilince altın bulutlar yükselir.
  Platform: G138 blokları, G127 harita (demo pini Vancouver, başka temada yok), G126 ses, G128/G051/G069 RSVP, G144 (3 yeni
  site metni 4 dilde), G139 basılı davetiye (composed), G075 teşekkür modu, alt menü `scroll-padding-bottom`.
- **Font:** Luxurious Script + Prata (01–32'de yok). docs/24'teki Noto Serif Display 15'te kullanıldığı için seçilmedi;
  Ma Shan Zheng yalnız geçici 囍 için (aşağıda).
- **Demo:** Mei & Julian (Mei Lin Zhou, Julian Thomas Reyes; M&J), The Peony Court Garden House (kurgu), Vancouver,
  British Columbia, September 25, 2027, 4:00 PM; URL/medya `null`; program/kıyafet sözlükteki ifadeler.
- **Koleksiyon** `collections/34_Red_Lacquer_Double_Happiness/`: DESIGN_BRIEF, COLLECTION_STATUS (`editable_draft`),
  content.demo.json, `assets/gpt/GPT_PROMPTS.md` (PAKET 5 W2.1–W2.20 tam yol/ölçü/şeffaflık/#00FF00 pencereler; PAKET 2
  kurgu çift 5 foto; PAKET 6 ön/arka 1575×2175), `assets/gpt/kuru_sekil.json`, `package/listing/listing_v3.md` (taslak,
  K41; başlık 125 karakter, 13 etiket ≤ 20, fiyat `[PRICE]`).
- **Kayıtlar (eklemeli):** `config.ts` `coming` + `[PRICE]`; `designs.ts` DESIGN_COPY ("Your guests tap the envelope. …")
  + DESIGN_STYLES `classic`; market + site sözlükleri 4 dil (OPENING_THINGS ve panelde `envelope` zaten vardı);
  `lib/audio/catalog.ts`; `lib/claim/demo-map.ts`; `lib/print/layouts.ts` + `public/print/red-lacquer-double-happiness/`;
  `tools/katalog.py` EK_TEMALAR no=34; testler g085/093/094/097 (coming listesi + 34), g138 (33 tema), g175 (33 tasarım,
  `'red-lacquer-double-happiness': 'envelope'`). 33 ve 35–38 aynı satırlara ekleyecek; birleştirme koordinatörde.

### Geçici görsel (K21) — GPT bekleyen 23 parça (PAKET 5: 23 dosya, + PAKET 2: 5, PAKET 6: 2)
Kırmızı kâğıt = 04 `bg_tile` zincifreye tonlandı; lake zemin = 07 `bg_tile`; krem = 01 `bg_tile`; altın varak = 17
`closure.png` mührünün düz metal alanı (dikdörtgen kırpım). Zarf = kırmızı kâğıdın dikdörtgen kırpımları (arka koyu,
kapak açık), düğmeler = altının yuvarlak kırpımları, iki pencere = düz kırmızı/altın yarılar, kapı kanatları = kırmızı
kâğıt yarıları. **囍 = Ma Shan Zheng yazı tipinin U+56CD karakteri** (CSS `::before` içeriği, altın varakla dolu;
metin düğümü değil, çevrilmez/düzenlenmez; stil sayfası bloklamaz, font gelmeden karakter görünmez; Google'ın `text=`
alt küme adresi bu ortamda 400/CORS verdi → standart unicode-range dilimi, 28 KB). GPT `xi_gold` gelince kalkar. İp,
bulutlar, ay kapısı çerçevesi, bordür, paralaks katmanları, püskül **yok** (`display:none`, `parts.css` gösterir).
Görünüm şu an sade; satış öncesi GPT parçaları + göz kontrolü şart.

### Kontroller (Linux, Node 22)
- `npm ci`, `rm -rf .next`, `npx tsc --noEmit` ✓; `I18N_STRICT=1 npm test` **1661/1661** (birleşme öncesi), taban
  birleşmesinden (G181) sonra **1665/1665, 0 hata, 0 atlanan**; `npm run build` ✓ (trace-check 34 tema, js-budget ✓).
- `theme-check --theme red-lacquer-double-happiness --stress --compare none`: **112 geçti, 0 hata**, 1 uyarı (PAKET 2
  yok → 03 fotoğrafları). İlk görünüm DPR 3: index 222 KB, home 119 KB (yer tutucu); fotoğraflı 281 / 274 KB. İlk koşuda
  bulunan iki hata düzeltildi: 囍 font isteği (CORS) ve katlanmış link 44 px altı.
- `tests/g149-print-layout.test.ts` ✓ (33 tasarım, uzun içerik, 5×7 + A5); `node scripts/i18n-missing.ts` 0 eksik;
  `python3 -m pytest tools/tests -q` **111 geçti**; `katalog.py kontrol` ✓ (11 ek kayıt, ≥4 eksen farklı);
  `copy-manifest --check` ✓; `tests/theme-red-lacquer-double-happiness.test.ts` 12/12.
- `python3 tools/gpt_kuru_deneme.py --tema red-lacquer-double-happiness --sekil …/kuru_sekil.json`: **GEÇTİ 23/25**
  (okunmayan yalnız PAKET 6 ön/arka — bilerek elle).
- Gözle: 390 px 5 sayfa, açılış kareleri, stres index 360, teşekkür home (`platform/previews/g183/`, her biri ≤ 170 KB).
  Açılış karelerinde kalkan kapağın dış yüzü + düğmesi görünüyordu (backface güvenilmez) → yüz değişimi visibility
  animasyonuyla yapıldı, yeniden kaydedilip doğrulandı.

**Denenmedi:** gerçek iPhone/Safari ve Android (özellikle 3B kapak/pencere), Vercel yayını, gerçek alıcı fotoğrafları,
yavaş ağ, GPT parçalarıyla görünüm, sesin duyulması, g051-browser / final-smoke, kuru denemenin `--theme-check` ile koşusu.
**Yapılmadı (kapsam dışı bırakıldı):** `tools/etsy_upload.py` tablosu (01–32; 33 de eklenmeden 34 eklenemez, test
aralığı), START HERE, PAKET 3 ilan sahneleri, palet varyantları — G175/G177 tipi ayrı görev önerilir.

## Günlük
- 2026-10-18 koordinatör: görev açıldı, bulut oturumuna verildi.
- 2026-10-18 alındı: claude-G183 (bulut oturumu)
- 2026-10-18 bitti, incelemeye gönderildi (claude-G183)
