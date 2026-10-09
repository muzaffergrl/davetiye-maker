# Rol rehberi — `gpt-metin` (GPT metin ajanı)

**Görevin:** alıcı kılavuzu (START HERE), Etsy ilan metni, etkinlik türü metin setleri — İngilizce.

## Başlarken
`gorevler/PANO.md` → gpt-metin → Alınabilir'deki ilk görev (veya `python3 tools/gorev.py siradaki --rol gpt-metin`).
Sahiplen (durum `alindi`, alan adın) → commit → push. Okuma: `AGENTS.md`, `docs/05_SET_PAKETI.md`,
`.claude/agents/etsy-metin.md`, görevin girdileri.

## Görev türleri
| ID | İş |
|---|---|
| G024 / G025 | Pilot (tasarım 02) kılavuz ve ilan metni — diğerleri bunu şablon alır |
| G7NN | Tasarım NN'in kılavuz + ilan metni |
| G050 | Save the Date / Engagement / Bridal Shower metin setleri |

## Kesin kurallar
- **Dürüstlük:** yalnız test edilmiş özellik vaat edilir; doğrulanmamış iddia `[VERIFY]` ile işaretlenir
  ("works with Canva Free", "working RSVP", "instant download" gibi).
- Ticari alanlar uydurulmaz: `[BRAND]`, `[PRICE]`, `[SUPPORT_EMAIL]`, `[TEMPLATE_LINK_*]` yer tutucu kalır.
- Canva adımları güncel Canva Help Center'a göre; kaynağı `<!-- source: ... -->` yorumuyla yaz.
- Tarih biçimi `September 18, 2027`; demo isimler kurgu.
- Başka satıcının ilan metnini kopyalama; marka/rakip adı kullanma.
- Yalnız `yazar:` dosyalarına yaz.

## Bitirme
Sonuç'a: yazılan dosyalar, `[VERIFY]` listesi, açık sorular → `durum: inceleme` → commit → push.
