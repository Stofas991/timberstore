# Changelog

Formát: verze · datum · karty · co se změnilo · PageSpeed mobil před/po.

## Nevydáno
- **Drobnosti** · Instagram na homepage jako úzký pás: všech 9 příspěvků v jedné řadě, široké jako obsah stránky (lícuje s patičkou), dlaždice max. 160 px – na 1920 px ~146 px (dřív přes celou šířku okna, ~360 px na 1440 px monitoru). Na mobilu a tabletu jedna řada posuvná prstem (~2,4 fotky vidět po ~135 px, aby šel přečíst text příspěvků; max. 180 px) místo mřížky 2 × 2. Tlačítko „Sledovať na Instagrame“ pod pásem, už nepřekrývá další blok; menší mezery kolem. Počet příspěvků nastaven v adminu (viz ADMIN-CHANGES).
- **C3** · Odznak s počtem kusů v košíku byl na tlačítku „Do košíka“ vpravo uříznutý: vedle pole pro množství sahá tlačítko až k okraji dlaždice a dlaždice ořezává, co přečnívá. Odznak je teď v rohu tlačítka, nepřesahuje ho.
- **C3** · Tabulka (Riadky) čitelnější, varianta B2 schválená v návrzích (jen tabulka, mřížka beze změny): název produktu se už neořezává na 2 řádky – zalomí se, kolik potřebuje, a je normálním (ne tučným) písmem 14,5 px. „Do košíka“ je kulaté tlačítko jen s ikonou košíku, „Detail“ kulaté se šipkou ›, takže název má víc místa (1280 px: 182 → 274 px, 1440 px: 254 → 462 px; nejdelší názvy 3 řádky místo oříznutí). Pod názvem „Kód: 496544“ šedě a tence na všech šířkách – samostatný sloupec Kód (od 1440 px) zrušen, jeho místo dostal název. Písmo o 1–2 px větší: kód a dostupnost 13 px (z 10,5/11), cena 16 px (z 14,5), „bez DPH“ a jednotková cena 11,5 px, záhlaví 12 px, množství 14 px. Méně tučné: dostupnost a záhlaví 500, cena 700.
- **C3** · Detail produktu: kód a značka pod názvem 12,5 px a tmavší (šablona 10 px šedě).

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
