# Starý kód na webu (mimo repo)

Inventář stavu k 26. 9. 2026 (homepage). Kód se převádí do repa, až když na něj sáhne úkol (CONTRIBUTING.md 1.3).

## Vlastní kód klienta / předchozích vývojářů
| Soubor | Kde se načítá | Poznámka | Stav |
|---|---|---|---|
| `/user/documents/upload/CSS/timber-custom.css?v=173` | záhlaví | hlavní vlastní CSS | nepřevedeno |
| `/user/documents/allstyle.css?v=1111` | záhlaví | další vlastní CSS | nepřevedeno |
| `765909.myshoptet.com/user/documents/upload/CSS/timber-kategorie-banner.css?v=10` | záhlaví | načítá se z původní myshoptet domény | nepřevedeno |
| `765909.myshoptet.com/user/documents/upload/CSS/timber-kategorie-banner.js?v=10` | zápatí | dtto | nepřevedeno |
| `/user/documents/upload/CSS/timber-menu.js?v=1` | záhlaví, async+defer | **V1: načítá se už jen jednou** (ověřeno 26. 9.) | nepřevedeno |
| `/user/documents/upload/CSS/timber-empty-cart.js` | zápatí | bez verze v URL | nepřevedeno |
| `/user/documents/allscript.js?v=111` | zápatí | další vlastní JS | nepřevedeno |
| Mřížka/řádky „GRID / LIST VIEW v19–v27“ (klientova rozpracovaná verze `timber-menu.js` ř. 579–1361 a `timber-custom.css` ř. 2071–3633, jen na jeho počítači) | **na webu není** | přepínač zobrazení, tabulkový výpis, pole pro množství, odznak počtu v košíku, řazení | **převzato beze změny** do `src/legacy/list-view/` (C3), přepisuje se na modul |
| inline `DOMContentLoaded` → `.custom-footer__o…` (paymentBox) | zápatí | inline skript v HTML kódu | nepřevedeno |
| inline skript `timber-page-loading` + `<style>` s `html.timber-page-loading body{visibility:hidden}` | záhlaví | **skryje celou stránku až do DOMContentLoaded (max 1,5 s)** — pravděpodobně zhoršuje LCP, kandidát na výkonovou kartu | nepřevedeno |
| inline `<style>` — úpravy detailu, filtrů, welcome boxu, hlavičky a košíku (desktop breakpointy) | záhlaví | ~60 pravidel | nepřevedeno |
| inline `<style>` — `.top-category-addon` (dlaždice kategorií v menu) | záhlaví | hodně `!important` | nepřevedeno |
| `/user/documents/upload/CSS/timber-search-filter.css?v=173` | záhlaví | **zakomentováno** — nenačítá se | kandidát na smazání |

Záloha celého záhlaví k 26. 9. 2026: [`shoptet/backup/2026-09-26-zahlavi.html`](shoptet/backup/2026-09-26-zahlavi.html). `timber-menu.js` v poli Záhlaví není, načítá se odjinud (ověřit, odkud).

## Doplňky a šablona (třetí strany — neupravujeme, jen evidujeme)
| Co | Soubory | Poznámka |
|---|---|---|
| Šablona Apollo (Jakub Turský) | `apollo.jakubtursky.sk/.../main.css`, `app.min.js`, `plugins/js/swiper.min.js`, `kategorie/main.css` | Swiper v šabloně pohání produktové karusely |
| Propojení produktů (webotvurci) — „Kamarádi" / Všetky varianty | `plugin-product-interconnection/...` | viz D2, D5, P8 |
| Násobky objednávky (dominikmartini) | `addons/dominikmartini/multiply_order/...` | |
| Hlavní slider homepage | nativní Shoptet `#carousel` (Bootstrap 3 carousel) | M1 přidává swipe modulem `carousel-swipe` |
| Galerie na detailu produktu | nativní Shoptet `.p-image` + `.p-thumbnails` (cloud-zoom, colorbox) | M1 přidává swipe modulem `gallery-swipe` (kliká na náhledy) |
