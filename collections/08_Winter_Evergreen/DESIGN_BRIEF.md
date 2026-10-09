# Tasarım 08 — Winter Evergreen · tasarım özeti

Kaynak: `tools/katalog.py` (Aşama 1 kataloğu, `docs/09_TASARIM_KATALOGU.md`). Durum: `concept`.

**Ruh:** Karlı bir dağ köşkü: çam dalları, kırmızı yaban mersini, kar taneleri.

| Eksen | Bu tasarım |
|---|---|
| Zarf / açılış | Orman yeşili zarf, çam dalı ve kırmızı kurdeleyle mühürlü; kar yağarken açılır. |
| Fotoğraf sunumu | Buğulu pencere camı çerçeveleri, buğu silinerek görünür. |
| Dekor ailesi | Çam, ardıç, kırmızı meyve, kozalak |
| Teknik | suluboya (soft watercolor) |
| Font hedefi | Parisienne (script) + Libre Baskerville (bilgi) — Canva'da bulunabilirliği doğrulanacak; bulunamazsa en yakın Canva fontu kaydedilir |
| Ana palet | evergreen: ink `#1F2E26` · deep `#2F5240` · primary `#3E6B53` · mist_top `#EEF2F1` · mist_bottom `#C9D6D2` · gold `#B79B5E` · gold_light `#DCC895` · ivory `#FAFAF6` · leaf `#3E6B53` |

## Sahneler (9:16, 1080×1920 — hikâye sırası AGENTS.md şart 4)
| # | Sahne | Bu tasarımda |
|---|---|---|
| 1 | Kapalı zarf / kapak | Orman yeşili zarf, çam dalı ve kırmızı kurdeleyle mühürlü; kar yağarken açılır. |
| 2 | Açılış, kart yükselir | Kapanış elemanı (mühür/kurdele/toka) ayrı katman olarak çözülür; kart ayrı katman. |
| 3 | Our Story — 3 fotoğraf | Buğulu pencere camı çerçeveleri, buğu silinerek görünür. |
| 4 | Davet kartı | Aileler, isimler, davet cümlesi, tarih bloğu, mekân. Dekor: Çam, ardıç, kırmızı meyve, kozalak. |
| 5 | Program | Ceremony / Cocktail Hour / Reception + kıyafet. |
| 6 | RSVP | Son tarih, buton, kapanış cümlesi, kapanış elemanının küçük tekrarı. |

Nesneler **ayrı katman** hareket eder; tüm ekranı zoom/fade yetmez. Kişisel alanlar (isim, tarih, monogram,
foto, link) görsele pişirilmez.

## Dosyalar
- Demo içerik: `collections/08_Winter_Evergreen/content.demo.json` (kurgu çift; URL'ler null)
- Renk: `collections/08_Winter_Evergreen/palette.json`
- GPT prompt'ları: `collections/08_Winter_Evergreen/assets/gpt/GPT_PROMPTS.md`
- HTML sahne kaynağı + katmanlar: `collections/08_Winter_Evergreen/video/`, `collections/08_Winter_Evergreen/assets/layers/`, `collections/08_Winter_Evergreen/kit_map.json` (görev G108)
- Canva master: görev G308
