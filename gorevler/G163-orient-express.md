---
id: G163
baslik: Yeni tasarım 25 Orient Express Voyage — platform teması (GPT parçalarından önce), koleksiyon, GPT prompt'ları, coming kaydı
rol: claude-kod
durum: inceleme
alan: claude-G163
oncelik: 1
bagimli: [G138, G139, G142, G144]
yazar: [platform/themes/orient-express-voyage/, collections/25_Orient_Express_Voyage/, platform/tests/theme-orient-express-voyage.test.ts, platform/tests/g085-designs.test.ts, platform/tests/g093-designs.test.ts, platform/tests/g094-designs.test.ts, platform/tests/g097-designs.test.ts, platform/tests/g138-extras.test.ts, platform/lib/marketing/designs.ts, platform/lib/marketing/config.ts, platform/lib/audio/catalog.ts, platform/lib/claim/demo-map.ts, platform/lib/print/layouts.ts, platform/public/print/orient-express-voyage/, platform/lib/i18n/dict/site/, platform/lib/i18n/dict/market/, tools/katalog.py, gorevler/G163-orient-express.md]
---

## Amaç
Koordinatör (session_01HP9ZrJ8mhZnigbvsvUQ4pR) isteği, `docs/24_YENI_TASARIMLAR.md` satır 25: kapalı nesne deri bilet cüzdanı
(kayış çözülür, cüzdan açılır, birinci sınıf bilet kayar), vagon penceresi fotoğrafları, pirinç/bagaj etiketi/harita/istasyon
saati, litografi seyahat afişi, Limelight + Cormorant Garamond, şişe yeşili-pirinç; hareket imzası: rota çizgisi kaydırmayla
çizilir, istasyonlar sırayla, sallanan etiket, biniş kartı damgası. GPT parçaları olmadan tam tema standardında tema + koleksiyon
+ prompt'lar + basılı davetiye düzeni + coming kaydı + Etsy taslağı. Dal `claude/g163-orient-express`; main/PR/deploy yok.

## Sonuç (2026-10-17, claude-G163)

### Tema `platform/themes/orient-express-voyage/` (coming)
- 5 sayfa tema standardında: kapalı nesne = **deri bilet cüzdanı** (kendi tip "cuzdan"): kayış ikiye ayrılıp kayar (0–700 ms),
  kapak sol menteşede −180° döner (iç yüzü ayrı parça; 600–1500), açık cüzdan `--open-scale` ile ekrana sığar ve ortalanır,
  bilet cepten yukarı kayar (1500–2600), öne ve ortaya gelir (2600–3000), home'a VT `invite-card` (3100). Dokunuştan home'a
  **3,2–3,4 s** (theme-check 3232 ms; yerel ölçüm 3419 ms). Ses: clasp 0 · page 600 · slide 1500 · chime 2600 (Evening Strings).
- Hareket imzası: rota çizgisi GPT haritası üstünde arayüz SVG yolu (`pathLength=1`, dash offset) — CSS scroll-driven
  (`view-timeline`), JS yedeği `--route`; details'te harita yapışkan, istasyonlar (program satırları) tek tek gelir, çizgi son
  istasyonda biter; home'da ilk 4 istasyon sırayla; bagaj etiketi (RSVP + son tarih) görününce sallanır; vagon pencerelerinde
  foto kaydırmayla ±%7 kayar (manzara); RSVP biniş kartında gönderimde damga basılır. Azaltılmış harekette hepsi sabit.
- Platform: G138 (blocks, travel, menü), G127 harita (demo pini Venice), G126 ses, G128 RSVP + G069 misafir adları + G051
  sorular, G075 teşekkür modu (`thank-you.css`), G068 copy manifesti (88 anahtar, 5 temaya özel), G144 site + market
  sözlüklerine TR/ES/DE/FR çeviriler (26 + 11 metin), og + favicon, CSP: yalnız `site.js` + `/rsvp/form.js`.
- **K21 / geçici görseller:** GPT parçası yok; `build_images.py` her parça için GPT dosyası varsa onu, yoksa düz palet tonu
  (yumuşak ışık düşüşü; şekil/çizgi/doku çizilmez) üretir; `img/manifest.json` → `interim` 16 parçayı listeler. Vagon
  çerçevesi geçici olarak şeffaf. Tema klasörü 0,1 MB.

