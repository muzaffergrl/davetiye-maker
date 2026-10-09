# Fabrika planı — kalıp × kit ile seri üretim

Son güncelleme: 2026-10-09 · Sahibi: entegratör (`claude-canva`)

Bu belge **ne üreteceğimizi ve hangi sırayla** üreteceğimizi anlatır. **Kimin hangi işi
nasıl alacağı** ise `gorevler/README.md` dosyasındadır. Bütün ajanlar (Claude, GPT/Codex,
GPT görsel) önce `AGENTS.md`'yi, sonra bu dosyayı, sonra `gorevler/README.md`'yi okur.

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

**Aşama 2 — her tasarım × 5 renk paleti.** Paletler, tasarımın master'ı kaydedildikten sonra o tasarıma
uygun seçilir. Kapı görevi: `G090`. Tasarım 02 için 5 palet (V02–V06) hazır ama `G090`'a kilitli.

## 3. Üretim hattı (her tasarım için aynı)

| Adım | Görev | Rol | Çıktı |
|---|---|---|---|
| 1 | `G1NN` kaynak | gpt-kod | HTML sahne kaynağı (kodla çizilmiş şekiller) + ayrı katmanlar + `kit_map.json` + MP4 önizleme |
| 2 | `G2NN` görsel | gpt-gorsel | Doku/dekor/kapanış/çerçeve görselleri (`GPT_PROMPTS.md`) |
| 3 | `G3NN` Canva | claude-canva | `kit_build` → Canva video master (ayrı katman, Canva metni) |
| 4 | set parçaları | gpt-kod + claude-canva + gpt-metin | website, PDF, story/kare, kılavuz, Etsy kiti — **tasarım 02'de hat kanıtlanınca** (G020–G027) diğer 19 tasarıma görev olarak açılır |

Adım 1 ve 2 birbirini beklemez (aynı anda yürür). Ortak araçlar: `G002` kit_build, `G003` kit_check,
`G026` md→pdf, `G040` varyant hattı. Tasarım 02 pilot hattır: araçlar önce onda denenir.

## 4. Roller

| Rol | Kim | Ne yapar | Ne yapmaz |
|---|---|---|---|
| `claude-canva` | Claude Code (Canva bağlayıcısı olan oturum) | Bütün Canva işleri; **entegratör**: `PROJECT_STATE.json`, `COLLECTION_STATUS.md`, `AGENTS.md`, `00_ANA_DEVIR.md`, bu belge | Konsept görsel üretmez |
| `gpt-gorsel` | ChatGPT görsel üretimi | `GPT_PROMPTS.md` dosyalarındaki görselleri üretir, belirtilen yola belirtilen adla koyar | Canva'ya dokunmaz, yazı/logo içeren görsel üretmez |
| `gpt-kod` | Codex / kod ajanı | `tools/` araçları, website/PDF HTML kaynakları, içerik kayıtları, PDF üreticileri | Canva'ya dokunmaz, entegratör dosyalarını düzenlemez |
| `gpt-metin` | GPT metin ajanı | İngilizce ilan metni, kılavuz metni, etkinlik türü metin setleri | Test edilmemiş özelliği vaat etmez, ticari alan uydurmaz |
| `claude-qa` | Claude (qa-kontrol alt ajanı) | Salt okunur denetim raporu | Dosya değiştirmez (yalnız kendi rapor dosyası) |

## 5. Açık blokajlar (kullanıcıya verilmez)

Canva API'sinde şu işlerin aracı yok: **element animasyonu/timeline, website Form (RSVP),
website yayınlama, template link**. Çözüm araştırması: `G004` → sonuç
`docs/08_CANVA_UI_BLOKAJ.md`. Bu çözülene kadar A1/A2 `sale_ready` olamaz; diğer işler
beklemeden ilerler.

## 6. Dosya sahipliği (çakışmayı önleyen tek kural)

- Bir ajan **yalnız aldığı görevin `yazar:` alanındaki yollara** yazar.
- `PROJECT_STATE.json`, `collections/*/COLLECTION_STATUS.md`, `AGENTS.md`, `CLAUDE.md`,
  `00_ANA_DEVIR.md`, `docs/06_FABRIKA_PLANI.md` → **yalnız entegratör** (`claude-canva`).
  Diğer ajanlar sonuçlarını kendi görev dosyalarının **Sonuç** bölümüne yazar; entegratör
  durum dosyalarına taşır.
