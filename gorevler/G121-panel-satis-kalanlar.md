---
id: G121
baslik: Panel, /start, admin ve satış sitesi — Refero turunun kalan P2'leri (docs/18) ve alıcı yolculuğu §6 kalanları (docs/19)
rol: claude-kod
durum: inceleme
alan: claude-G121
oncelik: 1
bagimli: [G088, G091, G100]
yazar: [platform/app/, platform/components/, platform/lib/, platform/tests/, platform/previews/g121/, docs/14_SATIS_SITESI.md, docs/16_PANEL_V2.md, docs/17_ADMIN_PANELI.md, docs/18_REFERANS_TASARIM.md, docs/19_ALICI_YOLCULUGU.md, gorevler/G121-panel-satis-kalanlar.md]
---

## Amaç
Kararlaştırılıp koda geçmemiş tasarım/akış iyileştirmelerini bitirmek: `docs/18_REFERANS_TASARIM.md` P1/P2 (P3 yalnız küçük ve
risksizse) ve `docs/19_ALICI_YOLCULUGU.md` §6 (admin A1–A6, `/start` B1–B5, panel C1–C6, satış sitesi D1–D6). Yapılmışlar G087, G095,
G099, G100'de; ticari/politik yer tutucular (fiyat, Etsy linki, kayıp link süresi, onay süresi, erteleme/silme/tasarım değiştirme
politikası, alan adı) olduğu gibi kalır. Temalara dokunulmaz; React Bits Pro gerektiren iş yok (G089).

## Sonuç
**2026-10-16 · claude-G121 — durum: inceleme.** Dal `claude-g121-panel-satis` (taban: koordinatörün `claude/zealous-fermi-hy1o40`'ı,
iki kez birleştirildi, çakışma yok). Yayın yok, push yok.

