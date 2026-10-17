---
id: G169
baslik: 30 Azulejo Mosaic — yeni tasarım (2. dalga), platform teması (GPT parçalarından önce), coming kaydı, prompt'lar, basılı davetiye, Etsy taslağı
rol: claude-kod
durum: inceleme
alan: claude-G169
oncelik: 1
bagimli: [G138, G139, G144, G149, G159, G167]
yazar: [platform/themes/azulejo-mosaic/, collections/30_Azulejo_Mosaic/, platform/tests/theme-azulejo-mosaic.test.ts, platform/previews/g169/, platform/public/print/azulejo-mosaic/, platform/lib/marketing/config.ts, platform/lib/marketing/designs.ts, platform/lib/marketing/i18n.ts, platform/lib/audio/catalog.ts, platform/lib/claim/demo-map.ts, platform/lib/print/layouts.ts, platform/lib/i18n/dict/site/, platform/lib/i18n/dict/market/, platform/lib/i18n/dict/panel/, platform/tests/g085-designs.test.ts, platform/tests/g093-designs.test.ts, platform/tests/g094-designs.test.ts, platform/tests/g097-designs.test.ts, platform/tests/g138-extras.test.ts, tools/katalog.py, gorevler/G169-azulejo-mosaic.md]
---

## Amaç
`docs/24_YENI_TASARIMLAR.md` 2. dalga satır 30: mavi-beyaz çini duvarı; çiniler tek tek 3B döner (ızgarada dalga), arkadan davet
çıkar; fotoğraflar çini mozaiğiyle açılır; kobalt azulejo, terrakota saksı (limon yok — 05'ten ayrı); el boyaması seramik;
cobalt-white-terracotta. Koordinatör: session_01HP9ZrJ8mhZnigbvsvUQ4pR. Dal `claude/g169-azulejo-mosaic`; main/PR/yayın yok.

## Sonuç (2026-10-17, claude-G169)

### Yapılanlar
- **Tema** `platform/themes/azulejo-mosaic/` (README, `build_images.py`, `img/manifest.json`, 5 şablon, `site.css`, `site.js`,
  `thank-you.css`, üretilen `parts.css`, `theme.json` 82 copy anahtarı, `content.demo.json`). Klasör ≈ 0,3 MB.
- **Kapalı nesne + açılış:** kobalt duvarda 4 × 6 çini paneli (köşe `tile_3`, bordür `tile_2` dışa dönük, alan `tile_1/4`
  2 × 2 çeyrek döndürmeli; `index.html` sınıfları = `build_images.tile_kind`), her çini ön yüz (boyalı) + arka yüz
  (terrakota) ayrı katman, arkasında kart. Dokunuş → panel hafif çöker (0–380 ms), sır ışığı geçer (80–780) → **dalga:**
  her çini dokunulan çiniye uzaklığına göre 420 + 1300 × mesafe ms'de kalkar, dokunuştan uzağa 3B döner, terrakota sırtını
  gösterip kalkarak söner (760 ms) → kart kalkar (2350) → öne gelir (2950) → home 3400 ms (VT `invite-card`). Klavyede
  dalga ortadan. Ses: tap 0 · whoosh 420 · slide 2350 · chime 2950 (Garden Waltz).
- **Foto mozaiği:** `.mosaic` alanlarına (home portre, tanıtım, story ×3, mekân) `site.js mosaic()` alan çinilerinden ızgara
  kurar; sahne adımı gelince çiniler sol üstten çapraz dalgayla dönüp kalkar, sonra silinir. JS'siz / reduced motion'da yok;
  açılıştan gelince home kartında yok. **RSVP:** yanıt gidince teşekkür paneli çinilerle açılır.
- **Sayfa adımı:** metin çini gibi üst kenarından yatarak yerleşir (rotateX); link/düğme içerenler yalnız yükselir (44 px).
- **Sayfalar:** home (kobalt duvarda kart, friz, badana zeminde davet, geri sayım, takvim, tanıtım, friz, kobalt bantta gün,
  imza), story (üç an ortada), details (beyaz kartta program, friz, mekân, G127 harita, G138, travel, menü, registry, SSS),
  rsvp (friz + kart, G128 form). Tek yeni site metni "Laid tile by tile, sent with love" 4 dilde.
- **Demo:** Inês & Mateo, Quinta da Andorinha Azul, Sintra (Lisbon, Portugal), June 5, 2027; URL/medya `null`; pin Sintra.
  Program/SSS/kıyafet metinleri G150 sözlüğündeki ifadeler.
- **Koleksiyon** `collections/30_Azulejo_Mosaic/`: `DESIGN_BRIEF.md`, `COLLECTION_STATUS.md` (`editable_draft`),
  `content.demo.json`, `assets/gpt/GPT_PROMPTS.md` (PAKET 5: W2.1–W2.11 — 4 çini, çini sırtı, kobalt duvar, badana, kart
  kâğıdı, friz, iki saksı, web_hero; PAKET 2: 5 foto; PAKET 6: ön/arka 1819×2551 = 5×7 ≈ 346 ppi, A5 ≈ 300 ppi; yazısız),
  `assets/gpt/kuru_sekil.json`, `package/listing/listing_v3.md` (taslak, K41; başlık 116 karakter, 13 etiket ≤ 20).
- **Basılı davetiye (G139):** `layouts.ts` `composed` — 18'in pamuk kâğıdı + üstte/altta yedişer çini (köşe–bordür–alan);
  `public/print/azulejo-mosaic/`. G149 testi geçti.
- **Kayıtlar (coming):** `config.ts`, `designs.ts` (+ `DESIGN_STYLES` classic/destination, açılış nesnesi `wall` →
  `OPENING_THINGS` + panel/market çevirileri), `audio/catalog.ts`, `demo-map.ts`, `katalog.py` `EK_TEMALAR` (6 eksen +
  `hareket`; font Arizonia + Cormorant Upright), tema sayan testler (coming listesi, g138 = 29).

### Geçici görsel (K21) — GPT bekleyen
Çiniler 05'in boyalı bordüründen kesildi (sarı göbek/derz terrakotaya döndürüldü, ~70 px'ten büyütüldü: yumuşak);
sırt/duvar/badana 05'in düz sıvası, kart 18'in pamuk kâğıdı tonlandı; friz = dört çini yan yana; og = panel montajı.
Saksılar yok (yedek çizilmedi). Bütün parçalar dosya adıyla kendiliğinden girer.

