# Tasarım 13 — Enchanted Forest Storybook · tasarım özeti

Kaynak: `tools/katalog.py` (Aşama 1 kataloğu, `docs/09_TASARIM_KATALOGU.md`). Durum: `concept`.

**Ruh:** Masal kitabı: yosun, eğrelti, ateş böceği ışıkları; sayfalar çevrilerek anlatılır.

| Eksen | Bu tasarım |
|---|---|
| Zarf / açılış | Kabartma çiçek bordürlü eski masal kitabı kapağı (yazısız); kapak açılır, sayfalar çevrilir. |
| Fotoğraf sunumu | Kitap sayfalarına yapıştırılmış fotoğraf köşelikli kartlar, sayfa çevrilince belirir. |
| Dekor ailesi | Eğrelti, yosun, mantar, ateş böceği ışığı |
| Teknik | masal kitabı illüstrasyonu (classic storybook ink-and-watercolor illustration) |
| Font hedefi | Tangerine (script) + IM Fell English (bilgi) — Canva'da bulunabilirliği doğrulanacak; bulunamazsa en yakın Canva fontu kaydedilir |
| Ana palet | forest-moss: ink `#2B2A1F` · deep `#4A5A3A` · primary `#6F7F4F` · mist_top `#EDEFE3` · mist_bottom `#BFC7A8` · gold `#B7975A` · gold_light `#DCC58F` · ivory `#F8F4E6` · leaf `#55703F` |

## Sahneler (9:16, 1080×1920 — hikâye sırası AGENTS.md şart 4)
| # | Sahne | Bu tasarımda |
|---|---|---|
| 1 | Kapalı zarf / kapak | Kabartma çiçek bordürlü eski masal kitabı kapağı (yazısız); kapak açılır, sayfalar çevrilir. |
| 2 | Açılış, kart yükselir | Kapanış elemanı (mühür/kurdele/toka) ayrı katman olarak çözülür; kart ayrı katman. |
| 3 | Our Story — 3 fotoğraf | Kitap sayfalarına yapıştırılmış fotoğraf köşelikli kartlar, sayfa çevrilince belirir. |
| 4 | Davet kartı | Aileler, isimler, davet cümlesi, tarih bloğu, mekân. Dekor: Eğrelti, yosun, mantar, ateş böceği ışığı. |
| 5 | Program | Ceremony / Cocktail Hour / Reception + kıyafet. |
| 6 | RSVP | Son tarih, buton, kapanış cümlesi, kapanış elemanının küçük tekrarı. |

Nesneler **ayrı katman** hareket eder; tüm ekranı zoom/fade yetmez. Kişisel alanlar (isim, tarih, monogram,
foto, link) görsele pişirilmez.

## Dosyalar
- Demo içerik: `collections/13_Enchanted_Forest/content.demo.json` (kurgu çift; URL'ler null)
- Renk: `collections/13_Enchanted_Forest/palette.json`
- GPT prompt'ları: `collections/13_Enchanted_Forest/assets/gpt/GPT_PROMPTS.md`
- HTML sahne kaynağı + katmanlar: `collections/13_Enchanted_Forest/video/`, `collections/13_Enchanted_Forest/assets/layers/`, `collections/13_Enchanted_Forest/kit_map.json` (görev G113)
- Canva master: görev G313
