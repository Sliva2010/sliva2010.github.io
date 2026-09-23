/**
 * GAZU FASHION & STREETWEAR ECOMMERCE
 * Interactive cart drawer, wishlist, and micro-interactions
 */

document.addEventListener('DOMContentLoaded', () => {
  initWishlist();
  initCartDrawer();
  initProductQuickAdd();
  initUtilityNotice();
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
        showToast('Item added to your wishlist');
      } else {
        wishlistTotal = Math.max(0, wishlistTotal - 1);
        showToast('Item removed from wishlist');
      }

      if (wishlistCount) {
        wishlistCount.textContent = `(${wishlistTotal})`;
      }
    });
  });

  const wishlistTrigger = document.getElementById('wishlistTriggerBtn');
  if (wishlistTrigger) {
    wishlistTrigger.addEventListener('click', () => {
      showToast(`Wishlist contains ${wishlistTotal} items`);
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
        showToast('Your shopping bag is empty');
        return;
      }
      showToast('Thank you for choosing GAZU! Demo checkout completed.');
      cartItems = [];
      renderCart();
      setTimeout(closeCart, 1200);
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
      showToast(`Added "${name}" to shopping bag`);
    });
  });
}

function renderCart() {
  const list = document.getElementById('cartItemsList');
  const emptyState = document.getElementById('cartEmptyState');
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
        <p>Your shopping bag is currently empty.</p>
        <a href="#best-of-gazu" class="btn-shop-now" id="continueShoppingBtn">EXPLORE COLLECTION</a>
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
        <span class="cart-item-remove" data-id="${item.id}">Remove</span>
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
      showToast('Item removed from bag');
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
      showToast('Search catalog: type keyword...');
    });
  }

  if (loginBtn) {
    loginBtn.addEventListener('click', () => {
      showToast('Member login: enter your credentials');
    });
  }
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
