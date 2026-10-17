---
id: G171
baslik: Yeni tasarım 32 Music Box Ballerina — platform teması (coming), koleksiyon, GPT prompt'ları, basılı düzen, ilan taslağı
rol: claude-kod
durum: inceleme
alan: claude-G171
oncelik: 1
bagimli: [G126, G138, G139, G144, G149, G159, G167]
yazar: [platform/themes/music-box-ballerina/, collections/32_Music_Box_Ballerina/, platform/tests/theme-music-box-ballerina.test.ts, platform/public/print/music-box-ballerina/, platform/lib/marketing/config.ts, platform/lib/marketing/designs.ts, platform/lib/audio/catalog.ts, platform/lib/claim/demo-map.ts, platform/lib/print/layouts.ts, platform/lib/i18n/dict/, platform/tests/g085-designs.test.ts, platform/tests/g093-designs.test.ts, platform/tests/g094-designs.test.ts, platform/tests/g097-designs.test.ts, platform/tests/g138-extras.test.ts, tools/katalog.py, gorevler/G171-music-box.md]
---

## Amaç
`docs/24_YENI_TASARIMLAR.md` 2. dalga, satır 32: kapalı nesne lake müzik kutusu; pirinç kurma anahtarına dokununca kapak
açılır, balerin yavaşça döner (GPT kare dizisi / 2B döndürme, çizim yok), tarak ezgisi (G126 kataloğu, yeni ses yok,
dokunuştan sonra, susturma düğmesi), fotoğraflar kapağın aynasında; saten astar, pirinç anahtar, tül, gül yaprakları;
fotogerçekçi + pastel; rose-quartz-gold. 23 Velvet Jewel Box'tan açıkça farklı. GPT parçaları gelmeden kurulur; satış
durumu `coming`. Koordinatör: session_01HP9ZrJ8mhZnigbvsvUQ4pR. Dal `claude/g171-music-box`.

## Sonuç (2026-10-17, claude-G171)

### Tema `platform/themes/music-box-ballerina/`
- 5 sayfa (kapalı kutu → home yeni sayfada → story, details, rsvp; teşekkür modu, G138 blokları, G127 harita, G126 ses
  kancaları, G128 form, G144 dil, 84 copy anahtarı). Fontlar **Ballet + Gilda Display** (28 tasarımda yok).
- **Açılış (`MOTION.envelope` = CSS, test karşılaştırır):** anahtar iki tur döner 0–900 · kutu tık 450–650 · kapak arka
  menteşede kalkar 900–1500 · aynalı iç kapak dikilir (aynada portre) 1500–2100 · 5 gül yaprağı süzülür 1400– · balerin
  kuyudan yükselir 1800–2300 · aynada parıltı 2000–2900 · yavaş piruet (8 kare sprite, 2,4 s/tur) 2300– · kart yükselir
  2900–3900 · öne gelir 3900–4250 · home 4350 (VT `invite-card`). Dev sunucuda dokunuş → home 4,6 s. Ses: clasp 0 ·
  clasp 450 · page 900 · chime 2300 · slide 2900 · chime 3900; varsayılan müzik katalogdaki **Music Box**.
- **Hareket imzası:** anahtar dönüşü, kapak menteşesi, balerin pirueti, aynada parıltılı foto geçişi (Story'de balerin
  her fotoğrafta çeyrek döner), az sayıda sallanarak düşen yaprak (RM'de yok), **oval ayna sayfa geçişi** (radyal maske;
  başka temada yok), sahne adımları dikey eksende hafifçe dönerek gelir.
- **Story:** kapak resminin oval penceresinde tek tek fotoğraf; kaydırma, ← → (`aria-disabled`), ←/→/Home/End,
  canlı sayaç; azaltılmış hareket / JS yok: oval fotoğraflar düz liste.
