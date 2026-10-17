---
id: G168
baslik: 29 Celestial Observatory — yeni tasarım (2. dalga), platform teması (GPT parçalarından önce), coming kaydı
rol: claude-kod
durum: bitti
alan: claude-G168
oncelik: 1
bagimli: [G138, G139, G144, G149, G159, G167]
yazar: [platform/themes/celestial-observatory/, collections/29_Celestial_Observatory/, platform/tests/theme-celestial-observatory.test.ts, platform/previews/g168/, platform/lib/marketing/config.ts, platform/lib/marketing/designs.ts, platform/lib/marketing/i18n.ts, platform/lib/i18n/dict/market/, platform/lib/i18n/dict/panel/, platform/lib/audio/catalog.ts, platform/lib/claim/demo-map.ts, platform/lib/print/layouts.ts, platform/public/print/celestial-observatory/, platform/lib/i18n/dict/site/, platform/tests/g085-designs.test.ts, platform/tests/g093-designs.test.ts, platform/tests/g094-designs.test.ts, platform/tests/g097-designs.test.ts, platform/tests/g138-extras.test.ts, tools/katalog.py, gorevler/G168-celestial-observatory.md]
---

## Amaç
`docs/24_YENI_TASARIMLAR.md` 2. dalga satır 29: pirinç gözlemevi kubbesi; yarık açılır, gece göğü görünür; döner yıldız
haritası (planisfer) foto çerçeveleri, kaydırınca gök döner; yıldız haritası, pirinç usturlap, gezegen yörüngeleri, ay
evreleri; gravür + altın varak; midnight-silver-gold; hareket imzası: kubbe açılışı, yıldızların sırayla yanması,
takımyıldız çizgisinin çiftin baş harflerini birleştirmesi (GPT yıldızları üstünde UI çizgisi), dönen gök. 19 Midnight
Garden ve 22 Nocturne gibi hissettirmemeli. Koordinatör: session_01HP9ZrJ8mhZnigbvsvUQ4pR. Dal
`claude/g168-celestial-observatory`; main/PR/yayın yok. 30–32 paralel oturumlarda.

## Sonuç (2026-10-17, claude-G168)

### Yapılanlar
- **Tema** `platform/themes/celestial-observatory/` (README, `build_images.py`, `img/manifest.json`, 5 şablon, `site.css`,
  `site.js`, `parts.css` (üretilir), `thank-you.css`, `theme.json` 82 copy anahtarı, `content.demo.json`).
- **Font:** Imperial Script (isimler, başlıklar) + Forum (gövde, büyük harf satırlar) — 28 tasarımın hiçbirinde yok
  (docs/24'teki "Cinzel Decorative + EB Garamond" önerisi 17 ve 01'de kullanıldığı için seçilmedi).
- **Açılış (4,05 s):** başlık kalkar (0–450 ms), ay ışığı pirinçten geçer (100–900) → **yarık kapağının iki yarısı** yana
  kayar (450–1100) → yarıkta gök aydınlanır, ışık yükselir (900–1800) → **14 yıldız tek tek yanar** (1100–2300, GPT
  sprite'ları) → **takımyıldız çizgisi baş harfleri birleştirir** (1700–2950; `site.js` canvas üstünde 1 px çizgi, her
  köşeye ulaşınca orada bir GPT yıldızı yanar) → gravür gök 14° döner (tüm açılış) → kart yarıktan yükselir (3000–3600) →
  öne gelir (3600–3950) → home 4050 ms (VT `invite-card`). Kubbe, yarık göğü, ışık, iki kapak yarısı, kart, yıldız alanı ve
  takımyıldız ayrı katman. Baş harfler platformun monogramından (`data-field="initials"`, panelde "Monogram") okunur,
  metin olarak gösterilmez; `LETTERS` tablosu A–Z (test: her harfin yolu birim kutuda). Ses: mandal 0, kapak 450, çan
  1700, kart 3000, çan 3600 (`lib/audio/catalog.ts`, Evening Strings).
