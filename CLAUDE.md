# CLAUDE.md — timberstore.sk

Custom code for the timberstore.sk e-shop (Shoptet, Apollo template). Full rules: **CONTRIBUTING.md** (Czech). Read it before changing anything.

## Hard rules
1. **Nothing exists outside this repo.** Never suggest editing code directly in the Shoptet admin or on the server.
2. **Shoptet contains only `shoptet/loader.html`.** Production = git tag served by jsDelivr, never `@main`.
3. **No secrets in the repo — it is public.** Keys and feed URLs with keys live only in `.env` on the server.
4. **Settings → CSS → JS.** Write code only when Shoptet admin can't do it.
5. **Module contract:** `export default { name, pages, init(root) }`; `init` must be idempotent (`data-ts-init`), core runs it in try/catch.
6. **Shoptet selectors, events, page detection and texts live only in `src/core/`.**
7. **CSS:** `ts-` prefix + BEM + `--ts-*` tokens; Shoptet overrides only in `src/styles/overrides/<component>.css`.
8. **Budget:** `timber.min.js` ≤ 30 kB gzip, `timber.min.css` ≤ 15 kB gzip — `npm run build` fails otherwise.
9. **Before deploy:** preview + checklist (CONTRIBUTING.md 3.3); visible changes need client approval.
10. **Bulk imports:** backup export + dry-run + only changed columns.
11. **Every change has a Trello card code** (e.g. `M1: ...` in commits, `feature/m1-...` branches). Shoptet admin changes go to `ADMIN-CHANGES.md` incl. previous state.
12. **The e-shop never depends on the Hetzner server at runtime.**

## Conventions
- Code, comments, commits: English. Customer-facing texts: Slovak, in `src/core/texts.js`.
- Vanilla JS (ES2020). jQuery only for Shoptet/Bootstrap plugin interop, always via `window.jQuery`, with a comment.
- New module: `src/modules/<name>/index.js` (+ `<name>.css`), register in `src/main.js` and `src/main.css`.

## Commands
- `npm run build` — bundle to `dist/` + budget check
- `npm run lint`
- `npm run release:rc` → preview tag, `npm run release` → minor release (bumps version, builds, tags, pushes)
