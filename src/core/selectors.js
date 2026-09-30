// Shoptet (Apollo template) selectors — the only place that knows Shoptet markup.
// When the template changes, fix it here.
export const SEL = {
  // Homepage banner carousel (Bootstrap 3 carousel rendered by Shoptet)
  carousel: '#carousel.carousel',
  carouselItem: '.item',
  // Slide images; Shoptet already picks the mobile/desktop file server-side, slides 2+ are loading="lazy"
  carouselImage: '.item img',
  // Product detail gallery: main image + thumbnails (verified 2026-09-26)
  productImage: '.p-image-wrapper .p-image',
  productThumbnail: '.p-thumbnails a.p-thumbnail',
  productThumbnailActiveClass: 'highlighted',
  // Thumbnail strip: .p-thumbnails (overflow hidden) > .p-thumbnails-inner (absolute, moved by
  // style.left/top with a 0.3 s transition). Arrows move it by one thumbnail and carry the
  // busy class while it slides (verified 2026-09-29).
  productThumbnails: '.p-thumbnails',
  productThumbnailsInner: '.p-thumbnails-inner',
  productThumbnailsNext: '.p-thumbnails-arrows .thumbnail-next',
  productThumbnailsPrev: '.p-thumbnails-arrows .thumbnail-prev',
  productThumbnailsVerticalClass: 'p-thumbnails-vertical',
  productThumbnailsBusyClass: 'clicked',
  // Transparent layer cloud-zoom puts over the main image (rebuilt ~201 ms after every photo switch)
  productZoomTrap: '.mousetrap',

  // Product listing (category, search). Final DOM after Apollo has moved the
  // availability into .p-tools and the cart form into .product-btn (verified 2026-09-26).
  // The add-to-cart popup's "Ostatní zákazníci tiež nakúpili" block is also
  // #products.products-block; .products-related tells it apart from the listing.
  productList: '#products:not(.products-related)',
  productCard: '#products:not(.products-related) > .product',
  cartForm: 'form.pr-action',
  cartFormAmount: 'input[name="amount"]', // hidden; the multiply_order add-on writes the pack size here
  cartFormPriceId: 'input[name="priceId"]',
  cartFormSubmit: '[data-testid="buttonAddToCart"]',
  // Native sorting buttons above the listing (data-sort="price" | "-price" | …)
  listSorting: '.listSorting',
  listSortingControl: '.listSorting__control',
  listSortingCurrentClass: 'listSorting__control--current',
};
