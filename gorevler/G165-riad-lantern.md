---
id: G165
baslik: Yeni tasarım 27 Riad Lantern Nights — platform teması (GPT parçalarından önce), koleksiyon, prompt'lar, basılı davetiye, ilan taslağı
rol: claude-kod
durum: inceleme
alan: claude-G165
oncelik: 2
bagimli: [G142]
yazar: [platform/themes/riad-lantern-nights/, collections/27_Riad_Lantern_Nights/, platform/tests/theme-riad-lantern-nights.test.ts, platform/tests/g085-designs.test.ts, platform/tests/g093-designs.test.ts, platform/tests/g094-designs.test.ts, platform/tests/g097-designs.test.ts, platform/tests/g138-extras.test.ts, platform/lib/marketing/config.ts, platform/lib/marketing/designs.ts, platform/lib/marketing/i18n.ts, platform/lib/audio/catalog.ts, platform/lib/claim/demo-map.ts, platform/lib/print/layouts.ts, platform/public/print/riad-lantern-nights/, platform/lib/i18n/dict/, platform/lib/i18n/wedding-glossary.ts, platform/scripts/theme-check.cjs, platform/previews/g165/, tools/katalog.py, gorevler/G165-riad-lantern.md]
---

## Amaç
Koordinatör isteği (docs/24 satır 27): kapalı nesne oyma sedir çift kapı; kanatlar 3B açılır, fener ışığı içeri vurur; foto
Fas kemeri pencerelerde ışıkla belirir; zellige, pirinç fener, sedir oyma, bougainvillea; gouache + gerçekçi doku; Cinzel +
Marcellus SC; teal-safran-pirinç; hareket imzası kapı açılışı + fener titreşimi + çini çini bordür + kemerden ışık. Tema
standardında tam tema (GPT parçaları yokken Nocturne yöntemiyle geçici katmanlar), demo kaydı, koleksiyon, GPT prompt'ları
(PAKET 5/2/6), basılı davetiye, "coming" kaydı, katalog satırı, Etsy taslağı. Dal `claude/g165-riad-lantern`; main/PR/deploy yok.

## Sonuç (2026-10-17, claude-G165)

### Ne yapıldı
- **Tema** `platform/themes/riad-lantern-nights/`: 5 sayfa + `thank-you.css`, `site.css` (15 KB), `site.js` (`MOTION`), 86 copy
  anahtarı (`copy-manifest --check` temiz), `build_images.py`, `img/manifest.json`, og + favicon, README. Klasör 0,47 MB.
- **Açılış (kapi, içe dönen kapı):** dokun → kapılar hafifçe itilir, fener hâlesi parlar (0–250 / 0–900 ms) → başlık kalkar
  (0–450) → sol kanat dış menteşesinde avluya döner (`rotateY 0→76°`, 300–1200), sağ kanat 120 ms sonra (420–1320) → fener
  ışığı kapıdan taşar, avlu aydınlanır (900–1900) → fildişi kart avlunun derinliğinden ışığa gelir (1900–3100) → öne
  (3100–3450) → home (3550, VT `invite-card`). Ölçülen dokun → home **3,7 s** (theme-check). 06/14 gatefold'dan farkı: kanatlar
  90°'yi geçmez, 180° dışa katlanmaz; iç yüz gerekmez.
