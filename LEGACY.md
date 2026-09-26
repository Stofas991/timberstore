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
| inline `DOMContentLoaded` → `.custom-footer__o…` (paymentBox) | zápatí | inline skript v HTML kódu | nepřevedeno |

## Doplňky a šablona (třetí strany — neupravujeme, jen evidujeme)
| Co | Soubory | Poznámka |
|---|---|---|
| Šablona Apollo (Jakub Turský) | `apollo.jakubtursky.sk/.../main.css`, `app.min.js`, `plugins/js/swiper.min.js`, `kategorie/main.css` | Swiper v šabloně pohání produktové karusely |
| Propojení produktů (webotvurci) — „Kamarádi" / Všetky varianty | `plugin-product-interconnection/...` | viz D2, D5, P8 |
| Násobky objednávky (dominikmartini) | `addons/dominikmartini/multiply_order/...` | |
| Hlavní slider homepage | nativní Shoptet `#carousel` (Bootstrap 3 carousel) | M1 přidává swipe modulem `carousel-swipe` |
