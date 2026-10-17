---
id: G167
baslik: Yeni tasarımlar 23–28 — GPT görselleri gelmeden QA + düzeltme (prompt eksiksizliği, bırak-çalıştır provası, hareket/bileşen denetimi)
rol: claude-qa
durum: inceleme
alan: claude-G167
oncelik: 1
bagimli: [G161, G162, G163, G164, G165, G166]
yazar: [platform/themes/velvet-jewel-box/, platform/themes/grand-theatre-premiere/, platform/themes/orient-express-voyage/, platform/themes/kintsugi-washi/, platform/themes/riad-lantern-nights/, platform/themes/maison-patisserie/, collections/23_Velvet_Jewel_Box/, collections/24_Grand_Theatre_Premiere/, collections/25_Orient_Express_Voyage/, collections/26_Kintsugi_Washi/, collections/27_Riad_Lantern_Nights/, collections/28_Maison_Patisserie/, platform/tests/theme-velvet-jewel-box.test.ts, platform/tests/theme-grand-theatre-premiere.test.ts, platform/tests/theme-orient-express-voyage.test.ts, platform/tests/theme-kintsugi-washi.test.ts, platform/tests/theme-riad-lantern-nights.test.ts, platform/tests/theme-maison-patisserie.test.ts, platform/lib/print/layouts.ts, platform/public/print/, platform/scripts/build-print-assets.ts, tools/gpt_kuru_deneme.py, tools/kit_check.py, tools/tests/test_kit_check.py, gorevler/G167-yeni-tasarim-qa.md]
---

## Amaç
Koordinatör (session_01HP9ZrJ8mhZnigbvsvUQ4pR) isteği: 23–28 "coming" temaları geçici katmanlarla çalışıyor. Sahibi GPT görsellerini
üretip `GPT_PROMPTS.md`'deki yollara bıraktığında her şey ilk denemede çalışsın; hareket ve bileşenler gerçekten ayrı ve cilalı olsun.
Dal `claude/g167-yeni-tasarim-qa`; PR/yayın/merge yok. Her tasarım ayrı bir alt ajanla (ayrı port) denetlendi, ortak işler ve
son doğrulama koordinatör oturumunda.

## Sonuç (2026-10-17)

### Ortak araçlar
- **`tools/gpt_kuru_deneme.py` (yeni) — bırak-çalıştır provası.** Repoyu geçici köke kopyalar (koleksiyonlar sembolik bağ, hedef
  koleksiyon + tema + platform kopya), `GPT_PROMPTS.md`'deki her `**Kaydet:**` yolunu doğru ölçü/şeffaflıkta nötr deneme görseliyle
  doldurur (prompt bloğunda `#00FF00` varsa düz yeşil pencere; şeffafta kenar şeridi tam şeffaf), temanın `build_images.py`'sini
  (denetim kancası `sitecustomize` ile alt süreçler dahil hangi parçayı okudu) ve `build-print-assets.ts --theme`'i koşar; sayfaların
  istediği her `img/…` üretildi mi (yorumlar hariç), okunmayan prompt'lu parça / prompt'suz okunan parça, manifest'te "interim" notu
  kaldı mı; `--theme-check [--stress]` ile kopyada theme-check. `--sekil` JSON'u (her koleksiyonda `assets/gpt/kuru_sekil.json`)
  parça başına kutu/pencere yüzdesi, `ton`, `gren`, `tohum` (aynı tuvalde üst üste parçalar için aynı piksel). Repo değişmez,
  deneme görselleri hiçbir yere yazılmaz (geçici kök sonunda silinir).
- **`tools/kit_check.py`:** tek Kaydet satırında birden çok dosya (`tile_1.png`, `tile_2.png` …) artık hepsi ayrı denetleniyor
  (önce yalnız ilki: 27'nin tile_2–4 + bougainvillea_br, 26'nın gold_flake_2–3 hiç denetlenmeyecekti). Eski koleksiyonların listesi
  değişmedi (karşılaştırıldı); `tools/tests/test_kit_check.py`'ye test.
- **`platform/scripts/build-print-assets.ts`:** PAKET 6 zeminleri geldiği hâlde `layouts.ts` hâlâ composed düzendeyse uyarır.

### Tasarım × denetim

