---
id: G184
baslik: 35 Highland Tartan & Thistle — yeni tasarım (3. dalga), platform teması (GPT parçalarından önce), coming kaydı
rol: claude-kod
durum: bitti
alan: claude-G184
oncelik: 2
bagimli: [G168, G175]
yazar: [platform/themes/highland-tartan-thistle/, collections/35_Highland_Tartan_Thistle/, platform/tests/theme-highland-tartan-thistle.test.ts, platform/previews/g184/, platform/lib/marketing/config.ts, platform/lib/marketing/designs.ts, platform/lib/marketing/i18n.ts, platform/lib/i18n/dict/market/, platform/lib/i18n/dict/panel/, platform/lib/i18n/dict/site/, platform/lib/audio/catalog.ts, platform/lib/claim/demo-map.ts, platform/lib/print/layouts.ts, platform/public/print/highland-tartan-thistle/, platform/tests/g085-designs.test.ts, platform/tests/g093-designs.test.ts, platform/tests/g094-designs.test.ts, platform/tests/g097-designs.test.ts, platform/tests/g138-extras.test.ts, platform/tests/g175-openings.test.ts, tools/katalog.py, tools/etsy_upload.py, tools/tests/test_etsy_upload.py, gorevler/G184-highland-tartan-thistle.md]
---

## Amaç
`docs/24_YENI_TASARIMLAR.md` 3. dalga satır 35. İlk sayfa kapalı **zarf** (K23 sıkı, 2026-10-18); zarfın türü, kapanması ve
açılış koreografisi 01–32'den farklı; iç sayfaların bileşenleri ve hareket imzası yeni. GPT parçaları gelmeden kurulur
(geçici görsel = mevcut temaların düz doku kırpımları, şekil çizilmez — K21), GPT istemleri tam yol/ölçü ile yazılır.
Satış durumu `coming`. Koordinatör: session_01HP9ZrJ8mhZnigbvsvUQ4pR. Dal `claude/g184-highland-tartan-thistle`; main/PR/yayın yok.

## Talimat (koordinatör)

GÖREV: G184 — 35 Highland Tartan & Thistle (`platform/themes/highland-tartan-thistle/`, `collections/35_Highland_Tartan_Thistle/`). Görev dosyası: `gorevler/G184-highland-tartan-thistle.md` (başlarken `durum: inceleme`, bitince `durum: inceleme` + "Sonuç" bölümünü doldur).

DAL: `claude/zealous-fermi-hy1o40`'tan (0b65f4ce) `claude/g184-highland-tartan-thistle` aç; yalnız oraya push et. PR açma, main'e dokunma, yayın yok, Etsy'ye bir şey gönderme.

ÖNCE OKU: AGENTS.md, CLAUDE.md, `docs/24_YENI_TASARIMLAR.md` (Ortak kurallar + 2. dalga ekleri + **3. dalga** bölümü, satır 35), `docs/11_TEMA_STANDARDI.md`, örnek tema `platform/themes/celestial-observatory/` ve onun görev raporu `gorevler/G168-celestial-observatory.md` (aynı iş kalıbı: geçici görsel, GPT_PROMPTS, kuru deneme, kayıtlar, testler), katalog kapağı `platform/components/marketing/InvitationCover.tsx`.

TASARIM ÖZETİ (docs/24 satırı esas): Kapalı zarf/açılış: Ekoseli yün zarf, deri kayış + pirinç toka; toka açılır, kayış kayar, kapak açılır, funda dalı ve kart çıkar; tepelerden sis çekilir. Foto sunumu: Antika pirinç madalyon (locket) çerçeveler; kapakları açılır. Dekor ailesi: Ekose, devedikeni, funda, deri, pirinç, dağ sisi. Teknik: yağlı boya manzara + fotogerçekçi doku. Font hedefi: Cinzel? yerine IM Fell English + Pinyon Script. Palet: heather-moss-tartan. Hareket imzası: Toka/kayış mekaniği, sis katmanlarının kayması, madalyon kapaklarının açılması.