- **Tam tuval katmanlar + üretilen sahne bloğu:** `build_images.py` menteşeleri, anahtar eksenini, ayna penceresini
  (#00FF00), balerin kutusunu, kartın yükselişini ölçer; `img/manifest.json` → `stage` ve `site.css` `stage:begin…end`
  bloğuna yazar (Story aynasının yerleşimi dahil). Balerin: `dancer_turn_a/b.png` → 8 kare sprite; yoksa `dancer.png`
  2B döndürülür.
- **Geçici görseller (K21, çizim yok):** 21 kâğıdı / 14 saten → kutu, kapak, kuyu (düz dikdörtgen, gül kuvarsı ton);
  14 oval çerçeve → ayna; 17 altın disk → anahtar yerine; 03 yaprakları; 01 kartı. **Balerin yerinde tonlanmış saten bir
  dikdörtgen** (2B dönüyor) — bilerek yer tutucu, satışa uygun değil. Tema klasörü 0,5 MB.
- Demo: Juliette & Arthur, The Rosewell Pavilion (kurgu), Saratoga Springs, NY; May 22, 2027; URL'ler `null`; foto yok.
  Harita pini Saratoga Springs (başka temada yok).

### Kayıtlar (eklemeli)
`config.ts` coming ([PRICE]) 28'in ardına; `designs.ts` metinleri (açılış "Your guests tap the box.") + stil
`classic, storybook`; `audio/catalog.ts`; `demo-map.ts`; `print/layouts.ts` (composed: pudra kâğıt + gül yaprağı;
`public/print/music-box-ballerina/` üretildi); i18n: 9 satış + 3 site metni × TR/ES/DE/FR (ajan çevirisi); testlerde
coming listeleri (g085/093/094/097) ve g138 `THEMES.length` 29; `tools/katalog.py` `EK_TEMALAR` 32 (6 eksen + hareket;
`kontrol` ✓, 7 ek kayıt).

### Koleksiyon `collections/32_Music_Box_Ballerina/`
`DESIGN_BRIEF.md`, `COLLECTION_STATUS.md` (editable_draft / coming), `content.demo.json` (= tema kopyası),
`assets/gpt/GPT_PROMPTS.md` (PAKET 5 W2.1–W2.13 / 15 dosya: aynalı iç kapak #00FF00 pencere, kuyu, kutu önü, kapalı kapak,
anahtar — aynı 1024×1536 tuval ve px koordinatları; porselen figürin balerin + iki dönüş şeridi 4×384 px; kart; 3 yaprak;
zeminler; web_hero — PAKET 2 kurgu çift 5 foto; PAKET 6 ön/arka 1575×2175 300 ppi, kutuları boş bırakan yüzdeler, A5
aynı zeminden), `assets/gpt/kuru_sekil.json`, `package/listing/listing_v3.md` (etsy-metin alt ajanı; yayımlanmadı;
başlık 117 karakter, 13 etiket, "envelope" yok; font alt kümeleri denetlenemedi).

### Testler (Linux, Node 22)
- `tests/theme-music-box-ballerina.test.ts` 19/19 (katalog, demo, rotalar, copy, katmanlar, MOTION = keyframe, sahne bloğu =
  manifest, oturum anahtarları + oval VT, ayna bileşeni, yapraklar, K21, teşekkür modu, ses, RSVP, G167 drop-in, klavye).
- `python3 tools/gpt_kuru_deneme.py --tema music-box-ballerina --sekil …/kuru_sekil.json` **GEÇTİ** 15/17 (okunmayan
  yalnız PAKET 6, öbür tasarımlar gibi).
- Birleşme öncesi: `npx tsc --noEmit` ✓, `I18N_STRICT=1 npm test` 1596/1598 (0 hata, 2 eski atlanan), `npm run build` ✓,
  `theme-check --theme music-box-ballerina --stress --compare none --no-video`: **111 geçti, 0 hata**, 1 uyarı (PAKET 2 yok
  → 03 fotoğrafları).
- 390 px'te index, home, story, details, rsvp ve açılış kareleri (0,25–4 s) gözle incelendi (dev sunucu): Story aynasında
  marjin çökmesi düzeltildi (`display:flow-root`), balerin kutusu küçültüldü (aynadaki portrenin alt %26'sını örtüyor).

### Taban birleştirme (2026-10-17)
`origin/claude/zealous-fermi-hy1o40` (30 Azulejo Mosaic, G169) birleştirildi; çakışmalar ekleyerek çözüldü (config/coming
listeleri 30 → 32 sırasıyla, g138 `THEMES.length` 30, designs/i18n/layouts/katalog iki taraf da; yinelenen sözlük anahtarı
yok). Birleşme sonrası: `tsc` ✓, `I18N_STRICT=1 npm test` **1607/1609** (0 hata, 2 atlanan), `npm run build` ✓ (31 tema),
`katalog.py kontrol` ✓ (8 ek kayıt).

**Denenmedi:** gerçek iPhone/Android, Vercel yayını, gerçek GPT kutusu/balerini ve fotoğrafları, yavaş ağ, seslerin
kulakla dinlenmesi.

## Günlük
- 2026-10-17 açıldı ve alındı: claude-G171 (koordinatör isteği)
- 2026-10-17 bitti, incelemeye gönderildi