### Kontroller (Linux, Node 22)
- `npm ci`, `rm -rf .next`, `npx tsc --noEmit` ✓; `I18N_STRICT=1 npm test` **1591/1591 geçti** (taban `claude/zealous-fermi-hy1o40` ile birleştirme sonrası; tabanda yeni commit yoktu) — ilk koşuda
  tek hata `marketing-content` "hand-painted" yasaklı iddia (görseller AI üretimi): satış metni, site metni ve ilan "painted"
  olarak düzeltildi; `npm run build` ✓ (trace-check 30 tema).
- `theme-check --theme azulejo-mosaic --stress --compare none --no-video`: **111 geçti, 0 hata**, 61 uyarı (60'ı "Google font
  not loaded (Cormorant Upright)" — test makinesinin ağı; 1'i PAKET 2 yok → 03 fotoğrafları). İlk koşuda 1 hata: "Replay the
  envelope" bağlantısı sahne adımı eğikken 33 px ölçülüyordu → link/düğme içeren adımlar yalnız yükseliyor. İlk görünüm DPR 3:
  index 221 KB, home 208 KB (yer tutucu); fotoğraflı 311 / 400 KB.
- `python3 tools/gpt_kuru_deneme.py --tema azulejo-mosaic --sekil …/kuru_sekil.json`: **GEÇTİ** 12/14 (okunmayan yalnız PAKET 6,
  bilerek elle). `python3 tools/katalog.py kontrol` ✓; `node scripts/i18n-missing.ts` 0 eksik; `build-print-assets --theme` ✓.
- 390 px görüntülere baktım (`previews/g169/`: 5 sayfa, yanıt gönderilmiş RSVP, stress index 360, `opening_frames_390.jpg`
  açılış kareleri — sol üstte dokunuştan yayılan dalga, terrakota sırtlar, kart; `story_mosaic_frames_390.jpg` foto mozaiği).

**Denenmedi:** gerçek iPhone/Safari ve Android Chrome, Vercel yayını, gerçek alıcı fotoğrafları, yavaş ağ, GPT parçalarıyla
görünüm, g051-browser ve final-smoke.

## Günlük
- 2026-10-17 açıldı ve alındı: claude-G169 (koordinatör isteği)
- 2026-10-17 bitti, incelemeye gönderildi
