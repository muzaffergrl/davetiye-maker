# Canva UI blokajları — G004 araştırma sonucu (2026-10-09)

Soru: Canva'da API/MCP aracı olmayan dört işi — **(1) element animasyonu/timeline, (2) website'e Form
(RSVP), (3) website yayını, (4) template link** — kullanıcıya elle iş vermeden yapabilir miyiz?

> **KARAR (kullanıcı, 2026-10-09): Seçenek A.** Canva hesabı Pro. Claude, kullanıcının bilgisayarında tarayıcıyı/
> bilgisayarı kullanarak bu işleri yapar — rol `claude-tarayici`, rehber `gorevler/roller/claude-tarayici.md`,
> görevler GA02/GANN (video) ve GB02/GBNN (website + template link'ler).

**Kısa cevap: bu bulut ortamından, bugünkü araçlarla hayır.** Aşağıda neyin denendiği ve kanıtı var.
Çözüm için kullanıcıdan bir **karar** gerekiyor (§3); elle iş değil.

## 1. Denenenler ve sonuçları

| # | Yol | Sonuç | Kanıt |
|---|---|---|---|
| 1 | Canva MCP `edit-design` işlemleri | Animasyon, sayfa süresi, geçiş, form, yayın, paylaşım işlemi **yok** | Araç şeması (işlem listesi: metin, görsel, şekil, konum, katman, sayfa, not, autofill) |
| 2 | PPTX içe aktarma ile animasyon taşıma | **Taşımıyor** | Canva Help Center yanıtı (2026-10-09): "transitions and animations ... will not automatically convert" |
| 3 | Canva tasarım üreticisi (`create-design`) | Animasyon **eklemiyor**, açıkça istense bile | `DAHXhM9mRoE` ve `DAHXhYgp4e0` MP4 export: kareler arası ortalama fark ≈ 0,01; tek değişim sayfa geçişi (5. sn) |
| 4 | Hareketli nesneyi video/GIF katmanı olarak yüklemek | Ajan yükleme kanalı **WebM, MOV, MP4'ü reddediyor**; GIF yükleniyor ama **içe aktarma başarısız** (2 farklı kodlama) | `create-upload-url` yanıtları: "Unsupported file format WEBM/MOV/MP4"; `get-assets`: GIF `import_failed` |
| 5 | `upload-asset-from-url` (video kabul eder) | Herkese açık HTTPS adres gerekir; **elimizde yok** | Repo özel (404); Adobe depolama yolu otomatik izin denetiminde reddedildi |
| 6 | Canva Connect API / Apps SDK | Animasyon, Form, website yayını, template link için **uç nokta bulunamadı**. Apps SDK yalnız editör içinde çalışan uygulamalardan öğe ekler | canva.dev belgeleri (Connect API kaynak grupları: assets, autofill, brand templates, comments, designs, imports, exports, folders, merges, resizes...) |
| 7 | Template link | Yalnız Canva arayüzünde: Share → Template link; **yalnız ücretli planlarda** (Pro/Teams/Enterprise/Edu/Nonprofit) | Canva Help: "Share a template link" |
| 8 | Website'e Form: üreticiye "RSVP Form" isteyerek | **Doğrulanamadı**: üretilen website sayfası API'de `unsupported` türünde, içeriği okunamıyor; PDF export'ta form görünmüyor | `DAHXhQPlWPg` |
| 9 | Tarayıcı otomasyonu (Playwright, bu bulut ortamı) | Canva güvenlik doğrulaması **engelliyor** (HTTP 403, "Just a moment…") | `canva.com/login` ve editör adresi aynı sonuç |

Test tasarımları (satış dışı, silinmedi — silme aracı yok): `DAHXhRJIiTQ` (master sayfa 1 kopyası),
`DAHXhYgp4e0` (animasyon testi), `DAHXhQPlWPg` (website + form testi).

## 2. Sonuç: iş bazında durum

| İş | Neden önemli | Bu ortamda | Kim yapabilir |
|---|---|---|---|
| Template link | **Satış bunsuz olmaz** (alıcıya giden link) | Yapılamaz | Canva arayüzü, ücretli hesap |
| Element animasyonu | AGENTS.md şart 4 (nesneler ayrı hareket) | Yapılamaz | Canva arayüzü — veya §3-B ile kısmen |
| Website Form (RSVP) | Kalıcı talep 3 | Yapılamaz / doğrulanamadı | Canva arayüzü |
| Website yayını | Bizim için yalnız test; asıl yayını **alıcı** kendi kopyasında yapar | Yapılamaz | Canva arayüzü |

## 3. Karar gereken seçenekler (kullanıcı)

**A. Kullanıcının bilgisayarında, Canva oturumu açık tarayıcıyı Claude'un sürmesi** (Claude masaüstü
uygulaması + Claude in Chrome / bilgisayar kullanımı). Dört işin hepsini çözer; Canva'nın bot engeline
takılmaz çünkü gerçek tarayıcı ve gerçek oturumdur. Gereken: bir kerelik kurulum (uygulama + uzantı açık,
Canva'da oturum açık) ve o sırada bilgisayarın açık olması. Bu, "kullanıcı elle iş yapmaz" kuralının
sınırında olduğu için **kullanıcının kararıdır**; ajanlar bunu kendiliğinden istemez.

**B. Animasyon için herkese açık medya adresi** (ör. bağlı Vercel hesabına geçici statik dağıtım).
Kendi HTML hareket hattımızla (zarf açılır, kart yükselir, polaroidler uçar) arka plan videoları üretip
`upload-asset-from-url` ile Canva'ya video katmanı olarak koyarız; isim/tarih/foto Canva'da düzenlenebilir
kalır. Yalnız animasyonu çözer (template link/Form değil). Gereken: kullanıcının açık izni (dosyalar kısa
süre herkese açık olur) ve otomatik izin denetiminin bu yükleme yolunu kabul etmesi. Canva'nın video
şeffaflığını desteklediği **doğrulanmadı**; tam sayfa arka plan videosu bunu gerektirmez.

**C. RSVP'yi Canva Form yerine bağlantılı butonla yapmak** (alıcı kendi Google Form/Tally linkini koyar;
`format_text` ile link ayarlanabiliyor). Form işini API içinde çözer ama kalıcı talep 3 ("Canva Form ile
RSVP") değişir — **kullanıcı kararı**.

Öneri: **A** (tek yol dört işi birden çözüyor; özellikle template link başka hiçbir yolla yapılamıyor).
A gelene kadar üretim durmaz: video master, website/PDF kaynakları, görseller, metinler, ilan kitleri
paralel ilerler; yalnız GANN görevleri ve satışa çıkış A'yı bekler.

## 4. Kaynaklar
- Canva Help Center (help aracı, 2026-10-09): PPTX içe aktarmada animasyonlar korunmaz.
- Canva Help — Share a template link: https://www.canva.com/help/share-template-link/
- Canva Connect API reference: https://canva.dev/docs/connect/
- Canva Apps SDK — elements: https://www.canva.dev/docs/apps/elements/ · video elements: https://www.canva.dev/docs/apps/feature-examples/video-elements/
- Canva Developers — bulkCreate/publish API duyurusu: https://community.canva.dev/t/announcing-the-general-availability-of-the-bulkcreate-and-publish-apis/8561