- **Hareket imzası:** fener titreşimi (`.lantern-glow`, kenarsız radyal ışık, 5,2 s düzensiz opaklık/parlaklık; index, home,
  rsvp), zellige satırı (home/story/details; her karo ayrı `data-step`, `tile` preset'i, 160 ms aralıkla soldan sağa), pencere
  ışığı (`light` preset'i: foto karanlıkta bekler, bir ışık şeridi bir kez geçer, foto aydınlanır; kaydırmada `animation-timeline:
  view()` ışık süzmesi). Reduced motion: hepsi kapalı, dokununca doğrudan home.
- **Story:** üç uzun 2:3 pencere — telefonda biri geniş (≤ 340 px) + ikisi yan yana (360 px'te ≥ 41vw), geniş ekranda üçlü
  kemer dizisi (ortadaki yukarıda); `<dialog>` görüntüleyici.
- **Geçici parçalar (K21, çizim yok):** 10'un `oak_tile`'ından dikleştirilip sedir tonuna çekilmiş iki kanat; 05'in dikişsiz
  sıvasından üç ton (safran avlu, fildişi kart, gece teali duvar); 05 `frame_portrait` bordüründen üç tek karo (kobalt → teal).
  Gerçek parçalar `collections/27_Riad_Lantern_Nights/assets/gpt/GPT_PROMPTS.md`'de; gelince `build_images.py` onlara geçer.
- **Demo kaydı:** kurgu Leila & Adrian, The Saffron Courtyard Riad, Marrakech, October 9, 2027 (en-US), URL'ler `null`, medya
  boş (PAKET 2 bekliyor). Tema ve koleksiyon kopyası birebir; `validate_content.py` GEÇTİ.
- **Koleksiyon:** `DESIGN_BRIEF.md`, `COLLECTION_STATUS.md` (`editable_draft` / coming), `content.demo.json`,
  `assets/gpt/GPT_PROMPTS.md` (PAKET 5: 18 parça — kapılar, kapı çerçevesi, avlu, kart (#00FF00 kemer pencere), fener, zemin,
  doku, 4 zellige, kemer çerçeve, yatay çerçeve, bougainvillea ×2, ayırıcı, accent, web_hero; PAKET 2: 5 foto; PAKET 6: ön/arka
  5×7 1500×2100 + A5 1748×2480 @300 ppi; her biri tam yol + ölçü + saydamlık; `build_images.py` / `build-print-assets.ts`
  komutları), `package/listing/listing_v3.md` (taslak, K41 yayımlanmadı; fiyat `[PRICE]`).
- **Basılı davetiye (G139):** `lib/print/layouts.ts` `composed` — iki yüz 05'in fildişi sıvası (tam boy), ön yüzde üstte ve
  altta, arkada üstte beş karoluk zellige satırı; mürekkep sedir. `public/print/riad-lantern-nights/` üretildi.
- **Kayıtlar (eklemeli):** `config.ts` coming, `designs.ts` metinleri + stiller (classic, destination; açılış nesnesi `door` —
  panelde "Button after the door opens"), `marketing/i18n.ts` `door`, ses (`tap 0 · whoosh 300 · slide 1900 · chime 3100`),
  demo pini Marrakech, `katalog.py` `EK_TEMALAR` satırı (6 eksen + `hareket`) + `ek_ayirt()` (`kontrol`: D'nin 20'sine ve
  birbirine ≥ 4 eksen, hareket imzası tekil — geçti), "coming" listesi testleri (g085/093/094/097), g138 tema sayısı 23.
- **Diller (G144):** yeni metinler TR/ES/DE/FR: site 2, panel 9 (kapı sözcüğü), market 12 + `door`, düğün sözlüğüne demo
  program satırları ve "Evening attire".
- **theme-check düzeltmesi (paylaşılan):** "details without links: dead buttons" denetimi G127 harita bloğunun kendi
  düğmelerini ("Show map", yol tarifi — yer adından çalışır, `urls.map` gerekmez) ölü sayıyordu; `[data-map]` içi düğmeler
  hariç tutuldu. Bu, harita pini olan her temayı etkileyen eski bir yanlış pozitifti.

### Komutlar + sayılar (Linux, Node 22)
- `theme-check --theme riad-lantern-nights --stress --compare none`: **112 geçti, 0 hata**, 1 uyarı (PAKET 2 yok → 03 örnek
  fotoğrafları). İlk görünüm DPR 3: index **374 KB**, home **211 KB** (fotoğraflı 464 / 749 KB). Açılış MP4'ü üretildi
  (`previews/g165/opening_390x844.mp4`, repoya konmadı). İlk koşulardaki hatalar giderildi: RSVP'de fener hâlesi taşması,
  home ilk sahnesi, 375×553'te Replay ve kart, uzun isimler (kartta tek satır, 30 px altına küçülmez, sarar).
- `g051-browser --theme`: 44/44 · `final-smoke --theme`: 45/45.
- `tests/theme-riad-lantern-nights.test.ts`: 13/13. `katalog.py kontrol` geçti.
- `npm ci && rm -rf .next && npx tsc --noEmit && I18N_STRICT=1 npm test && npm run build`: typecheck ✓, **1396/1398** geçti (0 hata, 2 atlanan), build ✓ (trace-check 24 tema). `tools/tests/test_etsy_upload.py`: 4/7 — 3 test (`opening_object`, `real_listings`, `check_exit`) değişikliklerim geri alınmış tabanda da aynı hatayla düşüyor ("no opening sentence for 'olive-ivory'", designs.ts ayrıştırması; bu görevden önce var).
- 390 px görüntülerine (kapalı/açılış kareleri, home, story, details, rsvp, yanıt gönderildi, teşekkür modu, zorlama kaydı,
  375×553, 360×640, 1280) gözle bakıldı.

### GPT'yi bekleyen
PAKET 5'in 18 parçası, PAKET 2'nin 5 fotoğrafı, PAKET 6'nın 4 baskı zemini (`GPT_PROMPTS.md`). Gelince: `build_images.py`
gerçek kesime (kapı dikişi, önde sabit kemer çerçeve, kemer maskeleri — story pencereleri ancak o zaman kemer olur),
`layouts.ts` kart parçalarına, demo kaydı örnek fotoğraflara geçer; sonra göz kontrolü + `live` kararı, ilan görselleri/video,
START HERE.

### Bilinçli sapmalar / sınırlar
- W1 comp yok (tasarım docs/24'ten kodla kuruldu) → comp öğe haritası ve qa-kontrol karşılaştırma kapısı yok.
- Foto pencereleri `frame_arch` gelene kadar dikdörtgen (CSS ile kemer çizmek yasak, docs/11 §5.6); geçici kanatlar oymasız.
- Karolar kaynak boyutunda 76 px (büyütme yok). `DEV_CONTENT`/`devRender` yok (21, 22 gibi).
- `docs/09_TASARIM_KATALOGU.md` yeniden üretilmedi (`katalog.py belge` 20 tasarımın tamamını yeniden yazar; entegratöre).

**Denenmedi:** gerçek iPhone/Safari ve Android Chrome, Vercel yayını (görev dışı), gerçek alıcı fotoğrafları, yavaş ağ.

## Günlük
- 2026-10-17 açıldı ve alındı: claude-G165 (koordinatör isteği)
- 2026-10-17 bitti, incelemeye gönderildi
