# Timberstore.sk — best practices pro vývoj

> Závazná pravidla pro veškerý vlastní kód na e-shopu timberstore.sk (Shoptet).
> Cíl: aby se po desítkách úkolů kód nerozsypal — vždy víme, co je na webu nasazené, odkud to přišlo a jak to vrátit.
>
> Stav: **schváleno 26. 9. 2026** — změny pravidel se zapisují sem a do CHANGELOGu.

---

## 0. Tvrdá pravidla (shrnutí — přebírá je `CLAUDE.md`)
1. **Co není v repu, neexistuje.** V Shoptet adminu ani na serveru se nic neupravuje ručně.
2. **V Shoptetu je jen loader.** Produkce = git tag přes jsDelivr, nikdy `@main`.
3. **Žádné tajné údaje v repu** — je veřejné. Klíče a URL feedů s klíčem jen v `.env` na serveru.
4. **Nastavení → CSS → JS.** Kód až tehdy, když to neumí admin.
5. **Modul dodržuje kontrakt**: `name` + `pages` + idempotentní `init`, spouštěný v try/catch.
6. **Selektory, eventy, detekce stránky a texty Shoptetu jen v `core/`.**
7. **CSS: `ts-` + BEM + `--ts-*` proměnné**, přepisy Shoptetu jen v `styles/overrides/`.
8. **Rozpočet: JS ≤ 30 kB, CSS ≤ 15 kB gzip**, nic blokujícího, PageSpeed nesmí klesnout.
9. **Před nasazením preview + checklist**; viditelné změny schvaluje klient.
10. **Hromadné importy: záloha exportem + dry-run + jen měněné sloupce.**
11. **Každá změna má kód karty z Trella**; každá změna v adminu jde do `ADMIN-CHANGES.md` i s původním stavem.
12. **E-shop na serveru Hetzner za běhu nezávisí.** Server dělá jen pomocné úlohy (obrázky, feedy, importy); frontend jde vždy z jsDelivr.

---

## 1. Základy

### 1.1 Zdroj pravdy = Git repo
- Veškerý vlastní kód (JS, CSS, HTML šablonky, backend úlohy) žije v **jednom GitHub repu**.
- Shoptet admin je **cíl nasazení, ne místo úprav**. V „Editoru HTML kódu" smí být jen loader (viz 3.1) a nic, co není v repu.
- Co není v repu, neexistuje. Když se na webu najde kód mimo repo, buď se převezme (1.3), nebo smaže.

### 1.2 Nasazení přes jsDelivr z git tagů
- Frontend se sestaví do `dist/` a vydá **git tagem** (`v1.4.0`, semver).
- Soubory se načítají z pevné verze: `https://cdn.jsdelivr.net/gh/<user>/<repo>@v1.4.0/dist/timber.min.js` — přes loader v Shoptetu (3.1), kde je verze uvedená na jediném místě.
- **Nikdy `@main` ani `@latest` v produkci** — branch odkazy jsDelivr cachuje nepředvídatelně (hodiny až dny).
- Verzované URL jsou neměnné → žádné ruční `?v=173`. Rollback = vrátit číslo verze v loaderu.
- Repo je **veřejné** (jsDelivr to vyžaduje). Důsledek: **do repa nikdy nejdou tajné údaje** — hesla, API klíče, ani URL feedů s klíčem v adrese (např. `feedKey=…`). Ty patří do `.env` na serveru (viz 4.5).

### 1.3 Stávající kód — přebírá se postupně
- Nový kód se píše rovnou podle tohoto standardu.
- Starý kód (timber-menu.js, slidery, ostatní skripty) se **převede do repa ve chvíli, kdy na něj sáhne úkol** — ne velkým refaktorem naráz.
- Při převzetí: zapsat do `LEGACY.md`, odkud skript pochází, kde se načítá a co dělá; odstranit duplicitní načtení.
- Inventář starého kódu se průběžně doplňuje v `LEGACY.md`.

