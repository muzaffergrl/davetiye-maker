---
id: G161
baslik: Yeni tasarım 23 Velvet Jewel Box — platform teması (coming), koleksiyon, GPT prompt'ları, basılı düzen, ilan taslağı
rol: claude-kod
durum: inceleme
alan: claude-G161
oncelik: 1
bagimli: []
yazar: [platform/themes/velvet-jewel-box/, collections/23_Velvet_Jewel_Box/, platform/tests/theme-velvet-jewel-box.test.ts, platform/previews/g161/, platform/public/print/velvet-jewel-box/, platform/lib/marketing/config.ts, platform/lib/marketing/designs.ts, platform/lib/audio/catalog.ts, platform/lib/claim/demo-map.ts, platform/lib/print/layouts.ts, platform/lib/i18n/dict/, platform/tests/g085-designs.test.ts, platform/tests/g093-designs.test.ts, platform/tests/g094-designs.test.ts, platform/tests/g097-designs.test.ts, platform/tests/g138-extras.test.ts, platform/scripts/theme-check.cjs, tools/katalog.py, gorevler/G161-velvet-jewel-box.md]
---

## Amaç
`docs/24_YENI_TASARIMLAR.md` dalgası, satır 23: kapalı nesne patlıcan moru kadife yüzük kutusu (kapak menteşeden 3B açılır,
saten astar, davet kartı yükselir), 3B silindir karusel, saten kurdele/inci/yüzük/şampanya saten, fotogerçekçi ürün çekimi,
Bodoni Moda + Pinyon Script, aubergine-champagne, kendine özgü hareket imzası. GPT parçaları gelmeden kurulur (22 Nocturne
modeli); satış durumu `coming`. Koordinatör: session_01HP9ZrJ8mhZnigbvsvUQ4pR. Dal `claude/g161-velvet-jewel-box`.

## Sonuç (2026-10-17, claude-G161)

### Tema `platform/themes/velvet-jewel-box/`
- 5 sayfa (kutu → home yeni sayfada → story, details, rsvp; teşekkür modu, G138 blokları, G127 harita, G126 ses kancaları,
  G128 form, G144 dil, 84 copy anahtarı), `site.css` 27 KB, `site.js` 14 KB, tema klasörü 0,54 MB (geçici görsellerle).
- **Açılış (ölçüldü, `MOTION.envelope` = CSS):** fiyonk kayıp düşer 0–650 ms · kutu küçük basınç 450–700 · kadife kapak
  menteşede 90°'ye döner 650–1300 · saten iç kapak 90°'de devralır 1300–1900 · saten üstünde ışık süpürmesi 1700–2600 ·
  kart kutudan yükselir 1900–3100 · öne gelir 3100–3450 · home 3550 ms (VT `invite-card`). Kayıtta dokunuş → home ≈ 3,6 s;
  kareler `platform/previews/g161/opening_frames_390.jpg`. Ses: ribbon 0 · clasp 650 · slide 1900 · chime 3100 (Music Box).
- **Hareket imzası (diğer 22'den farklı):** menteşe 3B açılış; saten ışık süpürmesi (kenarsız gradient, astarın kendi
  alfasıyla maskeli; home/details/rsvp satenlerinde görünüme girince bir kez); varak parıltısı (başlıkların kendi rengi
  üstünde hareketli maske bandı, bir kez — ilk sürüm `background-clip:text` idi, theme-check'in "yazıyı gizle" ölçümü onu
  gizleyemediği için maskeye çevrildi; görünüm aynı); story'de **silindir karusel** (38° aralık, sürükle/kaydır + en
  yakına oturma, oklar, ←/→/Home/End, yan fotoya dokununca döner; azaltılmış hareket ve JS'siz: scroll-snap kaydırıcı);
  sayfa geçişi **saten perde** (`::view-transition-new(root)` tüylü çapraz maske silmesi + eski sayfa kararıp geri kayar;
  22 temanın hepsi çapraz solma kullanıyor); sahne adımları "kumaş yerleşmesi" (hafif eğiklik düzelir) ve "drape" (üstten
  açılan clip-path).
