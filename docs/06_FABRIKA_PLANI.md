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

## 2. Varyant matrisi

Kalıp **T1 — Envelope Story** (`collections/02_Dusty_Blue`, Canva video master `DAHXhAaKIhI`):
zarf → mühür → kart yükselir → 3 polaroid → davet kartı → program → RSVP.

| Kod | Renk kiti | Klasör | Durum |
|---|---|---|---|
| V01 | Dusty Blue & Champagne | `collections/02_Dusty_Blue/assets/gpt/` | prompt hazır |
| V02 | Blush & Champagne | `collections/02_Dusty_Blue/variants/V02_blush_champagne/` | prompt hazır |
| V03 | Terracotta & Cream | `collections/02_Dusty_Blue/variants/V03_terracotta_cream/` | prompt hazır |
| V04 | Navy & Gold | `collections/02_Dusty_Blue/variants/V04_navy_gold/` | prompt hazır |
| V05 | Burgundy & Blush | `collections/02_Dusty_Blue/variants/V05_burgundy_blush/` | prompt hazır |
| V06 | Lavender & Silver | `collections/02_Dusty_Blue/variants/V06_lavender_silver/` | prompt hazır |

Renk kitlerinden sonra aynı kalıpla **etkinlik türleri**: Save the Date, Engagement,
Bridal Shower (metin setleri `G050`). Daha sonra kalıp T2, T3 (yeni koleksiyon kararıyla).

Örnek fotoğraflar (çift, anılar, mekân) **bütün varyantlarda ortaktır**: V01 Paket 2.

## 3. Aşamalar

| Aşama | Hedef | Bitiş şartı |
|---|---|---|
| **A — Altyapı** | Görev panosu, kit standardı, kit araçları, Canva UI blokaj araştırması | `G002`, `G003`, `G004` bitti |
| **B — V01 kit** | Fotogerçekçi doku/dekor/foto; Canva master'a takılı | `G012` bitti, önizleme onaylı |
| **C — V01 tam set** | A1–A5 + B1–B3 (`docs/05_SET_PAKETI.md`) | QA (`G027`) temiz; blokajlar dürüstçe yazılı |
| **D — Renk varyantları** | V02–V06 kitleri + Canva varyantları | Her varyantta kit kontrolü + QA |
| **E — Etkinlik türleri** | Save the Date, Engagement, Bridal Shower | Metin seti + Canva varyantı + QA |

Aşamalar **sıralı değil, paraleldir**: GPT görsel ajanları B ve D'nin görsellerini aynı anda
üretebilir; Codex araçları A'da yazarken Claude Canva'da çalışır. Bağımlılıklar görev
dosyalarındaki `bagimli:` alanındadır.

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
