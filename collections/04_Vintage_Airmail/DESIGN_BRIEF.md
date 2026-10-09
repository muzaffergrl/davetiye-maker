# Tasarım 04 — Vintage Airmail Love Letter · tasarım özeti

Kaynak: `tools/katalog.py` (Aşama 1 kataloğu, `docs/09_TASARIM_KATALOGU.md`). Durum: `concept`.

**Ruh:** Uzak diyarlardan gelen eski bir aşk mektubu: hava postası, pullar, damgalar.

| Eksen | Bu tasarım |
|---|---|
| Zarf / açılış | Kenarları kırmızı-lacivert çizgili hava postası zarfı; şerit yırtılarak açılır, mektup kayar. |
| Fotoğraf sunumu | Tırtıklı kenarlı pul ve kartpostal kartları, masaya tek tek düşer. |
| Dekor ailesi | Pullar, boş posta damgası halkaları, kuru çiçek |
| Teknik | vintage baskı (vintage print) |
| Font hedefi | Homemade Apple (script) + Special Elite (bilgi) — Canva'da bulunabilirliği doğrulanacak; bulunamazsa en yakın Canva fontu kaydedilir |
| Ana palet | airmail: ink `#2A2A35` · deep `#3D4F7A` · primary `#B5483E` · mist_top `#F2EADB` · mist_bottom `#DCCDB2` · gold `#A88A5A` · gold_light `#D2BE95` · ivory `#FAF4E8` · leaf `#8A9474` |

## Sahneler (9:16, 1080×1920 — hikâye sırası AGENTS.md şart 4)
| # | Sahne | Bu tasarımda |
|---|---|---|
| 1 | Kapalı zarf / kapak | Kenarları kırmızı-lacivert çizgili hava postası zarfı; şerit yırtılarak açılır, mektup kayar. |
| 2 | Açılış, kart yükselir | Kapanış elemanı (mühür/kurdele/toka) ayrı katman olarak çözülür; kart ayrı katman. |
| 3 | Our Story — 3 fotoğraf | Tırtıklı kenarlı pul ve kartpostal kartları, masaya tek tek düşer. |
| 4 | Davet kartı | Aileler, isimler, davet cümlesi, tarih bloğu, mekân. Dekor: Pullar, boş posta damgası halkaları, kuru çiçek. |
| 5 | Program | Ceremony / Cocktail Hour / Reception + kıyafet. |
| 6 | RSVP | Son tarih, buton, kapanış cümlesi, kapanış elemanının küçük tekrarı. |

Nesneler **ayrı katman** hareket eder; tüm ekranı zoom/fade yetmez. Kişisel alanlar (isim, tarih, monogram,
foto, link) görsele pişirilmez.

## Dosyalar
- Demo içerik: `collections/04_Vintage_Airmail/content.demo.json` (kurgu çift; URL'ler null)
- Renk: `collections/04_Vintage_Airmail/palette.json`
- GPT prompt'ları: `collections/04_Vintage_Airmail/assets/gpt/GPT_PROMPTS.md`
- HTML sahne kaynağı + katmanlar: `collections/04_Vintage_Airmail/video/`, `collections/04_Vintage_Airmail/assets/layers/`, `collections/04_Vintage_Airmail/kit_map.json` (görev G104)
- Canva master: görev G304