- **Foto sunumu:** bütün yuvarlak fotoğraflar (home kartı, tanıtım, Story'nin üç anı) planisferde; **kadran süpürmesi**
  ile belirir (konik maske merkez etrafında bir tur, `@property --sweep`); sayfa kaydırıldıkça pirinç halkalar −70°…+70°
  ve Story'nin arka planındaki gravür gök döner (`--p`, `--turn`, rAF). Mekân fotoğrafı alttan-ortadan soldan sağa
  "teleskop ışını" süpürmesiyle. Metin adımları "yıldız ışığı": parlak pırıltıdan durulur, hafifçe iner (ortak yükselme değil).
- **Sayfalar:** home (yörüngeler + harita kâğıdı kart; "Written in the stars" + ay evreleri bandı, tam adlar, üç satır
  tarih, RSVP, geri sayım, takvim; planisfer tanıtım; gün; imza: usturlap + baş harflerin takımyıldızı yeniden çizilir),
  details (program, mekân, G127 harita, G138 blokları, travel, menü, registry, SSS), rsvp (G128 form, G069 misafir adları,
  G051 sorular; gönderince yıldızlar yükselir), teşekkür modu (G075). Nav altta; G144 dil düğmesi platformdan; iki yeni
  metin ("Written in the stars", "Open the dome") 4 dilde (`lib/i18n/dict/site/*`). `scroll-padding-bottom` alt menü için.
- **Demo:** Celeste & Rowan (Celeste Marie Vance, Rowan James Ashby; monogram C&R), Starlight Ridge Observatory Gardens
  (kurgu), Flagstaff, Arizona, August 14, 2027, 7:00 PM; URL ve medya `null`; demo pini Flagstaff (başka temada yok).
  Program/kıyafet/SSS ifadeleri G150 sözlüğünde olanlar (Welcome drinks, Ceremony, Dinner & dancing, Late-night snacks,
  Black tie optional).
- **Koleksiyon** `collections/29_Celestial_Observatory/`: `DESIGN_BRIEF.md`, `COLLECTION_STATUS.md` (`editable_draft`),
  `content.demo.json`, `assets/gpt/GPT_PROMPTS.md` (PAKET 5: W2.1–W2.12 tam yol/ölçü/şeffaflık/#00FF00 pencereler; PAKET 2:
  5 foto, kurgu çift, yuvarlak kırpım için kare; PAKET 6: ön/arka 1575×2175 = 5×7 + taşma, A5 aynı sayfadan, 300 ppi; yazı
  yok), `assets/gpt/kuru_sekil.json` (prova şekilleri), `package/listing/listing_v3.md` (taslak, K41; başlık 115
  karakter, 13 etiket ≤ 20).
- **Basılı davetiye (G139):** `lib/print/layouts.ts` `composed` — harita kâğıdı + üstte/altta gece göğü şeridi (temanın
  tonladığı dokular; `public/print/celestial-observatory/` 1024 px ≈ 195 ppi, geçici). `tests/g149-print-layout.test.ts` ✓.
- **Kayıtlar:** `config.ts` `coming` (`[PRICE]`), `designs.ts` `DESIGN_COPY` (satış metni, G169 ile aynı
  düzen; açılış nesnesi "dome" → `OPENING_THINGS`, panel etiketleri "…the dome…"; market + panel çevirileri 4 dilde) ve
  `DESIGN_STYLES` (`classic`), `lib/audio/catalog.ts`, `lib/claim/demo-map.ts`, `tools/katalog.py` `EK_TEMALAR` satırı (6 eksen +
  `hareket`; `kontrol` ✓), tema sayan testler (g085/093/094/097 coming listesi 29 → 30 sırasıyla, g138 tema sayısı 30 — G169 birleşmesiyle).

### Geçici görsel (K21) — GPT bekleyen
Tasarımın kendi parçası yok. Kintsugi yaklaşımı: gök = 06'nın düz lacivert kâğıdı gece mavisine tonlandı; harita kâğıdı =
18'in düz pamuk kâğıdı gümüş-fildişine; pirinç = 17'nin altın mührünün defne arasındaki düz metal yüzeyi (dikdörtgen kırpım,
koyulaştırıldı). Geçici kubbe bu pirincin yarık çevresinden CSS maskesiyle kesilmiş dikdörtgeni (şekil çizilmedi), kapak
yarıları daha koyu kırpımlar; og/favicon aynı kırpımların montajı. Yıldızlar, yıldız haritası, halka, usturlap, ay evreleri,
yörüngeler **yok** (öğeleri `display:none`, `parts.css` gösterir) → açılışta takımyıldız çizgisi yıldızsız çizilir.
Görünüm şu an sade; satış öncesi GPT parçaları + göz kontrolü şart.

### Kontroller (Linux, Node 22)
- `npm ci`, `rm -rf .next`, `npx tsc --noEmit` ✓; `I18N_STRICT=1 npm test` **1590/1592 geçti, 0 hata, 2 atlandı** (önceden de
  atlananlar); `npm run build` ✓ (trace-check 30 tema). Taban birleşmesinden sonra yeniden: aşağıda "Birleşme".
- `theme-check --theme celestial-observatory --stress --compare none`: **112 geçti, 0 hata**, 1 uyarı (PAKET 2 yok → 03
  fotoğrafları). İlk görünüm DPR 3: index 157 KB, home 117 KB (yer tutucu); fotoğraflı 230 / 273 KB. reduced motion →
  home 120 ms. Açılış MP4'ü üretildi (repoya konmadı; kareler `previews/g168/opening_frames_390.jpg`).
- `python3 tools/gpt_kuru_deneme.py --tema celestial-observatory --sekil …/kuru_sekil.json`: **GEÇTİ 14/16** (okunmayan
  yalnız PAKET 6 ön/arka — bilerek elle; deneme görselleriyle `parts.css` 14 kural, kubbe yarığı/halka/kart pencereleri
  ölçüldü). Prova sonrası halka yerleşimi değişti (halka planisfer kutusunu doldurur, foto pencereye oturur: yan metne
  taşmaz).
- `tests/g149-print-layout.test.ts` ✓ (29 tasarım, uzun içerik, 5×7 + A5); `python3 tools/katalog.py kontrol` ✓;
  `copy-manifest --theme celestial-observatory --check` ✓; `node scripts/i18n-missing.ts` 0 eksik.
- 390 px görüntülere baktım (`previews/g168/`: 5 sayfa, açılış kareleri, stress index 360): kapak yarıları, yarık göğü,
  takımyıldız C R, kartın yarıktan yükselişi; 360×640'ta 21+21 karakter isim (kart içi küçülür, portre daralır; M B
  takımyıldızı). Geçici kubbe maskesinde 1 px dikiş görüldü → maske dikdörtgenleri örtüştürüldü.