### 1.4 Jazyk
- Tento dokument a komunikace: **česky**.
- Kód, názvy, komentáře, commit zprávy: **anglicky**.
- Texty pro zákazníka (UI): **slovensky**, držené na jednom místě (viz sekce 2).

---

## 2. Struktura JS/CSS a build

### 2.0 Pořadí řešení: nastavení → CSS → JS
- Než se napíše kód, ověřit, jestli to neumí **nastavení Shoptetu** (např. O3 poznámka a slevový kód, D2 skrytí parametrů). Nastavení nemá údržbu.
- Když nestačí nastavení, zkusit **CSS**. Teprve pak **JS**.
- Změny provedené v adminu (ne v kódu) se zapisují do `ADMIN-CHANGES.md` — co, kde, proč, datum, karta v Trellu.

### 2.1 Struktura repa
```
src/
  core/          # init, detekce stránky, eventy, selektory, texty, logger
  modules/
    qty-picker/  # jeden modul = jedna funkce
      index.js
      qty-picker.css
  styles/
    tokens.css   # --ts-* proměnné (barvy, mezery, breakpointy)
    overrides/   # přepisy Shoptet komponent, soubor na komponentu
  legacy/        # převzatý starý kód, než se přepíše
dist/            # výstup buildu (commituje se — jsDelivr ho servíruje)
backend/         # úlohy běžící na serveru Hetzner (sekce 4)
shared/          # utility sdílené frontendem i backendem
shoptet/         # loader.html — jediný kód vložený v Shoptetu (sekce 3)
server/          # konfigurace serveru: setup, docker-compose, Caddy, crontab
LEGACY.md  ADMIN-CHANGES.md  CHANGELOG.md
```

### 2.2 JavaScript
- **Vanilla JS (ES2020)**. jQuery jen pro napojení na Shoptet pluginy, které jinak ovládat nejdou — a vždy s komentářem proč.
- **Jeden globál**: `window.Timber` (verze, seznam modulů, debug). Nic dalšího do `window`.
- **Kontrakt modulu** — každý modul exportuje:
  ```js
  export default {
    name: 'qty-picker',
    pages: ['category', 'search'],   // kde se aktivuje
    init(root) { /* ... */ },        // musí být idempotentní
  };
  ```
- `core` volá `init` každého modulu v **try/catch** — pád jednoho modulu nesmí shodit ostatní ani Shoptet.
- **Idempotence**: `init` se smí zavolat opakovaně bez zdvojení (značka `data-ts-init` na elementu). Poučení z timber-menu.js načteného 2×.
- **Shoptet překresluje obsah AJAXem** (filtry, stránkování, košík) → moduly se znovu inicializují na Shoptet eventy (`ShoptetDOMPageContentLoaded`, `ShoptetCartUpdated` apod.). Názvy eventů jsou jen v `core/events.js`.
- **Detekce typu stránky** jen v `core/page.js`. Moduly ji nikdy nedělají samy.
- **Selektory Shoptetu** jen v `core/selectors.js`. Když Shoptet změní šablonu, opravuje se jedno místo.
- Vlastní elementy: styl přes třídy `.ts-*`, JS háčky přes `data-ts-*` atributy — styl a chování se neplete.
- **Texty pro zákazníka** (slovensky) jen v `core/texts.js`, žádné řetězce natvrdo v modulech.
- **Knihovny** přes npm s pevnou verzí, bundlované do balíku. Žádné další `<script>` z cizích CDN. Nejdřív použít, co už web má (např. slider knihovna u M1).

### 2.3 CSS
- Vlastní třídy s prefixem **`ts-` + BEM**: `.ts-qty-picker`, `.ts-qty-picker__btn`, `.ts-qty-picker--compact`.
- Barvy, mezery, rádiusy, breakpointy **jen jako `--ts-*` proměnné** v `tokens.css`. Žádné hex kódy v modulech.
- Breakpointy sjednocené se šablonou Shoptetu, definované jednou.
- Přepisy Shoptet tříd **jen v `styles/overrides/<komponenta>.css`**, u každého bloku komentář: co přepisuje a proč (+ karta v Trellu).
- `!important` jen proti inline stylům Shoptetu, vždy s komentářem.
- Mobile-first (`min-width` media queries) — mobil je většina provozu.

