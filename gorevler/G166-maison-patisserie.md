---
id: G166
baslik: 28 Maison Pâtisserie — platform teması (GPT parçalarından önce, geçici katmanlarla), coming kaydı, prompt'lar, basılı davetiye, Etsy taslağı
rol: claude-kod
durum: inceleme
alan: claude-G166
oncelik: 1
bagimli: []
yazar: [platform/themes/maison-patisserie/, collections/28_Maison_Patisserie/, platform/tests/theme-maison-patisserie.test.ts, platform/tests/g085-designs.test.ts, platform/tests/g093-designs.test.ts, platform/tests/g094-designs.test.ts, platform/tests/g097-designs.test.ts, platform/tests/g138-extras.test.ts, platform/tests/g127-maps.test.ts, platform/lib/marketing/config.ts, platform/lib/marketing/designs.ts, platform/lib/marketing/i18n.ts, platform/lib/audio/catalog.ts, platform/lib/print/layouts.ts, platform/lib/i18n/dict/, platform/lib/i18n/wedding-glossary.ts, platform/public/print/maison-patisserie/, platform/previews/g166/, tools/katalog.py, gorevler/G166-maison-patisserie.md]
---

## Amaç
Koordinatör (session_01HP9ZrJ8mhZnigbvsvUQ4pR) isteği, docs/24 #28: yeni tasarım **Maison Pâtisserie** — kapalı nesne fıstık yeşili
pasta kutusu, saten fiyonk çözülür, kapak kalkar, ipek kâğıt aralanır; fotoğraflar vitrin raflarında kayar; menü vitrin; RSVP
makaron çipleri; gönderimde şeker inci yağmuru. Tema standardında (docs/11), "coming", GPT parçaları gelmeden (Nocturne yaklaşımı).
Dal `claude/g166-maison-patisserie` (taban `1aa7b20`); main'e push/PR/yayın yok.

## Sonuç (2026-10-17, claude-G166)

### Tema `platform/themes/maison-patisserie/`
- 5 sayfa + `theme.json` (5 foto alanı: portre ve raf fotoğrafları 4:5, mekân 3:2; 83 copy anahtarı, 2'si temaya özel: raf düğmelerinin
  ekran okuyucu adları), `site.css` 27 KB, `site.js` 14 KB, `thank-you.css`, `build_images.py`, `README.md`, `img/` (tema klasörü 0,59 MB).
- **Açılış (kendi nesnesi, zarf değil):** kutu üstten görünür; dokun → kutu hafifçe basılır (0–260 ms) → fiyonk çözülür: iki ilmek iki
  yana ayrılıp söner, düğüm düşer (180–1000) → dört kurdele kolu kendi yönüne kayar (420–1120) → kapak misafire doğru kalkıp uzaklaşır
  (1100–1900) → iki ipek kâğıt dış kenarlarından perde gibi açılır (1850–2600) → içteki kart (portre, "Our wedding", isimler, tarih)
  kalkar (2500–3200) ve öne gelir (3200–3500) → home 3600 ms (VT `invite-card`). 12 ayrı katman; her katman aynı 1024 tuvalin tamamı
  (üst üste %100; ölçülecek parça yüzdesi yok). Azaltılmış hareket: animasyonsuz home. Skip, Enter, "Replay the opening", bfcache.
- **Story:** vitrin rafı bileşeni — üç foto cam rafta; dokunmatik kaydırma + scroll-snap, fareyle sürükleme, ‹ › düğmeleri, odaklı rafta
  ← →; ortadaki öne çıkar ve etiketi görünür ("1 / 3"). ≥ 760 px'te üçü yan yana (kaydırma yok). Azaltılmış harekette ve JS'siz düz liste.
- **Details:** gün akışı kart kâğıdında (1–10 satır, kâğıt uzar), tören cümlesi, takvim, mekân fotoğrafı, harita (G127), kıyafet,
  bloklar/travel (G138), **menü vitrini** (G138 `data-menu`: her bölüm bir raf, yemekler makaron renkli çipler), registry, SSS.
