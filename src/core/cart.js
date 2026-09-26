// Cart contents from Shoptet's dataLayer — the only place that reads it.
// Items look like { code, priceId, quantity, … } (verified in Shoptet's main.js, 2026-09-26).

/** Map of priceId (string) → quantity in the cart. Empty map when unavailable. */
export function getCartQuantities() {
  const map = new Map();
  let items = [];
  try {
    items = window.getShoptetDataLayer?.('cart') || [];
  } catch {
    return map;
  }
  for (const item of items) {
    if (item && item.priceId != null) {
      const id = String(item.priceId);
      map.set(id, (map.get(id) || 0) + (Number(item.quantity) || 0));
    }
  }
  return map;
}