### 2.4 Build (esbuild)
- `npm run build` → `dist/timber.min.js` + `dist/timber.min.css` + sourcemapy.
- Formát IIFE (nic neuniká do globálního scope kromě `window.Timber`).
- Sourcemapy se publikují taky — repo je veřejné tak jako tak a v produkci se s nimi dá ladit.
- Prettier + ESLint s minimální konfigurací, spouští se před commitem.

---

## 3. Testování, nasazení, rollback

### 3.1 Loader — jediný kód v Shoptetu
V záhlaví Shoptetu je jen tento loader (zdroj v repu: `shoptet/loader.html`). Produkční verze se mění **jen tady, na jednom místě**.

```html
<script>
(function () {
  var BASE = 'https://cdn.jsdelivr.net/gh/<user>/<repo>@';
  var PROD = 'v1.4.0'; // ← produkční verze
  var q = location.search.match(/[?&]ts_preview=([\w.\-]+)/);
  if (q) document.cookie = q[1] === 'off'
    ? 'ts_preview=; max-age=0; path=/'
    : 'ts_preview=' + q[1] + '; max-age=604800; path=/';
  var c = document.cookie.match(/(?:^|; )ts_preview=([\w.\-]+)/);
  var ok = c && /^(v\d+\.\d+\.\d+(-rc\.\d+)?|[0-9a-f]{7,40})$/.test(c[1]);
  var v = ok ? c[1] : PROD;
  window.TimberLoader = { version: v, preview: !!ok };
  if (!v) return; // PROD = '' → zákazníci nenačtou nic, funguje jen preview
  // document.write: CSS blokuje vykreslení (bez probliknutí), JS je defer (neblokuje)
  document.write('<link rel="stylesheet" href="' + BASE + v + '/dist/timber.min.css">');
  document.write('<script defer src="' + BASE + v + '/dist/timber.min.js"><\/script>');
})();
</script>
```

- `PROD = ''` vypne náš kód pro zákazníky, preview přes `?ts_preview=` funguje dál. Používá se při prvním vložení loaderu (vyzkoušet a schválit dřív, než to zákazníci uvidí) a jako nouzový vypínač.
- Preview verze se načítá **jen z našeho repa** a jen s platným tagem nebo commit hashem (regex) — nic jiného se přes URL podstrčit nedá.
- V preview zobrazí `core` malý štítek „PREVIEW v1.5.0-rc.1", aby si ho nikdo nespletl s produkcí.

### 3.2 Testování a akceptace klientem
- Rozpracovaná verze se vydá jako **rc tag** (`v1.5.0-rc.1`) nebo se testuje přímo commit hashem.
- Zapnutí preview: `https://www.timberstore.sk/?ts_preview=v1.5.0-rc.1` (cookie platí 7 dní). Vypnutí: `?ts_preview=off`.
- **Viditelné změny** → klient dostane preview odkaz, schválí, teprve pak nasazení.
- **Technické změny** (výkon, SEO, opravy chyb) → bez schvalování, jen záznam v CHANGELOGu.

### 3.3 Checklist před nasazením
Všechno povinné, u každého releasu:
- [ ] Dotčené stránky na **mobilu 375 px** a **desktopu** (+ iPad na šířku, když jde o layout)
- [ ] **Safari na iOS** (reálný iPhone nebo BrowserStack)
- [ ] **Nákupní flow**: vložit do košíku → košík → doprava a platba → údaje (i když změna košík neřeší)
- [ ] **Konzole bez nových chyb** na homepage, kategorii, detailu a v košíku
- [ ] **Výkonový rozpočet** splněn (3.4)
- [ ] CHANGELOG doplněný, karta v Trellu odkazuje na verzi

