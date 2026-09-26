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

## Struktura
```
src/core/        init, detekce stránky, selektory, eventy, texty
src/modules/     jeden modul = jedna funkce (karta v Trellu)
src/styles/      tokeny a přepisy Shoptetu
shoptet/         loader.html — jediný kód vložený v Shoptetu
backend/ server/ úlohy a konfigurace serveru Hetzner (zatím prázdné)
```
