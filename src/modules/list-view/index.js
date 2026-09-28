// C3 · Grid / list (table) view for product listings (desktop ≥ 992 px).
//
// The client's catalogue is thousands of fittings; a table (image, name, code,
// availability, price, quantity, cart) scans much faster than tiles. Rewrite of
// the client's unfinished script (src/legacy/list-view/), same look.
//
// How it works: the chosen view is a class on <html> (ts-view-list), set as soon as
// this file runs, so the table is styled before the first paint and after every
// Shoptet AJAX redraw without re-applying anything. The table itself is pure CSS
// over Shoptet's own product cards (list-view.css); JS only adds the switch and the
// column header. Nothing in Shoptet's cards or forms is moved or replaced.

import { SEL } from '../../core/selectors.js';
import { TEXTS } from '../../core/texts.js';

const STORAGE_KEY = 'ts-product-view';
const LIST_CLASS = 'ts-view-list';

const ICONS = {
  grid: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>',
  list: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="4" width="4" height="4" rx="1"/><rect x="9" y="4" width="12" height="4" rx="1"/><rect x="3" y="10" width="4" height="4" rx="1"/><rect x="9" y="10" width="12" height="4" rx="1"/><rect x="3" y="16" width="4" height="4" rx="1"/><rect x="9" y="16" width="12" height="4" rx="1"/></svg>',
};

function readView() {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'list' ? 'list' : 'grid';
  } catch {
    return 'grid'; // storage blocked (private mode)
  }
}

function saveView(view) {
  try {
    localStorage.setItem(STORAGE_KEY, view);
  } catch {
    // storage blocked — the view still switches for this page
  }
}

function setView(view) {
  document.documentElement.classList.toggle(LIST_CLASS, view === 'list');
}

// Before first paint: the class must be there before the listing is rendered.
setView(readView());

/* ---------- price sorting through Shoptet's own sort buttons ---------- */

function sortControls() {
  return [...document.querySelectorAll(SEL.listSortingControl)];
}

function currentSort(controls) {
  return controls.find((c) => c.classList.contains(SEL.listSortingCurrentClass))?.dataset.sort;
}

function sortByPrice() {
  const controls = sortControls();
  const next = currentSort(controls) === 'price' ? '-price' : 'price';
  controls.find((c) => c.dataset.sort === next)?.click();
}

/* ---------- DOM ---------- */

function buildSwitch() {
  const box = document.createElement('div');
  box.className = 'ts-view-switch';
  box.setAttribute('role', 'group');
  box.setAttribute('aria-label', TEXTS.viewSwitch.group);

  const label = document.createElement('span');
  label.className = 'ts-view-switch__label';
  label.textContent = TEXTS.viewSwitch.label;
  box.append(label);

  for (const view of ['grid', 'list']) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'ts-view-switch__btn';
    btn.dataset.tsView = view;
    btn.setAttribute('aria-label', TEXTS.viewSwitch[view]);
    btn.innerHTML = ICONS[view];
    box.append(btn);
  }

  box.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-ts-view]');
    if (!btn) return;
    saveView(btn.dataset.tsView);
    setView(btn.dataset.tsView);
    refresh();
  });
  return box;
}

function cell(text, modifier) {
  const div = document.createElement('div');
  div.className = `ts-product-table-head__cell ts-product-table-head__cell--${modifier}`;
  if (text) div.textContent = text;
  return div;
}

function buildHead() {
  const t = TEXTS.productTable;
  const head = document.createElement('div');
  head.className = 'ts-product-table-head';

  const price = cell('', 'price');
  if (sortControls().length) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'ts-product-table-head__sort';
    btn.textContent = t.price;
    btn.addEventListener('click', sortByPrice);
    price.append(btn);
  } else {
    price.textContent = t.price;
  }

  head.append(
    cell(t.product, 'product'),
    cell(t.code, 'code'),
    // Availability sorting waits for Shoptet's own option (Trello C4).
    cell(t.availability, 'availability'),
    price,
    cell(t.amount, 'amount'),
    cell('', 'cart'),
  );
  return head;
}

function refresh() {
  const isList = document.documentElement.classList.contains(LIST_CLASS);

  document.querySelectorAll('.ts-view-switch__btn').forEach((btn) => {
    const active = btn.dataset.tsView === (isList ? 'list' : 'grid');
    btn.classList.toggle('ts-view-switch__btn--active', active);
    btn.setAttribute('aria-pressed', String(active));
  });

  const sort = document.querySelector('.ts-product-table-head__sort');
  if (sort) {
    const current = currentSort(sortControls());
    sort.classList.toggle('ts-product-table-head__sort--asc', current === 'price');
    sort.classList.toggle('ts-product-table-head__sort--desc', current === '-price');
    sort.setAttribute(
      'aria-label',
      current === 'price' ? TEXTS.productTable.sortPriceDesc : TEXTS.productTable.sortPriceAsc,
    );
  }
}

export default {
  name: 'list-view',
  pages: ['category', 'search'],
  init(root) {
    const list = root.querySelector(SEL.productList);
    if (!list) return;

    // Switch next to Shoptet's sorting (category) or right above the list (search).
    if (!document.querySelector('.ts-view-switch')) {
      const sorting = document.querySelector(SEL.listSorting);
      if (sorting) sorting.before(buildSwitch());
      else list.before(buildSwitch());
    }

    // Column header right above the list; Shoptet's AJAX may drop it, re-add then.
    if (list.previousElementSibling?.classList.contains('ts-product-table-head') !== true) {
      document.querySelectorAll('.ts-product-table-head').forEach((h) => h.remove());
      list.before(buildHead());
    }

    refresh();
  },
};