### Birleşme (G169 Azulejo Mosaic, `claude/zealous-fermi-hy1o40`)
Çakışmalar eklemeli çözüldü: coming listeleri 29 → 30 sırasıyla, g138 tema sayısı 30, `config.ts` / `layouts.ts` /
`designs.ts` / `katalog.py` / sözlükler iki tarafı da tutar (yinelenen anahtar yok; denetlendi). Sonra: `tsc` ✓,
`I18N_STRICT=1 npm test` **1601/1603, 0 hata** (2 eski atlanan), `npm run build` ✓ (trace-check 31 tema),
`katalog.py kontrol` ✓ (8 ek kayıt), `i18n-missing` 0 eksik.
İkinci birleşme (G171 Music Box Ballerina): market sözlükleri iki tarafı tutar, coming listeleri 29 → 30 → 32, g138 tema
sayısı 31; yinelenen anahtar yok. Sonra `tsc` ✓, `I18N_STRICT=1 npm test` **1619/1621, 0 hata** (2 eski atlanan),
`npm run build` ✓ (trace-check 32 tema), `katalog.py kontrol` ✓ (9 ek kayıt).

**Denenmedi:** gerçek iPhone/Safari (özellikle `@property` desteği; yoksa süpürme atlanır, foto doğrudan görünür) ve
Android Chrome, Vercel yayını, gerçek alıcı fotoğrafları, yavaş ağ, GPT parçalarıyla görünüm, sesin duyulması,
g051-browser ve final-smoke (bu turda koşulmadı).

## Günlük
- 2026-10-17 açıldı ve alındı: claude-G168 (koordinatör isteği)
- 2026-10-17 bitti, incelemeye gönderildi
- 2026-10-17 entegratör onayladı
