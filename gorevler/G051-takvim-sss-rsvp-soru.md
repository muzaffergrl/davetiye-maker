---
id: G051
baslik: Platform özellikleri — Takvime ekle, SSS metinleri, RSVP özel sorusu (pazar standardı, docs/13 §7)
rol: claude-kod
durum: inceleme
alan: wf-tema
oncelik: 2
bagimli: [G038, G039, G042]
yazar: [platform/lib/, platform/app/, platform/components/, platform/themes/blush-garden-rose/, platform/tests/, platform/README.md, docs/03_URUN_ICERIK_SEMASI.json, tools/validate_content.py]
---

## Amaç
Etsy araştırması (docs/13 §7): rakiplerde standart olup bizde olmayanlardan lisans/karar gerektirmeyen üçü.
Müzik çalar bu görevde **yok** (lisans kuralı AGENTS şart 9; kullanıcı kararı).

## Yapılacaklar
1. **Takvime ekle:** etkinlik için `.ics` (RFC 5545, doğru saat dilimi, VTIMEZONE ya da UTC) + Google Calendar linki; tema
   işaretiyle (`data-calendar`) home/details'te buton. Rota `/[slug]/event.ics`; yayınlanmamış site 404.
2. **SSS metinleri:** şemaya `faq: [{q, a}]` (≤12, uzunluk sınırları), panelde ekle/sil/sırala, temada `data-repeat` ile details
   sayfasında açılır-kapanır liste; `optional_blocks.faq` ile aç/kapa. validate_content.py ve TS doğrulama eşit.
3. **RSVP özel sorusu:** şemaya `rsvp.questions: [{id, label, type: "choice"|"text", options?[]}]` (≤3); misafir formunda
   gösterim, kayıt, panel listesi ve CSV'de sütun. Mevcut yanıtlarla geriye uyumlu.
4. Testler + Playwright 390 px kontrolü; README güncel.

## Bitti sayılması için
- [x] Üç özellik testli; 390 px'te temada düzgün; CSV'de özel soru sütunu

## Sonuç
Üç özellik yapıldı, blush-garden-rose temasına işlendi (yeni görsel yok: mevcut GPT `divider`, temanın hap düğmeleri ve tipografisi).
Ayrıntı: `platform/README.md` → "Takvime ekle, SSS, RSVP özel soruları (G051)". Müzik çalar yok.

**1. Takvime ekle** — `platform/lib/calendar.ts` (etkinlik + `.ics` + Google linki), `lib/site/ics.ts`, rota `app/[slug]/event.ics/route.ts`
(yayında → `text/calendar`; yayınlanmamış / yayından kaldırılmış / bilinmeyen / ayrılmış slug → 404; taslak yalnız `?preview=` ile,
`private, no-store`), demo için `app/start/demo/[theme]/event.ics/route.ts`. Saatler UTC (`…Z`, VTIMEZONE yok), `zonedTimeToUtc` ile
(yaz saati dahil: EST/EDT, BST/GMT, AEST/AEDT, +05:30, olmayan 02:30, gece saat geri alınırken test edildi). Şemada bitiş saati olmadığı
için kural: başlangıç = tören saati (yoksa programın en erkeni), bitiş = son program saati + 2 saat; saat yoksa tüm gün. Motor işareti
`data-calendar="ics|google"` (`lib/theme/engine.ts`); temada home (davet kartı altı) ve details (program kartı altı) "Add to your
calendar · Apple / Outlook · Google".

**2. SSS** — şema `faq: [{q ≤120, a ≤600}]` ≤ 12; iş kuralı boş soru/yanıt hata, blok açık + liste boş uyarı. `tools/validate_content.py`
ve `lib/content/validate.ts` aynı kurallar ("boş" karakter kümesi iki dilde aynı yazıldı); 20 koleksiyon kaydı + 21 G051 vakasında geçti/kaldı
eşliği testte. Tema: details'te `<details data-repeat="faq">` akordeon (JS'siz açılır), `data-optional="faq" data-if="faq"`; kapalıyken
kaynakta yok. Panel: "Questions & answers" bölümü (göster anahtarı, ekle/sil/yukarı/aşağı, sayaçlar), yayın öncesi "Sections without content".

