---
id: G164
baslik: 26 Kintsugi & Washi — yeni tasarım, platform teması (GPT parçalarından önce), coming kaydı
rol: claude-kod
durum: inceleme
alan: claude-G164
oncelik: 1
bagimli: [G138, G139, G142, G144]
yazar: [platform/themes/kintsugi-washi/, collections/26_Kintsugi_Washi/, platform/tests/theme-kintsugi-washi.test.ts, platform/previews/g164/, platform/lib/marketing/config.ts, platform/lib/audio/catalog.ts, platform/lib/claim/demo-map.ts, platform/lib/print/layouts.ts, platform/public/print/kintsugi-washi/, platform/lib/i18n/dict/site/, platform/tests/g085-designs.test.ts, platform/tests/g093-designs.test.ts, platform/tests/g094-designs.test.ts, platform/tests/g097-designs.test.ts, platform/tests/g138-extras.test.ts, platform/scripts/theme-check.cjs, tools/katalog.py, gorevler/G164-kintsugi-washi.md]
---

## Amaç
`docs/24_YENI_TASARIMLAR.md` satır 26: çivit washi kâğıdı origami gibi katlanmış, katlar sırayla açılır; mürekkep yayılması
maskesiyle beliren fotoğraflar; altın kintsugi damarları, washi, sumi fırçası; sumi mürekkep + altın varak; Shippori Mincho +
Allura; indigo-gold-rice. Koordinatör: session_01HP9ZrJ8mhZnigbvsvUQ4pR. Dal `claude/g164-kintsugi-washi`; main/PR/yayın yok.

## Sonuç (2026-10-17, claude-G164)

### Yapılanlar
- **Tema** `platform/themes/kintsugi-washi/` (README, `build_images.py`, `img/manifest.json`, 5 şablon, `site.css` 23,5 KB,
  `site.js` 12,9 KB, `thank-you.css`, `theme.json` 82 copy anahtarı, `content.demo.json`). Klasör 0,35 MB.
- **Açılış:** pirinç kâğıdı kuşak aşağı kayıp söner (0–650 ms), kâğıdın üstünden yumuşak altın ışık geçer (120–1020), paket
  geri çekilir (500–1400, telefonda ölçek .76) → **üst kat** yukarı (550–1300) → **alt kat** aşağı (1100–1850) → **sol panel**
  (1650–2400) → **sağ panel** (2100–2850); her kat 90°'den sonra açık renkli içini gösterir (iki yüz, `backface-visibility`)
  → pirinç kâğıdı kart kalkar (2900–3500) → öne gelir (3500–3850) → home **3950 ms** (VT `invite-card` → home kartı).
  Kuşak, dört kat (sekiz yüz) ve kart ayrı katman. Ses: kuşak `ribbon` 0, her kat `paper` 550/1100/1650/2100, kart `slide`
  2900, `chime` 3500 (`lib/audio/catalog.ts`).
- **Story:** üç an sol–sağ–sol (4:5, 5:4, 4:5); her foto merkezden yayılan "mürekkep" maskesiyle belirir (`.ink`: üç yumuşak
  disk büyüyüp birleşir; W2.5 gelince maske GPT lekesi olur), sonra numara + başlık. Home kartı, tanıtım ve details mekân
  fotoğrafı da aynı yolla. JS'siz ve reduced motion'da maske yok.
- **Sayfalar:** home (çivit zeminde pirinç kâğıdı kart; pirinç bantta davet, üç satır tarih, RSVP, geri sayım, takvim;
  hikâye tanıtımı; gün; imza), details (program pirinç kâğıdında, mekân, G127 harita, G138 blokları, travel, menü, registry,
  SSS), rsvp (G128 form, G069 misafir adları, G051 sorular), teşekkür modu (G075). Nav altta; G144 dil düğmesi platformdan;
  tek yeni metin "Folded with care, opened with joy" 4 dilde (`lib/i18n/dict/site/*`).
- **Demo:** Naomi & Kai, Stillwater Garden Pavilion, Hood River (Oregon), October 9, 2027; URL ve medya `null`;
  demo pini Hood River. Program/SSS metinleri G150 sözlüğünde olan ifadelerle (glossary testi).
- **Koleksiyon** `collections/26_Kintsugi_Washi/`: `DESIGN_BRIEF.md`, `COLLECTION_STATUS.md` (`editable_draft`),
  `content.demo.json`, `assets/gpt/GPT_PROMPTS.md` (PAKET 5: W2.1–W2.10 tam yol/ölçü/şeffaflık; PAKET 2: 5 foto; PAKET 6:
  ön/arka 2250×3150 = 5×7 ve A5 ≥ 300 ppi; komutlar), `package/listing/listing_v3.md` (taslak, K41; başlık 113 karakter,
  13 etiket ≤ 20).
