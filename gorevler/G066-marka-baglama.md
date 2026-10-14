---
id: G066
baslik: BKE Studio markasını satış sitesine ve platforma bağla (ad, logo, favicon, "Made with" rozeti)
rol: claude-kod
durum: hazir
alan:
oncelik: 1
bagimli: [GM02, G061]
yazar: [platform/lib/marketing/config.ts, platform/components/marketing/, platform/app/(marketing)/layout.tsx, platform/app/layout.tsx, platform/public/brand/, platform/tests/]
---

## Amaç
K26/K27: ad **BKE Studio**, kimlik GM01 yön C. GM02 kiti hazır (`brand/`, `platform/public/brand/`). Satış sitesi (G061) ve
platform hâlâ `[BRAND]` yer tutucusu ve geçici favicon kullanıyor.

## Yapılacaklar (GM02 Sonuç'undaki bağlama listesi)
1. `platform/lib/marketing/config.ts`: `brand.name = 'BKE Studio'`, logo yolu. Alan adı, fiyat, destek e-postası **yer tutucu kalır**.
2. `components/marketing/Shell.tsx`: başlıkta `bke-logo-horizontal-anchor.svg`, altbilgide `-reverse` (SVG'leri `public/brand/`'a kopyala).
3. `app/(marketing)/layout.tsx` ve kök `app/layout.tsx`: `/brand/icon.svg`, `/brand/favicon.ico`, `/brand/apple-touch-icon.png`; istenirse manifest (192/512).
4. Satış sitesi renk/yazı token'ları `brand/tokens.json` ile uyumlu mu bak; uyumsuzsa yalnız token düzeyinde hizala.
5. "Made with BKE Studio" rozeti misafir sayfalarına **bu görevde eklenmez** (hedef link kararı yok; docs/15 P1).
6. Testler, build, satış sitesi 390/1280 önizlemesi (`platform/previews/g066/`).

## Bitti sayılması için
- [ ] Satış sitesinde ad, logo ve favicon BKE Studio; testler ve build geçti; önizleme görüntüleri

## Sonuç

## Günlük
- 2026-10-14 açıldı (entegratör): GM02 onayı sonrası; G061 düzeltme turu bitince başlar
