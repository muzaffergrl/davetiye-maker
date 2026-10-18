---
id: G188
baslik: G180 tema standardını 33–38'e uygula (font yedek yüzleri / CLS, ertelenen açılış parçaları / LCP, düğme kontrastı)
rol: claude-kod
durum: hazir
alan: claude-G188
oncelik: 2
bagimli: [G180, G182, G183, G184, G185, G186, G187]
yazar: [platform/themes/marigold-mehndi/, platform/themes/red-lacquer-double-happiness/, platform/themes/highland-tartan-thistle/, platform/themes/victorian-glasshouse/, platform/themes/art-nouveau-lily/, platform/themes/papel-picado-fiesta/, platform/tests/theme-marigold-mehndi.test.ts, platform/tests/theme-red-lacquer-double-happiness.test.ts, platform/tests/theme-highland-tartan-thistle.test.ts, platform/tests/theme-victorian-glasshouse.test.ts, platform/tests/theme-art-nouveau-lily.test.ts, platform/tests/theme-papel-picado-fiesta.test.ts, platform/tests/g180-theme-perf.test.ts, platform/previews/g188/, gorevler/G188-tema-standardi-33-38.md]
---

## Amaç
G180 (`gorevler/G180-tema-perf.md`, docs/11 §6 ve §12) 01–32'ye tema standardını uyguladı: isim yüzü için `scripts/font-fallback.ts`
ile `fb1`/`fb2` yedek `local()` yüzleri (her sayfanın `<head>`'inde, `site.css`'ten önce satır içi) ve `site.css` yığınında
`fb1,fb2`; açılışta kapalı nesne `fetchpriority=high`, ertelenen parçalar `loading=lazy` + low ve dokunuştan önce yüklü;
sabit alt menünün altında içerik yok; düğme kontrastı ≥ 4,5:1. `tests/g180-theme-perf.test.ts` 33–38'i "henüz yedek yüz yok"
diye listeliyor. Bu görev aynı standardı 33–38'e uygular ve testi bütün temalar için zorunlu yapar.

## Talimat (koordinatör)
Dal: `claude/zealous-fermi-hy1o40`'tan `claude/g188-tema-standardi-33-38`; yalnız oraya push. PR/main/yayın yok. K21: çizim yok.
1. Önce `gorevler/G180-tema-perf.md`, `docs/11_TEMA_STANDARDI.md` §6/§12, `scripts/font-fallback.ts`, `tests/g180-theme-perf.test.ts`,
   `tests/g180-browser.ts` oku; G180'in 01–32'de yaptığını 33–38'e birebir uygula (tema başına isim yüzü neyse o).
2. `site.css` 45 KB bütçesi ve tema testlerinin birebir CSS eşleşmeleri korunur; CSP hash sayıları değişirse tema testlerini güncelle.
3. `tests/g180-theme-perf.test.ts`'teki "henüz yedek yüz yok" istisnasını kaldır: test bütün temalar için geçmeli.
4. Ölçüm: G180'in yöntemi (`next start`, 390×844 DPR 2, CPU 4×, 150 ms RTT, fontlar 3 s geç); 6 tema için CLS < 0,1 ve LCP önce/sonra
   tablosu; `tests/g180-browser.ts` 38 temayla; `theme-check --stress` 6 tema 0 hata. Ham veri `previews/g188/`.
5. Zincir: `npm ci && rm -rf .next && npx tsc --noEmit && I18N_STRICT=1 npm test && npm run build`; `node scripts/font-fallback.ts --check`.
6. Bitiş: push, bu dosyada Sonuç (yapılanlar, ölçüm tablosu, komutlar + sonuçlar, denenmeyenler), `durum: inceleme`.

## Sonuç
_(görevi yapan ajan doldurur)_

## Günlük
- 2026-10-18 koordinatör: görev açıldı (G180 33–38'e dokunmadı).
