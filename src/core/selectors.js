// Shoptet (Apollo template) selectors — the only place that knows Shoptet markup.
// When the template changes, fix it here.
export const SEL = {
  // Homepage banner carousel (Bootstrap 3 carousel rendered by Shoptet)
  carousel: '#carousel.carousel',
  carouselItem: '.item',
  // Product detail gallery: main image + thumbnails (verified 2026-09-26)
  productImage: '.p-image-wrapper .p-image',
  productThumbnail: '.p-thumbnails a.p-thumbnail',
  productThumbnailActiveClass: 'highlighted',
  // Transparent layer cloud-zoom puts over the main image (rebuilt ~201 ms after every photo switch)
  productZoomTrap: '.mousetrap',

  // Product listing (category, search). Final DOM after Apollo has moved the
  // availability into .p-tools and the cart form into .product-btn (verified 2026-09-26).
  productList: '#products',
  productCard: '#products > .product',
  cartForm: 'form.pr-action',
  cartFormAmount: 'input[name="amount"]', // hidden; the multiply_order add-on writes the pack size here
  cartFormPriceId: 'input[name="priceId"]',
  cartFormSubmit: '[data-testid="buttonAddToCart"]',
  // Native sorting buttons above the listing (data-sort="price" | "-price" | …)
  listSorting: '.listSorting',
  listSortingControl: '.listSorting__control',
  listSortingCurrentClass: 'listSorting__control--current',
};