ŞARTLAR:
1. **K23 sıkı:** ilk sayfa kapalı ZARF. Düzen katalog kapağıyla uyumlu (üstte "Together with their families" + isimler, ortada zarf, altta tarih · yer + "Tap to open", köşede Skip). Dokununca zarf kendi mekaniğiyle SIRAYLA açılır (her nesne ayrı katman, ayrı hareket; tüm ekranı zoom/fade yetmez), kart yükselir → asıl içerik yeni sayfada (home); ek sayfalar (story/details/rsvp) home'dan. Zarf türü/kapanması/koreografisi 01–32'nin V kapak + mum mühür zarfına benzememeli. `designs.ts` açılış cümlesi "Your guests tap the envelope. …" ile başlar (openingObject = envelope).
2. **K21:** Claude şekil/dekor ÇİZMEZ. Geçici görsel = mevcut temaların düz doku/kâğıt kırpımları (CSS tonlama, maske, kırpma serbest; çizim yok). Bütün dekor parçaları için `collections/35_Highland_Tartan_Thistle/assets/gpt/GPT_PROMPTS.md`: İngilizce prompt, her parçanın TAM yolu + dosya adı, ölçü, şeffaflık, #00FF00 pencereler (PAKET 5 website katmanları, PAKET 2 kurgu çift fotoğrafları — gerçek kişiye benzemez, PAKET 6 basılı davetiye ön/arka). `assets/gpt/kuru_sekil.json` + `python3 tools/gpt_kuru_deneme.py --tema highland-tartan-thistle --sekil …` GEÇMELİ.
3. Klasik, romantik, zengin, geniş beğeni; ultra-minimal yok. Mobile-first 360–430 px, `prefers-reduced-motion`, CSP (yalnız temanın JS'i). Font dosyası pakete konmaz; 01–32'de kullanılmamış Google Fonts çifti seç.
4. Platform özelliklerinin hepsi: G138 içerik blokları, G127 harita, G126 ses kancaları (`lib/audio/catalog.ts`), G128 RSVP alanları, G144 dil etiketleri (yeni site metinleri `lib/i18n/dict/site/*` 4 dilde), G139 basılı davetiye (`lib/print/layouts.ts` composed + `public/print/highland-tartan-thistle/`), G075 teşekkür modu, alt menü için scroll-padding.
5. Demo içerik kurgu (isimler, mekân kurgu, gerçek şehir olabilir; tarih `Month D, YYYY`; URL/medya null); demo pini başka temada olmayan şehir. Kültürel temada semboller yaygın ve saygılı, dini simge yok.
6. Kayıtlar (her biri ADDITIVE, numara sırasıyla; 33–38 paralel oturumlarda aynı dosyalara ekliyor, birleştirmeyi koordinatör yapar): `config.ts` `status: 'coming'` + `price: '[PRICE]'`; `designs.ts` DESIGN_COPY + DESIGN_STYLES; `lib/marketing/i18n.ts` OPENING_THINGS gerekirse; market/panel dict 4 dil (I18N_STRICT=1 yeşil); `lib/claim/demo-map.ts`; `tools/katalog.py` EK_TEMALAR satırı (6 eksen + hareket; `katalog.py kontrol` ✓); sayı/liste testleri (g085/g093/g094/g097 coming listeleri, g138 tema sayısı, g175 `MARKETING.designs.length` ve COMING_OPENINGS — 'envelope'). `collections/35_Highland_Tartan_Thistle/`: DESIGN_BRIEF.md, COLLECTION_STATUS.md (`editable_draft`), content.demo.json, package/listing/listing_v3.md taslak (K41; başlık ≤140, 13 etiket ≤20 karakter, fiyat yer tutucu).
7. Test: `platform/tests/theme-highland-tartan-thistle.test.ts`. Koş: `cd platform && npm ci && rm -rf .next && npx tsc --noEmit && I18N_STRICT=1 npm test && npm run build`; `node scripts/theme-check.cjs --theme highland-tartan-thistle --stress --compare none` (0 hata); `tests/g149-print-layout.test.ts`; `node scripts/i18n-missing.ts` 0 eksik; `python3 -m pytest tools/tests -q`. 390 px ekranlara ve açılış karelerine GÖZLE bak; küçük önizlemeler `platform/previews/g184/` (her biri ≤ 250 KB). Yapılmamış testi yapılmış yazma.
8. Başka oturumların dosyalarını ezme; `git pull --rebase` yerine taban dalını (`origin/claude/zealous-fermi-hy1o40`) birleştirerek güncel kal. Koordinatör sonradan G180 (tema performans standardı) birleştirmesi için mesaj atabilir; gelirse uygula.
9. Gizli bilgi, anahtar, şifre yazma. Ödeme/alan adı yok. Commit mesajında model adı yok.

BİTİŞ: dal push edildi; görev dosyasında Sonuç (yapılanlar, geçici görsel listesi, GPT bekleyen parça sayısı, kontrol komutları + sonuçları, denenmeyenler); `durum: inceleme`. Son mesajında 5 satırlık özet ver.

## Sonuç (2026-10-18, claude-G184)

### Yapılanlar
- **Tema** `platform/themes/highland-tartan-thistle/` (README, `build_images.py`, `img/manifest.json`, 5 şablon, `site.css`,
  `site.js`, `parts.css` (üretilir), `thank-you.css`, `theme.json` 82 copy anahtarı, `content.demo.json`).
- **K23 sıkı ilk sayfa:** katalog kapağı düzeni — üstte "Together with their families" (host_line) + "Invite you to
  celebrate" + isimler, ortada kapalı zarf, altta tarih · şehir + "Tap to open", köşede Skip. Zarf 01–21'in V kapak + mum
  mührü değil: **düz kapaklı yün zarf, dikey deri kayış, pirinç toka**.
- **Açılış (3,65 s):** başlık/alt satır çekilir (0–450) → **tokanın çerçevesi alt çubuğunda devrilir** (150–600) → **kayış
  tokadan yukarı kayıp çıkar**, toka onunla (600–1300) → **yün kapak üst katından 3B kalkar**, 90°'den sonra koyu astarı
  görünür (1300–2100) → funda dalı yükselir (2000–2700, GPT; yoksa yok) → kart cepten yükselir (2500–3150) → öne gelir
  (3150–3550) → home 3650 ms (VT `invite-card`). Tüm açılış boyunca iki sis katmanı tepelerden **zıt yönlere çekilir**
  (0–3500). Arka, cep, kapak (iki yüz), kayış, toka, dal, kart, iki sis ayrı katman. Ses: toka 150, kayış 600, kapak 1300,
  kart 2500, çan 3150 (`lib/audio/catalog.ts`, Evening Strings).
- **Foto sunumu:** bütün oval fotoğraflar (home kartı, tanıtım, Story'nin üç anı) **pirinç madalyonda**; sahnesi gelince
  **kapak sol menteşesinde açılır** (GPT kapak gelene kadar pirinç oval kırpım). Mekân fotoğrafı **sisten** (soldan açılan
  yumuşak maske, `@property --clear`). Story/details arkasında iki sis katmanı kaydırmayla zıt yönlere süzülür (`--mist`).
  Metin adımları "sisten netleşir" (bulanıktan keskine, soldan hafif).
- **Sayfalar:** home (kart, davet bandı "Gathered in the hills", geri sayım, takvim, hikâye tanıtımı, günün 4 satırı, imza
  devedikeni), details (program, G127 harita, G138 blokları, travel, menü, registry, SSS), rsvp (G128 form, G069, G051;
  gönderince GPT funda çiçekçikleri düşer — yoksa yok), teşekkür modu (G075). Nav altta, `scroll-padding-bottom`. Üç yeni site
  metni 4 dilde (`lib/i18n/dict/site/*`): "Gathered in the hills", "Invite you to celebrate", "Open the envelope".
- **Font:** Rouge Script + Sorts Mill Goudy (01–32'de yok). docs/24 önerisi IM Fell English (13) + Pinyon Script (02/07/23)
  kullanıldığı için seçilmedi.
- **Demo:** Isla & Callum (Isla Morven Lennox, Callum Rhys Abernethy; I&C), Glenarden House (kurgu), Pitlochry, Perthshire,
  United Kingdom, September 25, 2027, 2:00 PM; URL/medya `null`; demo pini Pitlochry (başka temada yok). Program/kıyafet
  G150 sözlüğünden (Ceremony, Welcome drinks, Dinner & dancing, Late-night snacks, Formal attire). Dini simge, klan arması yok.
- **Koleksiyon** `collections/35_Highland_Tartan_Thistle/`: `DESIGN_BRIEF.md`, `COLLECTION_STATUS.md` (`editable_draft`),
  `content.demo.json`, `assets/gpt/GPT_PROMPTS.md` (PAKET 5 W2.1–W2.18 tam yol/ölçü/şeffaflık; #00FF00 pencereler: madalyon
  çerçevesi + kart; zarf katmanları aynı tuvalde; PAKET 2 kurgu çift 5 foto (4:5 + 16:9); PAKET 6 ön/arka 1575×2175),
  `assets/gpt/kuru_sekil.json`, `package/listing/listing_v3.md` (taslak; başlık 127 karakter, 13 etiket ≤ 20, `[PRICE]`).
- **Basılı davetiye (G139):** `lib/print/layouts.ts` `composed` — krem kâğıt + üst/alt yün şeridi; `public/print/highland-tartan-thistle/`.
- **Kayıtlar (eklemeli):** `config.ts` `coming` + `[PRICE]`; `designs.ts` DESIGN_COPY (açılış "Your guests tap the envelope. …",
  openingObject = envelope → OPENING_THINGS/panel sözlüğü değişmedi) + DESIGN_STYLES (`classic`, `destination`); market
  sözlükleri 4 dil; `demo-map.ts`; `katalog.py` EK_TEMALAR no=35 (6 eksen + hareket); g085/093/094/097 coming listesi, g138 tema
  sayısı 33, g175 `designs.length` 33 + COMING_OPENINGS `envelope`.

### Geçici görsel (K21) — GPT bekleyen: 20 PAKET 5 parçası + 5 PAKET 2 foto + 2 PAKET 6 sayfa
Yün = 09'un düz keteni funda moruna (ekose **yok**, desen çizilmedi); zemin = 17'nin yeşil kadifesi koyu yosuna; kâğıt = 01
kreme; deri = 07'nin kadifesi kahveye; pirinç = 17 mührünün düz metal yüzeyi (toka dikdörtgeni, madalyon kapağı oval kırpım);
sis = 08'in kâğıdı ağır bulanık, kendi lekeleri alfa. Tepeler, funda, devedikeni, madalyon çerçevesi, çiçekçikler **yok**
(`display:none`, `parts.css` gösterir). Görünüm sade; satış öncesi GPT parçaları + göz kontrolü şart.

### Kontroller (Linux, Node 22; taban birleşmesinden sonra)
- `npm ci`, `rm -rf .next`, `npx tsc --noEmit` ✓; `I18N_STRICT=1 npm test` **1662/1665 geçti, 0 hata, 3 atlandı** (önceden
  atlananlar); `npm run build` ✓ (trace-check 34 tema).
- `theme-check --theme highland-tartan-thistle --stress --compare none`: **112 geçti, 0 hata**, 1 uyarı (PAKET 2 yok → 03
  fotoğrafları). İlk görünüm DPR 3: index 267 KB, home 177 KB (yer tutucu); fotoğraflı 358 / 369 KB. Reduced motion → home 106 ms.
  (İlk koşuda açılmış madalyon kapakları ekran kenarını aşıyordu → kapak −90°'de gizlenir, `perspective-origin` menteşede.)
- `tests/theme-highland-tartan-thistle.test.ts` 12/12; `tests/g149-print-layout.test.ts` ✓; `node scripts/i18n-missing.ts` 0
  eksik; `copy-manifest --check` ✓; `katalog.py kontrol` ✓ (11 ek kayıt); `python3 -m pytest tools/tests -q` **111 geçti**.
- `gpt_kuru_deneme.py --tema highland-tartan-thistle --sekil …`: **GEÇTİ 20/22** (okunmayan yalnız PAKET 6, bilerek elle).
  Provada `parts.css`'te madalyon penceresi kuralında `inset:auto` sırası hatası bulundu ve düzeltildi.
- 390 px görüntülere ve açılış karelerine baktım (`previews/g184/`, her biri ≤ 250 KB): toka devrilmesi, kayışın kayması,
  kapağın 3B kalkışı (astar), kartın cepten yükselip öne gelmesi, sisin çekilmesi; 360 px stress (40 karakter isimler) taşmıyor.
  İlk bakışta tokanın görünmediği görüldü (konumlanmamış iç öğe) → düzeltildi.

### Denenmedi / açık
- Gerçek iPhone Safari (3B kapak `backface-visibility`, `@property`) ve Android Chrome, Vercel yayını, gerçek alıcı
  fotoğrafları, yavaş ağ, GPT parçalarıyla görünüm, sesin duyulması, g051-browser ve final-smoke.
- **`tools/etsy_upload.py` kaydı yapılmadı:** satır eklenince kapsam dışı `tools/tests/test_build_customer_guides.py`
  (01–32 sayar, LANGUAGE tablosu) kırılıyor; geri alındı. Öneri: 33–38 birleşince entegratör `etsy_upload.py` +
  `build_customer_guides` testlerini birlikte açsın (listing_v3.md hazır, `--designs 35` kuralları yeşil verdi).
- Renk paletleri (G177 benzeri) ve START HERE rehberi yok.

## Günlük
- 2026-10-18 koordinatör: görev açıldı, bulut oturumuna verildi.
- 2026-10-18 claude-G184: alındı; bitti, incelemeye gönderildi.
- 2026-10-18 entegratör onayladı
