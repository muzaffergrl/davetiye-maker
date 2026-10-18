# Fabrika planı — kalıp × kit ile seri üretim

Son güncelleme: 2026-10-09 · Sahibi: entegratör (`claude-canva`)

Bu belge **ne üreteceğimizi ve hangi sırayla** üreteceğimizi anlatır. **Kimin hangi işi
nasıl alacağı** ise `gorevler/README.md` dosyasındadır. Bütün ajanlar (Claude oturumları ve GPT
görsel ajanları) önce `AGENTS.md`'yi, sonra bu dosyayı, sonra `gorevler/README.md`'yi okur.

Kalıcı kural: **kullanıcı elle hiçbir iş yapmaz** (AGENTS.md, kalıcı talep 6). Ajanlar
kullanıcıya iş vermez; yapılamayan iş görev dosyasında `blokaj` olarak işaretlenir.

## 1. Fikir

Her ürünü sıfırdan çizmiyoruz. İki parçalı bir sistem kuruyoruz:

| Parça | Ne? | Kaç kez yapılır? |
|---|---|---|
| **Kalıp (iskelet)** | Sahne düzeni, metin kutuları, katman sırası, (ileride) animasyonlar. Canva'da 5 tasarım: video, website, PDF davetiye, story/kare, kılavuz | Kalıp başına **bir kez** |
| **Kit (stil)** | Aynı adlı, aynı ölçülü görsel katmanlar + renk token'ları (`palette.json`) | Renk/stil başına bir kez |

**Varyant = kalıbın Canva kopyası + kitin katmanları (`update_fill`) + metin renkleri.**
Bu yüzden kit dosya adları ve ölçüleri **asla** değişmez: `docs/07_KIT_STANDARDI.md`.

## 2. Hedef (kullanıcı kararı, 2026-10-09)

**Aşama 1 — birbirinden tamamen farklı 20 tasarım**, her biri eksiksiz paket (`docs/05_SET_PAKETI.md`).
Katalog: `docs/09_TASARIM_KATALOGU.md` (kaynak `tools/katalog.py`). Her tasarım 6 eksende tanımlı
(zarf/açılış, foto sunumu, dekor ailesi, teknik, font, ana palet); her çift en az 4 eksende farklı.
01 Olive & Ivory ve 02 Dusty Blue bu 20'nin içindedir; 03–20 yeni koleksiyonlardır.

**Aşama 2 — her tasarıma orijinale EK 5 renk paleti** (kullanıcı kararı 2026-10-09). Sonuç: 20 orijinal +
100 renk varyantı = **120 ürün**. Kapı görevi `G090`: 20 tasarımın eksiksiz paketi QA'dan geçince açılır.
Tasarım 02'nin 5 paleti (V02–V06) prompt'larıyla hazır, kapıya kilitli.

## 3. Üretim hattı (her tasarım için; numaralar `gorevler/README.md` §1b)

