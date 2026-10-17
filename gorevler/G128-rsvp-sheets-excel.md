---
id: G128
baslik: Düzenlenebilir RSVP alanları (Required/Optional, 5 soru türü) + tek tuş Google Sheets (canlı) + Excel indirme
rol: claude-kod
durum: bitti
alan: claude-G128
oncelik: 1
bagimli: [G051, G069, G068]
yazar: [platform/lib/rsvp/, platform/lib/google/, platform/lib/data/, platform/lib/content/, platform/lib/theme/engine.ts, platform/lib/marketing/faq.ts, platform/lib/marketing/facts.ts, platform/app/api/rsvp/, platform/app/api/google/, platform/app/api/edit/[slug]/google/, platform/app/api/edit/[slug]/publish/route.ts, platform/app/(marketing)/features/page.tsx, platform/components/panel/, platform/public/rsvp/form.js, platform/tests/, platform/previews/g128/, platform/package.json, platform/package-lock.json, platform/README.md, docs/03_URUN_ICERIK_SEMASI.json, docs/22_GOOGLE_SHEETS.md, tools/validate_content.py, gorevler/G128-rsvp-sheets-excel.md]
---

## Amaç
Kullanıcı: "RSVP alanları en basit şekilde düzenlenebilir olacak, zorunlu/zorunlu değil seçeneği. Panelde tek butonla Google Sheet'e
aktarma; yeni kayıt geldikçe sheet canlı güncellensin. Tek tuşla Excel indirme. Sheet ve Excel inanılmaz düzenli olmalı. Müşteri
alanları düzenlerse Excel/Sheet sütunları otomatik güncellensin." Koordinatör: session_01HP9ZrJ8mhZnigbvsvUQ4pR (birleştirme onda).

## Sonuç
**2026-10-16 · claude-G128 — durum: inceleme.** Dal `claude/g128-rsvp-sheets` (taban `claude/zealous-fermi-hy1o40`). Yayın yok,
ortam değişkeni eklenmedi. Ayrıntı: `platform/README.md` → "RSVP form alanları, Excel ve Google Sheets (G128)"; kurulum `docs/22`.

### Yapılanlar
1. **Alan yapılandırması (tek sistem, G051/G068 ile birleşik):** şema `rsvp.required {email, message}`, soru türleri
   `choice | text | long | yesno | number`, soru başına `required`, soru sınırı 3 → **10**. Etiketler: hazır alanlarda G068
   `copy.form_*`, sorularda `label` — ikinci bir kayıt yok. Eski siteler göçsüz geçer (bayrak yok = isteğe bağlı).
   Python doğrulayıcı (`tools/validate_content.py`) aynı şemayı okur; yorum/mesaj güncellendi, eşlik testi geçiyor.
