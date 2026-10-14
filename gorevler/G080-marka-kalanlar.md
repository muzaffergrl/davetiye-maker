---
id: G080
baslik: Marka ve panel sonrası kalanlar — /start ve signin BKE görünümü, onaysız temaların /start'tan kapatılması, metin/README/görsel kaynakları
rol: claude-kod
durum: inceleme
alan: claude-G080
oncelik: 2
bagimli: [G066]
yazar: [platform/app/start/, platform/app/signin/, platform/components/start/, platform/lib/themes/, platform/lib/marketing/facts.ts, platform/scripts/marketing-assets.ts, platform/README.md, platform/tests/, platform/previews/g080/]
---

## Amaç
G066-A/B ve G078 Sonuç'larında kalan açıklar.

## Yapılacaklar
1. `/start` (sahiplenme) ve kayıt sonrası ekran ile `app/signin` hâlâ eski yeşil görünümde / sistem fontunda → panel ile aynı BKE Studio dili
   (`components/panel/fonts.ts`, token'lar). İşlev ve testler aynı kalır.
2. **Onaysız temalar** `/start?theme=<id>` ile doğrudan sahiplenilebiliyor (G077/G078 notu). Tema onay bilgisi tek yerden (ör. `theme.json`
   `status: approved|review` ya da satış sitesindeki `designs.ts` listesi) okunur; production'da onaysız tema `/start`'ta reddedilir
   (dürüst mesaj), demo sayfaları test için açık kalır. Test: onaylı tema geçer, onaysız 4xx.
3. Satış sitesi metni "Download all replies (CSV) button" → paneldeki gerçek ad ("Download list") ile uyumlu (`facts.ts`).
4. `scripts/marketing-assets.ts` tam koşulunca panel görselleri `collections/03_Blush_Garden_Rose/package/shots/*.jpg`'den eski panel ekranlarını
   geri getiriyor → betik panel görsellerini canlı/yerel panelden çeksin ya da kaynak yolu G066-B önizlemelerine/yeni çekime çevrilsin; `--check` geçer.
5. `platform/README.md` panel notları K29 sonrası duruma göre güncellenir (3 adım, 6 sayfa, şerit, Home, Share).
6. npm test, typecheck, build, marketing-browser, panel-browser, claim testleri; önizleme `platform/previews/g080/` (390 + 1280).

## Sonuç

**Durum:** altı madde yapıldı, yerelde production build ile test edildi. **Yayınlanmadı** (deploy entegratörde).
Commit'ler: `a22bc1b` (görünüm + onay kapısı + metin + testler), `a6cda4e` (marketing-assets panel çekimi), son commit (README,
önizlemeler, Sonuç).

