---
id: G154
baslik: G090 QA metin/politika düzeltmeleri — START HERE, Etsy ilanları, satış sitesi metni, gizlilik sayfası (K48)
rol: claude-metin
durum: inceleme
alan: claude-G154
oncelik: 1
bagimli: [G090]
yazar: [docs/19_ALICI_YOLCULUGU.md, docs/14_SATIS_SITESI.md, docs/05_SET_PAKETI.md, collections/01_Olive_Ivory/package/, collections/02_Dusty_Blue/package/, collections/03_Blush_Garden_Rose/package/, collections/04_Vintage_Airmail/package/, collections/05_Lemon_Mediterranean/package/, collections/06_Art_Deco_Noir/package/, collections/07_Burgundy_Velvet/package/, collections/08_Winter_Evergreen/package/, collections/09_Lavender_Provence/package/, collections/10_Tuscan_Vineyard/package/, collections/11_Boho_Pampas/package/, collections/12_Tropical_Destination/package/, collections/13_Enchanted_Forest/package/, collections/14_Ivory_Lace_Pearl/package/, collections/15_Cherry_Blossom/package/, collections/16_Sunflower_Rustic/package/, collections/17_Emerald_Gold_Estate/package/, collections/18_Wildflower_Vellum/package/, collections/19_Midnight_Garden/package/, collections/20_Coastal_Seaside/package/, collections/21_Crimson_Rose_Atelier/package/, collections/_services/custom-design/package/, platform/lib/marketing/config.ts, platform/lib/marketing/facts.ts, platform/lib/marketing/faq.ts, platform/lib/marketing/site.ts, platform/components/marketing/pages/PrivacyPage.tsx, platform/components/marketing/pages/FeaturesPage.tsx, platform/components/marketing/pages/HowItWorksPage.tsx, platform/components/marketing/pages/PricingPage.tsx, platform/components/marketing/pages/DesignsPage.tsx, platform/lib/i18n/dict/market/, platform/tests/marketing-content.test.ts, platform/tests/marketing-schema.test.ts, tools/build_customer_guides.py, tools/build_service_guides.py, tools/etsy_upload.py, tools/tests/test_build_customer_guides.py, tools/tests/test_listing_kit.py, gorevler/G154-qa-metin.md]
---

