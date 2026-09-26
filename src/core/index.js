import { getPageType } from './page.js';
import { SHOPTET_EVENTS } from './events.js';
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
  const page = getPageType();

  window.Timber = {
    version: __VERSION__,
    page,
    modules: modules.map((m) => m.name),
  };

  const boot = () => {
    runModules(modules, page, document);
    if (window.TimberLoader?.preview) showPreviewBadge(__VERSION__);
    log.debug('started', window.Timber);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, { once: true });
  } else {
    boot();
  }

  // Shoptet swaps page content via AJAX (filters, pagination) — re-run modules.
  // Modules are idempotent, so already initialised elements are skipped.
  document.addEventListener(SHOPTET_EVENTS.pageContentLoaded, () => {
    runModules(modules, page, document);
  });
}
