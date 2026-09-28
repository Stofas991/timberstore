// C3 · Quantity field in product tiles and table rows (desktop).
//
// "Do košíka" in a listing adds one pack; ordering 40 hinges means opening every
// detail. We add − [field] + inside Shoptet's own cart form and only write the
// hidden amount input; Shoptet's submit button stays in charge of adding to the
// cart. The step is the pack size the multiply_order add-on writes into that input
// (e.g. 100 or 1000 pieces): − / + move by whole packs and a typed number is
// rounded up to whole packs, never below one pack.

import { SEL } from '../../core/selectors.js';
import { TEXTS } from '../../core/texts.js';

function parse(value) {
  const n = parseFloat(String(value).replace(',', '.'));
  return Number.isFinite(n) && n > 0 ? n : NaN;
}

function makeButton(text, label, modifier) {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = `ts-qty__btn ts-qty__btn--${modifier}`;
  btn.setAttribute('aria-label', label);
  btn.textContent = text;
  return btn;
}

function bind(form) {
  const amount = form.querySelector(SEL.cartFormAmount);
  const submit = form.querySelector(SEL.cartFormSubmit);
  if (!amount || !submit) return;

  let step = parse(amount.value) || 1;
  let touched = false;

  const box = document.createElement('div');
  box.className = 'ts-qty';
  const minus = makeButton('−', TEXTS.qty.decrease, 'minus');
  const plus = makeButton('+', TEXTS.qty.increase, 'plus');
  // No name attribute: only the hidden Shoptet input is submitted.
  const field = document.createElement('input');
  field.type = 'text';
  field.inputMode = 'numeric';
  field.autocomplete = 'off';
  field.className = 'ts-qty__value';
  field.setAttribute('aria-label', TEXTS.qty.value);
  field.value = String(step);
  box.append(minus, field, plus);
  form.insertBefore(box, submit);

  // Whole packs, at least one: 150 with a pack of 100 → 200.
  const toPacks = (n) => Math.max(step, Math.ceil(n / step) * step);

  const write = (qty) => {
    amount.value = String(qty);
    amount.dispatchEvent(new Event('change', { bubbles: true }));
  };

  // multiply_order may write the pack size after we ran; pick it up until the
  // customer has changed the amount themselves.
  const syncStep = () => {
    if (touched) return;
    step = parse(amount.value) || 1;
    field.value = String(step);
  };

  const commit = () => {
    const qty = toPacks(parse(field.value) || step);
    field.value = String(qty);
    write(qty);
  };

  const change = (direction) => {
    syncStep();
    touched = true;
    const current = parse(amount.value) || step;
    const qty = Math.max(step, Math.round((current + direction * step) / step) * step);
    field.value = String(qty);
    write(qty);
  };

  minus.addEventListener('click', () => change(-1));
  plus.addEventListener('click', () => change(1));

  field.addEventListener('focus', () => {
    syncStep();
    field.select();
  });
  // While typing, keep the submitted amount valid without rewriting the field.
  field.addEventListener('input', () => {
    touched = true;
    const n = parse(field.value);
    if (n) write(toPacks(n));
  });
  field.addEventListener('change', commit); // blur after editing
  // Enter adds to cart like a normal quantity field — round first.
  field.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') commit();
  });

  if (document.readyState !== 'complete') window.addEventListener('load', syncStep, { once: true });
}

export default {
  name: 'qty-picker',
  pages: ['category', 'search'],
  init(root) {
    root.querySelectorAll(`${SEL.productCard} ${SEL.cartForm}`).forEach((form) => {
      if (form.dataset.tsInit) return;
      form.dataset.tsInit = 'qty-picker';
      bind(form);
    });
  },
};