- **Basılı davetiye (G139):** `lib/print/layouts.ts` `composed` — pirinç kâğıdı + üstte/altta çivit washi şeridi (temanın
  tonladığı kâğıtlar; `public/print/kintsugi-washi/` 1024 px ≈ 195 ppi, geçici).
- **Kayıtlar:** `config.ts` `coming` (`[PRICE]`), `tools/katalog.py` `EK_TEMALAR` satırı (6 eksen + `hareket`) ve yeni
  `ek_ayirt()` denetimi (`kontrol`: D'nin 20 tasarımına ve dalganın eksenli kayıtlarına karşı ≥ 4 eksen, hareket imzası tek);
  tema sayan testler (g085/093/094/097 coming listesi, g138 tema sayısı 23). `designs.ts` satış metni **yazılmadı** (yalnız
  `live` tasarım ister; satışa açılırken + çevirileri).

### Geçici görsel (K21) — GPT bekleyen
Tasarımın kendi parçası yok. Nocturne yaklaşımı: var olan GPT pikselleri kesildi/tonlandı, çizim yok — çivit washi =
06'nın düz lacivert kâğıdı (`bg_tile`) kendi lifiyle çivide; pirinç kâğıdı = 18'in düz pamuk kâğıdı; katlar/kuşak/kart bu
kâğıtların dikdörtgen kırpımları (yalnız ışık: parlaklık + drop-shadow); og ve favicon aynı kırpımların montajı. Altın
damarlar, mürekkep lekesi, fırça darbesi, varak pulları (`MOTION.accents` boş), kuşak, kart penceresi, web_hero ve PAKET 2
fotoğrafları **yok** → `GPT_PROMPTS.md`; gelince yapılacak şablon işi tema README'sinde tablo hâlinde. Görünüm şu an sade;
satış öncesi GPT parçaları + göz kontrolü şart.

### Kontroller (Linux, Node 22)
- `npm ci`, `rm -rf .next`, `npx tsc --noEmit` ✓; `I18N_STRICT=1 npm test` **1393/1395 geçti, 0 hata, 2 atlandı**
  (önceden de atlananlar); `npm run build` ✓ (trace-check 24 tema).
- `theme-check --theme kintsugi-washi --stress --compare none`: **112 geçti, 0 hata**, 61 uyarı (60'ı "Google font not
  loaded (Shippori Mincho)" — fontların woff2'leri indirildi, Japonca alt kümeler yüklenmedi sayılıyor; 1'i PAKET 2 yok → 03
  fotoğrafları). İlk görünüm DPR 3: index 270 KB, home 229 KB (yer tutucu); fotoğraflı 361 / 422 KB. Açılış MP4'ü üretildi
  (repoya konmadı).
- İlk koşuda 1 hata vardı: "details without links: dead buttons" — `scripts/seed.ts` (72f2f26) her demoya şehir pini
  verdiğinden harita bloğunun "Show map / Google Maps / Apple Maps" düğmeleri ölü sayılıyordu (her temayı etkiler, tema
  hatası değil). `scripts/theme-check.cjs`'te tek satır: `[data-map]` içindeki düğmeler bu denetimden çıkarıldı.
- `python3 tools/katalog.py kontrol` ✓; `copy-manifest --check` ✓; `node scripts/i18n-missing.ts` 0 eksik;
  `tools/tests/test_etsy_upload.py` tabanda da düşen `olive-ivory` hatasıyla aynı (bu görevin değil).
- 390 px görüntülere baktım (`previews/g164/`: 5 sayfa, `opening_frames_390.jpg` açılış kareleri, stress/teşekkür hâlleri):
  kat sırası, kartın VT inişi, mürekkep maskesi, uzun isimler (kart içi küçülür, gerekirse portre daralır).

**Denenmedi:** gerçek iPhone/Safari ve Android Chrome, Vercel yayını, gerçek alıcı fotoğrafları, yavaş ağ, GPT parçalarıyla
görünüm, qa-kontrol karşılaştırma kapısı (W1 comp yok), g051-browser ve final-smoke (bu turda koşulmadı).

## Günlük
- 2026-10-17 açıldı ve alındı: claude-G164 (koordinatör isteği)
- 2026-10-17 bitti, incelemeye gönderildi
