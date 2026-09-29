# Změny v adminu Shoptetu

Git tyto změny nevrátí — proto se vždy zapisuje i **původní stav**.

| Datum | Karta | Kde (cesta v adminu) | Co se změnilo | Původní stav | Proč |
|---|---|---|---|---|---|
| 2026-09-26 | M1 | Vzhled a obsah → Editor HTML kódu → Záhlaví | Na konec přidán loader z `shoptet/loader.html` s `PROD = ''` (zákazníci nenačtou nic, funguje jen `?ts_preview=`). Stávající obsah beze změny. | [`shoptet/backup/2026-09-26-zahlavi.html`](shoptet/backup/2026-09-26-zahlavi.html) | Zapnout nasazování z repa; nejdřív jen preview ke schválení klientem. Vrácení: smazat blok loaderu z konce záhlaví. |
| 2026-09-29 | M1, C3, drobnosti | Vzhled a obsah → Editor HTML kódu → Záhlaví (loader) | `var PROD = '';` → `var PROD = 'v0.3.0';` – první nasazení pro zákazníky | `var PROD = '';` | Klient schválil v0.3.0-rc.1. Vrácení (rollback): zpět `PROD = ''` (vypne vše) nebo na předchozí tag. |
