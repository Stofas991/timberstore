# Changelog

Formát: verze · datum · karty · co se změnilo · PageSpeed mobil před/po.

## v0.3.0 · nevydáno
- **Drobnosti** (PR #1) · submenu bez tmavé čáry; bez tečky na konci horního pruhu; logo 200 × 44 px v hlavičce i ve sticky hlavičce; stín pod bílým textem banneru (M4); Instagram 2 × 2 na mobilu; celé názvy podkategorií na mobilu (M5); filtr značek bez zalamování (K3); stejně vysoké dlaždice produktů a zarovnaná tlačítka; nenápadné „Späť“ v košíku; iPad na šířku bez postranního panelu, produkty po 3 (TB1). Štítek preview ukazuje načtený tag/commit.
- **C3** (PR #2) · Přepínač Mriežka / Riadky nad výpisem (kategorie, vyhledávání; desktop od 992 px, volba se pamatuje). Riadky = tabulka: obrázek, název, kód, dostupnost, cena, množství, košík; řazení podle ceny v záhlaví přes řazení Shoptetu (oba směry). Pole − / + pro množství v mřížce i v tabulce, krok = balení z doplňku Násobky objednávky. Odznak s počtem kusů, které už jsou v košíku. Přepis klientovy rozpracované verze (nikdy nenasazené): bez smyčky, která stránku 1 700× za sekundu překreslovala.
- **M1** · rc.1 (zpětná vazba klienta): banner na homepage přednačte obrázky ostatních slidů, jakmile je stránka načtená a prohlížeč volný (dřív byl slide po swipu chvíli prázdný); na dotykových zařízeních slide za 350 ms místo 600 ms (desktop beze změny).
- **M1** · rc.1: galerie na detailu produktu posune pás náhledů šipkami Shoptetu tak, aby byl aktivní náhled vždy vidět (např. 4. fotka ze 4, vidět 3); velké fotky sousedních náhledů se přednačítají.
- rc.1: „Späť“ v košíku — při najetí myší už šipka nebělá ani neposkakuje (Apollo ji obarvoval bíle pro oranžové tlačítko); odkaz jen ztmavne.
- PageSpeed mobil: před — / po —

## v0.2.0 · nevydáno
- **M1** · Fotky na detailu produktu jdou na mobilu přepínat prstem (swipe přepíná náhledy galerie Shoptetu, na první/poslední fotce se zastaví, lightbox se tahem neotevře).
- **M1** · Swipe reaguje jen na dotyk (mobil/tablet). Myš na desktopu se chová jako bez našeho kódu.
- **M1** · rc.1: na dotyku vypnutý zoom Shoptetu (cloud-zoom) nad fotkou produktu. Při rychlém swipování se otevíral podržením prstu a zůstával viset se starou fotkou (fotka neseděla s náhledem). Klepnutí dál otevírá lightbox, zoom myší na desktopu beze změny.
- rc.2: oprava — kód občas vůbec nenaběhl (`Cannot read properties of null (reading 'classList')`). Loader vkládá skript dynamicky, takže se z cache může spustit dřív, než existuje `<body>`; typ stránky se teď zjišťuje až po DOMContentLoaded.
- Loader: `PROD = ''` = vypnuto pro zákazníky, funguje jen preview.
- PageSpeed mobil: před — / po —

## v0.1.0 · nenasazeno (jen tag)
- Základ repa: core (detekce stránky, registr modulů, preview štítek), loader, build s kontrolou rozpočtu.
- **M1** · Hlavní slider na homepage jde na mobilu posunout prstem (swipe nad stávajícím Bootstrap carouselem, bez přestavby slideru).
