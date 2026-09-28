import { getPageType } from './page.js';
import { CONTENT_EVENTS } from './events.js';
import { log } from './log.js';

/* global __VERSION__ */

function runModules(modules, page, root) {
  for (const mod of modules) {
    if (!mod.pages.includes(page) && !mod.pages.includes('*')) continue;
    try {
      mod.init(root);
    } catch (err) {
      // One broken module must never break the others or Shoptet itself.
      log.error(mod.name, err);
    }
  }
}

function showPreviewBadge(version) {
  const badge = document.createElement('div');
  badge.className = 'ts-preview-badge';
  badge.textContent = `PREVIEW ${version}`;
  badge.title = 'Klik = vypnout preview';
  badge.addEventListener('click', () => {
    location.search = '?ts_preview=off';
  });
  document.body.appendChild(badge);
}

export function start(modules) {
  window.Timber = {
    version: __VERSION__,
    page: null,
    modules: modules.map((m) => m.name),
  };

  // The loader inserts our script dynamically, so it may run while <head> is
  // still being parsed (no <body> yet). Everything touching the DOM waits here.
  const boot = () => {
    const page = getPageType();
    window.Timber.page = page;
    runModules(modules, page, document);
    // Show what the loader actually loaded: a tag, or a commit hash when previewing a branch.
    if (window.TimberLoader?.preview) showPreviewBadge(window.TimberLoader.version);
    log.debug('started', window.Timber);

    // Shoptet swaps or appends page content via AJAX (filters, pagination, load more)
    // — re-run modules. They are idempotent, so initialised elements are skipped.
    for (const event of CONTENT_EVENTS) {
      document.addEventListener(event, () => runModules(modules, page, document));
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, { once: true });
  } else {
    boot();
  }
}
