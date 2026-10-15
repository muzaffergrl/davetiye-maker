---
id: G089
baslik: React Bits Pro ile cila — satış sitesi, panel ve düğün sitelerini "yaşayan" hâle getir (K31)
rol: claude-kod
durum: hazir
alan:
oncelik: 2
bagimli: [G088]
yazar: [platform/components/marketing/, platform/components/panel/, platform/components/fx/, platform/app/(marketing)/, platform/package.json, platform/package-lock.json, platform/tests/, platform/previews/g089/, docs/14_SATIS_SITESI.md, docs/16_PANEL_V2.md]
---

## Amaç
K31: siteyi React Bits Pro bileşenleriyle daha canlı yapmak — giriş animasyonları, kaydırmayla beliren bölümler, metin/ışık efektleri,
galeri ve kart etkileşimleri. Önce satış sitesi ve panel (React); düğün temaları statik HTML/JS olduğu için orada yalnız hafif,
bağımsız efektler ve tema standardına (docs/11 §6 performans bütçesi, §10 azaltılmış hareket) uyanlar.

## Yapılacaklar
1. React Bits Pro lisansı ve kurulum yolu (kullanıcının hesabı; lisans anahtarı repoya/log'a yazılmaz). Erişim yoksa blokaj.
2. G088'in ekran listesine göre bileşen seçimi; her biri için `prefers-reduced-motion` karşılığı, mobil performans (LCP/CLS), paket boyutu.
3. Uygula, ölç (Lighthouse/Playwright 390 + 1280), önizleme `platform/previews/g089/`.
4. Düğün temalarına uygun efektler için docs/11'e öneri (tema standardı değişikliği ayrı görev).

## Sonuç

## Günlük
- 2026-10-15 açıldı (kullanıcı isteği K31)