## Amaç
G090 QA raporunun metin/politika bulgularını kapatmak (P0-01, P0-02, P0-03, P1-03…P1-08, P2-04): K48 koordinatör varsayılanları
(docs/01) START HERE'e, Etsy ilanlarına, satış sitesine ve gizlilik sayfasına; ürünün bugünkü özellikleri (G126 müzik, G139
indirmeler, G144 5 dil, G146 erişim; G147/G152 e-posta yalnız dükkân açınca → vaat yok) metinlere. Tema kodu, seed betikleri,
admin kodu, `lib/print/*`, durum dosyaları (PROJECT_STATE, AGENTS, CLAUDE) **dokunulmadı** (G155'in alanı).

## Sonuç
**2026-10-17 · claude-G154 — durum: inceleme.** Dal `claude/g154-qa-metin` (taban `origin/claude/zealous-fermi-hy1o40`; iş `767dc83` üstünde yapıldı, sonra
`017964a2`'ye (G153/G161/G162/G165/G166 birleşmeleri) rebase: market sözlüklerinde çakışma tabanın sözlükleri + G154'ün 53 çevirisi
yeniden uygulanarak çözüldü; aşağıdaki denetimler rebase sonrası yeniden koşuldu).
Yayın, main'e birleştirme, PR yok.

| Bulgu | Durum | Ne yapıldı / neden açık |
|---|---|---|
| **P0-01** START HERE yer tutucuları | **Düzeldi** | docs/19 Ek A: "We are confirming your Etsy order" → "Publish opens as soon as your order is confirmed, usually within 24 hours. Reload your editor page to check." (K48: bugün için doğru söyleyiş; Etsy doğrulaması açılınca anında olur ama vaat edilmez). "Longer hosting: [EXTENSION POLICY]" → "Need it online longer? Message us on Etsy before your **Online until** date and we can extend it." (ücret sözü yok) + "12 months after your website closes, we delete it…". Help'e 30 günde silme. 21 rehber yeniden üretildi: `[` hiç yok. |
| **P0-02** `/privacy` taslak | **Düzeldi** (hukuki okuma açık) | `config.ts policies` K48 cümleleri (lostLink, extension, deletion, retention; msg + 4 dil). `PrivacyPage.tsx` koddan yeniden yazıldı: `[PRIVACY REVIEW]` / "draft" kutusu kalktı; toplananlar = içerik, foto, **müzik dosyası**, cihaz anahtarlarının **SHA-256 özeti** + etiket, düzenleme anahtarı özeti, **şifreli Google token** (bağlanırsa), misafir yanıtı (parti adları dahil); **E-postalar** bölümü (yalnız SMTP açıkken: düzenleme linki, giriş linki, isteğe bağlı yanıt e-postası); IP yalnız özet + sayaç; çerezler doğrulandı (sitede tek çerez misafir şifresi 90 gün; panelde dil çerezi + Sheets bağlarken kısa çerez + tarayıcı deposu); harita yalnız "Show map" dokunuşunda; "Translate automatically" → tarayıcı yoksa MyMemory (translated.net); analitik yok; saklama 12 ay arşiv; silme Etsy'den sipariş no ile 30 gün. `verified.privacyText` **false kalır** (hukuki okuma önerisi yalnız docs/14 §6.10'da; launch kapısı korunuyor). |
| **P0-03** Etsy JSON açık kontrolleri / doğrulanmamış iddialar | **Düzeldi** | 21 `listing_v3.md` §2'de hiç `[VERIFY]` yok; her cümle var olan ve G090 yerelinde geçen bir özellik. Sipariş cümlesi koşullu ("If your editor says it is confirming your Etsy order … usually within 24 hours"), Google Sheets yalnız özellik ("connect your own Google Sheet"), müzikte "soft/gentle" kalktı, "designed for phone screens" (cihaz testi iddiası değil) VERIFY'sız. Canlı site / gerçek telefon / gerçek Google hesabı / mod okuma kontrolleri §11 kutularında; `tools/etsy_upload.py` artık §11'in işaretsiz kutularını `open_checks`'e ("before publishing") taşır → JSON'da 16–17 açık kontrol, `description` kaynaklı 0. `ready_to_publish` false (K41). |
| **P1-03** Satış sitesi "Not included" + çelişkiler | **Düzeldi** | `facts.ts`: Music / "translated website…English" / "Printed invitations" çıktı; "Included"a erişim (sipariş no + e-posta), Excel/CSV, harita, müzik, 5 dil, Downloads (site PDF'i + 5×7/A5 davetiye) eklendi; "Not included": özel alan adı, renk/font, e-postayla davet, liste içe aktarma, 5 dil dışı sabit metin, baskı/kargo, save the date. Features/How it works/Designs/FAQ/definition'da CSV → Excel, "private edit link" → sipariş no + e-posta, "No cookies" → misafir şifresi çerezi. E-posta hiçbir yerde vaat edilmiyor. Aynı çelişki K42 özel tasarım ilanında + CUSTOM_DESIGN.pdf'te ("Music, printed invitations" not included) düzeltildi. |
| **P1-04** Dil iddiası | **Düzeldi** | İlanlar (WHAT YOU GET + GOOD TO KNOW + SSS), START HERE (yeni **Languages** bölümü + Quick answers), satış sitesi (yeni SSS "Can our website be in another language?", Features): EN/TR/ES/DE/FR, sabit metinler çevrilmiş, kendi metin otomatik taslak + onay ("read each text before you approve it"). Tasarım font satırları korundu. |
| **P1-05** START HERE Downloads / "printed? No" | **Düzeldi** | Share'de **Downloads** bölümü (Download website as PDF; Printable invitation 5 × 7 in / A5 (148 × 210 mm), arka yüz, bleed, crop marks; "QR yalnız yayından sonra açar", "önce bir kopya basıp okutun"); Quick answers "Can I print invitations?" → Share → Downloads. Etiketler `lib/print/labels.ts`'ten denetleniyor (`LABEL_SOURCES`'a eklendi). |
| **P1-06/P1-07** Satış sitesi SSS + yer tutucular | **Düzeldi** | Kayıp link = G146 `/my` ([Create your website](/my)); `[LOST LINK POLICY]`, `[EXTENSION POLICY]`, `[DELETION PROCESS]` kalktı; `[ETSY SHOP URL]` → `https://www.etsy.com/shop/STUDIOBKE` (alt bilgi "Etsy shop" linki, /my "Open our Etsy shop", JSON-LD sameAs); `[DOMAIN]` → `siteHost()`: marka alan adı kararlaşınca o, yoksa `MARKETING_SITE_URL`/`PLATFORM_PUBLIC_URL`/`VERCEL_PROJECT_PRODUCTION_URL` host'u, hiçbiri yoksa "…/clara-and-julian" (alan adı uydurulmadı). `domain: '[DOMAIN]'` alanı launch kapısı olarak duruyor. "Coming soon on Etsy" doğru (K41) — kaldı. Yerel `next start`'ta /privacy, /faq, /features, /pricing, /how-it-works, /designs/olive-ivory, /tr/faq, /de/privacy, /fr/pricing, /es/features: köşeli parantezli yer tutucu **0**. |
| **P1-08** 06–21 ilan PDF'leri | **Düzeldi** | `python3 tools/listing_kit.py pdf --theme all` (21; 01–05 da yeni metinle yeniden) → `listing_kit.py check --theme all` 21/21 "0 problem(s)". |
| **P2-04** Başlat adresi düz metin | **Düzeldi** | s. 1'de QR'ın altında: "Link and QR code not working? Type this address into your browser: https://…/start?theme=<id>". |
| P0-04 alan adı / barındırma | **Açık (kullanıcı kararı)** | K48'de de açık. Linkler/QR'lar hâlâ `davetiye-platform-five.vercel.app` (uyarı `listing_kit.py check`'te). |
| P1-01 basılı davetiye yerleşimi, P1-02 / P2-01 demo fotoğrafları, P2-02 / P2-03 tema CSS | **Kapsam dışı (G155)** | İlan demo satırı "(sample names and photos)" P1-02 kapanınca doğru olur; kapanmazsa "(sample names)" yapılmalı. İlanın §11'ine "Printable invitation: decor no longer over the text (G090 P1-01, G155)" kutusu eklendi. |
| docs/19 §4.5 mesaj şablonları | **Açık (G155)** | `archive_notice` / `delete_data`'da `[EXTENSION POLICY]`, `[DELETION PROCESS]` duruyor: kopyası `platform/lib/admin/message-templates.json` (admin kodu) ile test eşleşmesi var (`g087-admin.test.ts`), ikisi birlikte G155'te. Panel `OrderPendingNote` süresi de panel kodu. |

### Belgeler
- docs/19: Ek A (yukarıdaki metinler + değişiklik geçmişinde G154), §0/§1/§3/A15/§4.1 iskelet/§4.3 SSS/§6 C3–D5/§7 K48'e göre.
- docs/14: §6.4–§6.10 (Not included, SSS, gizlilik notu yalnız belgede, çerez/veri listesi koddan), §13.4 madde 8.
- docs/05 §E: karar satırı (K48 + açık: alan adı, barındırma), Diller (G144), müzik/Downloads, sipariş onayı satırı; §G.

### Doğrulama (2026-10-17, bu dalda)
- `python3 tools/build_customer_guides.py` → 21/21 OK (10 sayfa, ~58–59 KB; linkler start + /my + /privacy; **jsQR 21/21** kendi `/start?theme=`); `--check` 21/21 OK.
- `python3 tools/etsy_upload.py` (JSON'lar yeniden) + `--check --strict` → 21 tasarım + 3 hizmet OK.
- `python3 tools/listing_kit.py check --theme all` → 21/21 0 problem (geçici vercel.app uyarısı).
- `python3 tools/build_service_guides.py` + `--check` → 3/3 OK (yalnız CUSTOM_DESIGN.pdf değişti).
- `python3 tools/tests/test_etsy_upload.py`, `test_build_customer_guides.py`, `test_listing_kit.py` → ok (testler G154'e uyarlandı: rehber ≤ 10 sayfa, K48 metinleri, START HERE'de açık yer tutucu yok).
- `platform/`: `npm ci && rm -rf .next && npx tsc --noEmit && I18N_STRICT=1 npm test && npm run build` → tsc temiz, **1510 test: 1508 geçti, 0 hata, 2 atlandı** (rebase sonrası; öncesi 1438/1436), build + trace-check OK. Market sözlükleri: 902 anahtar, 4 dilde **0 eksik** (53 yeni çeviri, 35 eski anahtar silindi); panel/site de 0 eksik. Meta: /features açıklaması 157 karakter.

### Yapılamadı / açık
- Canlı site okunamadı (ortam): canlıdaki `CLAIM_ORDER_VERIFICATION`, Google OAuth, SMTP değeri bilinmiyor → metinler her modda doğru olacak şekilde yazıldı; okumalar ilan §11'inde.
- Çeviriler (53 yeni satır × 4 dil) ajan çevirisi; ana dili konuşan biri okumadı.
- Gizlilik metni hukuki tavsiye değildir; AB/UK için bir uzmana okutulması önerisi docs/14 §6.10'da.
