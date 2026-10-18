---
id: G185
baslik: 36 Victorian Glasshouse — yeni tasarım (3. dalga), platform teması (GPT parçalarından önce), coming kaydı
rol: claude-kod
durum: inceleme
alan: claude-G185
oncelik: 2
bagimli: [G168, G175]
yazar: [platform/themes/victorian-glasshouse/, collections/36_Victorian_Glasshouse/, platform/tests/theme-victorian-glasshouse.test.ts, platform/previews/g185/, platform/lib/marketing/config.ts, platform/lib/marketing/designs.ts, platform/lib/marketing/i18n.ts, platform/lib/i18n/dict/market/, platform/lib/i18n/dict/panel/, platform/lib/i18n/dict/site/, platform/lib/audio/catalog.ts, platform/lib/claim/demo-map.ts, platform/lib/print/layouts.ts, platform/public/print/victorian-glasshouse/, platform/tests/g085-designs.test.ts, platform/tests/g093-designs.test.ts, platform/tests/g094-designs.test.ts, platform/tests/g097-designs.test.ts, platform/tests/g138-extras.test.ts, platform/tests/g175-openings.test.ts, tools/katalog.py, tools/etsy_upload.py, tools/tests/test_etsy_upload.py, gorevler/G185-victorian-glasshouse.md]
---

## Amaç
`docs/24_YENI_TASARIMLAR.md` 3. dalga satır 36. İlk sayfa kapalı **zarf** (K23 sıkı, 2026-10-18); zarfın türü, kapanması ve
açılış koreografisi 01–32'den farklı; iç sayfaların bileşenleri ve hareket imzası yeni. GPT parçaları gelmeden kurulur
(geçici görsel = mevcut temaların düz doku kırpımları, şekil çizilmez — K21), GPT istemleri tam yol/ölçü ile yazılır.
Satış durumu `coming`. Koordinatör: session_01HP9ZrJ8mhZnigbvsvUQ4pR. Dal `claude/g185-victorian-glasshouse`; main/PR/yayın yok.

## Talimat (koordinatör)

GÖREV: G185 — 36 Victorian Glasshouse (`platform/themes/victorian-glasshouse/`, `collections/36_Victorian_Glasshouse/`). Görev dosyası: `gorevler/G185-victorian-glasshouse.md` (başlarken `durum: inceleme`, bitince `durum: inceleme` + "Sonuç" bölümünü doldur).

DAL: `claude/zealous-fermi-hy1o40`'tan (0b65f4ce) `claude/g185-victorian-glasshouse` aç; yalnız oraya push et. PR açma, main'e dokunma, yayın yok, Etsy'ye bir şey gönderme.

ÖNCE OKU: AGENTS.md, CLAUDE.md, `docs/24_YENI_TASARIMLAR.md` (Ortak kurallar + 2. dalga ekleri + **3. dalga** bölümü, satır 36), `docs/11_TEMA_STANDARDI.md`, örnek tema `platform/themes/celestial-observatory/` ve onun görev raporu `gorevler/G168-celestial-observatory.md` (aynı iş kalıbı: geçici görsel, GPT_PROMPTS, kuru deneme, kayıtlar, testler), katalog kapağı `platform/components/marketing/InvitationCover.tsx`.

TASARIM ÖZETİ (docs/24 satırı esas): Kapalı zarf/açılış: Kraft tohum paketi zarfı, bakır bitki etiketi ve sicim; sicim çözülür, kapak açılır, kart çıkar; serada camdaki buğu silinerek eğrelti otları ve kart görünür. Foto sunumu: Herbaryum etiketli cam altı numuneler (cam yansıması + etiket). Dekor ailesi: Dökme demir kemerler, eğrelti otu, orkide, bakır etiketler, cam buğusu. Teknik: botanik gravür + fotogerçekçi cam. Font hedefi: Cormorant SC? yerine Bodoni Moda + Monsieur La Doulaise. Palet: fern-copper-glass. Hareket imzası: Buğunun silinmesi (maske), demir kemerlerin paralaksı, etiketlerin sallanması.

