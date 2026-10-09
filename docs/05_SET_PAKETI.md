# Set paketi — her tasarım için eksiksiz teslim listesi

Her koleksiyon (tasarım) **tek paket** olarak satılır. Bir set, aşağıdaki maddelerin hepsi
tamamlanmadan `sale_ready` olamaz. Durum `collections/<koleksiyon>/COLLECTION_STATUS.md` içinde
bu listeyle aynı sırada tutulur.

## A. Alıcının aldığı ürünler (Canva'da düzenlenebilir)

| # | Parça | Canva türü | Bitti sayılması için |
|---|---|---|---|
| A1 | Animasyonlu davetiye videosu | Mobile Video 1080×1920 | Kişisel metin/fotoğraflar ayrı katman; zarf/kart/foto animasyonları Canva timeline'da; MP4 export denendi |
| A2 | Düğün websitesi | Canva Website (tek sayfa) | Mobil + masaüstü önizleme; **Canva Form ile RSVP**; yayın testi; linkler çalışıyor |
| A3 | Davetiye PDF'i | Fixed (5×7 in veya A5) | Baskıya ve telefona uygun; tıklanabilir RSVP/website linki export sonrası test edildi |
| A4 | Paylaşım görseli | Story 1080×1920 + Kare 1080×1080 | Mesajla paylaşılabilir PNG/JPG |
| A5 | **Kullanım kılavuzu PDF'i** (START HERE) | Fixed (US Letter) | Template linkleri; adım adım düzenleme, RSVP kurma, yayınlama, export; sorun giderme |

**Template linkleri:** Her Canva tasarımı için Share → **Template link** (alıcı açınca kendi
kopyası oluşur; Canva Free ile çalışır — Canva Help Center, 2026-10-09). Master edit linki
asla alıcıya gitmez.

**RSVP:** Website'e Canva **Form** öğesi eklenir. Canva'ya göre alıcı kopyasındaki form
yanıtları alıcının hesabına gider, bizimkine karışmaz (Canva Help Center, 2026-10-09).
Satış öncesi iki ayrı hesapla A/B testi yapılır; test yapılmadan "working RSVP" denmez.

## B. Etsy ilan kiti (bizim için — `collections/<koleksiyon>/package/listing/`)

| # | Parça | Not |
|---|---|---|
| B1 | İlan görselleri | Kapak + video/website/PDF mockup'ları + "What's included" + "How it works" + düzenleme örneği |
| B2 | İlan videosu | Kısa, sessiz tanıtım klibi (Etsy'nin güncel süre/boyut kuralları yükleme öncesi doğrulanır) |
| B3 | **Etsy ilan PDF'i** | Başlık, açıklama, 13 etiket, kategori, nitelikler, dijital dosya ayarı, fiyat [PLACEHOLDER], SSS, alıcı mesajı şablonu, görsel/video listesi |
| B4 | Alıcıya giden dosya | A5 kılavuz PDF'i (Etsy'de dijital dosya olarak yüklenir) |

## C. Kim neyi yapar? (araç sınırları — dürüst liste)

| İş | Claude | Kullanıcı (Canva arayüzünde) |
|---|---|---|
| Tasarım, yerleşim, metin, katmanlar, görsel yerleştirme | ✅ Canva araçlarıyla | — |
| GPT görsel prompt'ları | ✅ `assets/gpt/GPT_PROMPTS.md` | GPT'de üretip klasöre koyar |
| Element animasyonu + timeline zamanlaması | ❌ araç yok | Animate + timeline (adımları Claude yazar) |
| Website'e Form (RSVP) ekleme | ❌ araç yok | Elements → Form (adımları Claude yazar) |
| Website yayınlama | ❌ araç yok | Publish |
| Template link oluşturma | ❌ araç yok | Share → Template link |
| PDF/PNG/MP4 export | ✅ export aracı | — |
| Kılavuz PDF ve Etsy PDF içerikleri | ✅ | Ticari bilgileri (marka, fiyat, destek e-postası) verir |

Not: Bu tablo araçlar değiştikçe güncellenir. Canva'ya yerel dosya yüklemek için çalışma
ortamının ağ ayarında `canva.com` izinli olmalı.
