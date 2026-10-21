# GPT işi — PAKET 7: Etsy ilanının 10–20. görselleri + promo video sahnesi (2026-10-21)

Kullanıcı (2026-10-21): Etsy'nin sınırı kadar görsel (ilan başına **20 fotoğraf + 2 video**); ürünü ön planda gösteren,
detayları anlatan, alıcının içini rahatlatan, satın almaya teşvik eden kareler; üstüne gelince oynayan video çok önemli.
İlanlarda şu an 9 görsel + 1 video var → tasarım başına **11 sahne + 1 video sahnesi**, 01–21: **231 görsel + 21 video**.

- Prompt'ların tek kaynağı: her tasarımın `collections/<NN>_*/assets/gpt/GPT_PROMPTS.md` → **PAKET 7** (7.1–7.11 + 7.V).
  Üreten: `python3 tools/paket7_ilan.py --all` (sahne dünyası PAKET 3'ten okunur; değişiklik için betiği düzenle, yeniden üret).
- GPT yalnız **sahne** üretir: ekranlar ve 7.7'deki kartın ön yüzü **düz #00FF00**. Gerçek site ekranlarını, gerçek basılı
  davetiye render'ını ve gerçek açılış kaydını Claude yerleştirir (`tools/mockup_compose.py`, docs/21). Etsy kuralı gereği
  ilan ürünü olduğu gibi gösterir; GPT'nin çizdiği arayüz/ekran kullanılmaz.
- Çıktı yolları: görseller `assets/gpt/mockups/p7_NN_*.png`, video `assets/gpt/video/promo_greenscreen.mp4`.

## GPT'ye (Codex, repo erişimli) yapıştırılacak talimat

```
Task: BKE Studio Etsy listing scenes, PAKET 7, designs 01–21 (repo muzaffergrl/davetiye-maker, branch main).
Work in parallel: start one sub-agent per design (21 sub-agents: 01, 02, … 21). Each sub-agent works only inside its own
folder collections/<NN>_*/assets/gpt/ and does this:
1. Open collections/<NN>_*/assets/gpt/GPT_PROMPTS.md and find the section "## PAKET 7".
2. In ONE image chat: send the "Instructions for GPT" block first, then generate 7.1 to 7.11 in order, using each English
   prompt exactly as written, at the size shown on its "Kaydet" line. Save each image with the exact file name and folder
   on its "Kaydet" line (assets/gpt/mockups/p7_NN_*.png).
3. Check every image against its "Kontrol" line: the exact number of flat pure-green (#00FF00) areas, all four corners of
   every green area visible, no finger/prop/petal on any green area, no text, letters, numbers, logos or watermarks, no
   brand marks on devices. Regenerate any image that fails (keep only the passing one under the exact file name).
4. Then make the 7.V video with your video model (1080×1080, 10–15 s, locked-off camera, phone and its green screen perfectly
   still and fully visible for the whole clip, nothing crosses the screen, no hands, no text). Save it as
   assets/gpt/video/promo_greenscreen.mp4. If you cannot make video, say so in the result and skip it.
5. Commit only that design's new files with the message "PAKET 7 <NN>: ilan sahneleri + promo video sahnesi" and push
   (git pull --rebase origin main first). Do not edit GPT_PROMPTS.md or any other file.
When all sub-agents finish, report one line per design: NN, images saved (x/11), video saved (yes/no), anything regenerated
or doubtful. Do not invent results; if a design is not done, say so.
```

## Sonra (Claude)
Her tasarımda 11 sahneye gerçek ekranlar ve başlıklar yerleştirilir (ilan görselleri 10–20), promo videoya gerçek açılış
kaydı oturtulur (`package/listing/video_promo.mp4`, 1080×1080, H.264, sessiz, 5–15 sn), sonra Etsy taslaklarına eklenir.
Hangi gerçek ekranın hangi sahneye gideceği: 7.1 açılış nesnesi yakın · 7.2 kapalı açılış ekranı · 7.3 home · 7.4 home
(telefon) + details (tablet) · 7.5 düzenleyici (masaüstü) · 7.6 düzenleyici + misafir sayfası · 7.7 basılı davetiye ön
yüzü + home · 7.8 dört sayfa (home, story, details, rsvp; ya da dört dil) · 7.9 details + harita · 7.10 teşekkür modu ·
7.11 Share ekranı.
