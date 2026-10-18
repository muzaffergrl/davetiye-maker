---
id: G181
baslik: Panel (alıcının düzenleyicisi) JS'ini görünüm başına böl; derin linklerin (#share, #edit/photos …) ilk boyamasını hızlandır
rol: claude-kod
durum: inceleme
alan: claude-G181
oncelik: 2
bagimli: [G173]
yazar: [platform/components/panel/Panel.tsx, platform/components/panel/lazy.tsx, platform/components/panel/EditorPage.tsx, platform/components/panel/EditListView.tsx, platform/components/panel/ShareView.tsx, platform/components/panel/HelpSheet.tsx, platform/components/panel/UrlText.tsx, platform/components/panel/views.tsx, platform/components/panel/context.tsx, platform/components/panel/fields.tsx, platform/components/panel/next-steps.ts, platform/components/panel/replies.ts, platform/components/panel/guests.tsx, platform/components/panel/setup-state.ts, platform/components/panel/publish-gate.tsx, platform/components/panel/Setup.tsx, platform/components/panel/Published.tsx, platform/components/panel/sections.tsx, platform/components/panel/zone.ts, platform/components/panel/panel.module.css, platform/app/edit/[slug]/page.tsx, platform/scripts/js-budget.cjs, platform/tests/g173-js-budget.test.ts, platform/tests/g173-browser.ts, platform/tests/g146.test.ts, platform/tests/g181-panel-split.test.ts, platform/tests/g181-browser.ts, platform/README.md, platform/previews/g181/, gorevler/G181-panel-bolme.md]
---

## Amaç
G173'ün açık bıraktığı iki madde: (1) panel tek bir client modülüydü (~366 KB ham, `/edit/[slug]` ilk yük 255,7 KB gzip),
bütün görünümler içindeydi; (2) `#share` / `#edit/photos` doğrudan açılınca LCP ~2,8–3,4 s'ydi, çünkü sunucu hash'i görmüyor ve
görünüm ancak hydration'dan sonra çiziliyordu. Davranış aynı kalacak (otomatik kayıt, kaydedilmemiş değişiklik korumaları, kurulum
adımları, önizleme iframe'i, i18n + `I18N_STRICT`, klavye/odak, hash ile derin linkler). Koordinatör: session_01HP9ZrJ8mhZnigbvsvUQ4pR.

## Sonuç
**2026-10-18 · claude-G181 — durum: inceleme.** Dal `claude/g181-panel-bolme` (taban `claude/zealous-fermi-hy1o40`, son hâli
merge edildi). Yayın yok, main'e dokunulmadı, PR yok. PROJECT_STATE.json / AGENTS.md / CLAUDE.md değişmedi.

### 1. Görünüm başına bölme
- `components/panel/lazy.tsx`: her görünüm ve sheet ayrı chunk (`next/dynamic`): kurulum (`Setup.tsx`), Home (`views.tsx`),
  Edit listesi (`EditListView.tsx`), editör sayfaları (`EditorPage.tsx`: altı sayfanın bütün form parçaları), Guests + yazdırma
  (`guests.tsx`), Share (`ShareView.tsx`), yardım (`HelpSheet.tsx`), isim/tarih değişikliği (`IdentitySheet.tsx`), "Your website is
  live" (`Published.tsx` `LiveSheetBody`, QR kütüphanesiyle).
- Kabukta (`Panel.tsx`) kalanlar: yönlendirme, otomatik kayıt (`usePanel`), çubuklar, önizleme (`PreviewPane`), sheet çerçevesi,
  yayın öncesi kurallar ve örnek tarih kapısı (`publish-gate.tsx`), kurulum durumu (`setup-state.ts`), "next steps"
  (`next-steps.ts`), yanıt sayacı (`replies.ts`), bağlam (`context.tsx`). Görünümlerin paylaştığı küçük parçalar kendi modüllerine
  taşındı (`UrlText.tsx`, `zone.ts`); eski yollar yeniden dışa aktarıyor (`fields.tsx`, `Setup.tsx`, `guests.tsx`, `sections.tsx`).
- Sunucu açılan görünümü yine çiziyor; Next o görünümün chunk'ını önceden yüklüyor. Diğer görünümler ve sheet'ler hydration'dan
  sonra tarayıcı boştayken (`requestIdleCallback`, yoksa `setTimeout`) sırayla iniyor. Chunk'ı gelmiş bir görünüm doğrudan çiziliyor
  (Suspense turu yok, "loading" karesi yok); chunk henüz yoksa kendi Suspense sınırında boş yer tutucu (`ViewLoading`).
- `loading` seçeneği bilerek yok. Verildiğinde `next/dynamic` görünümü bir Suspense sınırına sarıyor. React'in sunucu çizicisi
  büyük bir sınırı hazır olsa bile sayfanın sonuna taşıyıp betikle yerine koyuyor; ölçümde kurulum metni ~250 ms geç boyandı.
  Şimdi SSR HTML'inde askıda sınır yok (`<!--$?-->` 0).
