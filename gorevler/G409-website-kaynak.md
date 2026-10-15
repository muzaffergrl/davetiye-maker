---
id: G409
baslik: Tasarım 09 Lavender Provence — platform teması
rol: claude-kod
durum: bitti
alan: claude-local-G409
oncelik: 3
bagimli: [G209, G038, G046, G052]
yazar: [platform/themes/lavender-provence/, platform/tests/theme-lavender-provence.test.ts, platform/previews/g409/]
---

## Amaç
Tasarım 09'i platformda tema olarak kurmak (K24, `docs/10_SITE_PLATFORMU.md`): kapalı zarf açılış sayfası → home → story, details, rsvp; yalnız bu tasarımın GPT parçalarıyla (K21), kişisel metin HTML'de. **Kurallar `docs/11_TEMA_STANDARDI.md`'dedir; bu görev metniyle çelişirse docs/11 geçerlidir.**

## Girdiler
- Tema standardı: `docs/11_TEMA_STANDARDI.md` — bütünü; zarf tipi **keten kese** → §7.1 + §7.6; bitti tanımı §13, kontrol listesi §15
- Platform sözleşmesi: `platform/README.md` (işaretler, RSVP form sözleşmesi, `#site-data`); çalışan örnek `platform/themes/blush-garden-rose/` — **yalnız** işaret/RSVP/`#site-data`/oturum anahtarı kullanımı için; yerleşimi, aralıkları, süs konumları ve zamanlaması bu temaya taşınmaz (docs/11 §8). G035 kaynağı (`collections/03_Blush_Garden_Rose/website/`) örnek değildir
- GPT çıktıları (G209): `collections/09_Lavender_Provence/assets/gpt/comps/` (W1, yerleşim referansı, satılmaz; yalnız sade adlar — `_vN` denemedir), `parts/` (katmanlar), `photos/` (örnek fotoğraflar)
- İçerik `collections/09_Lavender_Provence/content.demo.json`, renk `collections/09_Lavender_Provence/palette.json`, özet `collections/09_Lavender_Provence/DESIGN_BRIEF.md`
- Araçlar: `tools/parts_prep.py` (geçici klasöre; docs/11 §5.3), `python3 tools/kit_check.py collections/09_Lavender_Provence --paket 5`, `node scripts/theme-check.cjs --theme <slug>` (G052)

- **G209 açık kusurları:** çerçeve ve küçük kart pencerelerinde yarı saydam/gradyanlı yeşil, yatay çerçeve ortasında alfa boşluğu → pencere kodla tam maske (parts_prep `leke_doldur`); kese hizası UYARI (alt -2,15%, kapanış uçları ~-1,3%) → manifest.stage.align ile düzelt. `story_3_v1` denemedir, kullanılmaz.