**1. /start, kayıt sonrası ekran, /signin → BKE Studio (panelin dili)**
- `app/start/shell.tsx` `StartShell`: kökte panelin `.app` sınıfı (`components/panel/panel.module.css` token'ları: renk, font, köşe,
  gölge, odak halkası), `PANEL_FONTS` (`components/panel/fonts.ts`) ve `BrandLogo` (marka SVG'si). `start.module.css` baştan: yalnız
  düzen; her renk/font/köşe/gölge `var(--c-*)`, `var(--font-*)` … — değer kopyalanmadı, panel token'ı değişince /start da değişir.
  Kâğıt zemin, beyaz kart + yumuşak gölge, patlıcan başlık/birincil düğme/bağlantı/odak (tek vurgu, K29), Archivo 800 başlık,
  Montserrat 300 üst satır, DM Sans gövde; altın/lavanta yalnız logoda. Alanlar ve düğmeler panelinkiyle aynı ölçüde (52 px alan,
  52 px birincil, ≥ 44 px her hedef). "Save this link" kutusu panelin kurallar kutusu gibi solda patlıcan çizgili beyaz kart.
  Masaüstünde logo içerik sütunuyla hizalı. İşlev, metinler, id/data-* seçicileri aynı (claim-browser değişmeden 50/50).
- `/signin`: panelin "edit link not valid" sayfasıyla aynı (logo, panel fontları, `.notice`); `.app` sarmalı ile kâğıt zemin geniş
  ekranda da tam genişlik.
- Eski yeşil (#335a4b) hiçbir yerde kalmadı (tarayıcı testi her elemanın rengini tarıyor).

**2. Onaysız temalar production'da /start'ta kapalı**
- **Tek kaynak seçimi: satış sitesinin tasarım listesi** (`lib/marketing/config.ts` `designs[]`, `status: 'live'` = onaylı; `'coming'`
  ya da listede yok = incelemede). Neden: zaten var ve bugün tam olarak 01 + 03'ü söylüyor; satış sitesi ile /start hiç ayrışamaz;
  onay, entegratörün satışa açarken yaptığı tek satırlık değişiklik; tema klasörlerine (başka ajanların çalıştığı yer) hiç dokunulmadı —
  `theme.json`'a alan eklenmedi. Bugün: onaylı 03 `blush-garden-rose`, 01 `olive-ivory`; incelemede 02, 04 (`'coming'`), 05.
- `lib/themes/approval.ts` (saf): `approvedThemeIds`, `themeApproval`, `themeApprovalEnforced` (yalnız `VERCEL_ENV=production` ya da
  `THEME_APPROVAL=enforce`; `next start` tek başına production sayılmaz), `themeOpenForClaims`, dürüst metin. `lib/themes/offered.ts`:
  /start listesi.
- Production'da: `/start?theme=<incelemede>` → **404** + "This design is not available yet … still being finished and is not on sale
  yet …" + onaylı tasarım listesi (`app/start/not-found.tsx`); `POST /api/start` → **403 `theme_in_review`**, hiçbir şey saklanmaz;
  temasız /start yalnız onaylıları listeler. Demolar (`/start/demo/<tema>`) ve var olan siteler açık. Yerelde, Vercel preview'da ve
  `npm test`'te her tema başlatılabilir (tema işi engellenmez). `claimableTheme()` değişmedi (panel/demo da onu kullanıyor).
- **Yazar alanı dışı (bilerek, küçük):** `lib/claim/claim.ts` — API kapısı için 1 satır kontrol + hata kodu/metni (sayfa tek başına
  kapı olmazdı; `lib/themes/` yoktu, `lib/claim/themes.ts`'e dokunmadım). Başka ajanın alanıyla çakışma yok.

**3. Metin:** `facts.ts` `PANEL_REPLIES_DOWNLOAD = 'Download list'` + `REPLIES_SCREEN_ALT`; ana sayfadaki alt metin bunu kullanıyor
(`app/(marketing)/page.tsx`, yazar dışı tek satır — eski metin orada duruyordu, facts.ts'te değil). `tests/g080-copy.test.ts`
etiketi `components/panel/guests.tsx` ile karşılaştırır ve satış sitesi kaynaklarında eski adı arar.

**4. marketing-assets.ts:** panel görselleri artık G059 JPG'lerinden değil, bu checkout'un build'inin **yerel `next start`'ından**
çekiliyor (`--panel`; geçici veri klasörü, local adaptör; 03 demosu tohumlanır, 5 kurgusal yanıt, kurgusal alıcı Elena & Marco
/start'tan site açar; anahtar maskeli, QR bulanık; Guests toplamları `DEMO_REPLY_TOTALS`'tan farklıysa betik durur). `--designs` /
`--panel` kısmi koşu, varsayılan ikisi; `--check` ok. Çekim G066-B karelerini neredeyse birebir verdi: yalnız `start` ve `editLink`
anlamlı değişti (yeni /start) → işlendi; diğer 6 görsel (Home metninde küçük kelime farkı, önizlemede sayaç) geri alındı. `assets.json`:
yalnız `note` satırı (ölçüler aynı).

**5. README:** "Düzenleme paneli (G039)" notu, "Panel v2" başı (font/görünüm), yeni "Görünüm" ve "Görünümler (K29 sonrası)" (3 adım,
6 sayfa, şerit + Review, Home hazırlık + 3 iş, Share düzeni, Day & place'te "After the wedding", iki sütun, /signin), g060 test
satırı (151 kontrol), /start bölümüne görünüm + "Tasarım onayı (G080)" ve g080-browser. Başka bölüme dokunulmadı.

**6. Testler** (yerel production build, son kod, origin/main birleştirilmiş)
- `npm test` **530/530** (yeni: `g080-approval` 8, `g080-copy` 2); `npm run typecheck`; `npm run build` + trace-check temiz.
- Tarayıcı: **g080-browser 92/92** (yeni), claim-browser 50/50, panel-browser 77/77, g060-browser 151/151, marketing-browser 283/283.
  g080: iki sunucu (A `THEME_APPROVAL=enforce`, B kapısız); panel fontları/token'ları/logo, axe-core 4.13.0 ciddi/kritik 0 (kontrast
  dahil; /start boş ve hatalı form, kayıt sonrası, incelemede, liste, /signin), dokunma ≥ 44 px, 320/390'da yatay kaydırma yok,
  404/403/demo 200, kapısız sunucuda 02 başlatılabiliyor.
- Diğer testlerin önizleme klasörleri (g039, g045, g060, g061) yeniden yazılmadı (çıktılar geçici klasöre).

**Önizleme:** `platform/previews/g080/` — `start_full_390`, `start_1280`, `claimed_390` (tam sayfa, anahtar maskeli),
`claimed_1280`, `in_review_390`, `in_review_1280` (02 production'da), `choose_design_390`, `signin_390`, `signin_1280`, `checks.json`.

**Açık / yapılmayanlar**
- Vercel'de denenmedi. Kapı `VERCEL_ENV`'i çalışma anında okur (Vercel sistem değişkeni; projede "Automatically expose System
  Environment Variables" açık olmalı — varsayılan). Yayından sonra: `curl -s -o /dev/null -w '%{http_code}'
  https://davetiye-platform-five.vercel.app/start?theme=dusty-blue-champagne` → 404 beklenir; olmazsa `THEME_APPROVAL=enforce`
  production ortam değişkeni olarak eklenebilir (değer gizli değil).
- `app/edit/[slug]/not-found.tsx` (yazar dışı): `.notice` 560 px sütun; geniş ekranda iki yan beyaz kalıyor (`/signin`'de `.app`
  sarmalıyla çözdüm; aynısı oraya da uygulanabilir).
- `collections/01_*` ve `03_*/package/customer/START_HERE.md` hâlâ "Refresh" + "Download all replies (CSV)" diyor (eski panel) →
  claude-metin. `tools/listing_templates/capture.ts` (G059) eski panel seçicilerini kullanıyor (`#section-*`, `[data-replies]`);
  ilan çekimi yenilenecekse güncellenmeli.
- `lib/marketing/designs.ts` `PANEL_SOURCES`/`PANEL_COLLECTION` artık yalnız anahtar listesi (dosya adları kullanılmıyor; yorum eski)
  — yazar dışı, dokunmadım.
- `node scripts/marketing-assets.ts --designs` bugün koşulursa tasarım ekranları değişir: koleksiyon çekimleri işlenmiş web
  görsellerinden yeni (ör. olive-ivory details/schedule/form yüksekliği 1385 → 1262/1234). Denedim, işlemedim (görev dışı; entegratör).
- `facts.ts` `NOT_INCLUDED` hâlâ "Password protection" diyor; G076 misafir şifresi geldi. Satış iddiası kararı entegratör/metinde,
  değiştirmedim.
- Gerçek telefonda deneme yok; ekran okuyucuyla elle deneme yok.

## Günlük
- 2026-10-14 açıldı (entegratör): G066-B, G078 açıkları
- 2026-10-14 alindi: claude-G080
- 2026-10-14 claude-G080: /start + signin BKE, onay kapısı (satış listesi tek kaynak), Download list, marketing-assets panel çekimi, README; npm test 530/530, g080 92/92, claim 50, panel 77, g060 151, marketing 283
- 2026-10-14 bitti, incelemeye gönderildi
