/**
 * GAZU FASHION & STREETWEAR ECOMMERCE (v2.0)
 * Interactive cart drawer, wishlist, scroll animations and Russian localized notifications
 */

document.addEventListener('DOMContentLoaded', () => {
  initWishlist();
  initCartDrawer();
  initProductQuickAdd();
  initUtilityNotice();
  initScrollAnimations();
});

let wishlistTotal = 0;
let cartItems = [];

/**
 * 1. Wishlist Functionality
 */
function initWishlist() {
  const wishlistButtons = document.querySelectorAll('.btn-wishlist');
  const wishlistCount = document.getElementById('wishlistCount');

  wishlistButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isActive = btn.classList.toggle('active');

      if (isActive) {
        wishlistTotal++;
        showToast('Товар добавлен в избранное');
      } else {
        wishlistTotal = Math.max(0, wishlistTotal - 1);
        showToast('Товар удален из избранного');
      }

      if (wishlistCount) {
        wishlistCount.textContent = `(${wishlistTotal})`;
      }
    });
  });

  const wishlistTrigger = document.getElementById('wishlistTriggerBtn');
  if (wishlistTrigger) {
    wishlistTrigger.addEventListener('click', () => {
      showToast(`В избранном: ${wishlistTotal} ${declOfNum(wishlistTotal, ['товар', 'товара', 'товаров'])}`);
    });
  }
}

/**
 * 2. Slide-Over Cart Drawer Controller
 */
function initCartDrawer() {
  const cartTrigger = document.getElementById('cartTriggerBtn');
  const cartOverlay = document.getElementById('cartOverlay');
  const cartClose = document.getElementById('cartCloseBtn');
  const continueShoppingBtn = document.getElementById('continueShoppingBtn');
  const checkoutBtn = document.getElementById('checkoutBtn');

  function openCart() {
    if (cartOverlay) {
      cartOverlay.classList.add('is-active');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeCart() {
    if (cartOverlay) {
      cartOverlay.classList.remove('is-active');
      document.body.style.overflow = '';
    }
  }

  if (cartTrigger) cartTrigger.addEventListener('click', openCart);
  if (cartClose) cartClose.addEventListener('click', closeCart);
  if (continueShoppingBtn) continueShoppingBtn.addEventListener('click', closeCart);

  if (cartOverlay) {
    cartOverlay.addEventListener('click', (e) => {
      if (e.target === cartOverlay) closeCart();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && cartOverlay && cartOverlay.classList.contains('is-active')) {
      closeCart();
    }
  });

  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      if (!cartItems.length) {
        showToast('Ваша корзина пуста');
        return;
      }
      showToast('Спасибо за заказ в GAZU! Демо-оформление завершено.');
      cartItems = [];
      renderCart();
      setTimeout(closeCart, 1400);
    });
  }
}

/**
 * 3. Quick Add to Cart
 */
function initProductQuickAdd() {
  const addButtons = document.querySelectorAll('.btn-quick-add');

  addButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const card = btn.closest('.product-card');
      if (!card) return;

      const id = card.getAttribute('data-id');
      const name = card.getAttribute('data-name');
      const price = parseInt(card.getAttribute('data-price'), 10) || 1999;
      const img = card.getAttribute('data-img');

      // Check if already in cart
      const existing = cartItems.find(item => item.id === id);
      if (existing) {
        existing.qty += 1;
      } else {
        cartItems.push({ id, name, price, img, qty: 1 });
      }

      renderCart();
      showToast(`«${name}» добавлен в корзину`);
    });
  });
}

function renderCart() {
  const list = document.getElementById('cartItemsList');
  const subtotalEl = document.getElementById('cartSubtotal');
  const cartCountEl = document.getElementById('cartCount');

  const totalQty = cartItems.reduce((sum, item) => sum + item.qty, 0);
  const totalPrice = cartItems.reduce((sum, item) => sum + (item.price * item.qty), 0);

  if (cartCountEl) {
    cartCountEl.textContent = `(${totalQty})`;
  }

  if (subtotalEl) {
    subtotalEl.textContent = `${totalPrice.toLocaleString('ru-RU')} ₽`;
  }

  if (!list) return;

  if (cartItems.length === 0) {
    list.innerHTML = `
      <div class="cart-empty-state" id="cartEmptyState">
        <p>Ваша корзина пока пуста.</p>
        <a href="#best-of-gazu" class="btn-shop-now" id="continueShoppingBtn">СМОТРЕТЬ КАТАЛОГ</a>
      </div>
    `;
    const contBtn = document.getElementById('continueShoppingBtn');
    if (contBtn) {
      contBtn.addEventListener('click', () => {
        const overlay = document.getElementById('cartOverlay');
        if (overlay) overlay.classList.remove('is-active');
        document.body.style.overflow = '';
      });
    }
    return;
  }

  list.innerHTML = cartItems.map(item => `
    <div class="cart-item">
      <img src="${item.img}" alt="${item.name}" class="cart-item-img">
      <div class="cart-item-info">
        <h4 class="cart-item-name">${item.name}</h4>
        <span class="cart-item-price">${item.qty} × ${item.price.toLocaleString('ru-RU')} ₽</span>
        <br>
        <span class="cart-item-remove" data-id="${item.id}">Удалить</span>
      </div>
    </div>
  `).join('');

  // Wire up remove buttons
  const removeButtons = list.querySelectorAll('.cart-item-remove');
  removeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      cartItems = cartItems.filter(item => item.id !== id);
      renderCart();
      showToast('Товар удален из корзины');
    });
  });
}

/**
 * 4. Search and Login Feedback
 */
function initUtilityNotice() {
  const searchBtn = document.getElementById('searchTriggerBtn');
  const loginBtn = document.getElementById('loginTriggerBtn');

  if (searchBtn) {
    searchBtn.addEventListener('click', () => {
      showToast('Поиск по каталогу: введите название...');
    });
  }

  if (loginBtn) {
    loginBtn.addEventListener('click', () => {
      showToast('Личный кабинет: авторизация клиента');
    });
  }
}

/**
 * 5. Distinct Scroll Reveal Animations
 */
function initScrollAnimations() {
  const elements = document.querySelectorAll(
    '.reveal-category, .reveal-vibes-left, .reveal-vibes-right, .reveal-trust, .reveal-product-header, .reveal-product-card, .reveal-footer'
  );

  if (!elements.length) return;

  if (!('IntersectionObserver' in window)) {
    elements.forEach(el => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const delay = el.getAttribute('data-delay');
        if (delay) {
          el.style.transitionDelay = `${delay}s`;
        }
        el.classList.add('is-visible');
        obs.unobserve(el);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  elements.forEach(el => observer.observe(el));
}

/**
 * Toast Notification Helper
 */
let toastTimeout = null;
function showToast(message) {
  const toast = document.getElementById('toastNotice');
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add('is-visible');

  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.remove('is-visible');
  }, 2400);
}

/**
 * Declension helper for Russian nouns
 */
function declOfNum(number, titles) {
  const cases = [2, 0, 1, 1, 1, 2];
  return titles[
    number % 100 > 4 && number % 100 < 20
      ? 2
      : cases[number % 10 < 5 ? number % 10 : 5]
  ];
}
