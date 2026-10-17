---
id: G162
baslik: Yeni tasarım 24 Grand Theatre Premiere — platform teması (GPT parçalarından önce), coming kaydı, GPT istekleri, basılı davetiye, ilan taslağı
rol: claude-kod
durum: bitti
alan: claude-G162
oncelik: 1
bagimli: [G138, G139, G144]
yazar: [platform/themes/grand-theatre-premiere/, collections/24_Grand_Theatre_Premiere/, platform/tests/theme-grand-theatre-premiere.test.ts, platform/tests/g085-designs.test.ts, platform/tests/g093-designs.test.ts, platform/tests/g094-designs.test.ts, platform/tests/g097-designs.test.ts, platform/tests/g138-extras.test.ts, platform/lib/marketing/config.ts, platform/lib/marketing/designs.ts, platform/lib/audio/catalog.ts, platform/lib/claim/demo-map.ts, platform/lib/print/layouts.ts, platform/public/print/grand-theatre-premiere/, platform/lib/i18n/dict/, platform/lib/i18n/wedding-glossary.ts, platform/scripts/theme-check.cjs, platform/previews/g162/, tools/katalog.py, gorevler/G162-grand-theatre.md]
---

## Amaç
`docs/24_YENI_TASARIMLAR.md` satır 24 (koordinatör session_01HP9ZrJ8mhZnigbvsvUQ4pR): kapalı nesnesi tavus mavisi kadife perde olan
"Grand Theatre Premiere" — tema standardında (docs/11) tam platform teması, GPT parçaları gelmeden çalışır hâlde (Nocturne yaklaşımı),
demo kaydı (kurgu Charlotte & Theodore), koleksiyon belgeleri + bütün görsellerin İngilizce GPT istekleri, G139 basılı davetiye düzeni,
"coming" kaydı, Etsy ilan taslağı. Dal `claude/g162-grand-theatre` (taban `1aa7b20`); main'e push/PR/yayın yok.

## Sonuç (2026-10-17, claude-G162)