### 3.4 Výkonový rozpočet
- `timber.min.js` **≤ 30 kB gzip**, `timber.min.css` **≤ 15 kB gzip** — build při překročení **selže**.
- Žádný nový skript blokující vykreslování. Náš balík je vždy `defer`.
- PageSpeed Insights (mobil) před a po nasazení — skóre ani LCP/CLS **nesmí klesnout**. Výsledek se zapíše do CHANGELOGu.
- Obrázky přes CDN Shoptetu s parametry velikosti, s `width`/`height` (viz V2).

### 3.5 Postup vydání
1. Práce ve větvi `feature/<karta>` → merge do `main`.
2. `npm run release` — build, kontrola rozpočtu, zvýšení verze, git tag, push.
3. Preview s novým tagem → checklist → (u viditelných změn) schválení klientem.
4. Změnit `PROD` v loaderu v Shoptetu.
5. Zapsat do CHANGELOGu a do karty v Trellu.

### 3.6 Rollback
- Vrátit `PROD` v loaderu na předchozí tag. Hotovo do dvou minut, tagované soubory na jsDelivr se nemění.
- Změny v adminu Shoptetu git nevrátí → v `ADMIN-CHANGES.md` se vždy zapisuje **i původní stav**, aby šel obnovit.

---

## 4. Backend a automatizace (Hetzner)

E-shop zůstává na Shoptetu. Na serveru běží **jen pomocné úlohy**: stahování a úprava obrázků z feedů dodavatelů, úpravy feedů, stahování dokumentace, noční index pro vyhledávání a importní soubory pro Shoptet.

### 4.1 Hlavní pravidlo: e-shop na serveru nezávisí
- Když server spadne, **zákazník nic nepozná** — jen se dočasně zastaví úlohy.
- Frontend (JS/CSS) se **nikdy** nenačítá ze serveru, jen z jsDelivr (sekce 1.2).
- Pokud by nějaký výstup potřeboval prohlížeč zákazníka (např. index vyhledávání u P3), publikuje se na jsDelivr / CDN, ne přímo ze serveru.

### 4.2 Server
- **Hetzner Cloud CX23** (2 vCPU, 4 GB RAM), lokalita Německo. Při nedostatku výkonu škálovat na CX33.
- Úlohy v **Node.js**, každá v `backend/<uloha>/`. Sdílené utility (párování kódů, parsování feedů) v `shared/`.
- Běh v **Dockeru** (docker compose), plánování přes **cron** na hostu. Crontab je v repu.
- Zpracování obrázků přes **sharp** (bez omezení CPU, žádné dávkování kvůli limitům).
- Na serveru nejsou osobní údaje zákazníků, pokud se to výslovně nerozhodne.

### 4.3 Server jako kód
- Veškerá konfigurace je v repu ve složce `server/`: `setup.sh` (první instalace), `docker-compose.yml`, `Caddyfile`, `crontab`.
- **Na serveru se nic neupravuje ručně** — stejné pravidlo jako u Shoptet adminu. Změna = commit → nasazení.
- Server musí jít z repa **postavit znovu do půl hodiny** (nový server + `setup.sh` + `.env`).
- Nasazení: `server/deploy.sh` (git pull + `docker compose up -d --build`), později případně přes GitHub Actions.

### 4.4 Zabezpečení
- Přihlášení **jen SSH klíčem**, root login a hesla vypnuté.
- **Firewall** (Hetzner Cloud Firewall): otevřené jen 22 (SSH), 80 a 443.
- **unattended-upgrades** pro automatické bezpečnostní aktualizace systému.
- Zapnuté **zálohy / snapshoty Hetzneru**.

### 4.5 Tajné údaje
- API klíče, URL feedů s klíčem (`feedKey=…`), přístupy → **jen v `.env` na serveru** (práva 600). V repu je jen `.env.example` bez hodnot.
- Do repa nepatří ani IP adresa serveru a přístupové údaje — repo je veřejné.
- Nikdy nevypisovat tajné údaje do logů.