- Alana atlama (`goTo`) ve `#edit/venue` kaydırması, editör chunk'ı gelene kadar bekliyor.

### 2. Derin linkler
Sunucu hash'i görmediği için `BootShell` (Panel.tsx) eklendi: sunucu HTML'i, hydration'a kadar, derin linkin açabileceği her
görünümün iskeletini (çubuklar, alt sekme, başlık) ve küçük bir satır içi betik taşıyor. Betik HTML ayrıştırılırken çalışıyor.
Adres sunucunun çizdiğinden başka bir görünüm istiyorsa (ya da kurulum bu telefonda kapatılmışsa, Home):
1. O görünümün iskeletini gösteriyor (`data-boot`). CSS sunucunun varsayılan görünümünü gizliyor, böylece yanlış görünüm yanıp
   sönmüyor.
2. Sayfayı bir kez `?view=<hash>` ile yeniden istiyor (`location.replace`, geçmişe kayıt eklemiyor). Sunucu o görünümü çiziyor
   (`app/edit/[slug]/page.tsx` → `initialView`, `parseHash` ile doğrulanıyor; kurulum adımı yalnız yayından önce). Panel
   hydration'dan sonra `view`'i adresten siliyor: adreste yine yalnız `k` ve hash kalıyor.
3. `view` zaten adresteyse ya da sunucu onu yok saydıysa ikinci istek yapılmıyor. İskelet kalıyor ve modül değerlendirilirken
   görünüm chunk'ı inmeye başlıyor.

