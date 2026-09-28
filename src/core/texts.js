// Customer-facing texts (Slovak). No hard-coded strings in modules.
export const TEXTS = {
  viewSwitch: {
    label: 'Zobrazenie',
    group: 'Zobrazenie produktov',
    grid: 'Mriežkové zobrazenie',
    list: 'Riadkové zobrazenie',
  },
  productTable: {
    product: 'Produkt',
    code: 'Kód',
    availability: 'Dostupnosť',
    price: 'Cena',
    amount: 'Množstvo',
    sortPriceAsc: 'Zoradiť od najlacnejšieho',
    sortPriceDesc: 'Zoradiť od najdrahšieho',
  },
  qty: {
    decrease: 'Znížiť množstvo',
    increase: 'Zvýšiť množstvo',
    value: 'Množstvo',
  },
  cartCount: (qty) => `V košíku: ${qty} ks`,
};