2. **Panel "Reply form"** (`components/panel/RsvpFormFields.tsx`, RSVP sayfasında eski "Questions for your guests"in yerinde):
   Your name / Will you attend? → "Always required" (silinmez), Number of guests → "Always asked", Email ve Note → büyük
   **Required / Optional** düğmeleri; her alanın etiketi düzenlenebilir. "Your questions": soru, cevap türü (Choices · Yes / No ·
   Short answer · Long answer · Number), seçenekler, Required/Optional, ⋯ menüsünden yukarı/aşağı/sil (Undo'lu), "Add a question".
   Panelin "Add a reply" formu yeni türleri de gösterir (yes/no seçimi, sayı/uzun kutu).
3. **Misafir formu** (`public/rsvp/form.js`, 20 temada ortak): sayfa `site-data.rsvp_form` (yalnız id/tür/bayrak) okur; zorunlu
   alanlara `required` + `aria-required`, zorunlu e-posta/notun "(optional)" işareti gizlenir, isteğe bağlı soruya temanın kendi
   "(optional)" işareti kopyalanır; yes/no temanın seçenek hapları (sunucu Yes/No seçeneği yazar), sayı tek satır + sayısal klavye,
   uzun yanıt büyük kutu. Hata mesajları sunucuyla aynı, temanın `[data-rsvp-error-for]` yuvasında, `aria-describedby` bağlı.
   Sunucu (`lib/rsvp/validate.ts`) aynı kuralları uygular; çiftin elle eklediği yanıtta zorunluluk aranmaz. Gövde sınırı 8 → 32 KB.
   Tema dosyalarına dokunulmadı.
4. **Excel** (`lib/rsvp/xlsx.ts`, exceljs 4.4.0 MIT; `GET /api/rsvp/<slug>/excel`): Guests'te yapışkan çubukta **Download Excel**
   (CSV "Download CSV" olarak düğme satırına indi). "Replies": #2B1526 başlık, dondurulmuş başlık, otomatik filtre, sütun genişlikleri,
   #EDE5D7 şerit, "Submitted" gerçek tarih (site saat dilimi, `mmm d, yyyy h:mm AM/PM`), Attending Yes/No, Guests ve sayı cevapları
   sayı, uzun metin kaydırmalı; misafir metni asla formül olmaz. "Summary": toplam, gelen/gelmeyen, kişi sayısı, bekletilenler,
   seçenekli ve evet/hayır sorularının dağılımı (sayı + %), sayı sorularının toplamı.
5. **Ortak sütun modeli** (`lib/rsvp/table.ts`): Excel, Sheet ve CSV aynı cevap sütunlarını kullanır — güncel sorular metinleriyle,
   silinmiş soruların cevapları sağda "<soru> (removed)". Soru adı değişince sütun adı değişir.
6. **Google Sheets** (`lib/google/`): "Connect Google Sheets" → OAuth 2.0, yalnız `drive.file` → alıcının Drive'ında
   "<Names> — RSVP replies" (Replies + Summary, Excel'le aynı düzen; tek `batchUpdate`). Tam yeniden yazım her: sayılan misafir
   yanıtı (`after()`, misafir beklemez), çiftin ekle/düzelt/sil/tut işlemi, yayınlama (alan yapısı değişmiş olabilir), "Sync now".
   Panel: "Connected · Last synced 4:05 PM · Open sheet · Sync now · Disconnect"; hata "Sync failed — <neden> · Sync now",
   Google izni düştüyse "Connect again"; alıcı tabloyu silerse yenisi açılır. Refresh token AES-256-GCM (`GOOGLE_TOKEN_KEY`, site id
   ek veri), loglanmaz/gönderilmez; state = slug + rastgele, HttpOnly çerez + sitede hash + 10 dk + tek kullanım; panel uçları
   yalnız Bearer. Env yoksa panelde "Google Sheets: coming soon", uçlar 503. `googleapis` paketi yok, `fetch`.
   Bağlantı **site kaydının dışında** (yeni adaptör yöntemleri `readSiteDoc/updateSiteDoc`; local `docs/<siteId>/`, blob
   `docs/<siteId>/*.json` ETag'li yeniden deneme; site silinince gider) — senkron `updatedAt`'i oynatmaz, panel kaydı çakışmaz.
7. `docs/22_GOOGLE_SHEETS.md` — Google Cloud adımları (proje, Sheets + Drive API, izin ekranı External + In production, drive.file,
   Web istemcisi, redirect URI `https://davetiye-platform-five.vercel.app/api/google/callback`, Vercel env).

### Değişen / eklenen alıcı etiketleri (START HERE için)
Panel RSVP: "Reply form", "What guests fill in. A required field must be filled in before a reply can be sent. Your Excel file and Google
Sheet get a column for each field.", "Label", "Always required" / "Always asked", "Guests must fill this in?", "Required" / "Optional",
"Your questions", "Guests must answer?", cevap türleri "Choices · Yes / No · Short answer · Long answer · Number" (+ ipucu satırları),
"Add a question", "Add a choice". Guests: "Download Excel", "Download CSV", "Google Sheets" kartı ("Connect Google Sheets",
"Connected", "Sync failed", "Last synced …", "Open sheet", "Sync now", "Disconnect", "Connect again", "Disconnect Google Sheets?",
"Keep connected", "Google Sheets: coming soon …"), Google dönüş sayfası ("Google Sheets is connected" vb.).
Misafir formu: "Please enter your email address.", "Please write a note for the couple.", "Please choose an answer.",
"Please answer this question.", "Please choose Yes or No.", "Please enter a whole number from 0 to 9999.", isteğe bağlı sorularda "(optional)".
Excel/Sheet başlıkları: Submitted · Name · Attending · Guests · Other guests · Email · <sorular> · <… (removed)> · Note for the couple · Source.
Satış sitesi: `lib/marketing/faq.ts` ve `/features` cümlesi yeni türler + Required/Optional ile güncellendi (sayı limitten gelir: 10).

### Testler (bu oturumda koşuldu)
- `npm ci`, `npm run typecheck` temiz.
- Yeni `tests/g128-rsvp-sheets.test.ts` (9 test): içerik kuralları, zorunlu/tür doğrulaması, tema görünümü + site-data, tablo
  sütunları + "(removed)", Excel dosyasını exceljs ile geri okuyup biçim kontrolü, CSV, token şifreleme, **sahte Google sunucusuyla**
  bağlan (state/çerez/tek kullanım) → ilk senkron → yeniden senkron → silinmiş dosya → düşmüş izin → disconnect (revoke) → site silme.
- Eski testlerden 7'si yeni sınırlara göre güncellendi (10 soru, 32 KB, "(removed)" başlığı, `required` artık gerçek alan).
- `tests/g128-browser.ts` (build sonrası, 390 px): blush-garden-rose, olive-ivory, art-deco-black-tie misafir formu + panel + Guests;
  ekran görüntüleri `platform/previews/g128/`. `tests/g051-browser.ts`'deki "en çok 3 soru" kontrolü 10'a göre düzeltildi (koşulmadı).
- Son tur: `npm test` **1233 test, 1231 geçti, 0 kaldı** (2 atlanan, eskiden de atlanıyordu); `npm run build` + trace-check geçti;
  `tests/g128-browser.ts` **32/32**. Son turda düzeltilen 3 eski test: site-data anahtarlarına `rsvp_form`, satış sitesi panel
  düğmesi etiketi `PANEL_REPLIES_DOWNLOAD` → "Download Excel" (`lib/marketing/facts.ts`), dönüş betiği ayrılmış `public/rsvp/` altına.

### Denenmedi / açık
- **Gerçek Google hesabıyla bağlantı denenmedi** (kimlik bilgisi yok): izin ekranı, gerçek Sheets biçim görünümü, gerçek gecikme.
- Tam Playwright süitleri ve 20 temada `theme-check --stress` koşulmadı (istek gereği); form 3 temada denendi, 20 tema aynı işaretleri taşıyor.
- Çok sunucu örneğinde iki senkron üst üste binerse ikisi de tam tabloyu yazar; nadir sıra bozulması bir sonraki senkronda düzelir.
- Yayınlanmamış (taslak) sitede alan değişikliği Sheet'e ancak sonraki yanıtta / "Sync now"da geçer (tetik yayınlamada).
- Excel/Sheet'te hazır alan başlıkları sabit ("Email", "Note for the couple"); çiftin form etiketini değiştirmesi başlığı değiştirmez (bilerek).
- Satış sitesindeki panel `replies` ekran görüntüsü hâlâ eski "Download list" düğmesini gösteriyor; alt metni "Download Excel" oldu → G089 ekranı yeniden çekmeli.
- `docs/10_SITE_PLATFORMU.md` §2 ve G043 Supabase şemasına `site_docs` benzeri tablo ve `rsvp.required` notu entegratörde eklenmeli.

## Günlük
- 2026-10-16 claude-G128: kodlandı, testler (Sonuç), incelemeye
- 2026-10-17 entegratör onayladı