| Adım | Görev | Rol | Çıktı | Bekler |
|---|---|---|---|---|
| 1 | G1NN kaynak | claude-kod | HTML sahne kaynağı + ayrı katmanlar + `kit_map.json` + MP4 önizleme | — |
| 2 | G2NN görsel | gpt-gorsel | Paket 5 (website: W1 comp'lar + W2 parçalar) + Paket 2 fotoğraflar (K22–K24, G033; §0) | — |
| 3 | G3NN Canva video | claude-canva | `kit_build` → Canva video master | 1, 2, G002 |
| 4 | G4NN website | claude-kod | platform teması `platform/themes/<tema>/` (K24; §0) | 2, G038, G046 |
| 5 | G5NN baskı | claude-kod | 5×7 davetiye + story/kare kaynağı | pilot G022 |
| 6 | G6NN Canva set | claude-canva | Canva website + PDF + story/kare + export | 3, 4, 5, pilot G021/G023 |
| 7 | G7NN metin | claude-metin | kılavuz + Etsy ilan metni | pilot G024/G025 |
| 8 | G8NN mockup | gpt-gorsel | Paket 3: telefon, laptop, kart | — |
| 9 | G9NN ilan kiti | claude-kod | ilan görselleri, video, PDF | 6, 7, 8, G026, G028 |
| 10 | GANN video UI | claude-tarayici | animasyon + video template link | G004, 3 |
| 10b | GBNN website UI | claude-tarayici | Canva Form, yayın testi, set template link'leri | 6 |
| 11 | GQNN QA | claude-qa | QA raporu | 9, 10, 10b |
| Aşama 2 | GP1NN → GP2NN → GP3NN → GP4NN | claude/gpt | 5 palet: prompt → görsel → Canva → ilan | G090 |

Tasarım 02 pilot hattır (G001–G027, G902, GA02): ortak araçlar ve şablonlar önce onda kurulur, sonra
diğer tasarımlar aynı düzeni izler. Adım 1, 2, 4, 5, 7, 8 bekleme olmadan paralel yürür.

## 0. K22 (2026-10-13): ürün yalnız website
Videodan çıkıldı. Ürün: mobil öncelikli tek sayfa düğün websitesi; görseller GPT (K21). Bütün açık görevler
(G011, G013 hariç) askıya alındı; yeni website standardı tasarım 03 demosuyla (G035) belirlenecek.
Teslim biçimi (Canva Website / kendi kodlu site + düzenleme formu) kullanıcı kararını bekliyor.

**Tasarım başına website hattı (G033, 2026-10-13; K22–K24):** 03 dışındaki her tasarım iki görevle tema olur.
**G2NN** (gpt-gorsel): koleksiyonun `assets/gpt/GPT_PROMPTS.md` → PAKET 5 (W1: 5 telefon ekranı comp'u — kapalı zarf
sayfası, home, story, details, rsvp; W2: ~17 website parçası — kapalı/açık zarf + kapanış elemanı, kartlar, dikey/yatay
foto çerçevesi, köşe kümeleri, 3 accent, arka planlar, hero) + PAKET 2 (5 örnek fotoğraf). → **G4NN** (claude-kod):
`platform/themes/<tema>/` — 03 temasının yapısı, yalnız o tasarımın GPT parçaları, tasarıma özgü zarf açılışı ve
sıralı sayfa koreografisi (MOTION), foto alanları, 390 px önizlemeler; G2NN + G038 (03 teması) + G046 (tema standardı)
bitince açılır. **Model tasarım 03'tür** (G030 parçalar, G035 site, G036 fotoğraflar, G038 tema). Prompt'lar
`python3 tools/katalog.py paket5`, görevler `katalog.py gorev5` ile üretilir; sanat yönetimi (zarf, kapanış, açılış
hikâyesi, çerçeve, accent'ler) `tools/katalog.py` → `WEB`, özet tablo `docs/09_TASARIM_KATALOGU.md`.

## 3a. Tasarım modeli — GPT tasarlar, Claude birleştirir (K21, 2026-10-09)
Kodla çizilmiş zarf/kart/çerçeve sahneleri (G1NN) kullanıcı tarafından "amatör, basit" bulundu ve durduruldu.
Yeni hat, her tasarım için:
1. **GPT — Paket 4 T1:** 6 video sahnesinin bitmiş tasarımı (comp, demo metinli; yalnız referans, satılmaz).
2. **GPT — Paket 4 T2:** aynı tasarımın parçaları (arka plan, kapalı/açık zarf, kapanış elemanı, kartlar,
   foto çerçeveleri, çiçek kümeleri, petal, ayırıcı, website hero). Yazı yok; foto pencereleri düz `#00FF00`.
3. **Claude — `tools/parts_prep.py`:** kırpma, yeşil pencereyi şeffaflaştırma + foto alanı koordinatı, ön cep kesimi.
4. **Claude — Canva montajı:** comp'a bakarak parçaları yerleştirir; metinler Canva metni, fotoğraflar değiştirilebilir alan.
5. **claude-tarayici:** animasyon/zamanlama, Form, template link (değişmedi).
Website, PDF ve paylaşım görselleri de aynı GPT parçalarını kullanır. Claude yeni görsel/şekil tasarlamaz.
Pilot: tasarım 03 — G030 (GPT) → G032 (araç) → G031 (montaj) → kullanıcıya comp↔Canva karşılaştırması → G033 (20 tasarıma yayılım).

**GPT görselleri gelince (G176):** kullanıcı görselleri (çoğu rastgele indirme adıyla) verince Claude her birine bakar,
`{"<gelen dosya>": "<GPT_PROMPTS.md'deki hedef yol>"}` haritasını yazar ve tek komut koşar:
`python3 tools/gpt_yerlestir.py --eslestir harita.json` (kuru: hedef bir prompt'ta isteniyor mu, oran/şeffaflık/`#00FF00`
penceresi tutuyor mu, farklı bir dosya eziliyor mu — tek red = hiçbir şey yazılmaz) → aynısı `--uygula` (kopyala; etkilenen
her tasarımda `build_images.py` → `build-print-assets.ts` → palet → img/ referans + manifest denetimi → `etsy_upload.py`;
`--theme-check` ve `--ilan` üretim build'iyle; sonda `gpt_bekleyen.py --yaz`). Yerleştirmeden: `--koleksiyon NN|all`.
Tasarım × adım tablosu ve "live için kalanlar" (eksik parça, başarısız/koşulmamış denetim, göz kontrolü) basılır; live'a
alma, yayın ve Etsy her zaman koordinatörün ayrı kararıdır.

## 3b. Video pilotu — İPTAL (2026-10-09, K19)
GPT ajan oturumunda video üretim aracı yok; Higgsfield kullanılmayacak. Animasyon Canva-yerel (GANN,
claude-tarayici). GV02A/B/C kapatıldı.

## 4. Roller

**İş bölümü (kullanıcı kararı 2026-10-09):** kod ve metin işleri **Claude**, bütün görseller **GPT (imagegen)**.
Claude görsel üretmez; GPT kod/Canva/metin görevi almaz.

| Rol | Kim | Ne yapar | Ne yapmaz |
|---|---|---|---|
| `claude-canva` | Claude Code (Canva bağlayıcısı olan oturum) | Bütün Canva işleri; **entegratör**: `PROJECT_STATE.json`, `COLLECTION_STATUS.md`, `AGENTS.md`, `00_ANA_DEVIR.md`, bu belge | Konsept görsel üretmez |
| `gpt-gorsel` | ChatGPT görsel üretimi (imagegen) — **bütün görseller yalnız GPT'de** | `GPT_PROMPTS.md` dosyalarındaki görselleri üretir, belirtilen yola belirtilen adla koyar | Canva'ya dokunmaz, yazı/logo içeren görsel üretmez |
| `claude-kod` | Claude Code oturumu (kod) | `tools/` araçları, website/PDF HTML kaynakları, içerik kayıtları, PDF üreticileri | Canva'ya dokunmaz, entegratör dosyalarını düzenlemez |
| `claude-metin` | Claude oturumu (metin) | İngilizce ilan metni, kılavuz metni, etkinlik türü metin setleri | Test edilmemiş özelliği vaat etmez, ticari alan uydurmaz |
| `claude-tarayici` | Claude, kullanıcının bilgisayarında (masaüstü uygulaması + tarayıcı) | Canva arayüzü işleri: animasyon, template link, website Form, yayın testi | Tasarım içeriğini değiştirmez; ödeme/hesap ayarı yok |
| `claude-qa` | Claude (qa-kontrol alt ajanı) | Salt okunur denetim raporu | Dosya değiştirmez (yalnız kendi rapor dosyası) |

## 5. Açık blokajlar (kullanıcıya verilmez)

Canva API'sinde şu işlerin aracı yok: **element animasyonu/timeline, website Form (RSVP),
website yayınlama, template link**. Araştırma bitti (`G004`): `docs/08_CANVA_UI_BLOKAJ.md` —
bulut ortamından yapılamıyor. **Karar: A** — Claude kullanıcının bilgisayarında Canva oturumlu tarayıcıyı kullanır
(rol `claude-tarayici`, görevler GANN/GBNN). Bu çözülene kadar A1/A2 `sale_ready` olamaz; diğer işler
beklemeden ilerler.

**Bekleyen fikir (kullanıcı: "pilot beklesin", 2026-10-09):** video için Canva yerine kendi düzenleme
sayfamız (alıcı linkte isim/tarih/foto girer, MP4'ü tarayıcıda üretip indirir; HyperFrames ile aynı teknik).
Değişmeyecek şart 1'i video için değiştirir → kullanıcı kararı. GPT tasarım pilotu (G030/G031) görüldükten
sonra yeniden sorulacak; o zamana kadar görev açılmaz.

## 6. Dosya sahipliği (çakışmayı önleyen tek kural)

- Bir ajan **yalnız aldığı görevin `yazar:` alanındaki yollara** yazar.
- `PROJECT_STATE.json`, `collections/*/COLLECTION_STATUS.md`, `AGENTS.md`, `CLAUDE.md`,
  `00_ANA_DEVIR.md`, `docs/06_FABRIKA_PLANI.md` → **yalnız entegratör** (`claude-canva`).
  Diğer ajanlar sonuçlarını kendi görev dosyalarının **Sonuç** bölümüne yazar; entegratör
  durum dosyalarına taşır.