| Denetim | 23 Velvet | 24 Theatre | 25 Orient | 26 Kintsugi | 27 Riad | 28 Maison |
|---|---|---|---|---|---|---|
| Prompt eksiksizliği (yol, ölçü, alfa, yazı yok, yetim yok) | düzeltildi (4 yetim ertelendi, A5 çifti tekleşti) | düzeltildi (+W2.7b card_plain) | düzeltildi (opak etiketleri, A5 çıktı) | düzeltildi (Kullanım notları, baskı adları 23/24/25/28 ile aynı) | düzeltildi (baskı tek zemin/yüz, yüzdeler) | düzeltildi (2 dekor ertelendi) |
| PAKET 2 tek kurgu çift, gerçek kişiye benzemez | ✓ Isabelle & Julian | ✓ Charlotte & Theodore (2.2 palet çelişkisi düzeltildi) | ✓ | ✓ Naomi & Kai | ✓ | ✓ |
| Prova öncesi | build GPT kolunda 6 dosya adı kayıyordu, pencere keylenmiyordu | **GPT kolu yoktu** | kayış/bilet hizası sabit kutuya göre | 11/14 parça okunmuyordu | **GPT kolu yoktu** | build çıkış 1, `shelf-1200` yok, 2 yetim |
| Prova sonrası (`gpt_kuru_deneme`) | GEÇTİ 7/9 | GEÇTİ 14/18 | GEÇTİ 16/18 | GEÇTİ 12/14 | GEÇTİ 18/20 | GEÇTİ 14/16 |
| Okunmayanlar | yalnız PAKET 6 (bilerek elle) | yalnız PAKET 6 | yalnız PAKET 6 | yalnız PAKET 6 | yalnız PAKET 6 | yalnız PAKET 6 |
| Geçici çıktı değişmedi | ✓ (bayt aynı) | ✓ (+card_plain) | ✓ | ✓ | ✓ (+tile_4, tile_N-152) | ✓ |
| Sahne yüzdeleri CSS = manifest (build yazar, test sabitler) | ✓ yeni | ✓ yeni | ✓ yeni | parts.css | ✓ yeni | — (tam tuval katmanlar) |
| Açılış süresi (dokunuş → home) | 3,85–3,9 s (MOTION ile uyumlu) | 3,67–3,76 s | 3,24–3,43 s | 4,2–4,4 s | ≈ 3,75 s | 3,74–3,78 s |
| Takılma (long task, açılış) | 0 | 0 (home yükü 69 ms bir kez) | 0 (4× CPU'da 56 ms bir kez) | 0 (GPT modunda 1280'de 83–100 ms 3 kare, headless) | 0 | 0 (yükte ≈60 ms bir kez) |
| `prefers-reduced-motion` | ✓ 263 ms → home, karusel = kaydırıcı | ✓ 153 ms | ✓ 171–240 ms | ✓ 260–560 ms | ✓ 180 ms | ✓ ≈200 ms, raf = liste, inci yok |
| Klavye / odak / sıra | düzeltildi (son fotoda odak body'ye düşüyordu → aria-disabled; sayaç live region) | ✓ perde Enter/Space, spot kartları | düzeltildi (etiket odakta sallanır, scroll-padding) | ✓ | ✓ hikâye görüntüleyici Esc ile odak geri | düzeltildi (alt menü arkasında odak, çip halkası, gereksiz Tab durağı) |
| Dokunma hedefi ≥ 44 px (tema) | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Yatay kaydırma | 0 | 0 | 0 | 0 | 0 | 0 |
| Uzun isim (stress) | ✓ | düzeltildi (perde sayfası tarih satırı; home kartı kısa ekran) | düzeltildi ("Tap to unbuckle" ekran dışı; bilet taşması) | ✓ | düzeltildi ("Tap to open" 360×640'ta ekran dışı) | ✓ |
| Ses kancaları | ✓ ipuçları MOTION'da | ✓ istekler izlendi | ✓ | ✓ | ✓ | ✓ |
| RSVP + özel efekt | ✓ + yeni: saten ışık + varak "Thank you!" | ✓ koçan yırtılır, "Send another" geri koyar | ✓ biniş damgası | ✓ altın pullar (GPT pulları gelince) | ✓ + yeni: fener parlaması, GPT accent'iyle 3 bract | ✓ 18 şeker inci, RM'de 0 |
| Harita bloğu | ✓ düğmeler (açılış denenmedi) | ✓ | ✓ iframe açıldı | ✓ düğmeler | ✓ iframe | ✓ iframe — **pin yanlış şehirde** (aşağıda) |
| TR / DE | ✓ | ✓ (`host_line` içerik alanı, panel çevirisi işi) | ✓ | ✓ | ✓ (sunucu çıktısı; tarayıcıda değil) | ✓ |
| Ayırt edicilik | menteşe 3B + saten süpürme + silindir karusel | perde + spot + sayfa çevirme + koçan | kayış + kitap kapağı + kaydırmayla çizilen rota | dört kat origami + mürekkep maskesi; ortak "yükselme" sahne adımı "mürekkep sızması"na çevrildi | içe açılan kapılar + fener; fener titreşimi filter→opacity/scale (CPU 0,14→0,015 s/5 s) | üstten kutu, fiyonk çözülür, kâğıt perde, raf |

### Son doğrulama (koordinatör, Linux, Node 22)
- `cd platform && npm ci && rm -rf .next && npx tsc --noEmit` ✓ · `I18N_STRICT=1 npm test` **1524/1526** (0 hata, 2 eski atlanan) ·
  `npm run build` ✓ (trace-check 29 tema).
- `theme-check --theme <id> --stress --compare none --no-video` (gerçek repo, geçici görsellerle): altısı da **111 geçti, 0 hata**.
  Uyarılar: PAKET 2 yok → 03'ün örnek fotoğrafları (hepsi); 25'te 11, 26'da 60 "Google font not loaded" (test makinesinin ağı).
- `gpt_kuru_deneme.py --tema <id> --sekil …/kuru_sekil.json` altısı **GEÇTİ** (yukarıdaki sayılar). Alt ajanlar ayrıca `--theme-check
  --stress` ile provayı koştu: 24, 25 (koyu ton), 26, 27 0 hata; 23 ve 28'de kutu sayfasındaki 8–10 "text over painted decor"
  hatası nötr gri deneme zemininden — koyu/sakin `ton` verilince 23 0 hata.

### PAKET 6 (basılı zeminler) — kendiliğinden geçmez
Composed düzenden zemin düzenine geçiş G149 gereği metin kutularının gerçek resim üstünde yeniden ölçülmesini ister; otomatik
yapılmadı. Her tasarımda: prompt'lar `layouts.ts` metin kutularını boş bırakacak yüzdeleri söylüyor; `GPT_PROMPTS.md` "PAKET 6
gelince" ve `layouts.ts` bloğunun yorumu tam adımları veriyor (kaynaklar → iki zemin, `composed` → `cover('front'/'back')`, kutuları
ölç, `build-print-assets`, g149 testi). Ölçüler tekleşti: tek zemin/yüz (A5 `cover` ile ≈%1 kırpar). `build-print-assets` gelen
ama kullanılmayan zemin için uyarır.

### Kapsam dışı / açık kalanlar
- **28 harita pini:** demo mekân Newport, RI; pin Savannah, GA. `lib/claim/demo-map.ts`'te 28 kaydı yok; G167 `lib/claim/*`'a
  dokunmuyor. Önerilen satır: `'maison-patisserie': { lat: 41.4901, lng: -71.3128 }`.
- **Platform dil seçici** (`public/static/lang.css:12,31`): summary 36 px, menü linkleri 40 px — bütün temalarda < 44 px.
- **Bütün temalar:** sabit alt menü için `scroll-padding` yok (odaklanan öğe menünün arkasında kalabilir); 25 ve 28 kendi
  temalarında düzeltti, diğer 22 tema kapsam dışı.
- **`tools/tema_build.py:320-324` `yesil_gorunur`:** ton testi koyu fıstık/zeytin yeşillerinde de tetikleniyor; gerçek GPT görseli
  build'i haksız yere durdurabilir. 27 ve 28 yalnız pencereli dosyada / saf #00FF00'a yakın denetliyor; ortak fonksiyon başka
  temaları etkilediği için değiştirilmedi.
- **24 W2.7b `card_plain.png`** fazladan bir GPT görseli: home kartı pencerede foto olmadan da düzgün dursun diye. İstenmezse
  alternatif (pencereye foto) kısa ekran + uzun isimde sığmıyordu.

### Yalnız gerçek GPT görseliyle anlaşılacaklar
Eklem/menteşe/dikiş ölçümleri (23, 25 toka, 27 kapı dikişi; düşüş yolları uyarıyla var), yeşil anahtarlamanın temizliği, kart
pencerelerinin altında uzun isimlerin sığması, `bg_page`/istasyon zemini üstünde metin okunurluğu (23/25/28 build'leri uyarır),
23'te açık kapakla sahne oranı (provada 1,06 → 0,83; theme-check geçti, göz kontrolü gerek), 26 damar parıltısı/mürekkep maskesi,
28 fiyonk düğümü ve kurdele kolları, PAKET 6 metin kutuları; genel görünüm → ancak sonra `coming` → `live`.

### Denenmedi
Gerçek iPhone/Android, Safari/Firefox, sesin gerçekten duyulması, yavaş ağ, ekran okuyucu, Vercel yayını, gerçek GPT parçaları
ve fotoğrafları, gerçek zeminlerle basılı PDF; `g051-browser` / `final-smoke` bu turda koşulmadı.

## Günlük
- 2026-10-17 açıldı ve alındı: claude-G167 (koordinatör isteği); altı alt ajan (tasarım başına) + ortak araçlar
- 2026-10-17 bitti, incelemeye gönderildi