### Tema `platform/themes/grand-theatre-premiere/` (README: açılış, sayfalar, geçici parçalar, sapmalar)
- **Açılış (perde):** dokununca iki kanat dikişe doğru nefes alır, başlık kalkar, salon ışıkları kısılır → sol kanat ağır kıvrımlarla
  dış kenarına toplanarak aralanır (aşıp oturur), sağ kanat 140 ms sonra → spot ışığı sol kulisten sahneyi tarayıp program kartına
  oturur → kanatlar toplanmış perdelere el değiştirir ve salınır → kart aydınlanır, sahnenin önüne çıkar → home (VT `invite-card`
  → home'daki program kartı). Arka duvar, iki kanat, iki toplanmış perde, saçak, spot ve kart ayrı katman (tek tuval, `manifest.stage`).
  **Ölçülen: dokun → home 3,6 s** (theme-check 390×844, üç koşu: 3590 / 3605 / 3622 ms); azaltılmış harekette animasyonsuz 126 ms.
- **Story ("perde arası"):** karanlık kadife sahnede kademeli üç kart (sol, sağ, sol; geniş ekranda üçlü), "Scene I–III" (rakam CSS
  sayacı, sözcük `scene_label`). Spot ışığı (yumuşak radyal ışık, `@property --sx/--sy`) Scene I'de durur; dokunma / tıklama /
  klavye odağı ışığı o karta kaydırıp kartı kaldırır (`aria-pressed`), fare ışığı gezdirir, boş sahneye dokunmak ışığı oraya taşır.
- **Details ("The Programme"):** fildişi program kâğıdında akşam perdeler hâlinde (Act I…X, saat, başlık, yer; 1–10 satır), tören
  cümlesi, takvim; mekân (3:2 foto, G127 harita), dress code, G138 blokları / travel / menu, registry, SSS.
- **RSVP ("Reserve your seat"):** ortak form biletin fildişi gövdesinde; delikli çizginin altında koçan ("Admit one", isimler, tarih).
  `rsvp:state` success → koçan yırtılıp düşer; "Send another reply" (ready) geri koyar.
- **Sayfa çevirme:** home ↔ story ↔ details ↔ rsvp arasında her iç sayfanın `<head>` betiği `pagereveal`'da sayfa sırasına göre
  VT türü `turn-next` / `turn-prev` ekler; ileri giderken eski sayfa sol kenarından döner, geri gelirken yeni sayfa üstüne kapanır.
  Çapraz belge VT'si olmayan tarayıcıda yeni sayfa "yaprak gibi oturur" (`turn-fallback`). Diğer 22 tasarımda olmayan hareket.
- Standart işaretleri: 5 sayfa, 5 foto alanı (`hero_portrait`, `story_1..3` 4:5, `venue` 3:2), G051 takvim/SSS/sorular, G069 misafir
  adları, G075 teşekkür modu (`thank-you.css`; foto yoksa pencerede kadife), G068 copy (88 anahtar; tasarıma özgü 6 anahtar `label`'lı),
  G126 ses kancaları (`.stage/.replay/[data-skip]`), G127 harita, G138 blokları, G144 diller, `prefers-reduced-motion`, CSP: yalnız
  `site.js` + `/rsvp/form.js`. Fontlar Abril Fatface + Playfair Display (Google Fonts, latin-ext). `site.css` 27 KB, `site.js` 13 KB,
  klasör 0,8 MB.
- **Geçici parçalar (K21, çizim yok):** GPT parçası yok; `build_images.py` repodaki iki GPT dokusunu kırpar / tonlar / aynalar:
  06'nın kadife karosu (tavus mavisine duotone) → perde kanatları, saçak bandı, sahne içi, sayfa zemini, yer tutucular; 21'in fildişi
  kâğıdı → program kartı, program sayfaları, bilet koçanı; og + favicon bunlardan montaj. Sahne şu an düz kadife bloklar (kıvrım,
  saçak püskülü, altın kemer yok) — hareket, katmanlar ve sayfa sözleşmeleri nihai; parçalar gelince aynı dosya adlarına geçer.

### Koleksiyon `collections/24_Grand_Theatre_Premiere/`
`DESIGN_BRIEF.md`, `COLLECTION_STATUS.md` (`editable_draft`, coming), `content.demo.json` (= tema kopyası; kurgu Charlotte & Theodore,
The Larkmont Grand Theatre — kurgu mekân, Richmond, Virginia; October 16, 2027; URL'ler null; medya null), `assets/gpt/GPT_PROMPTS.md`
(PAKET 5 W2.1–W2.13: proscenium #00FF00 açıklıklı, kapalı/açık perde kanatları ×4 aynı tuvalde ve ölçülerle, sahne içi, program kartı
#00FF00 pencereli, kadife ve kâğıt karoları, bilet koçanı, salon zemini, püskül, web_hero; PAKET 2 2.1–2.5 kurgu çift, gerçek kişiye
benzemez; PAKET 6 P1–P4 5×7 1575×2175 ve A5 1819×2551 ön/arka zemin, 300 ppi; tam yollar, şeffaflık, `build_images.py` +
`build-print-assets` komutları, "Claude'un kesimi"), `package/listing/listing_v3.md` (taslak, K41: yayımlanmadı; başlık 118
karakter, 13 etiket ≤ 20, "envelope" yok — `etsy_upload` kurallarıyla elle denetlendi).

### Basılı davetiye (G139)
`lib/print/layouts.ts` → `grand-theatre-premiere` composed: fildişi program kâğıdı, ön yüzde üstte ve altta, arka yüzde üstte kadife
bandı (temanın kestiği GPT dokuları; `public/print/grand-theatre-premiere/{paper,velvet}.webp`); metin kutuları bantların dışında
(`front [19,12,15,12]`, `back [17,12,8,12]`). 5×7 bleed + kesim işaretli ve A5 PDF üretilip gözle bakıldı (2 sayfa, QR arkada).
PAKET 6 gelince `card`/`back` kaynaklarına geçer.

### Kayıtlar (paylaşılan dosyalarda yalnız ekleme)
- `lib/marketing/config.ts` **coming** (`[PRICE]`), `lib/marketing/designs.ts` metinleri (açılış nesnesi "curtain") + stil `classic`,
  `lib/audio/catalog.ts` (Evening Strings; tap 0 · whoosh 400 · slide 2000 · chime 2900 ms = `MOTION.envelope` adımları), demo pini
  Richmond, VA.
- `tools/katalog.py` `EK_TEMALAR` satırı: 6 eksen + `hareket` (D'ye girmedi). D'deki 20 tasarımın her biriyle ≥ 5 eksende farklı
  (yalnız 05 ile font ortak: Playfair Display); `python3 tools/katalog.py kontrol` geçti — "ek tasarımlar (docs/24): 3 kayıt, her biri
  D'den ve birbirinden ≥4 eksende farklı, hareket imzası ayrı" (24, 25, 26).
- Testler: "coming" listeleri (g085/093/094/097) Nocturne + Grand Theatre; `g138-extras` tema sayısı 22 → 23; yeni
  `tests/theme-grand-theatre-premiere.test.ts` (15 test: katalog/coming/baskı kaynakları, demo kaydı, demo rotası, copy manifesti,
  perde katmanları + MOTION ↔ CSS zamanları, oturum anahtarları + VT, sayfa çevirme türleri, sahneler/foto alanları/kırık görsel yok,
  K21, spot ışığı, RSVP + koçan, teşekkür modu, içerik değişimi + tam ad yedeği, ses, manifest).
- Diller (G144): yeni tasarım metinleri site (21), panel (9: "curtain" açılış sözcüğü) ve satış (10) sözlüklerine TR/ES/DE/FR; demo
  program etiketleri, SSS ve soru `wedding-glossary.ts`'e (g150). `I18N_STRICT=1` yeşil.

### Ortak araç düzeltmesi (`scripts/theme-check.cjs`) ve koordinatör dalıyla birleşme
- Dal, koordinatör dalının son hâline (`767dc83`: G163 Orient Express + G164 Kintsugi & Washi birleşmiş) **rebase** edildi;
  çakışmalar (config, designs, layouts, ses, pin, sözlükler, katalog, coming listeleri, tema sayısı) ekleme olarak çözüldü:
  coming listesi `nocturne, orient-express, kintsugi-washi, grand-theatre-premiere`, `g138-extras` 25 tema, katalogda 24 artık
  `ek_ayirt` (G163) denetiminde.
- "details without links: dead buttons" yanlış alarmı (seed'deki demo şehir pini → G127 harita düğmeleri) G163 de bulmuş ve
  `[data-map]` ile düzeltmişti; benim `.pmap-place` sürümüm bırakıldı, onunki kaldı.
- Eklenen tek ortak değişiklik: "Tap to open" ipucu sözcükle bulunamazsa `.tap-hint` sınıfıyla aranır (zarf olmayan açılışlar —
  "Tap to raise the curtain" — ölçülsün; önceden yalnız uyarı veriyordu).

### Kontroller (Linux, Node 22, `platform/`)
- (koordinatör dalı `a8ccabf` ile birleşme sonrası: 23 Velvet Jewel Box ve 28 Maison Pâtisserie dahil; coming listesi tasarım
  sırasında, `g138-extras` 27 tema, katalog `kontrol` 5 ek kayıt ≥4 eksen) `npm ci` ✓ · `rm -rf .next && npx tsc --noEmit` ✓ ·
  `I18N_STRICT=1 npm test` **1484 test: 1482 geçti, 0 hata**, 2 atlandı (build çıktısı isteyen iki test); G149 baskı testi 5×7 ve A5
  27 tasarımda geçti · `npm run build` ✓ + trace-check (28 tema) · theme-check `--stress` yeniden 112/0 · g051 44/44 · build'den sonra
  `tests/marketing-build.test.ts` 2/2 (rebase öncesi tabanda Crimson'un ES/DE/FR meta açıklaması 160'ı aşıyordu; koordinatör
  dalında düzeltilmiş). Grand Theatre'nin meta açıklaması 5 dilde 145–156 karakter (live olunca bu test kapsar).
- `theme-check --theme grand-theatre-premiere --stress --compare none`: **112 geçti, 0 hata, 1 uyarı** (PAKET 2 yok → 03 örnek
  fotoğrafları). İlk görünüm (390×844, DPR 3): index 493 KB, home 242 KB (yer tutucu); fotoğraflı index 583, home 535 KB. Açılış
  MP4'ü üretildi (repoya konmadı). İlk iki koşuda bulunanlar düzeltildi: 360 px'te zorlama metinli nav taşması, 375×553'te açık hâlde
  "Replay" ekran dışı, zorlama kaydında 360×640'ta ipucu ekran altı (`fitStage()`: uzun isimde sahne daralır).
- `g051-browser --theme grand-theatre-premiere` 44/44 · `final-smoke --theme grand-theatre-premiere` 45/45.
- `python3 tools/katalog.py kontrol` ✓ · `tools/tests/test_etsy_upload.py` ✓ (24 `DESIGNS`'ta değil: coming).
- 390 px'te bütün sayfalara ve hâllere gözle bakıldı (kapalı perde, açılış kareleri, home, story spot ışığı, details, rsvp, yanıt sonrası,
  teşekkür hâli, zorlama kaydı, 1280 px). Seçilmiş görüntüler: `platform/previews/g162/`.

**Denenmedi:** gerçek iPhone/Safari ve Android Chrome, Safari'de çapraz belge VT türleri (sayfa çevirme), Vercel yayını (görev dışı),
gerçek alıcı fotoğrafları, yavaş ağ, qa-kontrol karşılaştırma kapısı (W1 comp yok), GPT parçalarıyla kesim (`build_images.py` geçici
kaynaklarla çalışıyor; PAKET 5 gelince kaynaklar ve `site.css` yüzdeleri manifestten güncellenecek).

### GPT'yi bekleyen (hepsi `collections/24_Grand_Theatre_Premiere/assets/gpt/GPT_PROMPTS.md`)
PAKET 5: `parts/proscenium.png`, `curtain_left.png`, `curtain_right.png`, `curtain_left_open.png`, `curtain_right_open.png`,
`stage_back.png`, `card_small.png`, `velvet_tile.png`, `playbill_tile.png`, `ticket_stub.png`, `bg_page.png`, `tassel.png`,
`web_hero.png` · PAKET 2: `photos/hero_portrait.jpg`, `story_1..3.jpg`, `venue.jpg` · PAKET 6: `print/invitation_{front,back}_{5x7,a5}.png`.
Gelince: `kit_check --paket 5/2` → `build_images.py` kaynak geçişi → `site.css` manifest yüzdeleri → theme-check → göz kontrolü →
`config.ts` `live` kararı (entegratör).

## Günlük
- 2026-10-17 açıldı ve alındı: claude-G162 (koordinatör isteği)
- 2026-10-17 bitti, incelemeye gönderildi
- 2026-10-17 entegratör onayladı
