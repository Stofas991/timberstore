/* LEGACY — imported verbatim for C3 (2026-09-26), see LEGACY.md.
   Source: client's unpublished working copy of timber-menu.js lines 579–1361 (Desktop), the part appended
   after the live version. Not our code style; replaced by the C3 module. */
/* =========================================================
   TIMBER STORE – GRID / LIST VIEW v19
   RUNTIME AMOUNT SAFE
   ---------------------------------------------------------
   Audit confirmed:
   - product card DOM is stable before/after AJAX
   - visible +/- are NOT rendered by Martini in category cards
   - hidden input[name="amount"] receives runtime quantity
     (e.g. 500 for StrongFix, 2 for IF-Quick)
   - original Shoptet form/button remain authoritative

   Therefore:
   - we NEVER clone/replace the native form/button
   - we only add a visual qty controller INSIDE the native form
   - its step/min is the runtime initial hidden amount
   - "Do košíka" is still the original Shoptet submit button
   ========================================================= */
(function () {
    'use strict';

    if (window.__timberViewV19Initialized) return;
    window.__timberViewV19Initialized = true;

    var STORAGE_KEY = 'timber-product-view';
    var retryTimer = null;
    var retryCount = 0;
    var MAX_RETRIES = 40;

    function getPreferredView() {
        try {
            return localStorage.getItem(STORAGE_KEY) === 'list' ? 'list' : 'grid';
        } catch (e) {
            return 'grid';
        }
    }

    function setPreferredView(view) {
        try {
            localStorage.setItem(STORAGE_KEY, view === 'list' ? 'list' : 'grid');
        } catch (e) {}
    }

    function getProducts() {
        return document.querySelector('#products.products, #products');
    }

    function getSortingAnchor() {
        return document.querySelector('.listSorting, .list-sorting, [class*="listSorting"]');
    }

    function getToolbarHost() {
        var sorting = getSortingAnchor();
        if (sorting && sorting.parentElement) {
            return { host: sorting.parentElement, before: sorting };
        }

        var products = getProducts();
        if (products && products.parentElement) {
            return { host: products.parentElement, before: products };
        }

        return null;
    }

    function productCards(products) {
        if (!products) return [];
        return Array.prototype.slice.call(products.children).filter(function (node) {
            return node.classList && node.classList.contains('product');
        });
    }

    function getNativeForm(card) {
        return card ? card.querySelector('.product-btn form.pr-action') : null;
    }

    function getHiddenAmount(form) {
        return form ? form.querySelector('input[name="amount"]') : null;
    }

    function dispatchAmountEvents(input) {
        if (!input) return;
        try {
            input.dispatchEvent(new Event('input', { bubbles: true }));
            input.dispatchEvent(new Event('change', { bubbles: true }));
        } catch (e) {}
    }

    function initQuantityForCard(card) {
        if (!card || card.querySelector('.timber-v19-qty')) return true;

        var form = getNativeForm(card);
        var amount = getHiddenAmount(form);

        if (!form || !amount) return false;

        var runtime = parseFloat(String(amount.value || '').replace(',', '.'));

        /* Martini fills this later than first HTML paint.
           If still empty/invalid, wait for next refresh cycle. */
        if (!isFinite(runtime) || runtime <= 0) {
            return false;
        }

        var base = runtime;

        var wrap = document.createElement('div');
        wrap.className = 'timber-v19-qty';
        wrap.setAttribute('data-step', String(base));

        var minus = document.createElement('button');
        minus.type = 'button';
        minus.className = 'timber-v19-qty__btn timber-v19-qty__minus';
        minus.setAttribute('aria-label', 'Znížiť množstvo');
        minus.textContent = '−';

        var value = document.createElement('span');
        value.className = 'timber-v19-qty__value';
        value.textContent = String(runtime);

        var plus = document.createElement('button');
        plus.type = 'button';
        plus.className = 'timber-v19-qty__btn timber-v19-qty__plus';
        plus.setAttribute('aria-label', 'Zvýšiť množstvo');
        plus.textContent = '+';

        wrap.appendChild(minus);
        wrap.appendChild(value);
        wrap.appendChild(plus);

        var submit = form.querySelector('[data-testid="buttonAddToCart"], .btn-cart, .add-to-cart-button, button[type="submit"], input[type="submit"]');
        if (submit) {
            form.insertBefore(wrap, submit);
        } else {
            form.appendChild(wrap);
        }

        function update(next) {
            if (!isFinite(next) || next < base) next = base;

            /* enforce exact multiples of base */
            next = Math.max(base, Math.round(next / base) * base);

            amount.value = String(next);
            value.textContent = String(next);
            dispatchAmountEvents(amount);
        }

        minus.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();

            var current = parseFloat(String(amount.value || base).replace(',', '.'));
            if (!isFinite(current) || current <= 0) current = base;

            update(current - base);
        });

        plus.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();

            var current = parseFloat(String(amount.value || base).replace(',', '.'));
            if (!isFinite(current) || current <= 0) current = base;

            update(current + base);
        });

        return true;
    }


    function ensureAvailabilityProxies() {
        var products = getProducts();
        if (!products) return;

        productCards(products).forEach(function (card) {
            var root = card.querySelector(':scope > .p') || card;
            if (!root) return;

            var original = root.querySelector(
                '.availability, .p-tools > .availability, .availability-label, .p-stock'
            );

            if (!original) return;

            var text = (original.textContent || '')
                .replace(/\s+/g, ' ')
                .trim();

            if (!text) return;

            var proxy = root.querySelector('.timber-v21-availability');

            if (!proxy) {
                proxy = document.createElement('div');
                proxy.className = 'timber-v21-availability';
                root.appendChild(proxy);
            }

            proxy.textContent = text;
            proxy.classList.remove(
                'is-local-stock',
                'is-central-stock',
                'is-other-stock'
            );

            var normalized = text.toLowerCase();

            if (
                normalized.indexOf('skladom') !== -1 &&
                normalized.indexOf('centr') === -1
            ) {
                proxy.classList.add('is-local-stock');
            } else if (
                normalized.indexOf('centr') !== -1
            ) {
                proxy.classList.add('is-central-stock');
            } else {
                proxy.classList.add('is-other-stock');
            }
        });
    }

    function ensureQuantities() {
        var products = getProducts();
        if (!products) return;

        productCards(products).forEach(function (card) {
            initQuantityForCard(card);
        });
    }

    function getCartMap() {
        var cart = [];

        try {
            if (typeof window.getShoptetDataLayer === 'function') {
                cart = window.getShoptetDataLayer('cart') || [];
            } else if (
                window.dataLayer &&
                window.dataLayer[0] &&
                window.dataLayer[0].shoptet
            ) {
                cart = window.dataLayer[0].shoptet.cart || [];
            }
        } catch (e) {
            cart = [];
        }

        var map = {};
        cart.forEach(function (item) {
            if (item && item.code) {
                map[String(item.code)] = Number(item.quantity) || 0;
            }
        });

        return map;
    }

    function cardCode(card) {
        var codeEl = card.querySelector('.p-code [data-micro="sku"], .p-code, .product-code');
        var text = codeEl ? (codeEl.textContent || '').replace(/\s+/g, ' ').trim() : '';

        if (text) {
            return text.replace(/^Kód:\s*/i, '').trim();
        }

        return '';
    }

    function updateCartBadges() {
        var products = getProducts();
        if (!products) return;

        var map = getCartMap();

        productCards(products).forEach(function (card) {
            var button = card.querySelector('[data-testid="buttonAddToCart"], .btn-cart, .add-to-cart-button');
            if (!button) return;

            var code = cardCode(card);
            var qty = code ? (map[code] || 0) : 0;

            button.classList.add('timber-v19-cart-button');

            var badge = button.querySelector('.timber-v19-cart-badge');
            if (!badge) {
                badge = document.createElement('span');
                badge.className = 'timber-v19-cart-badge';
                badge.hidden = true;
                button.appendChild(badge);
            }

            if (qty > 0) {
                button.classList.add('has-cart-quantity');
                badge.hidden = false;
                badge.textContent = String(qty);
            } else {
                button.classList.remove('has-cart-quantity');
                badge.hidden = true;
                badge.textContent = '';
            }
        });
    }

    function ensureListHeader(show) {
        var products = getProducts();
        if (!products) return;

        var header = document.querySelector('.timber-v19-header');

        if (!show) {
            if (header) header.remove();
            return;
        }

        if (!header) {
            header = document.createElement('div');
            header.className = 'timber-v19-header';
            var availDirection = getAvailabilityDirectionFromUrl();
            var priceDirection = getPriceDirectionFromNativeSort();

            header.innerHTML =
                '<div>Produkt</div>' +
                '<div>Kód</div>' +
                '<div><button type="button" class="timber-v24-sort" data-timber-sort="availability" data-direction="' + availDirection + '">Dostupnosť <span class="timber-v24-chevron" aria-hidden="true"></span></button></div>' +
                '<div><button type="button" class="timber-v24-sort" data-timber-sort="price" data-direction="' + priceDirection + '">Cena <span class="timber-v24-chevron" aria-hidden="true"></span></button></div>' +
                '<div>Množstvo</div>' +
                '<div></div>';

            products.insertAdjacentElement('beforebegin', header);

            header.querySelectorAll('.timber-v24-sort').forEach(function (button) {
                updateSortButton(button, button.getAttribute('data-direction') || 'asc');
            });
        }
    }



    function getAvailabilityDirectionFromUrl() {
        try {
            var url = new URL(window.location.href);
            return url.searchParams.get('timber_availability') === 'desc'
                ? 'desc'
                : 'asc';
        } catch (e) {
            return 'asc';
        }
    }

    function getPriceDirectionFromNativeSort() {
        var current = document.querySelector(
            '.listSorting__control--current, .listSorting .active, .listSorting [aria-disabled="true"]'
        );

        var text = current ? normalizeText(current.textContent) : '';

        if (text.indexOf('najdrahs') !== -1) return 'desc';
        if (text.indexOf('najlacnejs') !== -1) return 'asc';

        return 'asc';
    }

    function setAvailabilitySortAndReload(direction) {
        try {
            var url = new URL(window.location.href);

            url.searchParams.set('timber_availability', direction);

            /*
             * Availability sorting is our client-side layer.
             * Keep native order untouched, but force a clean full reload
             * so the category does not visually shuffle in place.
             */
            window.location.href = url.toString();
        } catch (e) {
            window.location.reload();
        }
    }

    function goToNativePriceSort(direction) {
        var wanted = direction === 'desc'
            ? 'najdrahsie'
            : 'najlacnejsie';

        var candidates = Array.prototype.slice.call(
            document.querySelectorAll('.listSorting__control, .listSorting button, .listSorting a')
        );

        var control = candidates.find(function (el) {
            return normalizeText(el.textContent).indexOf(wanted) !== -1;
        });

        if (!control) return false;

        var url =
            control.getAttribute('data-url') ||
            control.getAttribute('href');

        if (url) {
            window.location.href = url;
            return true;
        }

        control.click();
        return true;
    }

    function normalizeText(text) {
        return String(text || '')
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/\s+/g, ' ')
            .trim();
    }

    function getAvailabilityText(card) {
        if (!card) return '';

        var proxy = card.querySelector('.timber-v21-availability');
        if (proxy && proxy.textContent.trim()) {
            return proxy.textContent.trim();
        }

        var original = card.querySelector(
            '.availability, .availability-label, .p-stock'
        );

        return original ? original.textContent.trim() : '';
    }

    function availabilityRank(text) {
        var t = normalizeText(text);

        // Highest priority: truly local stock.
        if (
            (t === 'skladom' || t.indexOf('skladom') === 0) &&
            t.indexOf('central') === -1
        ) {
            return 0;
        }

        // Supplier/central warehouse.
        if (t.indexOf('central') !== -1) {
            return 1;
        }

        // Ordered / inbound / temporarily unavailable but expected.
        if (
            t.indexOf('objednan') !== -1 ||
            t.indexOf('na ceste') !== -1 ||
            t.indexOf('ocakav') !== -1
        ) {
            return 2;
        }

        // Everything else.
        return 3;
    }

    function sortLoadedByAvailability(direction) {
        var products = getProducts();
        if (!products) return;

        ensureAvailabilityProxies();

        var cards = productCards(products);
        var indexed = cards.map(function (card, index) {
            var text = getAvailabilityText(card);

            return {
                card: card,
                index: index,
                text: text,
                rank: availabilityRank(text)
            };
        });

        indexed.sort(function (a, b) {
            var diff = a.rank - b.rank;

            if (direction === 'desc') {
                diff = -diff;
            }

            if (diff !== 0) {
                return diff;
            }

            // Keep the existing order inside the same availability group.
            return a.index - b.index;
        });

        indexed.forEach(function (item) {
            products.appendChild(item.card);
        });

        // Re-apply our visual helpers after DOM reordering.
        ensureAvailabilityProxies();
        ensureQuantities();
        updateCartBadges();
    }


    function updateSortButton(button, direction) {
        if (!button) return;

        button.setAttribute('data-direction', direction);
        button.classList.toggle('is-asc', direction === 'asc');
        button.classList.toggle('is-desc', direction === 'desc');
    }

    function installCartWheelGuard() {
        var widget = document.querySelector('#cart-widget');
        if (!widget || widget.__timberV22WheelGuard) return;

        widget.__timberV22WheelGuard = true;

        widget.addEventListener('wheel', function (e) {
            if (widget.getAttribute('aria-hidden') === 'true') return;

            var scrollables = Array.prototype.slice.call(
                widget.querySelectorAll('*')
            ).filter(function (el) {
                var style = window.getComputedStyle(el);
                var oy = style.overflowY;
                return (
                    el.scrollHeight > el.clientHeight + 2 &&
                    (oy === 'auto' || oy === 'scroll')
                );
            });

            var target = scrollables[0];

            if (!target) {
                e.preventDefault();
                e.stopPropagation();
                return;
            }

            target.scrollTop += e.deltaY;
            e.preventDefault();
            e.stopPropagation();
        }, { passive: false });
    }

    function applyView(view) {
        var products = getProducts();
        if (!products) return false;

        var desktopList = view === 'list' && window.innerWidth >= 992;

        products.classList.toggle('ts-view-list', desktopList);
        products.classList.toggle('ts-view-grid', !desktopList);

        document.documentElement.classList.toggle('timber-list-active', desktopList);
        if (document.body) {
            document.body.classList.toggle('timber-list-active', desktopList);
        }

        ensureListHeader(desktopList);
        ensureQuantities();
        ensureAvailabilityProxies();

        if (desktopList) {
            var availabilityDirection = getAvailabilityDirectionFromUrl();

            try {
                var currentUrl = new URL(window.location.href);
                if (currentUrl.searchParams.has('timber_availability')) {
                    sortLoadedByAvailability(availabilityDirection);
                }
            } catch (e) {}
        }

        updateCartBadges();
        installCartWheelGuard();

        document.querySelectorAll('[data-timber-view]').forEach(function (button) {
            var active =
                button.getAttribute('data-timber-view') ===
                (desktopList ? 'list' : 'grid');

            button.classList.toggle('is-active', active);
            button.setAttribute('aria-pressed', active ? 'true' : 'false');
        });

        return true;
    }

    function buildToolbar() {
        var existing = document.querySelector('.timber-view-switch');

        if (existing) {
            applyView(getPreferredView());
            return true;
        }

        var products = getProducts();
        var placement = getToolbarHost();

        if (!products || !placement) return false;

        var toolbar = document.createElement('div');
        toolbar.className = 'timber-view-switch';
        toolbar.setAttribute('aria-label', 'Zobrazenie produktov');

        toolbar.innerHTML =
            '<span class="timber-view-switch__label">Zobrazenie</span>' +
            '<button type="button" class="timber-view-switch__button" data-timber-view="grid" aria-label="Mriežkové zobrazenie" aria-pressed="false">' +
                '<svg viewBox="0 0 24 24" aria-hidden="true">' +
                    '<rect x="3" y="3" width="7" height="7" rx="1"></rect>' +
                    '<rect x="14" y="3" width="7" height="7" rx="1"></rect>' +
                    '<rect x="3" y="14" width="7" height="7" rx="1"></rect>' +
                    '<rect x="14" y="14" width="7" height="7" rx="1"></rect>' +
                '</svg>' +
            '</button>' +
            '<button type="button" class="timber-view-switch__button" data-timber-view="list" aria-label="Riadkové zobrazenie" aria-pressed="false">' +
                '<svg viewBox="0 0 24 24" aria-hidden="true">' +
                    '<rect x="3" y="4" width="4" height="4" rx="1"></rect>' +
                    '<rect x="9" y="4" width="12" height="4" rx="1"></rect>' +
                    '<rect x="3" y="10" width="4" height="4" rx="1"></rect>' +
                    '<rect x="9" y="10" width="12" height="4" rx="1"></rect>' +
                    '<rect x="3" y="16" width="4" height="4" rx="1"></rect>' +
                    '<rect x="9" y="16" width="12" height="4" rx="1"></rect>' +
                '</svg>' +
            '</button>';

        placement.host.insertBefore(toolbar, placement.before || null);

        applyView(getPreferredView());
        return true;
    }

    function ensureToolbar() {
        if (buildToolbar()) {
            retryCount = 0;
            return;
        }

        if (retryCount >= MAX_RETRIES) return;

        retryCount += 1;

        if (retryTimer) clearTimeout(retryTimer);

        retryTimer = setTimeout(ensureToolbar, 250);
    }


    document.addEventListener('click', function (e) {
        var sortButton = e.target.closest('.timber-v24-sort');
        if (!sortButton) return;

        e.preventDefault();

        var type = sortButton.getAttribute('data-timber-sort');
        var current = sortButton.getAttribute('data-direction') || 'asc';
        var next = current === 'asc' ? 'desc' : 'asc';

        if (type === 'availability') {
            setAvailabilitySortAndReload(current);
        } else if (type === 'price') {
            goToNativePriceSort(current);
        }
    });

    document.addEventListener('click', function (e) {
        var button = e.target.closest('[data-timber-view]');
        if (!button) return;

        e.preventDefault();

        var view =
            button.getAttribute('data-timber-view') === 'list'
                ? 'list'
                : 'grid';

        setPreferredView(view);
        applyView(view);
    });

    function refreshAfterShoptetAjax() {
        /* Martini amount arrives after HTML.
           Repeat only our decoration; never replace native cards/forms. */
        [100, 350, 800, 1500].forEach(function (delay) {
            setTimeout(function () {
                ensureToolbar();
                ensureQuantities();
                ensureAvailabilityProxies();
                installCartWheelGuard();
                applyView(getPreferredView());
            }, delay);
        });
    }

    [
        'ShoptetDOMPageContentLoaded',
        'ShoptetDOMPageMoreProductsLoaded',
        'ShoptetPageSortingChanged',
        'ShoptetPagePaginationUsed'
    ].forEach(function (eventName) {
        document.addEventListener(eventName, refreshAfterShoptetAjax);
    });

    [
        'ShoptetDataLayerUpdated',
        'ShoptetCartUpdated',
        'ShoptetCartAddCartItem',
        'ShoptetDOMCartContentLoaded'
    ].forEach(function (eventName) {
        document.addEventListener(eventName, function () {
            setTimeout(updateCartBadges, 50);
            setTimeout(updateCartBadges, 350);
        });
    });


    function enforcePreferredViewImmediately() {
        var products = getProducts();
        if (!products) return;

        var wantsList =
            getPreferredView() === 'list' &&
            window.innerWidth >= 992;

        if (wantsList) {
            products.classList.add('ts-view-list');
            products.classList.remove('ts-view-grid');
            document.documentElement.classList.add('timber-list-active');
            if (document.body) document.body.classList.add('timber-list-active');
        }
    }

    var timberProductsObserver = new MutationObserver(function () {
        enforcePreferredViewImmediately();

        clearTimeout(window.__timberV27RefreshTimer);
        window.__timberV27RefreshTimer = setTimeout(function () {
            ensureToolbar();
            ensureQuantities();
            ensureAvailabilityProxies();
            applyView(getPreferredView());
        }, 30);
    });

    function startTimberProductsObserver() {
        if (!document.body) return;

        timberProductsObserver.observe(document.body, {
            childList: true,
            subtree: true
        });

        enforcePreferredViewImmediately();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function () {
            startTimberProductsObserver();
            ensureToolbar();
        }, { once: true });
    } else {
        startTimberProductsObserver();
        ensureToolbar();
    }

    window.addEventListener('load', function () {
        ensureToolbar();
        refreshAfterShoptetAjax();
    });

    window.addEventListener('resize', function () {
        applyView(getPreferredView());
    });

    setTimeout(ensureToolbar, 300);
    setTimeout(ensureToolbar, 900);
    setTimeout(ensureToolbar, 1800);
}());
