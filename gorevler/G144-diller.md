---
id: G144
baslik: Satış sitesi ve alıcı sitelerine EN/TR/ES/DE/FR dil desteği (ücretli/anahtarlı çeviri API'si yok)
rol: claude-kod
durum: inceleme
alan: claude-G144
oncelik: 1
bagimli: [G138, G140, G141]
yazar: [platform/lib/i18n/, platform/lib/theme/engine.ts, platform/lib/theme/map-block.ts, platform/lib/site/render.ts, platform/lib/site/gate.ts, platform/lib/content/types.ts, platform/lib/content/schema.ts, docs/03_URUN_ICERIK_SEMASI.json, platform/lib/panel/model.ts, platform/lib/panel/brand.ts, platform/lib/rsvp/table.ts, platform/lib/rsvp/xlsx.ts, platform/lib/google/sheets.ts, platform/app/api/rsvp/[slug]/excel/route.ts, platform/public/rsvp/form.js, platform/public/static/, platform/public/audio/audio.js, platform/components/panel/, platform/components/my/, platform/app/edit/, platform/app/start/, platform/app/my/, platform/app/signin/, platform/app/(marketing)/, platform/components/marketing/, platform/lib/marketing/, platform/content/guides/, platform/next.config.ts, platform/lib/slug.ts, platform/scripts/i18n-missing.ts, platform/tests/, platform/previews/g144/, platform/README.md, gorevler/G144-diller.md]
---

## Amaç
K45 madde 3. Kullanıcı: "Hem kendi websitemize hem de kullanıcıların oluşturduğu kendi websitelerine ingilizce/türkçe/ispanyolca/
almanca/fransızca dil seçenekleri ekleyelim. kullanıcı hangi dillerde olacağını seçebilsin panelden. otomatik çeviri olsun içerik."
Çeviri servisi sorusuna: "api olmadan çeviri yapamaz mıyız". Koordinatör: session_01HP9ZrJ8mhZnigbvsvUQ4pR (birleştirme onda).

## Sonuç
**2026-10-17 · claude-G144 — durum: inceleme.** Dal `claude/g144-diller` (taban `claude/zealous-fermi-hy1o40` f08c092). Yayın yok,
ortam değişkeni yok.

### Altyapı (`platform/lib/i18n/`, kurallar `lib/i18n/README.md`)
- Anahtar = İngilizce metnin kendisi (`t('…')`, `tn(n,'one','{n} other')`, sabitlerde `msg()`); eksik çeviri → İngilizce.
- Sözlükler: `dict/panel|site|market/<tr|es|de|fr>.ts` — **panel 1197, site 206, satış 817 anahtar; dört dilde 0 eksik.**
  Yalnız seçili dilin dosyası yüklenir (`dicts.ts`, dinamik import). Satış rehberleri: `content/guides/<dil>/*.md` (6 × 4).
- Kapsam testi `tests/i18n.test.ts`: kaynak koddaki `t/tn/msg` sabitleri + 21 temanın copy varsayılanları ve sabit şablon
  metinleri her sözlükte var mı (eksikler tanı satırı; `I18N_STRICT=1` ile hata), yer tutucular korunmuş mu, tema `max`
  uzunlukları aşılmış mı; tarih biçimleri, dil seçimi, çift çevirisi durumları, motorun TR/DE çıktısı.
  **G139/G142 için:** yeni metin eklenince çevirisi yoksa İngilizce görünür; `node scripts/i18n-missing.ts --json x.json`
  eksikleri listeler — küçük bir çeviri ekiyle tamamlanır.

### Alıcı sitesi
- `content.languages = {primary, extra[]}` ve `content.translations` (docs/03 şeması + `lib/content/schema.ts` eşlendi).
- URL: `/<slug>/<sayfa>?lang=de` (ana dil parametresiz; sayfa linkleri, takvim ve paylaşım linki `?lang`'i taşır),
  `<html lang>`, `hreflang` + x-default (yalnız birden fazla dilde ve kamu adresi biliniyorsa), sağ üstte küçük dil düğmesi
  (`/static/lang.css|js`; zarf sayfasında "Skip"in altında), tarayıcı dili başka bir site diliyse ilk açılışta o dilde tek
  satırlık öneri (oturum boyunca kapatılabilir).
- Çevrilenler: tema copy varsayılanları, `data-copy-fixed`, sabit aria-label/alt/title/data-pending, `data-text` şablon
  kelimeleri, RSVP formu ve hata mesajları (`form.js`, sunucu mesajları da bilinen metinse), evet/hayır seçenekleri (değer
  "Yes/No" kalır), harita bloğu, Ekstralar blok sözcükleri, müzik düğmesi, şifre sayfası, teşekkür başlığı, paylaşım alt
  metni, geri sayım birimleri, tarih/gün/ay (`Intl`; hiçbir dilde sayısal tarih yok; İngilizce dışında 24 saat).
- Çiftin kendi metni: misafir yalnız **onaylı ve kaynağı değişmemiş** çeviriyi görür, yoksa ana dildeki metin.
- Tema site.js dosyalarına dokunulmadı (bütçeler aynı); betikler metinleri `#site-data.i18n` ile yalnız sayfanın dilinde alır.

### Panel
- **Us → Languages:** ana dil, ek diller (5'ten seçim), her ek dil için alan alan çeviri kutuları (kaynak metin üstte),
  durum rozeti (Not translated / Check and approve / Out of date / Approved), **Translate automatically**, **Approve all**,
  tek tek onay; elle yazılan çeviri onaylı sayılır; otomatik çeviri onay bekler. Panelin kendi dili de burada (çerez `bke_lang`;
  yoksa tarayıcı dili).
- Otomatik çeviri (`lib/i18n/auto-translate.ts`), anahtarsız: önce tarayıcının cihaz üstü **Translator API**'si (Chrome 138+
  masaüstü; metin cihazdan çıkmaz), yoksa **MyMemory anahtarsız ucu** (istek başına 500 bayt → cümle sınırında bölünür; IP
  başına günde ~5000 karakter; makine çevirisi kalitesi, panel "okuyup onaylayın" der ve metnin translated.net'e gittiğini
  yazar). Kota/servis yoksa "kendin yaz" moduna düşer. **Gerçek servise bu oturumdan istek atılmadı** (ağ testi yapılmadı;
  bölme ve hata yolları birim testli).
- Panel, /start, /my, /signin arayüzü 4 dile çevrildi (~1190 metin). Sunucudan gelen bazı hata mesajları (doğrulama
  cümleleri, rights.ts'in dinamik cümleleri) bilinen metin değilse İngilizce kalabilir.
- **Excel** başlıkları panelin dilinde; **Google Sheet** arka planda da eşitlendiği için sitenin **ana dilinde**.
  START HERE rehberi bu görevde değişmedi (İngilizce) — not.

### Satış sitesi
- `/tr`, `/es`, `/de`, `/fr` (+ bütün alt sayfalar): `next.config.ts` rewrites → `app/(marketing)/i18n/[lang]/…` (kök
  `[slug]` ile çakışmaz; `tr/es/de/fr/en/i18n` ayrılmış slug). İngilizce adresler ve metin aynı kaldı. Dil seçici (masaüstü
  başlıkta, telefonda menünün altında), hreflang + x-default, kanonik, `og:locale`, sitemap 5 dil × sayfa + xhtml:link.
  `<html lang>` platformla ortak olduğundan sayfa gövdesi `<div lang>` ile işaretli. llms.txt İngilizce.

### Testler (kendim çalıştırdım)
- `npm run typecheck` temiz. `tests/i18n.test.ts` 17/17, `tests/g144-market.test.ts` 8/8.
- `tests/g144-browser.ts` (build sonrası, 390 × 844): 5 tema (olive-ivory, art-deco-black-tie, crimson-rose-atelier,
  winter-evergreen, coastal-seaside) × TR/DE × 5 sayfa — taşma/yatay kaydırma yok, `<html lang>`, linkler `?lang`, RSVP hata
  metni çevrili, dil düğmesi, Almanca tarayıcı önerisi, Türkçe panel Languages, satış sitesi /tr /de /de/designs:
  **165/165**. Görüntüler `platform/previews/g144/` (her birine baktım; ilk sürümde düğme Crimson'da başlığı örtüyordu →
  sağ üste alındı).
- Son `npm test`: 1300 test, 1298 geçti, 0 hata, 2 atlandı (önceden de atlananlar). `npm run build` temiz (trace-check dahil);
  build sonrası g144-browser 3 temayla yeniden 105/105.

### Açık / sonraki
- Çeviriler makine değil, ajanların yazdığı çevirilerdir; anadil gözden geçirmesi yapılmadı. Kısa menü etiketleri tema `max`
  sınırı yüzünden kısaltıldı (TR "Giriş/Detay/Yanıt", DE "Start/Sek.", FR "Début").
- MyMemory gerçek ağ testi ve Chrome Translator API gerçek cihaz testi yapılmadı.
- Tema demoları (/start/demo) yalnız İngilizce.

## Alıcı etiketleri (panel, EN → TR örnekleri)
Languages → Diller · Main language → Ana dil · Also show my website in → Websitemi şu dillerde de göster: ·
Translate automatically → Otomatik çevir · Approve all → Tümünü onayla · Approve → Onayla · It is still right → Hâlâ doğru ·
Not translated → Çevrilmedi · Check and approve → Kontrol et ve onayla · Out of date → Güncel değil · Approved → Onaylandı ·
Language of this editor → Bu düzenleyicinin dili.