## Yapılacaklar
1. `theme.json`, 5 sayfa, `site.css`, `site.js`, `build_images.py`, `README.md` docs/11 §1–§4 düzeninde. 03'ten yalnız platform sözleşmesi alınır (motor işaretleri, RSVP formu, `#site-data`, slug'lı oturum anahtarları, `data-scene`/`data-step`/`data-a` kancaları); yerleşim, tipografi ve hiyerarşi bu tasarımın W1 comp'larından — tema `README.md`'sinde sayfa başına **comp öğe haritası** (her W1 öğesi → şablon öğesi ya da gerekçeli sapma; comp'u olmayan bölümler bu tasarımın parçaları ve tipografisiyle, docs/11 §8).
2. Parçalar: `python3 platform/themes/lavender-provence/build_images.py` → `parts_prep` **geçici klasöre** (`--prep-dir`; tema klasörüne, `img_src/`'ye ya da `assets/`'e asla — docs/11 §1, §5.3–§5.4), tip kesimleri (§7), maskeler, `free_zone`, yer tutucular, og; WebP + srcset genişlikleri (§5.1, §5.5). Yalnız bu tasarımın GPT parçaları; yeni şekil/dekor çizme (K21).
3. Zarf açılışı (`MOTION.envelope`, keten kese, docs/11 §7.1 + §7.6): On tap, the jute twine with its lavender bundle unties and slips away, the linen pouch loosens and opens, and the card slides up out of it while dried lavender buds scatter on a summer breeze. Katalog: Ketenden bir kese; sicim çözülür, kese ağzı açılır, kart dışarı kayar. Açılış cümlesindeki sıra, sayı ve yön bağlayıcıdır; kapanış elemanı, zarf/kapak ve kart ayrı katmanlar; kart home'daki karta dönüşür; `closure.png` zarfla aynı tuvalde çizilir, `envelope_closed` üstüne 1:1 oturur.
4. Sayfa koreografisi (`MOTION.scenes`): her sayfada öğeler sırayla girer. Story: Kurutulmuş çiçek basılmış (pressed flower) kartlar, rüzgârla savrulur gibi gelir (three pressed-flower cards tumbling in at loose angles as if carried by a summer breeze, not overlapping); telefonda foto penceresi ≥ 38vw (sığmazsa basamaklı/alt alta düzen, comp sapması olarak yazılır — docs/11 §9). Parçacıklar `MOTION.accents` (§8: tür başına dosya ve yol). Details/rsvp: kart, satırlar ve buton sırayla.
5. Foto alanları: `hero_portrait` (card_small penceresi), `story_1..3` (frame_portrait), `venue` (frame_landscape); kutu ve maske `windows.json`'dan (§5.6, §9). PAKET 2 fotoğrafı yoksa yer tutucu.
6. Fontlar: Alex Brush + Cormorant Garamond (Google Fonts link'i; repoya font dosyası girmez). Tarih motor biçimiyle (`May 15, 2027`). Link blokları `data-if="urls.*"` ile linksiz kalkar — "link will be added soon" diyen ölü düğme yok (§4).
7. Testler ve önizleme (§13): `platform/tests/theme-lavender-provence.test.ts`; `theme-check --theme lavender-provence` (5 genişlik, kısa telefonlar, akışlar, ağırlık, MP4); `platform/previews/g409/` (W1 comp | tema karşılaştırmaları dahil).

## Bitti sayılması için
- [ ] docs/11 §15 kontrol listesi tamam (atlanan madde Sonuç'ta gerekçesiyle)
- [ ] `npm test`, `npm run typecheck`, `npm run build` (trace-check) geçti; `tests/theme-lavender-provence.test.ts` (§13.2)
- [ ] `theme-check --theme lavender-provence` hatasız; `previews/g409/` + `compare_<sayfa>_390.jpg` qa-kontrol incelemesinden geçti
- [ ] Sonuç dürüst: açılış ve story tarifi, comp sapmaları, denenmeyenler (gerçek iPhone/Safari, yayın), sorunlu GPT parçaları

## Sonuç
**Yapıldı (claude-local-G409, 2026-10-15):** `platform/themes/lavender-provence/` — theme.json (5 sayfa, 5 foto alanı, 72 copy anahtarı;
`copy-manifest --check` temiz), content.demo.json (koleksiyon kaydının birebir kopyası), 5 şablon, site.css (45 KB sınırında), site.js
(34,8 KB), thank-you.css, build_images.py (tools/tema_build.py + bu tasarımın kesimleri), README.md (comp öğe haritası, sapmalar), img/
(2,77 MB, ≤ 3 MB). `platform/tests/theme-lavender-provence.test.ts` (34 test; §13.2'nin 24 maddesi + kese, açılış, story, home, teşekkür).
`platform/previews/g409/` (theme-check çıktısı, compare_*_390.jpg, compare_closure.jpg, cuts_pouch.jpg, checks.json).
- **Açılış:** dokununca sicimin iki ilmeği gevşeyip yanlara açılarak söner, lavanta demeti düğümüyle kesenin önünden sağ alta kayıp gider;
  kapalı kese açık keseye geçerken gevşer (scaleX 1,03→1, scaleY ,97→1, alt kenar sabit); kart ağızdan yukarı kayar (ağız kenarı kırpar)
  ve 7 lavanta tomurcuğu esintiyle ağızdan sağa-yukarı savrulur; kart öne gelir, VT ile home kartına uçar (`go` 3550 ms + VT 0,9 s).
- **Story:** üç preslenmiş kart (frame_portrait) kendi yanından ±25° dönerek esintiyle gelir, gevşek açısında (−4°, +3,5°, −2,2°) durur;
  üst üste binmez; telefonda foto penceresi 40,3vw; başlık el yazısıyla kartın altında.
- **Görsel hattı:** hiza UYARI'sı ölçülen dönüşümle giderildi (açık kese ölçek+öteleme: alt −2,15 % → −0,07 %; sicim uçları düğüm
  çevresinde yatay × 0,9466: −1,37/−1,22 % → 0/+0,44 %; `manifest.stage.align`). `tema_build.kese_kes` ağız yayını bulamadı (geometrik
  yedek astarı ön duvara katıyordu) → ön duvar leylak astarın alt sınırından renkle kesildi (415 sütun). Kapanış renkle üç parçaya
  (tie_l, tie_r, bundle; örtüşme 0). Pencereler `leke_doldur` ile tam şeffaf (yeşil/alfa boşluğu kusuru giderildi, denetim 0 px). GPT
  tuvallerindeki alfa 1–7 hâlesi sıfırlandı. Gerilen kart bantları kâğıt lifinden temizlendi (`*_mid`). Kart: card_small, kese
  gövdesinin %55'i; ağız kırpması `stage.rim.clip`.
- **Comp sapmaları (README'de gerekçeli):** dört kutulu geri sayım → sade rakam (§5.7); story ve details'te comp'ta kart üstündeki
  yazılar kartın altında (GPT çerçevelerinin pencere altı düz bandı ~%7–10, yazı sığmıyor); RSVP kartında info_card'ın tepe dalı
  kalıyor (comp'ta yok); "Gordes, France" → `venue.city_region_country`; kese telefonda comp'tan büyük (§7.1 sahne boyu); bg_tile
  (keten) kullanılmadı, zemin bg_page'in çiçeksiz bandı + aynası; monogram yok (kapanışta mühür yok).

**Testler:** `npm test` (Windows, junction shim'iyle) 659 test, 0 fail (27071ab öncesi; son CSS düzeltmelerinden sonra yeniden koşuldu —
aşağıdaki commit); `tests/theme-lavender-provence.test.ts` 34/34; `npm run typecheck` temiz; `npm run build` + trace-check geçti
(lavender-provence izleniyor). Tarayıcı denetimleri playwright-core + kurulu Chrome 155 ile (tarayıcı indirilmedi):
`theme-check --theme lavender-provence --stress --no-video` **120 geçti / 2 kaldı** — ikisi ortam kaynaklı: (1) "reduced motion 2291 ms"
(%94 CPU yükünde; aynı tema bir önceki turda 422 ms ile geçti), (2) "content change" adımı Windows'ta denetim betiğinin ESM yol hatası
(`ERR_UNSUPPORTED_ESM_URL_SCHEME`, scripts/theme-check.cjs inline import'u `C:\…` yolu veriyor — tema dışı, Linux'ta denenmeli).
İlk görünüm (390×844, DPR 3): index 1078 KB, home 1067 KB (yer tutucu); fotoğraflı 1160 / 1455 KB. Dokun → home 4,7 s (yükte 6,4 s;
nominal 4,45 s). `g051-browser --theme lavender-provence`: 44/44. Kontrast: metin token'ları en koyu zeminde ≥ 4,8:1, hap 4,7:1.
Alex Brush + Cormorant Garamond latin-ext içeriyor (Amélie).

**Denenmedi:** gerçek iPhone/Safari ve Android Chrome; Vercel yayını; MP4 kayıt (`--no-video`: makinede ffmpeg yok); gerçek alıcı
fotoğrafları; yavaş ağ; theme-check "content change" akışı (Windows). **qa-kontrol incelemesi (§13.4) yapılamadı:** alt-ajan API
haftalık limitine takıldı (429). compare_*.jpg'ler tarafımdan gözle karşılaştırıldı; entegratörün qa-kontrol'ü koşturması gerekiyor.

**Sorunlu GPT parçaları / önerilen prompt düzeltmeleri** (`tools/katalog.py WEB[09]`): envelope_open kapalıdan 31 px yukarıda (aynı
tuvalde alt kenar çakışmalı); closure sicim uçları kese kenarından ~14 px taşıyor; frame_portrait / frame_landscape pencere altı düz bandı
çok dar (başlık için ≥ %15 boş kâğıt istenmeli); card_small/frame pencerelerinde yarı saydam yeşil + alfa boşluğu; tuvallerde alfa 1–7
hâle. **Önerilen görev:** scripts/theme-check.cjs ve tests/*-browser.ts'te inline ESM import'larını `pathToFileURL` ile Windows uyumlu
yapmak (claude-kod); tests/g068-copy.test.ts ve g075-thank-you.test.ts listelerine lavender-provence eklemek (yazar alanım dışı).

## Günlük
- 2026-10-13 blokaj: K22 (kullanıcı, 2026-10-13): videodan çıkıldı, ürün yalnız mobil öncelikli website. Yeni website standardı pilotla (G035) belirlenince yeniden tanımlanacak
- 2026-10-13 yeniden tanımlandı (K22–K24, G033)
- 2026-10-15 alindi: claude-local-G409
- 2026-10-15 bitti, incelemeye gönderildi
- 2026-10-15 entegratör onayladı
