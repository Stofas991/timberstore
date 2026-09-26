// C3 · "Already in the cart" count on the listing's cart buttons.
//
// Reads the cart from Shoptet's dataLayer and shows the quantity per product as a
// badge on its "Do košíka" button, matched by the form's priceId (works for
// variants too). Updates whenever Shoptet reports a cart change.

import { SEL } from '../../core/selectors.js';
import { SHOPTET_EVENTS } from '../../core/events.js';
import { TEXTS } from '../../core/texts.js';
import { getCartQuantities } from '../../core/cart.js';

function render() {
  const quantities = getCartQuantities();

  document.querySelectorAll(`${SEL.productCard} ${SEL.cartForm}`).forEach((form) => {
    const button = form.querySelector(SEL.cartFormSubmit);
    const priceId = form.querySelector(SEL.cartFormPriceId)?.value;
    if (!button || !priceId) return;

    const qty = quantities.get(String(priceId)) || 0;
    let badge = button.querySelector('.ts-cart-count');

    if (!qty) {
      if (badge) {
        badge.remove();
        button.removeAttribute('title');
      }
      return;
    }
    if (!badge) {
      badge = document.createElement('span');
      badge.className = 'ts-cart-count';
      badge.setAttribute('aria-hidden', 'true'); // the title carries the information
      button.appendChild(badge);
    }
    // Write only on change: a no-op write would still be a DOM mutation.
    if (badge.textContent !== String(qty)) badge.textContent = String(qty);
    button.title = TEXTS.cartCount(qty);
  });
}

let listening = false;

export default {
  name: 'cart-count',
  pages: ['category', 'search'],
  init() {
    render();
    if (listening) return;
    listening = true;
    [SHOPTET_EVENTS.cartUpdated, SHOPTET_EVENTS.dataLayerUpdated].forEach((event) =>
      document.addEventListener(event, render),
    );
  },
};
