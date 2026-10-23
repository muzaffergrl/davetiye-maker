---
id: G965
baslik: Yerel oturum — Etsy ilk satış dalgası: PDF yenileme, alıcı mesajı + SSS, yalnız 01–20 yayını ("yayınla" onayıyla) (K55)
rol: claude-tarayici
durum: hazir
alan:
oncelik: 1
bagimli: []
yazar: [docs/20_ETSY_DUKKAN_KURULUMU.md, docs/19_ALICI_YOLCULUGU.md, docs/20_etsy_taslaklar_*/, platform/lib/marketing/config.ts, platform/lib/etsy/listings.json, gorevler/G965-yerel-etsy-ilk-dalga.md]
---

## Amaç
K55 (2026-10-23): ilk satış dalgası yalnız 01–20; 21, 22–49 ve hizmetler taslakta kalır. Entegre main yayınlandıktan sonra taslakların
dijital dosyaları (yeni START HERE) yenilenir, dükkân metinleri güncellenir; sahibin açık "yayınla" onayıyla 01–20 tek tek yayınlanır
ve linkler `tools/ilan_baglantilari.py` ile platforma bağlanır.

## Yapılacaklar
`docs/38_YEREL_ETSY_ILK_DALGA.md` bloğu (adım 0–8). 22–32 medya yeniden yüklemesi (K54) yeniden çekim commit'i main'e gelince (adım 2).

## Bitti sayılması için
- [ ] Değişen PDF'ler bütün ilgili taslaklarda yeni dosya ID'siyle
- [ ] "Message to Buyers for Digital Items" ve iki SSS maddesi Etsy'de, yeniden okunup doğrulandı
- [ ] Sahibin "yayınla"sından sonra Active 20 (01–20), Draft 32; linkler `ilan_baglantilari.py --yaz` ile yazıldı, testler yeşil
- [ ] docs/20 §7.14 + ekranlar `docs/20_etsy_taslaklar_<YYYYMMDD>/`

## Sonuç
_(yerel oturum doldurur)_

## Günlük
- 2026-10-23 açıldı (docs rolü, claude/adoring-gates-docs): talimat docs/38 yazıldı; uygulanmadı, yayın yok.
