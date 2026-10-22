---
id: G429
baslik: Tasarım 29 Celestial Observatory — tema yeniden kurulumu (39 pilot yapısı, PAKET 5R parçaları)
rol: claude-kod
durum: inceleme
alan: claude-session-01HjhGPm
oncelik: 2
bagimli: [G229, G423]
yazar: [platform/themes/celestial-observatory/, platform/tests/theme-celestial-observatory.test.ts, platform/previews/g429/, platform/lib/print/layouts.ts, platform/public/print/celestial-observatory/, platform/public/marketing/, platform/lib/marketing/, collections/29_Celestial_Observatory/package/, gorevler/G429-celestial-observatory-yeniden.md]
---

## Amaç
`docs/35_22_32_YENIDEN_TASARIM.md` §6: `platform/themes/celestial-observatory/` Codex'in `envelope-v3` kalıbından çıkarılıp
39 Silver Photo Booth pilotunun yapısıyla (`docs/34_TEMA_HATTI_40_48.md`) yeni GPT parçalarından baştan kurulur.
Pilot G423 (Velvet Jewel Box) örnek alınır.

## Girdiler
- `collections/29_Celestial_Observatory/DESIGN_BRIEF.md` + `collections/29_Celestial_Observatory/assets/gpt/GPT_PROMPTS.md` (her parçanın "Kullanım" satırı) + `parts/` (G229)
- Pilot dosyaları `platform/themes/silver-photo-booth/` ve `swan-chantilly-lace/`; standart `docs/11`, `docs/34`, `docs/35` §3

## Yapılacaklar
1. `kit_check --paket 5` + göz kontrolü; kusurları `docs/34` §4 yöntemleriyle çöz (çizim yok, K21).
2. `build_images.py` (alfa kutusu, arka katman kutusuna yerleştirme, `keyed_window`, manifest.stage ↔ site.css), `img/` ≤ 3 MB.
3. Şablonlar + `site.css` + `site.js` (`MOTION` ↔ CSS keyframe gecikmeleri aynı sayılar); kapak düzeni ve açılış `docs/35` §3.
   Kaldır: `envelope-v3.*`, `opening*`, `interior*`, `parts.css`, eski `v3-*/v4-*` görseller. Koru: slug, `theme.json` foto
   anahtarları, `content.demo.json`, kopya anahtarları (`node scripts/copy-manifest.ts --theme celestial-observatory --check`).
4. `variants.css` paletleri yeni sanattan; baskı düzeni PAKET 6R'ye (`lib/print/layouts.ts`, `build-print-assets`).
5. `tests/theme-celestial-observatory.test.ts` yeni yapıya göre; katalog kapak posteri + açılış klibi yeniden.
6. Göz kontrolü (`docs/34` §5): kapalı → açılış (300 ms aralık) → home/story/details/rsvp; 360/390/430 + masaüstü.

## Bitti sayılması için
- [~] Tema testi 11/11 + unique-openings/interiors, physical-lining, rebuilt-eleven-rsvp, g180, g150, g175 geçer;
  g085/g093/g094/g097/g138/g139/g155 + content seyrek çalışma ağacında koşamaz (entegratör birleştirince koşar)
- [x] Açılışta boş/düz renkli yüz yok; kapanış (rete + usturlap), kapak (gerçek iç yüz: gözlemevi kubbesi), kart, süzülen nesneler ayrı hareket ediyor
- [x] Kapak düzeni: isimler ve Skip hiçbir dekorun altında değil; tarih · şehir + Tap to open
- [x] Sonuç yazılı; katalog durumu `preview` (önizleme kareleri repoya konmadı: oturum notları)

## Sonuç
G429 tamamlandı (2026-10-22, dal `claude/g429-celestial-observatory`; pilot G423'ün yapısı).
- Tema baştan yazıldı; Codex `envelope-v3`/`opening*`/`interior*`/`parts.css`/`variants.css` ve eski img/ kaldırıldı.
- `build_images.py`: 20 PAKET 5R parçası; zarf katmanları arka kutusuna (cep tam kutu, kapak eşit ölçekle genişliğe ve
  menteşe üst kenara; kapalıyken astar boşluğu 0 px), kubbe iç yüzü kendi oranında; usturlap: plaka diski ve rete halkası
  daire uydurmasıyla ölçüldü, rete kendi merkezinde kare kesildi ve diskin merkezine oturtuldu (GPT 54 px kaydırmıştı);
  planisfer kadranı çerçeve merkezine; pencereler yeşil halka + çevrelediği alan; yeşil kalıntı yok; klasör 1,44 MB.
- Açılış (3,55 s): rete 120° döner + pirinçte ışık + 6 uç parıltısı → usturlap süzülür → kubbe kapak 3B (iç yüz =
  gözlemevi kubbesi) → kart cebin arkasından yükselir, öne gelir; altın yıldızlar tek tek yanar, hilal süzülür.
- İç sayfalar: home kartı = GPT kartı (madalyon portre), ay evreleri ayırıcı, planisfer halkaları (kaydırmayla dönen kadran,
  konik maskeyle kadran süpürmesi), teleskop ışını gibi mekân, yıldız tozu yükselen RSVP.
- Testler: `tests/theme-celestial-observatory.test.ts` 11/11; istenen liste 82 test, 81 geçti, 1 bilinen hata
  (`marketing-content` "claims we never make" — önceden vardı); `tsc --noEmit` temiz; i18n eksik 17/dil.
- Platform: designs.ts (PREVIEW + REBUILT, UNIQUE_INTERIORS çıktı) + tr/de/es/fr, ses = MOTION, PAKET 6R baskı düzeni
  (kutular ölçüldü, örnek PDF göz kontrolü), katalog eksenleri, Codex fikstürlerinden çıkarıldı, demo fotoğrafları.
- Göz kontrolü: 390×844, 360×740, 1280×800 Chromium; açılış sabit zamanlarda ve gerçek zamanlı; taşma 0. Gerçek telefonda denenmedi.
- Ertelenen: paletler (variants) yeni sanattan; font-fallback Imperial Script için yeniden ölçülmedi; katalog kartı/klibi yeniden yakalanmadı.
