---
id: G170
baslik: 31 Sky Lantern Festival — yeni tasarım (2. dalga), platform teması (GPT parçalarından önce), coming kaydı
rol: claude-kod
durum: inceleme
alan: claude-G170
oncelik: 1
bagimli: [G138, G139, G144, G149, G159, G167]
yazar: [platform/themes/sky-lantern-festival/, collections/31_Sky_Lantern_Festival/, platform/tests/theme-sky-lantern-festival.test.ts, platform/previews/g170/, platform/lib/marketing/config.ts, platform/lib/marketing/designs.ts, platform/lib/marketing/i18n.ts, platform/lib/audio/catalog.ts, platform/lib/claim/demo-map.ts, platform/lib/print/layouts.ts, platform/public/print/sky-lantern-festival/, platform/lib/i18n/dict/site/, platform/lib/i18n/dict/market/, platform/lib/i18n/dict/panel/, platform/tests/g085-designs.test.ts, platform/tests/g093-designs.test.ts, platform/tests/g094-designs.test.ts, platform/tests/g097-designs.test.ts, platform/tests/g138-extras.test.ts, tools/katalog.py, gorevler/G170-sky-lantern.md]
---

## Amaç
`docs/24_YENI_TASARIMLAR.md` 2. dalga satır 31: avuçlarda tutulan kâğıt fener; dokununca ışır ve yükselir; yükselen fenerlerin
ışığında beliren fotoğraflar; pirinç kâğıdı fenerler, alacakaranlık gökyüzü, yıldız tozu; suluboya + ışık; dusk-amber-violet;
hareket imzası fener yükselişi (paralaks), sıcak ışık hâlesi, kaydırmayla süzülen fenerler. Kültürel olarak nötr, zarif; 27
Riad'a benzememeli. Koordinatör: session_01HP9ZrJ8mhZnigbvsvUQ4pR. Dal `claude/g170-sky-lantern`; main/PR/yayın yok.

## Sonuç (2026-10-17, claude-G170)

### Yapılanlar
- **Tema** `platform/themes/sky-lantern-festival/` (README, `build_images.py`, `img/manifest.json`, 5 şablon, `site.css`,
  `site.js`, `thank-you.css`, `theme.json` 86 copy anahtarı, `content.demo.json`).
- **Açılış (fener yükselişi):** başlık uzaklaşır (0–500 ms) → fener **ışır** (yanan katman sönüğün üstüne, 0–600) ve hâlesi
  büyür (0–1200) → avuçlar açılıp iner (700–1600, yalnız GPT) → fener sallanarak ekranın üstünden çıkar (900–3100) →
  **paralaks:** gök %7, yıldız tozu %16 aşağı kayar (900–3500), üç uzak fener farklı boy/hızda yükselir (1000/1260/1520) →
  bıraktığı ışıkta pirinç kâğıdı kart parlayarak belirir (2000–3100) → öne (3200–3600) → home **3700 ms** (VT `invite-card`).
  Gök, yıldız tozu, uzak fenerler, avuçlar, fener (sönük + yanan), hâle, kart ayrı katman. Ses: tap 0 · paper 700 · whoosh 900 ·
  slide 2000 · chime 3200 (`lib/audio/catalog.ts`, First Light).
- **Foto sunumu ("kindle"):** fotoğraf karanlıkta bekler; küçük bir fener (`.riser`) yanından yükselir, kayıtlı `--r`
  özelliğiyle radyal maske alttan yukarı açılır, sıcak bir art-ışık söner. Story'de fener yolu (sol–sağ–sol; genişte üçlü,
  ortası yukarıda), home tanıtımında üç foto, details'te mekân fotoğrafı. Details programında her satırın küçük feneri sırayla
  yanar. Home ve story'de 2–4 uzak fener sayfa kaydırıldıkça süzülür (`animation-timeline: scroll(root)`; desteklenmezse
  durağan). RSVP gönderilince hâle parlar ve bir fener göğe yükselir. Hareket azaltmada hepsi kapalı.
- **Sayfalar:** home (gökte kart, davet, geri sayım, takvim, fotoğraflar, alacakaranlık bandında program, imza), story,
  details (G127 harita, G138 blokları, travel, menü, registry, SSS), rsvp (G128 form, G069 misafir adları, G051 sorular),
  teşekkür modu (G075). Fontlar Bellefair + Corinthia (23–32 dahil hiçbir tasarımda yok; ilk seçim Gilda Display'di, 32 Music Box da onu aldığı için birleştirmede Bellefair'e geçildi). Yeni site metni iki tane: "Under the
  evening sky", "Light the lantern again" (4 dil, `lib/i18n/dict/site/*`).
- **Demo:** Sophie & Daniel, The Meadowlark Terrace (kurgu), Santa Barbara, California, September 18, 2027; URL/medya `null`;
  demo pini Santa Barbara (başka temada yok). Program/SSS ifadeleri G150 sözlüğünde olanlar.
