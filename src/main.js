import { start } from './core/index.js';
import carouselSwipe from './modules/carousel-swipe/index.js';
import gallerySwipe from './modules/gallery-swipe/index.js';
import listView from './modules/list-view/index.js';
import qtyPicker from './modules/qty-picker/index.js';
import cartCount from './modules/cart-count/index.js';

// Register every module here. Order = init order.
// qty-picker before cart-count: the badge goes into the button the qty field sits next to.
start([carouselSwipe, gallerySwipe, listView, qtyPicker, cartCount]);