ŞARTLAR:
1. **K23 sıkı:** ilk sayfa kapalı ZARF. Düzen katalog kapağıyla uyumlu (üstte "Together with their families" + isimler, ortada zarf, altta tarih · yer + "Tap to open", köşede Skip). Dokununca zarf kendi mekaniğiyle SIRAYLA açılır (her nesne ayrı katman, ayrı hareket; tüm ekranı zoom/fade yetmez), kart yükselir → asıl içerik yeni sayfada (home); ek sayfalar (story/details/rsvp) home'dan. Zarf türü/kapanması/koreografisi 01–32'nin V kapak + mum mühür zarfına benzememeli. `designs.ts` açılış cümlesi "Your guests tap the envelope. …" ile başlar (openingObject = envelope).
2. **K21:** Claude şekil/dekor ÇİZMEZ. Geçici görsel = mevcut temaların düz doku/kâğıt kırpımları (CSS tonlama, maske, kırpma serbest; çizim yok). Bütün dekor parçaları için `collections/36_Victorian_Glasshouse/assets/gpt/GPT_PROMPTS.md`: İngilizce prompt, her parçanın TAM yolu + dosya adı, ölçü, şeffaflık, #00FF00 pencereler (PAKET 5 website katmanları, PAKET 2 kurgu çift fotoğrafları — gerçek kişiye benzemez, PAKET 6 basılı davetiye ön/arka). `assets/gpt/kuru_sekil.json` + `python3 tools/gpt_kuru_deneme.py --tema victorian-glasshouse --sekil …` GEÇMELİ.
3. Klasik, romantik, zengin, geniş beğeni; ultra-minimal yok. Mobile-first 360–430 px, `prefers-reduced-motion`, CSP (yalnız temanın JS'i). Font dosyası pakete konmaz; 01–32'de kullanılmamış Google Fonts çifti seç.
4. Platform özelliklerinin hepsi: G138 içerik blokları, G127 harita, G126 ses kancaları (`lib/audio/catalog.ts`), G128 RSVP alanları, G144 dil etiketleri (yeni site metinleri `lib/i18n/dict/site/*` 4 dilde), G139 basılı davetiye (`lib/print/layouts.ts` composed + `public/print/victorian-glasshouse/`), G075 teşekkür modu, alt menü için scroll-padding.
5. Demo içerik kurgu (isimler, mekân kurgu, gerçek şehir olabilir; tarih `Month D, YYYY`; URL/medya null); demo pini başka temada olmayan şehir. Kültürel temada semboller yaygın ve saygılı, dini simge yok.
6. Kayıtlar (her biri ADDITIVE, numara sırasıyla; 33–38 paralel oturumlarda aynı dosyalara ekliyor, birleştirmeyi koordinatör yapar): `config.ts` `status: 'coming'` + `price: '[PRICE]'`; `designs.ts` DESIGN_COPY + DESIGN_STYLES; `lib/marketing/i18n.ts` OPENING_THINGS gerekirse; market/panel dict 4 dil (I18N_STRICT=1 yeşil); `lib/claim/demo-map.ts`; `tools/katalog.py` EK_TEMALAR satırı (6 eksen + hareket; `katalog.py kontrol` ✓); sayı/liste testleri (g085/g093/g094/g097 coming listeleri, g138 tema sayısı, g175 `MARKETING.designs.length` ve COMING_OPENINGS — 'envelope'). `collections/36_Victorian_Glasshouse/`: DESIGN_BRIEF.md, COLLECTION_STATUS.md (`editable_draft`), content.demo.json, package/listing/listing_v3.md taslak (K41; başlık ≤140, 13 etiket ≤20 karakter, fiyat yer tutucu).
7. Test: `platform/tests/theme-victorian-glasshouse.test.ts`. Koş: `cd platform && npm ci && rm -rf .next && npx tsc --noEmit && I18N_STRICT=1 npm test && npm run build`; `node scripts/theme-check.cjs --theme victorian-glasshouse --stress --compare none` (0 hata); `tests/g149-print-layout.test.ts`; `node scripts/i18n-missing.ts` 0 eksik; `python3 -m pytest tools/tests -q`. 390 px ekranlara ve açılış karelerine GÖZLE bak; küçük önizlemeler `platform/previews/g185/` (her biri ≤ 250 KB). Yapılmamış testi yapılmış yazma.
8. Başka oturumların dosyalarını ezme; `git pull --rebase` yerine taban dalını (`origin/claude/zealous-fermi-hy1o40`) birleştirerek güncel kal. Koordinatör sonradan G180 (tema performans standardı) birleştirmesi için mesaj atabilir; gelirse uygula.
9. Gizli bilgi, anahtar, şifre yazma. Ödeme/alan adı yok. Commit mesajında model adı yok.

BİTİŞ: dal push edildi; görev dosyasında Sonuç (yapılanlar, geçici görsel listesi, GPT bekleyen parça sayısı, kontrol komutları + sonuçları, denenmeyenler); `durum: inceleme`. Son mesajında 5 satırlık özet ver.

## Sonuç (2026-10-18, claude-G185)

### Yapılanlar
- **Tema** `platform/themes/victorian-glasshouse/` (README, `build_images.py`, `img/manifest.json`, 5 şablon, `site.css`,
  `site.js`, `parts.css` (üretilir), `thank-you.css`, `theme.json` 82 copy anahtarı, `content.demo.json`).
- **Font:** Monsieur La Doulaise (isimler, başlıklar) + Old Standard TT (gövde, etiketler) — 01–32'nin hiçbirinde yok
  (docs/24'ün "Bodoni Moda"sı 14 ve 23'te kullanıldığı için seçilmedi). Bakır etiketteki monogram Old Standard italik
  (el yazısının kuyrukları etiketten taşıyordu; theme-check yakaladı).
- **İlk sayfa (K23 sıkı, kapalı zarf):** katalog kapağı düzeni — üstte host_line + "invite you to celebrate their wedding"
  + isimler, ortada **kraft tohum paketi zarfı** (dikdörtgen gövde, üstte düz kapak; V kapak ve mum mühür yok), ortadan
  jüt sicim, düğümde **bakır bitki etiketi** (monogram `data-field="initials"`), altta tarih · şehir + "Tap to open",
  köşede Skip.
- **Açılış (4,1 s):** başlık kalkar (0–450) · etiket düğümünde sertçe sallanır (0–500) ve dönerek düşer (500–1200) ·
  sicim düğümden ikiye ayrılır, üst yarı yukarı, alt yarı aşağı (300–1000) · kapak menteşesinden **yukarı ve arkaya**
  katlanır (900–1600; 90°'de kartın arkasına geçer, iç yüzü paketin üstünde dikilir) · sıcak hava camı buğulandırır
  (1300–2300; tüm ekranda bulanıklık + soluk perde) · kart buğunun ardında paketten tamamen çıkar (1700–2500) · buğu
  yumuşak kenarlı maskeyle soldan sağa **silinir** (2600–3600; `@property --wipe`), eğrelti otları (GPT) belirir ·
  demir kemerler (GPT) süzülür · kart paketin önüne gelir (3600–4000) · home 4100 ms (VT `invite-card`). Arka duvar,
  gövde, kapak (iki yüz), iki sicim yarısı, etiket, kart, buğu, eğrelti, kemerler ayrı katman. Ses (`catalog.ts`,
  Garden Waltz): tap 0 · ribbon 300 · paper 900 · slide 1700 · whoosh 2600 · chime 3600.
- **Foto sunumu:** bütün fotoğraflar 4:5 **cam altında numune** (home kartı, tanıtım, Story'nin üç anı; mekân 16:9):
  sahne görünüme girince camdaki **buğu bir yandan silinir** (maske), cam üstünden **ışık bandı** geçer, **bakır numara
  etiketi** (01–03) ipinde sallanıp durulur, yazı **herbaryum etiketine yazılır** (clip-path, kendi yanından). Story
  sol–sağ–sol. Programda her satırın küçük bakır etiketi sırayla sallanır. Kaydırmada demir kemerler/eğrelti kendi
  hızlarında kayar (`--sy` paralaks). Metin adımları "camdaki nefes": bulanıktan yerinde netleşir (29'un parıltısı ve
  ortak yükselme değil). RSVP gönderilince imza etiketi yeniden sallanır, GPT yaprakçıklarıyla eğrelti yaprakları iner.
- **Sayfalar:** home (kart, davet "Grown with love", geri sayım, takvim, numune tanıtımı, buğulu camda gün, fern imza),
  story, details (program, mekân, G127 harita, G138 blokları, travel, menü, registry, SSS), rsvp (G128 form, G069
  misafir adları, G051 sorular), teşekkür modu (G075). Nav altta; G144: iki yeni metin ("Grown with love", "Open the
  seed packet") 4 dilde `lib/i18n/dict/site/*`. `scroll-padding-bottom` alt menü için.
- **Demo:** Flora & Edmund (Flora Juliet Hartley, Edmund Rhys Calloway; F&E), The Fernhill Glasshouse (kurgu),
  Columbus, Ohio, June 19, 2027, 4:00 PM; URL/medya `null`; demo pini Columbus (başka temada yok).
- **Koleksiyon** `collections/36_Victorian_Glasshouse/`: `DESIGN_BRIEF.md`, `COLLECTION_STATUS.md` (`editable_draft`),
  `content.demo.json`, `assets/gpt/GPT_PROMPTS.md` (PAKET 5 W3.1–W3.16 = 19 dosya, tam yol/ölçü/şeffaflık/#00FF00
  pencereler: bakır etiket deliği, numune camı penceresi, kart portre penceresi; PAKET 2: 5 foto, kurgu çift, 4:5 +
  16:9; PAKET 6: ön/arka 1575×2175, yazı alanı boş), `assets/gpt/kuru_sekil.json`, `package/listing/listing_v3.md`
  (taslak, K41; başlık 117 karakter, 13 etiket ≤ 20, `[PRICE]`).
- **Basılı davetiye (G139):** `lib/print/layouts.ts` `composed` — herbaryum kâğıdı + üstte eğrelti bandı ve bakır plaka,
  altta kraft bant; arka üstte dar eğrelti bandı (`public/print/victorian-glasshouse/`, geçici).
- **Kayıtlar:** `config.ts` `coming` + `[PRICE]`; `designs.ts` `DESIGN_COPY` (açılış "Your guests tap the envelope. …",
  openingObject = envelope; market çevirileri 4 dilde) + `DESIGN_STYLES` (`classic`, `floral`); `catalog.ts`;
  `demo-map.ts`; `katalog.py` `EK_TEMALAR` no=36 (6 eksen + hareket); testler: g085/093/094/097 off-sale listesine
  `victorian-glasshouse`, g138 tema sayısı 33, g175 `MARKETING.designs.length` 33 + COMING_OPENINGS 'envelope'.
  `OPENING_THINGS` ve panel sözlüğü değişmedi ("envelope" zaten var).
- **Eklenmedi (bilerek):** `tools/etsy_upload.py` `DESIGNS` (test 01–32 kesintisiz sırayı ve her tasarımın
  `etsy_upload.json`'unu istiyor; 31'de olduğu gibi canlıya yakın eklenmeli), renk paletleri (G153, GPT'den sonra),
  START HERE.

### Geçici görsel (K21) — GPT bekleyen 19 + 5 + 2
Eğrelti zemin = 17'nin düz yeşil kadifesi (tonlandı); buğulu cam = 13'ün düz soluk kâğıdı; herbaryum kâğıdı = 16'nın düz
krem kâğıdı; kraft = 04'ün düz eski kâğıdı (kraft rengine tonlandı; paket gövdesi/kapak bu dokunun dikdörtgenleri);
bakır = 17'nin altın mührünün düz metal yüzeyi (dikdörtgen kırpım, bakıra tonlandı; etiket plakası); sicim = 10'un
kapanışındaki düğüm altı düz jüt iplerinden kırpım (yaprak yok). Buğu ve ışık bandı CSS ışığı. Eğrelti otları, demir
kemerler, orkide dalı, numune camı, herbaryum etiketi, yaprakçıklar **yok** (`display:none`; `parts.css` gösterir).
GPT bekleyen: PAKET 5'in 19 dosyası, PAKET 2'nin 5 fotoğrafı, PAKET 6'nın 2 sayfası. Satış öncesi GPT parçaları + göz
kontrolü şart.

### Kontroller (Linux, Node 22)
- `npm ci`, `rm -rf .next`, `npx tsc --noEmit` ✓; `I18N_STRICT=1 npm test` **1658/1660 geçti, 0 hata, 2 atlandı**
  (önceden de atlananlar); `npm run build` ✓ (trace-check 34 tema).
- `node scripts/theme-check.cjs --theme victorian-glasshouse --stress --compare none --out previews/g185`: **112 geçti,
  0 hata**, 1 uyarı (PAKET 2 yok → 03 fotoğrafları). İlk iki koşuda bulunanlar düzeltildi: bakır etiketteki el yazısı
  monogram kesiliyordu (→ italik serif), stres metninde alt menü 390 px'e sığmıyordu (→ harf aralığı/padding),
  360×640 stres kaydında "Tap to open" ekran altına düşüyordu (→ kısa ekranda paket küçülür). İlk görünüm DPR 3:
  index 194 KB, home 146 KB (yer tutucu); fotoğraflı 285 / 339 KB. Reduced motion → home 115 ms.
- `python3 tools/gpt_kuru_deneme.py --tema victorian-glasshouse --sekil …/kuru_sekil.json`: **GEÇTİ 19/21** (okunmayan
  yalnız PAKET 6 ön/arka — bilerek elle).
- `tests/g149-print-layout.test.ts` ✓ (33 tasarım, 5×7 + A5); `python3 tools/katalog.py kontrol` ✓ (11 ek kayıt);
  `copy-manifest --check` ✓; `node scripts/i18n-missing.ts` 0 eksik; `python3 -m pytest tools/tests -q` 111/111 (ilk
  koşuda istem dosyamdaki bir yol yazımı `test_gpt_is_listesi`'ni bozdu; düzeltildi).
- Göz: 390 px'te index, home, story, details, rsvp, açılış kareleri (Playwright ile 0–4050 ms arası ve theme-check
  kaydı), 360 stres index/home. Önizlemeler `platform/previews/g185/` (JPG, her biri ≤ 67 KB; PNG/MP4 repoya konmadı).
  Göze göre düzeltilenler: kart paketten yeterince çıkmıyordu (→ tamamen çıkar, öne gelince paketin önüne geçer),
  kraft lekeleri fazlaydı (→ tonlama yumuşatıldı), "10:30 PM" kırılıyordu (→ saat sütunu genişledi).

### Birleşme (taban `claude/zealous-fermi-hy1o40` f2051280, G181 panel bölme)
Çakışma yok. Sonra: `npm ci`, `tsc` ✓; `I18N_STRICT=1 npm test` **1661/1664, 0 hata, 3 atlandı** (build'siz koşuda atlanan
iki eski + G181'in build testi); `npm run build` ✓ (trace-check 34 tema); `i18n-missing` 0 eksik; `katalog.py kontrol` ✓
(11 ek kayıt); `pytest tools/tests` 111/111.

**Denenmedi:** gerçek iPhone/Safari (`@property --wipe` + maske altında `backdrop-filter`; yoksa buğu yalnız soluk perde,
silme sonunda sıçrar) ve Android Chrome, Vercel yayını, gerçek alıcı fotoğrafları, yavaş ağ, GPT parçalarıyla görünüm,
sesin duyulması, g051-browser ve final-smoke (bu turda koşulmadı).

### Önerilen
- GPT PAKET 5/2/6 üretimi (GPT_PROMPTS.md) → `build_images.py` → göz kontrolü → `layouts.ts` PAKET 6 bloğu.
- Canlıya yakın: `etsy_upload.py` `DESIGNS` + START HERE (G175 kalıbı), renk paletleri (G177 kalıbı), katalog kapağı
  (`InvitationCover.tsx` COVERS, bu görevin yazar listesinde değil).

## Günlük
- 2026-10-18 koordinatör: görev açıldı, bulut oturumuna verildi.
- 2026-10-18 alındı: claude-G185
- 2026-10-18 bitti, incelemeye gönderildi (claude-G185)
