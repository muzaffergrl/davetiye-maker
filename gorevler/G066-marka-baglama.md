---
id: G066
baslik: Satış sitesi + panel BKE Studio marka tasarımına geçer (GM04/GM05 comp'ları, ad, logo, favicon, renk/yazı)
rol: claude-kod
durum: alindi
alan: claude-G066
oncelik: 1
bagimli: [GM02, GM04, GM05, G060, G061]
yazar: [platform/lib/marketing/, platform/components/marketing/, platform/components/panel/, platform/app/(marketing)/, platform/app/layout.tsx, platform/app/edit/, platform/public/brand/, platform/tests/, platform/previews/g066/, docs/16_PANEL_V2.md]
---

## Amaç
K26/K27: ad **BKE Studio**, kimlik GM01 yön C. GM02 kiti hazır (`brand/`, `platform/public/brand/`). Satış sitesi (G061) ve
platform hâlâ `[BRAND]` yer tutucusu ve geçici favicon kullanıyor.

## Kapsam genişledi (2026-10-14)
Kullanıcı: "BKE Studio'yu da ekleyelim; logo, isim, marka tasarımına uygun bir website ve panel tasarımı yapalım." GPT comp'ları:
satış sitesi `brand/ui/site/` (GM04), panel `brand/ui/panel/` (GM05). Bu görev ikisini de comp'lara göre yeniden giydirir:
renk/yazı token'ları (`brand/tokens.json`; Archivo / Montserrat / DM Sans, Google Fonts — repoya font yok), başlık hiyerarşisi,
kartlar, düğmeler, çipler, alt menü, masaüstü düzeni. **İşlev kaybı yok:** bütün mevcut testler (panel, g060, claim, rsvp, final-smoke,
satış sitesi) geçer; erişilebilirlik (kontrast ≥ 4.5:1, dokunma ≥ 44 px) korunur. Comp'taki metin değil, ürünün gerçek metni/linki
kullanılır (alan adı yok — `bkestudio.com` yalnız comp'ta; link `config`'ten). Önizleme: 390 + 1280 px önce/sonra.

## Yapılacaklar (GM02 Sonuç'undaki bağlama listesi + giydirme)
1. `platform/lib/marketing/config.ts`: `brand.name = 'BKE Studio'`, logo yolu. Alan adı, fiyat, destek e-postası **yer tutucu kalır**.
2. `components/marketing/Shell.tsx`: başlıkta `bke-logo-horizontal-anchor.svg`, altbilgide `-reverse` (SVG'leri `public/brand/`'a kopyala).
3. `app/(marketing)/layout.tsx` ve kök `app/layout.tsx`: `/brand/icon.svg`, `/brand/favicon.ico`, `/brand/apple-touch-icon.png`; istenirse manifest (192/512).
4. Satış sitesi renk/yazı token'ları `brand/tokens.json` ile uyumlu mu bak; uyumsuzsa yalnız token düzeyinde hizala.
5. "Made with BKE Studio" rozeti misafir sayfalarına **bu görevde eklenmez** (hedef link kararı yok; docs/15 P1).
6. Testler, build, satış sitesi 390/1280 önizlemesi (`platform/previews/g066/`).

## Sıra (2026-10-14, entegratör)
İki aşama: **A — satış sitesi** (hemen; panel koduna dokunmaz) → **B — panel** (G069 RSVP v2 ve G076 site şifresi main'e
girdikten sonra; aynı bileşenlere dokundukları için). Aynı görev, iki ayrı ajan turu; Sonuç'a iki bölüm.

## Bitti sayılması için
- [ ] Satış sitesinde ad, logo ve favicon BKE Studio; testler ve build geçti; önizleme görüntüleri

## Sonuç

## Günlük
- 2026-10-14 açıldı (entegratör): GM02 onayı sonrası; G061 düzeltme turu bitince başlar
- 2026-10-14 alindi: claude-G066
