# Tasarım 24 — Grand Theatre Premiere · tasarım özeti

Kaynak: `docs/24_YENI_TASARIMLAR.md` (dalga 23–28, 2026-10-17) satır 24 + G162 (platform teması, GPT parçalarından önce).
Katalog: `tools/katalog.py` `EK_TEMALAR` (6 eksen + hareket imzası; D'ye girmedi). Çalışma adı marka değildir.

**Ruh:** gala gecesi — tavus mavisi kadife perde, antik altın proscenium, fildişi bir tiyatro programı; klasik, romantik,
zengin; geniş beğeni (Belle Époque opera binası).

| Eksen | Bu tasarım |
|---|---|
| Kapalı nesne / açılış | Antik altın kemer altında tavus mavisi kadife sahne perdesi. Dokununca salon ışıkları kısılır, iki kanat ağır kıvrımlarla aralanır (sol önce, sağ 140 ms sonra; aşıp yerine oturur), toplanmış perdelere el değiştirip salınır; spot ışığı soldan sahneyi tarayıp program kartına oturur, kart sahnenin önüne çıkar ve home'a uçar |
| Fotoğraf sunumu | Story = "perde arası": karanlık kadife sahnede kademeli duran üç kart (Scene I–III); spot ışığı dokunulan / üzerine gelinen kartı aydınlatır ve kaldırır |
| Dekor ailesi | Kadife perde, püskül, altın proscenium kemer, program (playbill) kâğıdı, bilet koçanı |
| Teknik | yağlı boya tiyatro afişi |
| Font | Abril Fatface (isimler, başlıklar) + Playfair Display (metin) — Google Fonts, latin-ext |
| Ana palet | pit `#061416` · velvet `#0E3D40` · peacock `#16595B` · antique gold `#C9A45C` · ivory `#F3EBD8` · ink `#1E2626` |
| Hareket imzası | Perde aralanması (kademeli, salınımlı), spot ışığı maskesi (story), program sayfası çevirme geçişi (View Transitions türleri `turn-next`/`turn-prev`, yedek: sayfa yerleşmesi), RSVP'de bilet koçanının delikli çizgiden yırtılması |

Diğer 22 tasarımdan farkı: kapalı nesne zarf değil perde (hiçbir tasarımda yok); açılış kanatların yana toplanması +
ışık süpürmesi; sayfalar arası geçiş sayfa çevirme (diğerleri solma / kart uçuşu); RSVP gönderiminde nesne hareketi.

## Dosyalar
- Demo içerik: `content.demo.json` (kurgu Charlotte & Theodore, The Larkmont Grand Theatre — kurgu mekân, Richmond,
  Virginia; 16 Ekim 2027; URL'ler null; örnek fotoğraf yok — PAKET 2 bekliyor)
- GPT: `assets/gpt/GPT_PROMPTS.md` (PAKET 5 W2.1–W2.13, PAKET 2 2.1–2.5, PAKET 6 P1–P4) — hiçbiri üretilmedi
- Tema: `platform/themes/grand-theatre-premiere/` (README: açılış, sayfalar, geçici parçalar, sapmalar)
- Basılı davetiye: `platform/lib/print/layouts.ts` (composed, geçici); ilan taslağı: `package/listing/listing_v3.md`
