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
| 2 | G2NN görsel | gpt-gorsel | Paket 1: doku, dekor, kapanış, çerçeve | — |
| 3 | G3NN Canva video | claude-canva | `kit_build` → Canva video master | 1, 2, G002 |
| 4 | G4NN website | claude-kod | website HTML kaynağı | pilot G020 |
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

## 6. Dosya sahipliği (çakışmayı önleyen tek kural)

- Bir ajan **yalnız aldığı görevin `yazar:` alanındaki yollara** yazar.
- `PROJECT_STATE.json`, `collections/*/COLLECTION_STATUS.md`, `AGENTS.md`, `CLAUDE.md`,
  `00_ANA_DEVIR.md`, `docs/06_FABRIKA_PLANI.md` → **yalnız entegratör** (`claude-canva`).
  Diğer ajanlar sonuçlarını kendi görev dosyalarının **Sonuç** bölümüne yazar; entegratör
  durum dosyalarına taşır.
