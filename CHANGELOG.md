# Changelog

Formát: verze · datum · karty · co se změnilo · PageSpeed mobil před/po.

## Nevydáno
- **Oprava (Shoptet)** · Okno „Produkt bol pridaný do košíka“ se vejde na obrazovku a posouvá se uvnitř (zelená hlavička s křížkem zůstává nahoře), krátké okno je vycentrované. Stránka pod otevřeným oknem se neposouvá a šipka „nahoru“ je po dobu otevření okna skrytá. Dřív ho Shoptet usadil na pevné místo ve stránce a pod ním se posouvala ztmavená stránka – na telefonu se tah prstem často sekl (colorbox navíc zaokrouhlí výšku obsahu dolů a okno bylo posuvné o 1 px). Platí na mobilu i desktopu. Chyba byla i bez našeho kódu, mimo blok V1/drobnosti/M1/C3.

## v0.3.1 · 2026-09-30 · oprava
- **Oprava (v0.3.0)** · Okno „Produkt bol pridaný do košíka“ – blok „Ostatní zákazníci tiež nakúpili“: na mobilu ceny a tlačítka odjely mimo obrazovku (o 452 px). Blok má stejné `#products.products-block` jako výpis, takže na něj působila úprava výšky dlaždic (K5). Všechny úpravy výpisu (dlaždice, tabulka, TB1, pole pro množství, odznak košíku) jsou teď jen pro skutečný výpis (`#products:not(.products-related)`). Okno je zase jako bez našeho kódu – původní rozpad dlaždic v něm řeší karta M3.
- **C3** · Přepnutí Mriežka ↔ Riadky bez animace: po návratu na mřížku se názvy produktů „zvětšovaly“ z 13,5 na 18 px (přechody šablony 0,3 s). Přechody jsou vypnuté jen na okamžik přepnutí, hover efekty dlaždic v mřížce zůstávají.

## v0.3.0 · 2026-09-29 · první nasazení
Obsahuje i v0.1.0 a v0.2.0 (nikdy nenasazené, jen tagy / rc).

- **M1** · Hlavní slider na homepage jde na mobilu posunout prstem (swipe nad stávajícím Bootstrap carouselem). Obrázky ostatních slidů se přednačtou, jakmile je stránka načtená a prohlížeč volný; na dotykových zařízeních slide za 350 ms místo 600 ms (desktop beze změny).
- **M1** · Fotky na detailu produktu jdou na mobilu přepínat prstem (přepíná náhledy galerie Shoptetu, na první/poslední fotce se zastaví, lightbox se tahem neotevře). Pás náhledů se posune, aby byl aktivní náhled vždy vidět; velké fotky sousedních náhledů se přednačítají. Na dotyku vypnutý zoom Shoptetu nad fotkou (při rychlém swipování zůstával viset se starou fotkou); klepnutí dál otevírá lightbox.
- **M1** · Swipe reaguje jen na dotyk (mobil/tablet). Myš na desktopu se chová jako bez našeho kódu.
- **Drobnosti** (PR #1) · submenu bez tmavé čáry; bez tečky na konci horního pruhu; logo 200 × 44 px v hlavičce i ve sticky hlavičce; stín pod bílým textem banneru (M4); Instagram 2 × 2 na mobilu; celé názvy podkategorií na mobilu (M5); filtr značek bez zalamování (K3); stejně vysoké dlaždice produktů a zarovnaná tlačítka; nenápadné „Späť“ v košíku (i při najetí myší); iPad na šířku bez postranního panelu, produkty po 3 (TB1).
- **C3** (PR #2) · Přepínač Mriežka / Riadky nad výpisem (kategorie, vyhledávání; desktop od 992 px, volba se pamatuje). Riadky = tabulka: obrázek, název, kód, dostupnost, cena, množství, košík; řazení podle ceny v záhlaví přes řazení Shoptetu (oba směry). Pole pro množství (− / + i psaní) v mřížce i v tabulce, zaokrouhluje na celá balení z doplňku Násobky objednávky. Odznak s počtem kusů v košíku. Přepis klientovy rozpracované verze (nikdy nenasazené).
- Loader: `PROD = ''` vypne náš kód pro zákazníky, preview funguje dál. Štítek preview ukazuje načtený tag/commit. Kód se spouští až po DOMContentLoaded (dynamicky vložený skript mohl z cache naběhnout dřív než `<body>`).
- **C4** · řazení podle dostupnosti se neprogramuje: výchozí řazení „Odporúčame“ už řadí skladem napřed (klientův doplněk Brani). Otevřené: produkty „Objednané“ mezi „Skladom“ – nastavení Brani.
- PageSpeed mobil (Lighthouse 12, medián 3 měření): před — homepage 46 (LCP 9,4 s, CLS 0), kategorie 42 (LCP 6,0 s, CLS 0) / po —

## v0.1.0 · nenasazeno (jen tag)
- Základ repa: core (detekce stránky, registr modulů, preview štítek), loader, build s kontrolou rozpočtu.