- **Kayıtlar:** `config.ts` `coming` (`[PRICE]`); `designs.ts` satış metni + `DESIGN_STYLES` (`classic`), açılış nesnesi
  `lantern` (`marketing/i18n.ts` `OPENING_THINGS`; panel etiketleri "…on the lantern"); market 13 + panel 9 + site 2 anahtar
  tr/de/es/fr; `tools/katalog.py` `EK_TEMALAR` satırı (6 eksen + `hareket`; `kontrol` ✓); coming listeleri
  (g085/093/094/097) ve g138 tema sayısı (29).
- **Koleksiyon** `collections/31_Sky_Lantern_Festival/`: `DESIGN_BRIEF.md`, `COLLECTION_STATUS.md` (`editable_draft`),
  `content.demo.json`, `assets/gpt/GPT_PROMPTS.md` (PAKET 5: 12 parça, tam yol/ölçü/alfa, avuçlar + iki fener aynı tuvalde;
  PAKET 2: 5 foto, kurgu çift; PAKET 6: ön/arka 1819×2551 = A5+bleed 300 ppi, 5×7'yi de basar; yazı yok),
  `assets/gpt/kuru_sekil.json`, `package/listing/listing_v3.md` (taslak, K41; başlık 104 karakter, 13 etiket ≤ 20).
- **Basılı davetiye (G139):** `lib/print/layouts.ts` `composed` — 18'in pamuk kâğıdı + temanın gök bandı (üst/alt) ve bir fener
  (`public/print/sky-lantern-festival/`); `g149-print-layout` geçti.

### Geçici görsel (K21) — GPT bekleyen
Tasarımın kendi parçası yok. 02'nin suluboya yıkaması satır satır tonlandı (mor → pembe → kehribar gök; koyu mor sayfa zemini),
18'in pamuk kâğıdından fener (sönük pembe / yanan kehribar dikdörtgen), uzak fener ve kart kesildi; çizim yok. Avuçlar, yıldız
tozu, pirinç kâğıdı paspartu, yatay çerçeve, ayırıcı ve PAKET 2 fotoğrafları **yok** (sayfalarda gizli katman; gelince
`build_images.py` `@gpt-layers` bloğuyla açar). Fener şimdilik düz kâğıt dikdörtgen: "avuçlarda fener" anı GPT parçalarıyla
anlaşılır; satış öncesi göz kontrolü şart.

### Birleştirme
`origin/claude/zealous-fermi-hy1o40` (30 Azulejo + 32 Music Box) birleştirildi: config / designs / `DESIGN_STYLES` /
`OPENING_THINGS` (`wall`, `lantern`) / baskı düzenleri / katalog / coming listeleri 30 → 31 → 32 sırasıyla, tema sayısı 31,
sözlüklerde iki taraf korundu (yinelenen anahtar yok).

### Kontroller (Linux, Node 22)
- `npm ci`, `rm -rf .next`, `npx tsc --noEmit` ✓; `npm run build` ✓ (trace-check 30 tema); `I18N_STRICT=1 npm test` **1594/1594** (birleştirmeden önce) ve birleşik dalda **1623/1623** (0 hata, 0 atlanan).
- `theme-check --theme sky-lantern-festival --stress --compare none`: **112 geçti, 0 hata**, 12 uyarı (11 "Google font not
  loaded (Corinthia)": el yazısı kullanmayan details'te font tembel yüklenir; 1 PAKET 2 yok → 03 fotoğrafları). İlk görünüm
  DPR 3: index 335 KB, home 295 KB (yer tutucu); fotoğraflı 425 / 801 KB. İlk koşuda 10 hata vardı (açılış sayfasında açık renk
  "Tap to open"/"Replay" parlak kehribar ufkun üstünde) → göğün altına alacakaranlık geçişi (CSS ışık) eklendi, ikinci koşu
  temiz; birleştirme + font değişikliğinden sonra üçüncü koşu da 112/0.
- `python3 tools/gpt_kuru_deneme.py --tema sky-lantern-festival --sekil …/kuru_sekil.json`: **GEÇTİ** 12/14 (okunmayan yalnız
  PAKET 6, bilerek elle).
- `python3 tools/katalog.py kontrol` ✓; `copy-manifest --check` ✓; `node scripts/i18n-missing.ts` 0 eksik; `validate_content.py` ✓.
- 390 px görüntülere baktım (`previews/g170/`: 5 sayfa, `opening_frames_390.jpg` açılış kareleri, stres 360, RSVP gönderildi).

**Denenmedi:** gerçek iPhone/Safari ve Android Chrome, Firefox, Vercel yayını, gerçek alıcı fotoğrafları, yavaş ağ, GPT
parçalarıyla görünüm, sesin gerçekten duyulması, g051-browser ve final-smoke.

## Günlük
- 2026-10-17 açıldı ve alındı: claude-G170 (koordinatör isteği)
- 2026-10-17 bitti, incelemeye gönderildi