### Madde tablosu
| Madde | Durum | Dosya |
|---|---|---|
| 18 §1 P1 kurulum 1. adım tek iş | vardı (G100) | — |
| 18 §1 P3 "Step 1 of 3 · Your names and date" | yapılmadı (h1 ile tekrar) | — |
| 18 §1 P2 2. adım: Skip birincilin yanında, "More photos" kurulumdan çıksın | yapıldı | `components/panel/Setup.tsx`, `panel.module.css` |
| 18 §1 P2 3. adım: yayından önce tek cümle | yapıldı | `Setup.tsx` |
| 18 §1 P1 yayın başarı ekranı | vardı (G100) | — |
| 18 §2 P1 Day & place "More options" | vardı (G087/G100) | — |
| 18 §2 P1 tek "sample" satırı | vardı (G100) | — |
| 18 §2 P2 "Advanced: change headings & labels" | kısmen: bölüm zaten kapalı açılır; **ad değişmedi** (START HERE, Review, testler) — karar | — |
| 18 §2 P2 "Saved" geri bildirimi, şerit yalnız fark varken, Review önizlemeli | yapıldı | `Panel.tsx`, `ui.tsx` (`SaveIndicator`), `panel.module.css` |
| 18 §2 P3 Edit listesinde satır başı önizleme | yapılmadı | — |
| 18 §3 P2 yüzde kartı çapa, isim başlığı küçük | yapıldı (başlık 34–54 → 28–40 px; durum kartı sade şerit) | `panel.module.css`, `views.tsx` |
| 18 §3 P2 tek sakin durum etiketi + yanında eylem | yapıldı (Home'da çubuk "Live"ı tekrar etmez) | `views.tsx` (`StatusCard`), `Panel.tsx` |
| 18 §3 P2 Home → Settings listesi | yapıldı | `views.tsx` (`SettingsCard`), `fields.tsx` (`jump`), `sections.tsx`, `Panel.tsx` |
| 18 §4 P2 Share: QR katlı, ilk ekranda link + Copy + Share, offline en altta | yapıldı | `views.tsx` (`ShareView`), `panel.module.css` |
| 18 §4 P1 Guests liste + Results | vardı (G100) | — |
| 18 §4 P3 tek yanıt sayfası | yapılmadı | — |
| 18 §5 P2 hero'da kaydırılabilir 3–4 ekran | yapılmadı (gerekçe docs/18 §9: 390'da çerçeve 160 px, açılış dizisi aşağıda var, ilk ekran ölçülü) | — |
| 18 §5 P2 /designs stil çipleri | yapıldı (CSS-only, JS'siz) | `lib/marketing/designs.ts`, `app/(marketing)/designs/page.tsx`, `DesignCard.tsx`, `marketing.module.css` |
| 18 §5 P1 tasarım sayfası tek birincil eylem | vardı (G099) | — |
| 18 §5 P1 fiyat sayfası | karar bekliyor (fiyat, Etsy linki) | — |
| 18 §5 P2 mobil sıra | yapıldı (tasarımlar hero'nun altında) | `app/(marketing)/page.tsx` |
| 18 §6 P1 Özet'te Yapılacaklar en üstte | vardı (G095) | — |
| 18 §6 P3 sipariş kartları ≤ 3 satır | yapılmadı | — |
| 18 §6 P2 site sayfası niyete göre, mesaj müşteri bağlamının yanında | yapıldı | `components/admin/AdminSite.tsx`, `admin.module.css` |
| 18 §6 P3 silmede Vazgeç solda / sil sağda | yapıldı | `AdminSite.tsx` |
| 19 A1 şablonlar | vardı + G121: metin düzenlenebilir, kopyalama Geçmiş'e yazılır (şablon + zaman, `messageLog`) | `AdminSite.tsx`, `lib/admin/{messages,api,summary}.ts`, `lib/data/types.ts` |
| 19 A2 eylem + mesaj | vardı (G087) | — |
| 19 A3 güvenlik ağı | vardı + denetim düzenlenmiş metinde de (`messageMissing`) | `lib/admin/messages.ts` |
| 19 A4 sipariş görünümü | vardı + numara aramasında "bu numarayla site yok" ipucu (`orderWithoutSite`) | `AdminList.tsx`, `lib/admin/view.ts` |
| 19 A5 arşiv yaklaşanlar | vardı + site sayfası `archive_notice` ile açılır (`defaultTemplateId`) | `lib/admin/view.ts`, `AdminSite.tsx` |
| 19 A6 yanlış tasarım / numara taşıma | kısmen: silme numarayı serbest bırakır (yazıldı) + "yanlış tasarım" ipucu; araç ve politika karar bekliyor | `AdminSite.tsx` |
| 19 B1, B3, B4 | vardı | — |
| 19 B2 Home Screen ipucu | yapıldı | `app/start/StartForm.tsx` |
| 19 B5 | değişiklik yok | — |
| 19 C1 Help "→ Copy edit link" | yapıldı | `views.tsx` |
| 19 C2 | vardı (başlık korundu) | — |
| 19 C3 onay notu | kısmen: "Reload this page to check." eklendi; `[ORDER CHECK TIME]` karar bekliyor | `Setup.tsx` |
| 19 C4, C5 | vardı | — |
| 19 C6 e-posta bildirimi yok | Help'te vardı + Guests boş durumu | `guests.tsx` |
| 19 D1 | vardı + Canva karşılaştırması "content and the wording" | `lib/marketing/facts.ts` |
| 19 D2–D5 | vardı | — |
| 19 D6 `/help` | karar bekliyor (alan adı; Ek A'nın web uyarlaması claude-metin) | — |
| Koordinatör eki: önizleme sekmesi "Envelope" | yapıldı: tasarımın kendi açılışı | `lib/panel/{model,state}.ts`, `PreviewPane.tsx`, `Setup.tsx`, `sections.tsx`, `IdentitySheet.tsx`, `ThankYou.tsx`, `Panel.tsx` |

### Alıcıya görünen etiket değişiklikleri (eski → yeni)
- Kurulum 2. adım: **"More photos" (Optional) katlaması → kaldırıldı**; yerine düz satır "Your website has N more photo places. Add them
  any time under Edit → Photos; until then guests see a soft placeholder image." (START HERE Ek A satır "**More photos** are optional"
  güncellenmeli — `build_customer_guides.py --check` 20 tasarımda yalnız bunu buluyor).
- Kurulum: "Skip for now" adı aynı; altta altı çizili link → Continue'nun yanında düğme.
- Kurulum 3. adım yardımı: "Check it once, then publish. You can keep editing after you publish." → "Check it once, then publish." +
  çubukta "Guests can open your website with the link. You can keep editing after."
- Önizleme ilk sekmesi: **"Envelope" → tasarıma göre** "Envelope" (01, 02, 03, 04, 05, 07, 08, 10, 11, 15, 16, 17, 19, 20) ·
  "Gatefold" (06, 14) · "Pouch" (09) · "Wallet" (12) · "Book" (13) · "Sleeve" (18); satış kopyası olmayan tasarımda "Opening".
  Headings & labels satırları da: "Above your names on the envelope" → "… on the book" vb. (yalnız zarfsız 6 tasarımda).
- Home: yeni kart başlığı **"Settings"** (Time zone · Date style · Name & date changes left · Guest password); Home'da üst çubuktaki
  **"Live"** rozeti artık yok (durum kartında var; öteki görünümlerde çubukta duruyor).
- Share: "QR code for printed cards" adı aynı; açık başlık → **katlı bölüm** (dokununca açılır).
- Kayıt göstergesi: "Saved" kayıttan sonra ~2,5 sn yazıyla görünür (telefonda da).
- Review: her değişen sayfanın yanında göz düğmesi (aria-label "Preview <Page>"); giriş cümlesine "(tap the eye to preview a page)".
- Help: "(Share → Your private edit link → Copy)" → "(… → Copy edit link)". Guests boş: "+ New replies show here; we don’t send email
  notifications yet." Onay notu: "+ Reload this page to check." /start: yeni "Tip: once your editor is open, add it to your Home Screen."
- Satış sitesi: /designs'ta yeni çipler (All · Romantic floral · Classic & elegant · Rustic & boho · Destination · Seasonal ·
  Storybook & vintage); Canva karşılaştırması "you change the content" → "you change the content and the wording".
- Admin (Türkçe, dükkân): "Destek işlemleri"nden "Yayından kaldır" çıktı → yeni kart "Dikkat: yüksek etkili işlemler" (Yayından kaldır +
  Siteyi sil); silmede yeni "Vazgeç"; mesaj kutusunda "Mesajı kopyala" + yeni "Şablona dön".

### Doğrulama (bu dalın son build'i)
- `npm test` **1221/1221** (0 atlanan); yeni `tests/g121.test.ts` 7 test. `npm run typecheck` temiz; `npm run build` + trace-check yeşil.
- Tarayıcı (yerel `next start`, Chromium): yeni `tests/g121-browser.ts` **82/82** (390/1280/320, axe serious/critical 0, dokunma
  hedefi ≥ 44 px panel / ≥ 36 px admin, JS'siz süzgeç); `g060-browser` 153/153, `panel-browser` 80/80, `g100-browser` 52/52,
  `g087-browser` 65/65, `g068-browser` 192/192, `g069-browser` 403/403, `g076-browser` 51/51, `final-smoke` 45/45; g075 ve
  marketing-browser sonuçları Günlük'te. Güncellenen eski testler: g060 (More photos yok, QR katlı, Home'da Live çubukta değil),
  panel-browser (aynı Live kuralı). Öteki görevlerin `previews/` klasörlerine yazılmadı (çıktılar geçici klasöre).
- Ekranlar `platform/previews/g121/` (bakıldı): kurulum 2–3, Home + Settings, şerit + Saved, Review + önizleme, Book sekmesi, Share,
  Guests boş, /start, admin site + sipariş araması, /designs süzgeci, ana sayfa tasarımlar.
- Denenmedi: Vercel/canlı, gerçek telefon, ekran okuyucu.

### Açık / karar bekleyen
- "Headings & labels on this page" → "Advanced: …" adı (koordinatör); START HERE Ek A'da "More photos", önizleme sekmesi ("**Envelope**
  is the opening page" → tasarımın kendi adı) ve Share'de QR'ın katlı olduğu cümleler güncellenmeli (claude-metin / G122 sahibi).
- Fiyat sayfası düzeni (fiyat + Etsy linki kararı), `[ORDER CHECK TIME]`, `[DESIGN SWITCH POLICY]` + tasarım değiştirme aracı,
  sipariş numarası taşıma, `/help` (alan adı).

## Günlük
- 2026-10-16 açıldı ve alındı (claude-G121, koordinatör isteği)
- 2026-10-16 bitti, incelemeye gönderildi