- **Geçici görseller (K21):** W2 parçaları yok. `build_images.py` GPT'nin kullanacağı 1024×1536 tuvalde yer tutucu bir kutu
  kurar — başka koleksiyonların GPT dokularından düz dikdörtgen kırpımlar, bu paletin tonlarına çevrilmiş (17'nin koyu
  karosu → kadife, 14'ün saten karosu → astar/zemin, 01 kâğıdı → kart, 14'ün saten fiyonk accent'i → kapanış) — ve onu
  GPT'nin `box_closed`/`box_open`'ını keseceği yoldan keser (eklem + menteşe satırları, `manifest.stage`). Çizim yok.
  Yer tutucu kutu bilerek "kutu taslağı" gibi görünüyor; satışa uygun değil. Parçalar gelince betik kendiliğinden onlara
  geçer; eklem/menteşe ölçülür (`SEAM_PCT`/`HINGE_PCT` ile düzeltilebilir), `site.css`'teki yüzdeler manifest'ten kopyalanır
  (tema testi karşılaştırır).
- Demo: Isabelle & Julian, Halvern House, New York (kurgu), 13 Kasım 2027, US tarih; URL'ler `null`; örnek foto yok
  (PAKET 2 bekliyor) → demo yer tutucu gösteriyor. Harita pini New York.

### Kayıtlar (eklemeli, en az değişiklik)
- `config.ts` `coming` ([PRICE]); `designs.ts` metinleri (açılış nesnesi "box") + stil `classic`; `audio/catalog.ts`;
  `demo-map.ts`; `print/layouts.ts` (composed: kadife + fiyonk, metin süsten uzak — önizleme `previews/g161/print_5x7_front_back.jpg`;
  `public/print/velvet-jewel-box/` üretildi); i18n: 9 panel + 2 site + 10 satış metni × TR/ES/DE/FR (ajan çevirisi,
  anadil kontrolü yok); testlerde "coming" listeleri (g085/093/094/097) ve g138 tema sayısı 22 → 23.
- `tools/katalog.py`: `EK_TEMALAR`'a 23 (6 eksen + `hareket`) ve `kontrol`'e `ek_ayirt()` (eksenli ek kayıt D'deki ve
  diğer ek kayıtlardaki her tasarımdan ≥ 4 eksende farklı + hareket imzası tekil). D'ye girmedi (G142 gerekçesi: üreteçler
  dosya yazar). `docs/09` yeniden üretilmedi (yalnız D'den üretiliyor).
- **Paylaşılan araç düzeltmesi:** `scripts/theme-check.cjs` "details without links: dead buttons" denetimi harita bloğunun
  kendi düğmelerini (`[data-map]`) artık saymıyor. Sebep: bugünkü `72f2f26` (seed demo pini) her pinli temada bu denetimi
  kırmızıya çeviriyordu (Show map / Google Maps / Apple Maps bir linkten değil, pinden geliyor). Bir satır.

### Koleksiyon `collections/23_Velvet_Jewel_Box/`
`DESIGN_BRIEF.md`, `COLLECTION_STATUS.md` (editable_draft / coming), `content.demo.json` (= tema kopyası),
`assets/gpt/GPT_PROMPTS.md`: **PAKET 5** W2.1–W2.11 (kapalı kutu, fiyonk — aynı tuval, açık kutu, kart #00FF00 pencere,
kadife zemin, saten zemin, inci dizisi ayırıcı, inci accent, alyanslar, vitrin altlığı, web_hero/og; her biri tam yol, ölçü,
şeffaflık), **PAKET 2** (kurgu çift 5 foto, gerçek kişiye benzemesin), **PAKET 6** (basılı ön/arka zemin 5×7 ve A5, 300 ppi,
bleed dahil) + yerleştirince çalıştırılacak komutlar. `package/listing/listing_v3.md` (etsy-metin alt ajanı; yayınlanmadı,
görsel/video/rehber yok, "envelope" geçmiyor; başlık 118 karakter).

### Testler (Linux, Node 22)
- `npx tsc --noEmit` ✓; `I18N_STRICT=1 npm test` — ilk tam koşu 1397/1400 (1 hata: g150 sözlüğü demo dress code /
  program satırını bilmiyordu → demo "Black tie optional" ve "Cocktail Hour" yapıldı; ilgili testler yeşil); son tam koşu **1398/1400** (0 hata, 2 eski atlanan).
- `npm run build` ✓ (trace-check 24 tema).
- `theme-check --theme velvet-jewel-box --stress --compare none`: **112 geçti, 0 hata**, 1 uyarı (PAKET 2 yok → 03 fotoğrafları).
  İlk turdaki hatalar düzeltildi: karuselde yan fotoların başlıkları ekran dışında (→ `visibility:hidden`), zarf sayfasında
  isimler "boyalı dekor üstünde" (kadife zemin fazla dokuluydu → daha yumuşak; varak maskeye çevrildi), replay linki 41 px
  (sahne girişindeki `rotateX` kutuyu kısaltıyordu → eğiklik), harita düğmeleri (yukarıda).
- İlk görünüm (DPR 3): index 471 KB, home 279 KB; örnek fotoğraflarla 561 / 378 KB. `g051-browser` 44/44, `final-smoke` 45/45.
- `tests/theme-velvet-jewel-box.test.ts` 15 test (katalog/satış durumu, demo = koleksiyon, demo rotası, teşekkür modu, ses,
  RSVP sözleşmesi, copy = şablon, ayrı katmanlar + CSS = manifest yüzdeleri, MOTION = keyframe, oturum anahtarları + VT +
  saten geçiş, sahneler/foto alanları, karusel klavye/düğme/yedek, K21, og/favicon/baskı kaynakları).
- 390 px'te bütün sayfalara, placeholder, stress ve teşekkür hâllerine gözle bakıldı (`previews/g161/`).
- `python3 tools/katalog.py kontrol` ✓.

### GPT'yi bekleyen
PAKET 5 W2.1–W2.11 (asıl kadife kutu ve bütün dekor), PAKET 2 (5 foto), PAKET 6 (4 baskı zemini). Gelince: `build_images.py`,
`site.css` yüzdeleri, `layouts.ts` kaynakları, theme-check tekrar, göz kontrolü → ancak sonra `live` kararı.

**Denenmedi:** gerçek iPhone/Android, Vercel yayını, gerçek GPT kutusu ve fotoğraflar, yavaş ağ, qa-kontrol karşılaştırma
kapısı (W1 comp yok). Fontlar test makinesinde Google Fonts'tan yüklendi mi ayrıca doğrulanmadı (uyarı çıkmadı).

## Günlük
- 2026-10-17 açıldı ve alındı: claude-G161 (koordinatör isteği)
- 2026-10-17 bitti, incelemeye gönderildi