`/edit` için script-src CSP yok (`next.config.ts` `SECRET_PAGE_HEADERS`; Next'in kendi satır içi betikleri de böyle). Bu yüzden
nonce ya da hash gerekmedi. Önce yalnız iskelet + erken chunk denendi: iskelet 0,85 s'de çıktı, ama 4× CPU'da ana JS'in
değerlendirilmesi ve hydration baskın olduğu için gerçek görünüm yine ~3,0–3,4 s'de geldi, LCP iyileşmedi. Bu yüzden sunucu
çizimine geçildi.

### 3. JS bütçesi
`scripts/js-budget.cjs`: `/edit/` 270 → **205 KB** (ölçülen 188,0 + ~%9). `tests/g173-js-budget.test.ts` yeni sınıra göre
güncellendi.

### Önce → sonra (390 px, CPU 4×, yavaş 4G: 150 ms RTT, 1,6 Mbps, önbelleksiz; G173 yöntemi)
Yeni bir yerel sitenin (`/start` ile alınmış, hiç yayınlanmamış olive-ivory) paneli. Her taraf iki koşu; değerler aralık olarak
verildi. Önce = taban commit 572fafc0 (ayrı worktree'de build edildi); sonra = bu dal. Kaynak: `platform/previews/g181/before-{1,2}.json`,
`after-{1,2}.json`.

**"Doğru görünüm"** sütunu `tests/g173-browser.ts`'e eklenen yeni ölçü: adresin istediği görünüm (ya da iskeleti) ekranda ilk ne
zaman var. **Bütün süreler sekmenin İLK navigasyonundan sayılıyor**: `?view=` ile yapılan ikinci isteğin süresi dahil.

| Adres | İlk yük JS (gzip, build) | LCP ms | Doğru görünüm ms | TBT ms | CLS |
|---|---|---|---|---|---|
| `#setup/1` (sunucunun varsayılanı) | 255,7 → **188,0** | 1072–1364 → 1288–1368 | 891–1047 → 980–1066 | 617–687 → 649–699 | 0 |
| `#home` | 255,7 → 188,0 | 1056–1300* → 1855–1856 | **2923–3176 → 1607–1623** | 745–888 → 388–406 | 0 |
| `#edit` | 255,7 → 188,0 | 1068–1328* → 1833–1879 | **2598–2780 → 1609–1648** | 451–582 → 452–522 | 0 |
| `#edit/photos` | 255,7 → 188,0 | **3156–3212 → 1806–1828** | 2855–2919 → 1591–1609 | 696–707 → 493–503 | 0 |
| `#guests` | 255,7 → 188,0 | 1084–1288* → 1814–1837 | **2920–2971 → 1617–1634** | 726–738 → 446–622 | 0 |
| `#share` | 255,7 → 188,0 | **3332–3560 → 1841–1857** | 3038–3269 → 1596–1619 | 829–1000 → 464–533 | 0 |

\* Öncesinde `#home` / `#edit` / `#guests` LCP'si düşük görünüyordu, ama LCP öğesi **yanlış görünümdü**: sunucunun çizdiği kurulum
1. adımının metni (`setupHelp`). Doğru görünüm ancak 2,6–3,2 s'de geliyordu, o ana kadar kurulum ekranı duruyordu. Şimdi LCP
öğesi görünümün kendi metni (`checkText`, `pageTitle`, `emptyText`) ve görünüm 1,6 s'de ekranda.

Diğer ölçümler:
- **Aktarım (6 s pencere):** 351–367 → 473–497 KB, JS 259 → 329–337 KB. Artışın nedenleri:
  - Pencere, hydration sonrası boşta inen diğer görünümleri de içeriyor (toplam ~110 KB gzip; uygulama içi geçişin anlık kalması
    için).
  - Ölçüm önbelleği kapalı. Derin linkte ilk belgenin bitmiş yanıtları (CSS, fontlar) ikinci belgede yeniden iniyor; gerçek
    tarayıcı bunları önbellekten alır.
- **Ön-yüklemesiz ilk yük:** build'in saydığı 188 KB + açılan görünüm. Örnek: Share 21,5 KB, editör 42 KB (kurulumla paylaşılan
  form parçaları dahil), kurulum 34 KB, Home 4 KB.
- **HTML:** iskelet ve betik eklenince 45 → 56 KB ham (9,5 → 11,3 KB gzip).

### Testler
- `npm ci && rm -rf .next && npx tsc --noEmit && I18N_STRICT=1 npm test && npm run build`: merge sonrası sonuç aşağıda
  (Günlük). Merge öncesi: 1653/1653 geçti, build + trace-check + js-budget geçti (`/edit/[slug]` 188,0/205).
- **Yeni `tests/g181-panel-split.test.ts`** (`npm test` içinde):
  - Her görünümün yalnız kendine ait bir metni (işaret) kendi modülünde ve kabuk modüllerinde yok.
  - `Panel.tsx` ve kabuk modülleri hiçbir görünüm modülünü statik import etmiyor; `lazy.tsx` her birini `dynamic()` ile yüklüyor.
  - İskelet her adresi biliyor.
  - Build varsa: `/edit/[slug]`'ın ilk yük dosyalarında (js-budget'ın saydığı runtime + giriş chunk'ları) kabuğun metni var,
    hiçbir görünümün işareti yok; her görünümün chunk'ı build'de ayrı duruyor.
- **Yeni `tests/g181-browser.ts`** (build sonrası, 77/77):
  - Hiç yayınlanmamış ve yayında iki sitede `#home`, `#edit`, `#edit/photos`, `#edit/venue` (venue bölümüne kaydırılmış),
    `#guests`, `#guests/results`, `#guests/print`, `#share`, `#setup/1` doğru görünümü açıyor. Konsol ya da sayfa hatası yok
    (hydration uyuşmazlığı dahil); iskelet kalkıyor; adreste `?view` kalmıyor.
  - JS chunk'ları engellenmiş hâlde: derin link tek ek istekle sunucunun çizdiği görünümü gösteriyor. `view` yok sayıldığında
    doğru iskelet + doğru sekme görünüyor, ikinci istek yok. Varsayılan görünümde hiçbir şey yapılmıyor. Kurulumu kapatılmış
    taslak Home'u açıyor.
  - İlk yükte Share / Guests / editör / yardım kodu yok; boşta hepsi iniyor. Share / Guests / Edit / Our Story'ye dokununca
    görünüm "loading" karesi olmadan geliyor.
  - Ekran: `previews/g181/boot_share_390.png`.
- **Panel tarayıcı testleri:** sonuçlar Günlük'te. `panel-browser` (2 FAIL) ve `claim-browser` (3 FAIL) taban commit'te de
  birebir aynı başarısız. Bu iş onları değiştirmedi:
  - panel-browser: "preview: 390 px wide" 384 px veriyor; Review metninde "Details" alt başlığı tekrarlanıyor.
  - claim-browser: aynı siparişle ikinci başvuru mesajında `[role="status"]` 2 öğe buluyor.
- **`tests/g173-browser.ts`:** panel koşusu `#setup/1` … `#share`, LCP ≤ 2,5 s ve CLS 0 koşullarında 12/12 geçti (iki koşu,
  `--no-a11y`). Ölçüme yeni "doğru görünüm" alanı eklendi. Süreler artık sekmenin ilk navigasyonundan sayılıyor
  (`sessionStorage` + `timeOrigin` farkı).

### Açık kalanlar
- `?view=` yönlendirmesi derin linkte bir ek HTML isteği demek: yavaş 4G'de ~150 ms RTT + ~13 KB. Ölçülen kazanç (doğru görünüm
  ~1,4 s erken) bunu karşılıyor. Yine de uygulama içinde bir view'e yeniden yükleme yapılırsa her seferinde iki istek gidiyor. İleride
  son görünümü bir çerezde tutmak, yeniden yüklemede sunucunun doğrudan o görünümü çizmesini sağlar (bu görevde yapılmadı).
- Kabuk + Next/React runtime hâlâ 188 KB; bunun ~142 KB'ı framework. Kabukta en büyük parçalar içerik doğrulama ve
  `lib/panel/model.ts` (yayın notları, hazırlık); otomatik kayıt ve çubuklar onlara bağlı, bölünmedi.
- Gerçek telefonda ve canlıda ölçülmedi; değerler lab ölçümü (aynı makinede başka ajanlar var, TBT ±%40 oynuyor).

## Günlük
- 2026-10-18 claude-G181: bölme + derin link (iskelet → `?view=` ile sunucu çizimi), bütçe 205, testler → inceleme
