// C3 · Quantity field in product tiles and table rows (desktop).
//
// "Do košíka" in a listing adds one pack; ordering 40 hinges means opening every
// detail. We add − value + inside Shoptet's own cart form and only write the hidden
// amount input; Shoptet's submit button stays in charge of adding to the cart.
// The step is the pack size the multiply_order add-on writes into that input
// (e.g. 100 or 1000 pieces), so − / + always move by whole packs.

import { SEL } from '../../core/selectors.js';
import { TEXTS } from '../../core/texts.js';

function readAmount(input) {
  const n = parseFloat(String(input.value).replace(',', '.'));
  return Number.isFinite(n) && n > 0 ? n : 1;
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

  let step = readAmount(amount);
  let touched = false;

  const box = document.createElement('div');
  box.className = 'ts-qty';
  const minus = makeButton('−', TEXTS.qty.decrease, 'minus');
  const plus = makeButton('+', TEXTS.qty.increase, 'plus');
  const value = document.createElement('output');
  value.className = 'ts-qty__value';
  value.setAttribute('aria-label', TEXTS.qty.value);
  value.textContent = String(step);
  box.append(minus, value, plus);
  form.insertBefore(box, submit);

  // multiply_order may write the pack size after we ran; pick it up until the
  // customer has changed the amount themselves.
  const syncStep = () => {
    if (touched) return;
    step = readAmount(amount);
    value.textContent = String(step);
  };

  const change = (direction) => {
    syncStep();
    touched = true;
    const next = readAmount(amount) + direction * step;
    const qty = Math.max(step, Math.round(next / step) * step);
    amount.value = String(qty);
    value.textContent = String(qty);
    amount.dispatchEvent(new Event('change', { bubbles: true }));
  };

  minus.addEventListener('click', () => change(-1));
  plus.addEventListener('click', () => change(1));
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
