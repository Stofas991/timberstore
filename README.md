# timberstore

Vlastní kód pro e-shop [timberstore.sk](https://www.timberstore.sk) (Shoptet, šablona Apollo).
Pravidla vývoje: [CONTRIBUTING.md](CONTRIBUTING.md).

## Rozběhnutí
```bash
npm install
npm run build      # dist/timber.min.js + dist/timber.min.css + kontrola rozpočtu
npm run lint
```

## Vydání
```bash
npm run release:rc       # první testovací verze další minor (v0.1.0 → v0.2.0-rc.0)
npm run release:rc:next  # další testovací verze po opravě (v0.2.0-rc.0 → v0.2.0-rc.1)
npm run release          # finální verze (v0.2.0-rc.1 → v0.2.0), build, tag, push
npm run release:patch  # opravná verze (v0.2.1)
```
Po vydání změnit `PROD` v loaderu v Shoptetu (`shoptet/loader.html`).

## Preview
- Zapnout: `https://www.timberstore.sk/?ts_preview=v0.2.0-rc.0` (cookie na 7 dní, vlevo dole štítek PREVIEW)
- Vypnout: `?ts_preview=off` nebo klik na štítek
- **Tag nebo commit:** rozpracovaná větev (PR) se kontroluje přes zkratku commitu (`?ts_preview=b05dce0`), nic se nečísluje. Tag `rc` (`?ts_preview=v0.3.0-rc.0`) se vydává až z `main` po mergi, když jde verze ke schválení klientovi. Čísla verzí tak odpovídají jen schválenému kódu.
- Release skripty po pushi samy počkají (`npm run wait-cdn`), až jsDelivr nový tag vrací, a vypíšou preview odkaz. Když skript skončí chybou, odkaz ještě neposílat.
- **Nový tag posílat až po ověření**, že ho jsDelivr vrací (`https://cdn.jsdelivr.net/gh/Timberstore/timberstore@<tag>/dist/timber.min.js` → 200). Hned po pushi může pár minut vracet 404 a tu si pak chvíli pamatuje. Pomůže `https://purge.jsdelivr.net/gh/Timberstore/timberstore@<tag>/dist/timber.min.js` (a totéž pro `.css`).

## Struktura
```
src/core/        init, detekce stránky, selektory, eventy, texty
src/modules/     jeden modul = jedna funkce (karta v Trellu)
src/styles/      tokeny a přepisy Shoptetu
shoptet/         loader.html — jediný kód vložený v Shoptetu
backend/ server/ úlohy a konfigurace serveru Hetzner (zatím prázdné)
```