- **RSVP:** G042/G051/G069/G128 sözleşmesi; "Will you attend?" ve çiftin seçenekli soruları makaron renkli çipler (radyo çipin içinde
  gerçek denetim); başarılı gönderimde 18 şeker inci düşer (`MOTION.accents.closing`, GPT sprite; azaltılmış harekette yok).
- Teşekkür modu (G075; fotoğrafsız kart penceresinde fiyonk), G068 metinler, G126 ses (Garden Waltz; ribbon 180 · paper 1100 · paper
  1850 · slide 2500 · chime 3200 ms), G144 (4 yeni site metni + panel "box" kelimeleri + satış metinleri 4 dilde; `I18N_STRICT=1` 0 eksik),
  og (geçici: kapalı kutu krem zeminde, yazısız) + favicon (fiyonk).
- Fontlar Italiana + Parisienne (Google Fonts). Ölçüldü: Parisienne latin-ext var, **Italiana yalnız latin** (README'de sınır olarak).

### Geçici görseller (K21 — çizim yok)
Maison Pâtisserie'nin hiçbir GPT parçası yok. `build_images.py` her katmanı depodaki GPT görsellerinden **kırpma/tonlama/aynalama/maske**
ile kuruyor: krem kâğıt = 21 `textures/paper-background.png`, saten = 14 `parts/bg_tile.png`, fiyonk = 14 `parts/accent_3.png` (gül
tonuna çekilip düğümden iki ilmek + düğüm olarak kesildi; birleşim kaynakla örtüşme 0,0), şeker inci = 14 `accent_1`'in inci gövdesi.
Kutu, kapak, ipek kâğıt, kart ve raf bu kâğıt/satenin düz dikdörtgen kırpımları (Nocturne'ün geçici kartı gibi). Betik
`assets/gpt/parts/` içinde dosya gördükçe **katman katman** GPT'ye geçer (`img/manifest.json` → `sources`). Dekor ailesi (makaron, tül,
altın kenar tabak) sayfalarda henüz yok — parçaları yok.

### Koleksiyon `collections/28_Maison_Patisserie/`
`DESIGN_BRIEF.md`, `COLLECTION_STATUS.md` (editable_draft / coming), `content.demo.json` (kurgu Camille & Oliver, The Belle Rive
Orangery, Newport RI; en-US; URL'ler ve medya null; demo menü; `validate_content.py` GEÇTİ; tema kopyası birebir),
`assets/gpt/GPT_PROMPTS.md` (İngilizce, tam yol + ölçü + şeffaflık: **PAKET 5** 16 parça — kutu, ipek kâğıt ×2, kapak, kurdele çaprazı,
fiyonk sol/sağ/düğüm, kart, zemin, karo, raf, şeker inci, makaron tabağı, tül, web_hero; **PAKET 2** 5 kurgu çift fotoğrafı; **PAKET 6**
basılı davetiye ön/arka 5×7 (1575×2175) ve A5 (1819×2551) 300 ppi taşma paylı; komutlar), `package/listing/listing_v3.md` (aynı
biçim; K41 yayımlanmadı; görsel/video/rehber yok diye açıkça yazılı).

### Kayıtlar
- `config.ts` `coming` + `[PRICE]`; `designs.ts` DESIGN_COPY (açılış "Your guests tap the box.") + stil `classic`; `marketing/i18n.ts`
  OPENING_THINGS'e `box`; `audio/catalog.ts`; `print/layouts.ts` **G139 composed** (krem kâğıt + fiyonk; `public/print/maison-patisserie/`,
  5×7 ve A5 bleed+kesim örnekleri üretilip bakıldı — `previews/g166/print_invitation_5x7_a5.jpg`).
- `tools/katalog.py`: `EK_TEMALAR` dalga kaydı (zarf/foto/dekor/teknik/font/palet + `hareket`; ad ASCII "Maison Patisserie" →
  tema_slug `maison-patisserie`) ve `dalga_ayirt()` (dalga kaydı D'deki 20 tasarım + dalganın diğerleriyle ≥ 4 eksende farklı, hareket
  imzası dolu) → `kontrol` çıktısına eklendi. Font ekseni 06 (Italiana) ve 08 (Parisienne) ile ortak; diğer 5 eksen farklı.
- Testler: yeni `tests/theme-maison-patisserie.test.ts` (16); "coming" listeleri (g085/093/094/097) + Maison; g138 tema sayısı 23.
- Glossary (G150 testi): 5 demo metni satırı.

### Kontroller
- `python3 tools/katalog.py kontrol` ✓ (yeni dalga: 1 tasarım ≥ 4 eksen + hareket imzası).
- `theme-check --theme maison-patisserie --stress --compare none`: **112 geçti, 0 hata, 1 uyarı** (PAKET 2 yok → 03 örnek fotoğrafları).
  İlk görünüm (390×844, DPR 3): index **378 KB**, home **190 KB**; tohumlanmış fotoğraflarla 469 / 493 KB. **Kutu → home 3770 ms.**
  İlk koşuda 98 hata vardı: raf kaydırıcısında ekran dışı kartların etiketleri "kırpılmış metin", alt menü zorlama metinlerinde taşma,
  uzun isimler hero kartında tek satır kalıyordu, 375×553'te hero nav altına giriyordu, isimler 30 px'e iniyordu — hepsi düzeltildi.
- `npm ci`, `rm -rf .next`, `npx tsc --noEmit` ✓, `I18N_STRICT=1 npm test`, `npm run build` (+ trace-check, 24 tema) — sayılar aşağıda "Son koşum".
- Gözle bakıldı (390 px): kutu kapalı/açık, açılış kareleri (`opening_frames_390x844.jpg`), home, story (raf), details (menü vitrini),
  rsvp (çipler, teşekkür paneli), zorlama ve teşekkür hâlleri. Görüntüler `platform/previews/g166/` (PNG'ler yer için JPEG'e çevrildi;
  `checks.json` .png adlarını anar; açılış MP4'ü repoya konmadı).

### Son koşum (Linux, Node 22)
`npm ci` · `rm -rf .next` · `npx tsc --noEmit` ✓ · `I18N_STRICT=1 npm test` **1399/1401, 0 hata, 2 atlandı** (`.next` yokken atlanan
marketing-build testleri; build sonrası ayrıca koşuldu: 2/2) · `npm run build` ✓ (trace-check 24 tema) · son theme-check (`--no-video`,
son CSS ile) 111/0/1, kutu → home 3771 ms.

### Kapsam dışı küçük değişiklikler (gerekçeli)
- `tests/g127-maps.test.ts`: "her temaya demo pini" testi Maison'u **bekleyen** listesinde tutuyor — pin `lib/claim/demo-map.ts`'de ve o
  dosya bu görevde yasaktı. Koordinatör: `'maison-patisserie': { lat: 41.4901, lng: -71.3128 }` ekleyip listeden çıkarsın.
- `lib/i18n/dict/market/{es,de,fr}.ts`: Crimson'un meta açıklama çevirileri 180–189 karakterdi (`marketing-build` testi yalnız `.next`
  varken koşuyor, tabanda da kırmızıydı) → 150–155'e kısaltıldı.

### Denenmedi
Gerçek iPhone/Safari ve Android Chrome, Vercel yayını, gerçek alıcı fotoğrafları, yavaş ağ, `g051-browser`/`final-smoke` (bu görevde
istenmedi), W1 comp karşılaştırması (comp yok), qa-kontrol kapısı. GPT parçaları gelince: `build_images.py`, `site.css`'teki ipek kâğıt/fiyonk
`transform-origin`'leri manifest'le, PAKET 6 → `layouts.ts` `composed` kaldırılır, demo fotoğrafları, ilan görselleri/video/START HERE.

## Günlük
- 2026-10-17 açıldı ve alındı: claude-G166 (koordinatör isteği)
- 2026-10-17 bitti, incelemeye gönderildi