**3. RSVP özel soruları** — şema `rsvp.questions` ≤ 3 (`choice` ≥ 2 farklı seçenek ≤ 8×60, `text` seçeneksiz, kalıcı `id`). Formda
konuk sayısının altında, yalnız katılan misafire (`data-rsvp-if-attending`); `/rsvp/form.js` girişlere `answer:<id>` adı verir,
`answers: {id: değer}` gönderir; sunucu doğrular (yanlış seçenek 400, metin ≤ 300), "no" diyenin cevabını saklamaz. Kayıt
`answers: [{id, question, answer}]` (local + blob adaptörü); eski yanıtlar alan olmadan okunur (geriye uyumlu). Çift listesinde
"Meal choice: Fish"; CSV'de `Message`'tan sonra soru başına sütun (yeniden adlandırılan soru yeni başlıkla, silinen soru kendi
sütununda; formül koruması başlık ve cevaplarda). Panel: RSVP bölümünde "Questions for your guests".

**Testler** (hepsi bu oturumda koşuldu): `npm test` 226/226 (yeni: `tests/calendar.test.ts` 12; content/rsvp/rsvp-api/adapter/panel/
theme testlerine G051 vakaları), `npm run typecheck` temiz, `npm run build` + trace-check (17 rota). Tarayıcı (Chromium 390 px, `next start`):
yeni `tests/g051-browser.ts` 43/43 (home+details takvim düğmeleri ve `.ics`, SSS dokun/klavye, taşma yok, ≥ 44 px, özel sorular
evet/hayır/sunucu hatası, CSV sütunları, panel SSS + soru düzenleyicisi + yanıtta cevaplar, demo `.ics`); mevcutlar yeniden: rsvp-browser
25/25, panel-browser 72/72, theme-check 69/69, final-smoke 42/42, claim-browser 50/50 (ekran görüntüleri geçici klasöre; repodaki
`previews/` güncellenmedi).

**Denenmedi:** gerçek iPhone/Android'de `.ics` açılışı, Apple Calendar/Outlook'a gerçek içe aktarma, oturumlu Google hesabında link;
canlı Vercel'de yayın (yayın yapılmadı; push yayın yapmaz).

**Yazar alanı dışında zorunlu küçük değişiklikler** (bitmiş görevlerin dosyaları, şu an kimse yazmıyor): `platform/public/rsvp/form.js`
(G042 form betiği — özel soru girişleri olmadan cevap gönderilemez), `platform/next.config.ts` + `platform/scripts/trace-check.cjs` (demo
`.ics` rotası tema dosyalarını okuyor; Vercel paketine girsin diye birer satır).

**Entegratöre notlar / önerilen görevler:**
- `docs/10_SITE_PLATFORMU.md` §2 `rsvps` tablosuna `answers jsonb` eklenmeli (G043 Supabase şeması da); README'de yazıldı.
- Tema 03 demo kaydında (`collections/03_…/content.demo.json` + kopyası `platform/lib/claim/demo/blush-garden-rose.json`) örnek SSS /
  özel soru yok → `/start` demosunda bu bloklar görünmüyor. İstenirse claude-metin örnek SSS (+ bir menü sorusu) yazar; panel örnek metni
  zaten "Sample" diye işaretler.
- `platform/previews/g038|final` görüntüleri yeni takvim satırını göstermiyor (yeniden üretmek: `THEME_SHOTS_DIR` olmadan theme-check).
- `_sample` iskelet teması yeni işaretleri (`data-calendar`, `faq`, `rsvp.questions`) kullanmıyor (yazar alanım değil); G046 tema
  standardı belgesi (`docs/11`) bu üç işareti/şema alanını anmalı.
- Ürün kararı olarak açık: şemada etkinlik bitiş saati yok (takvim +2 saat kuralı); özel sorular zorunlu yapılamıyor (şema `required` taşımıyor).

## Günlük
- 2026-10-13 alindi: wf-tema
- 2026-10-13 bitti, incelemeye gönderildi