### Koleksiyon `collections/25_Orient_Express_Voyage/`
`DESIGN_BRIEF.md`, `COLLECTION_STATUS.md` (editable_draft / coming), `content.demo.json` (kurgu Amelia & Rafael, Palazzo
Ferrovia, Venice; en-US; URL'ler null; foto yok), `assets/gpt/GPT_PROMPTS.md` (PAKET 5: 16 parça, PAKET 2: 5 foto, PAKET 6:
5×7 1575×2175 + A5 1819×2551 ön/arka, 300 ppi; her biri tam yol + ölçü + şeffaflık; build komutları), `package/listing/listing_v3.md`
(taslak; K41 yayın yok; görsel/video/START HERE yok, VERIFY'lar açık).

### Kayıtlar (paylaşılan dosyalar, eklemeli)
`config.ts` coming `[PRICE]`, `designs.ts` (açılış "Your guests tap the wallet.", stiller classic + destination),
`audio/catalog.ts`, `claim/demo-map.ts`, `print/layouts.ts` (composed: ön = temanın afiş görseli, arka = fildişi + damga;
`public/print/orient-express-voyage/`), `tools/katalog.py` → `EK_TEMALAR` eksenli kayıt + hareket imzası + `ek_ayirt()` (kontrol
geçiyor), testler: yeni `tests/theme-orient-express-voyage.test.ts` (13), coming listeleri (g085/093/094/097), g138 tema sayısı 23.
Demo program/SSS metinleri G150 sözlüğündeki ifadelerle yazıldı (glossary testi).
`scripts/theme-check.cjs`: "details without links" denetimi artık `[data-map]` içindeki düğmeleri saymıyor — G127'den beri
harita bloğu mekândan "Show map"/yol tarifi gösteriyor; denetim **her temada** (01, 22 dahil) yanlış hata veriyordu.

### Kontroller (Linux, Node 22, Chromium /opt/pw-browsers)
- `theme-check --stress --compare none`: **112 geçti, 0 hata**, 13 uyarı (11'i Cormorant Garamond zarf sayfasında yüklenmedi —
  test makinesinin ağı; 1'i "Tap to open" ipucu metni bulunamadı (bizimki "Tap to unbuckle"); 1'i PAKET 2 yok → 03 fotoğrafları).
  İlk görünüm DPR 3: index 190 KB / home 170 KB (yer tutucu), 280 / 467 KB (örnek fotoğraf).
- `npm ci`, `rm -rf .next`, `tsc --noEmit` ✓, `npm run build` ✓ (trace-check 24 tema), `I18N_STRICT=1 npm test` 1398 test:
  **1397 geçti, 1 hata** — `marketing-build`: `/es|de|fr/designs/crimson-rose-atelier` meta açıklaması 180–189 karakter (21
  Crimson'un çevirileri; bu görevin değişikliği değil, `.next` varken koşan testte çıkıyor).
- `python3 tools/katalog.py kontrol` ✓. `tools/tests/test_listing_kit.py` / `test_etsy_upload.py` bu daldan önce de
  kırık ("no opening sentence for 'olive-ivory'": G144 `msg()` sarmalayıcısı regex'i bozuyor).
- 390 px ekran görüntüleri (kapalı, açılış 250/700/1100/1600/2200/2900 ms, home, story, details kaydırma, rsvp, gönderim sonrası
  damga, stres + teşekkür modu) gözle bakıldı; düzeltilen: story başlığı yeşil zeminde görünmüyordu, bilet öne gelince sağda
  kalıyordu (ortaya kayıyor), damga RSVP'de yatay taşma yapıyordu, nav stres metninde taşıyordu, açık cüzdan 375×553'te Replay'i
  ekrandan itiyordu. Görüntüler repoya konmadı.

### GPT'yi bekleyenler
PAKET 5'in 16 parçası (cüzdan kapalı/kayış/kapak içi/iç panel/cep, istasyon zemini, bilet, afiş, harita, bagaj etiketi, istasyon
saati, vagon penceresi, vagon paneli, kâğıt, biniş kartı, damga), PAKET 2'nin 5 fotoğrafı, PAKET 6'nın 4 basılı zemini. Gelince:
`build_images.py`, `site.css` `manifest stage.*` yüzdeleri, `build-print-assets.ts`, göz kontrolü, sonra `live` kararı.

**Denenmedi:** gerçek iPhone/Android, Vercel yayını, gerçek alıcı fotoğrafları, GPT görselleriyle görünüm, ilan görselleri/video.

## Günlük
- 2026-10-17 açıldı ve alındı: claude-G163 (koordinatör isteği)
- 2026-10-17 bitti, incelemeye gönderildi
