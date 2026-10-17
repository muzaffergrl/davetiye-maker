---
id: G134
baslik: Entegrasyon — G126 kaydı, G127 demo pini, G096 düzeltmeleri (G135), 21 Crimson Rose Atelier; Nocturne / React Bits / ilan 9–10 incelemesi
rol: claude-kod
durum: inceleme
alan: claude-G134
oncelik: 1
bagimli: [G126, G127, G133, G135]
yazar: [gorevler/G134-entegrasyon.md, gorevler/G135-g096-duzeltmeler.md, docs/19_ALICI_YOLCULUGU.md, platform/lib/admin/messages.ts, platform/lib/claim/claim.ts, platform/lib/claim/demo-map.ts, platform/tests/g121.test.ts, platform/tests/g121-browser.ts, platform/tests/g127-maps.test.ts, platform/tests/g135-live-fixes.test.ts, platform/themes/crimson-rose-atelier/img/manifest.json, platform/app/(marketing)/layout.tsx]
---

## Amaç
Koordinatör adına beş dalı main'e (`8d51815`) sırayla birleştirmek (`g134-entegrasyon` dalı; push yok), iki dalı yalnız
karşılaştırmak. Hız öncelikli: typecheck + değişen alanların birim testleri + sonda bir kez `npm test` ve `npm run build`.

## Sonuç (2026-10-17, claude-G134)
**Dal:** `g134-entegrasyon` (taban `origin/main` `8d51815`). Push ve deploy yok.

1. **`claude/g126-ses`** (`5149f1a`) — çakışmasız; yalnız görev kaydı.
2. **`claude/g127-harita`** (`b71e51f`) — çakışmasız; demo sayfasında şehir merkezi pini.
3. **`claude/g096-ux-fixes`** (`6a1845f`, eski taban `edabe77`) — tek metin çakışması (docs/19 §4.6 kural 5: main'in "yanıt süresi
   24 saat" kararı + G098'in süresiz `publish_blocked_pending` notu birlikte). Kimlik **G098 → G135** (`gorevler/G135-g096-duzeltmeler.md`,
   `tests/g135-live-fixes.test.ts`, kod yorumları; commit mesajları değişmedi). Main'e uyarlama: G121'in beş K42 şablonunun İngilizce
   notları `NOTES_TR`'ye Türkçe eklendi (yoksa admin'de notsuz kalırdı); G121'in "elle doldurulan politika" testi (birim + tarayıcı betiği)
   artık `date_moved` `[POSTPONEMENT POLICY]` ile — `publish_blocked_pending` artık kopyalanabilir.
