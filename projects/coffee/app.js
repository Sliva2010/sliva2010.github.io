/**
 * KULTURA COFFEE & BAKERY — INTERACTIVE SCRIPTS
 * Moscow Specialty Coffee Shop
 */

document.addEventListener('DOMContentLoaded', () => {
  initMenuTabs();
  initBeanSelector();
  initBookingModal();
  initScrollReveal();
  initStickyHeader();
  setDefaultDate();
});

/**
 * 1. Interactive Menu Tabs Filter
 */
function initMenuTabs() {
  const tabButtons = document.querySelectorAll('.menu-tab-btn');
  const menuCards = document.querySelectorAll('.menu-card');

  if (!tabButtons.length || !menuCards.length) return;

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const category = btn.getAttribute('data-category');

      // Update active tab button
      tabButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Filter cards with smooth fade
      menuCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        if (cardCategory === category) {
          card.classList.remove('is-hidden');
          card.style.opacity = '0';
          card.style.transform = 'translateY(12px)';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 30);
        } else {
          card.classList.add('is-hidden');
        }
      });
    });
  });
}

/**
 * 2. Interactive Daily Bean Selector in Hero
 */
function initBeanSelector() {
  const beanButtons = document.querySelectorAll('.bean-tab-btn');
  const beanNotes = document.getElementById('beanNotes');
  const beanProcess = document.getElementById('beanProcess');
  const beanRoast = document.getElementById('beanRoast');
  const beanDisplay = document.getElementById('beanDisplay');

  if (!beanButtons.length || !beanDisplay) return;

  beanButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      beanButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const notes = btn.getAttribute('data-notes');
      const process = btn.getAttribute('data-process');
      const roast = btn.getAttribute('data-roast');

      // Quick crossfade
      beanDisplay.style.opacity = '0.3';
      beanDisplay.style.transform = 'translateY(4px)';

      setTimeout(() => {
        if (beanNotes) beanNotes.textContent = notes;
        if (beanProcess) beanProcess.textContent = process;
        if (beanRoast) beanRoast.textContent = roast;
        beanDisplay.style.opacity = '1';
        beanDisplay.style.transform = 'translateY(0)';
      }, 140);
    });
  });
}

/**
 * 3. Booking & Takeaway Modal Controller
 */
function initBookingModal() {
  const modal = document.getElementById('bookingModal');
  const openButtons = document.querySelectorAll('.open-booking-btn');
  const closeBtn = document.getElementById('closeModalBtn');
  const resetBtn = document.getElementById('resetModalBtn');
  const form = document.getElementById('bookingForm');
  const successBox = document.getElementById('formSuccess');
  const modalBadge = document.getElementById('modalBadge');
  const modalTitle = document.getElementById('modalTitle');
  const locationSelect = document.getElementById('formLocation');
  const guestsGroup = document.getElementById('guestsGroup');

  if (!modal) return;

  function openModal(mode = 'table', preselectedLoc = '') {
    modal.classList.add('is-active');
    document.body.style.overflow = 'hidden';

    // Reset view
    if (form) form.style.display = 'flex';
    if (successBox) successBox.classList.remove('is-active');

    if (mode === 'takeaway') {
      if (modalBadge) modalBadge.textContent = 'ПРЕДЗАКАЗ TAKEAWAY';
      if (modalTitle) modalTitle.textContent = 'Оформить заказ с собой';
      if (guestsGroup) guestsGroup.style.display = 'none';
    } else {
      if (modalBadge) modalBadge.textContent = 'БРОНИРОВАНИЕ СТОЛА';
      if (modalTitle) modalTitle.textContent = 'Забронировать стол в KULTURA';
      if (guestsGroup) guestsGroup.style.display = 'flex';
    }

    if (preselectedLoc && locationSelect) {
      for (let option of locationSelect.options) {
        if (option.value.includes(preselectedLoc) || preselectedLoc.includes(option.value)) {
          option.selected = true;
          break;
        }
      }
    }
  }

  function closeModal() {
    modal.classList.remove('is-active');
    document.body.style.overflow = '';
  }

  openButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const mode = btn.getAttribute('data-mode') || 'table';
      const loc = btn.getAttribute('data-loc') || '';
      openModal(mode, loc);
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (resetBtn) resetBtn.addEventListener('click', closeModal);

  // Close on outside click
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  // Close on ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('is-active')) {
      closeModal();
    }
  });

  // Handle Form Submit
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      form.style.display = 'none';
      if (successBox) successBox.classList.add('is-active');
    });
  }
}

/**
 * Set today's date in date picker
 */
function setDefaultDate() {
  const dateInput = document.getElementById('formDate');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.value = today;
    dateInput.min = today;
  }
}

/**
 * 4. Scroll Reveal Animations via IntersectionObserver
 */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  if (!revealElements.length) return;

  if (!('IntersectionObserver' in window)) {
    revealElements.forEach(el => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => observer.observe(el));
}

/**
 * 5. Sticky Header styling
 */
function initStickyHeader() {
  const header = document.getElementById('navbar');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.style.boxShadow = '0 6px 20px rgba(20, 16, 12, 0.08)';
    } else {
      header.style.boxShadow = 'none';
    }
  }, { passive: true });
}