### 4.6 Výstupy a cesta dat do Shoptetu
- Na běžném tarifu Shoptet **nemá API** → data se do Shoptetu dostávají **importem** (CSV/XML). Server vygeneruje importní soubor, import se spouští v adminu (nebo z URL, pokud to tarif umožní — ověřit).
- Veřejné výstupy (upravené obrázky, importní soubory) servíruje **Caddy s automatickým HTTPS**, výhradně ze složky `public/`.
- Veřejné výstupy **nesmí obsahovat nákupní ceny, marže ani jiná citlivá data** (poučení z Wavy Boats — výstup se vždy filtruje na povolená pole).
- Úlohy jsou **idempotentní**: opakovaný běh nevytvoří duplicity (porovnání přes hash / kód produktu).

### 4.7 Povinné pojistky u hromadných změn
- **Záloha exportem před každým importem** — export dotčených produktů uložený na serveru s datem (`backups/YYYY-MM-DD-<uloha>.csv`, **mimo `public/`**, mimo repo). Admin Shoptetu nemá undo, záloha je jediná cesta zpět.
- **Dry-run s reportem** — skript nejdřív jen vypíše, co by změnil (počet produktů, které sloupce, ukázka 10 řádků). Import až po kontrole reportu.
- Import obsahuje **jen kód produktu a měněné sloupce** — nikdy celý produkt, aby se omylem nepřepsaly ceny nebo sklad.

### 4.8 Monitoring
- **Dead man's switch** (healthchecks.io, free): každá úloha po úspěšném doběhnutí pošle ping. Když ping nepřijde včas, přijde e-mail — pozná i úlohu, která se vůbec nespustila.
- Při chybě úloha pošle ping „fail" s krátkou zprávou → okamžitý e-mail.
- **Týdenní souhrnný report** — samostatná úloha: kolik obrázků staženo, kolik produktů stále bez obrázku / dokumentace, počet chyb.
- Logy s rotací (limit velikosti logů v Dockeru), aby nezaplnily disk.

---

## 5. Dokumentace a proces

### 5.1 Trello ↔ kód
- Každá karta má **krátký kód** (M2, C3, V1…). Karty bez kódu (např. „NOVÉ · …") ho dostanou, když se přesunou do „dělám teď".
- Větev: `feature/m2-cart-modal`. Commit: `M2: lock body scroll in cart modal`.
- Po nasazení komentář v kartě: **„Nasazeno ve v1.5.0 (datum)"** + odkaz na tag. Z karty se dá dohledat kód a z kódu karta.

### 5.2 Soubory v repu
| Soubor | Obsah |
|---|---|
| `README.md` | Jak repo rozběhnout, build, release, preview |
| `CONTRIBUTING.md` | Tento dokument |
| `CLAUDE.md` | Tvrdá pravidla ze sekce 0 + odkaz na CONTRIBUTING.md — každá AI session začíná se stejnými pravidly |
| `CHANGELOG.md` | Za každou verzi: datum, kódy karet, co se změnilo, PageSpeed před/po |
| `LEGACY.md` | Inventář převzatého starého kódu (odkud, kde se načítal, co dělá, stav převodu) |
| `ADMIN-CHANGES.md` | Změny v adminu Shoptetu: co, kde, proč, **původní stav**, datum, karta |

### 5.3 Účty a vlastnictví
- **GitHub repo** v samostatné organizaci **Timberstore**, vlastněné firmou klienta (kontakt info@timberstore.sk). Klient i Kryštof jsou Owner — klient může přidat jiného vývojáře a odebrat přístupy i bez Kryštofa. Samostatná organizace (ne glos-optimalizace), aby klient neviděl repa jiných klientů.
- **Hetzner Cloud** na účtu klienta (platí provoz), Kryštof jako člen projektu. Na serveru neběží úlohy jiných klientů. Když spolupráce skončí, nic se nerozbije.
- **Shoptet admin** přes vlastní uživatelský účet, ne sdílené přihlášení klienta.

### 5.4 Komunikace s klientem
- **Měsíční souhrn slovensky** — lidsky psaný přehled z CHANGELOGu: co se změnilo, co to přináší, co má klient vyzkoušet. Slouží zároveň jako podklad k faktuře.
- Stav jednotlivých úkolů klient vidí v Trellu.