4. **`codex/crimson-rose-atelier`** (`d41daf7`) — iki çakışma: `draftFromDemo` (G135 saat dilimi + Crimson'un örnek medyayı temizlemesi,
   ikisi de) ve `g127-maps` testi (main'deki demo-pin testi korundu). Eklenenler: `DEMO_CITY_PINS`'e Crimson (Como; testin "her temaya bir pin"
   şartı), tema `img/manifest.json` (og + favicon; yoksa `trace-check` 32 sorunla **build'i düşürüyordu**). Tema kontrolü aşağıda.
5. **`codex/nocturne-lake-estate`** — birleştirilmedi; değerlendirme aşağıda.

**Ek:** yerel `claude/g089-react-bits` dalından yalnız satış sitesinde Archivo `display: 'optional'` (/designs CLS 0,048 → ~0,003 ölçümü o
daldan; burada yeniden ölçülmedi) uygulandı. Gerisi uygulanmadı (aşağıda).

### Crimson Rose Atelier (21) — hızlı tema denetimi
- `final-smoke --theme crimson-rose-atelier`: **45/45** (zarf → home → story → details → RSVP yanıtı kaydı; /start → panel → foto →
  yayın → QR → alıcı sitesinde yanıt panelde). Paylaşılan RSVP, müzik kaydı (`DESIGN_SOUND`), harita bloğu (`data-map` + demo pini),
  teşekkür modu (tema testi) çalışıyor.
- `theme-check --stress`: **36 geçti, 109 hata, 35 uyarı** (çoğu tekrarlı). Kümeler: (a) `theme.json` "copy" listesi şablonlarla uyuşmuyor
  (15; `scripts/copy-manifest.ts` koşulmamış — panelde kullanılmayan metinler, `details_title` yok → details `<title>` "… ·" ile bitiyor);
  (b) zarf sözleşmesi eksik: `.replay` yok, açılınca "Tap to open" kalıyor, home'da `[data-scene]`/`invite-card` view-transition yok,
  RSVP'de "Replay the envelope" linki yok, açılış akışı tıklaması zaman aşımı; (c) home'daki yatay "memory-strip" albüm şeridi ekran dışı
  metin sayılıyor (tasarım gereği kaydırmalı; standart dışı); (d) `[data-slot]` işaretleri ve countdown `data-target-utc` yok (sayaç görünür
  çalışıyor); (e) RSVP soru etiketinde "(optional)" etikete gömülü; (f) zarfta metin boyalı dekor kenarında. Ciddi ama düzeltilmedi (görev
  kapsamı: raporla).
- 390 px gözle (`index/home/story/details/rsvp`): tasarım temiz ve okunur; taşma yok. Details'te sabit ses düğmesi tam sayfa görüntüde
  mekân satırının üstüne düşüyor (yalnız görüntü yakalama konumu olabilir; telefonda bakılmalı).
- Satış durumu `coming` kalır; satışa çıkmadan önce (b) ve (a) kapanmalı.

### Nocturne Lake Estate (22) — birleştirilmedi
1. Durum: `drafts/` altında taşınabilir tek dosya demo + kaynak; platform kataloğuna, `DESIGN_SOUND`'a, `designs.ts`'e, demo pinine kayıtlı değil;
   tema testi (`tests/theme-*.test.ts`) yok.
2. Motor sözleşmesi büyük ölçüde var (35/35 içerik kontrolü, beş sayfa, `data-map`, RSVP `/rsvp/form.js`, teşekkür modu).
3. Zarf tek görsel (`envelope.webp`) olarak "release" animasyonuyla açılıyor: K23 / AGENTS şart 4 (nesneler ayrı hareket eder) karşılanmıyor;
   flap/mühür/kart ayrı GPT parçası yok. GPT kaynağı yalnız 3 PNG (W1 comp + W2 parçaları + PAKET 2 fotoğraf seti yok).
4. Standart dosyalar eksik: tema README, `build_images.py`, `img/manifest.json`, `thank-you.css`; og/favicon yanlış yerde (`og.jpg`,
   kök `favicon.png`) → Crimson'daki gibi `trace-check` build'i düşürür. `.replay`/`[data-scene]`/view-transition yok.
5. Tahmin: platform teması olmaya **orta mesafe** — tasarım ve içerik bağları hazır; zarf parçaları (GPT), standart dosyalar, kayıtlar ve testler gerekir.

### React Bits (yerel `claude/g089-react-bits`) — karşılaştırma
Main'deki bulut G089 (`components/fx/MotionRoot.tsx`, `fx.css`, `panel-fx.css`, `ShinyText`, `Confetti`) aynı işleri yapıyor: kaydırmada
belirme, imleçle derinlik/eğim, panelde görünüm geçişi. Yerel daldaki `RevealOnScroll`, `DepthTilt`, `useViewFade` ikisi birlikte
çalışırsa **efekt tekrarı** olur (bölümler iki kez gizlenip belirir, kart iki katman eğilir, panel iki kez söner). Main'de olmayan tek
parça `StaggeredText` (H1 kelime kademesi): ShinyText ve hero sırasıyla çakışma riski + Archivo optional şartı yüzünden önerilmez.
Uygulanan: Archivo `optional`. Dal kapatılabilir.

### İlan görselleri 9–10 (`claude/dazzling-goldberg-y08us2`)
Dalın son hâli: eski `images/` setindeki 9 "What you can change" ve 10 "Good to know" geri çekildi (main'in editoryal setinde `04_edit`
zaten "neleri değiştirebilirsiniz"i taşıyor); yerine editoryal sete **9. "Good to know"** (yalnız 01–05). Biçim docs/21 ile tutarlı
(kâğıt + yazı, roma rakamları, saç çizgisi); iddialar `listing_v3` ile aynı (12 ay, 3 isim/tarih değişikliği, edit linki e-postayla
gelmiyor, isteğe bağlı şifre, teşekkür sayfası). Sorunlar: 03 Blush'ın 9. görselinde kâğıt dokusu yok (228 KB, düz zemin; diğerleri ~3,5 MB);
`tools/listing_editorial.py`/docs/21 main'de G131 ile değişti, dal eski tabanda. Öneri: değer — alıcının satın almadan önce sorduğu soruları
tek karede topluyor; 20 tasarıma main'deki güncel `listing_editorial.py` ile yeniden üretilerek yayılmalı (dal birleştirilmeden), Blush
dokusu düzeltilmeli. "Edit linki e-postayla gelmiyor" iddiası e-posta özelliği gelirse görselden de kalkmalı.

**Testler (Linux, Node 22):** `npm run typecheck` ✓; değişen alanların birim testleri ✓ (89 + 12); `npm run build` ✓ (trace-check 22 tema;
manifest'ten önce 32 sorunla düşüyordu); `npm test` **1261/1261 geçti**, 0 hata, 0 atlandı; Crimson `final-smoke` 45/45, `theme-check --stress`
36 geçti / 109 hata / 35 uyarı (yukarıda). Çalıştırılmayan: `tests/g121-browser.ts` (değişen betik), canlı ortam.

## Günlük
- 2026-10-17 açıldı ve alındı: claude-G134 (koordinatör isteği)
- 2026-10-17 bitti, incelemeye gönderildi
