/**
 * ZINK AI TUTOR LANDING PAGE — INTERACTIVE SCRIPTS
 * Phone Mockup Screen Switcher, Auto-Demo & Distinct Block Scroll Animations
 */

document.addEventListener('DOMContentLoaded', () => {
  initPhoneMockupSwitcher();
  initScrollAnimations();
});

function initPhoneMockupSwitcher() {
  const phoneImg = document.getElementById('phoneActiveScreen');
  const selectorButtons = document.querySelectorAll('.selector-btn');
  const captionTitle = document.getElementById('captionTitle');
  const captionDesc = document.getElementById('captionDesc');

  if (!phoneImg || !selectorButtons.length) return;

  let currentIndex = 0;
  let autoTimer = null;
  let isUserInteracting = false;

  function setScreen(btn, animate = true) {
    const newSrc = btn.getAttribute('data-img');
    const title = btn.getAttribute('data-title');
    const desc = btn.getAttribute('data-desc');

    selectorButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    if (animate) {
      phoneImg.style.opacity = '0.3';
      phoneImg.style.transform = 'scale(0.97)';
      
      setTimeout(() => {
        phoneImg.src = newSrc;
        phoneImg.style.opacity = '1';
        phoneImg.style.transform = 'scale(1)';
      }, 150);
    } else {
      phoneImg.src = newSrc;
    }

    if (captionTitle) captionTitle.textContent = title;
    if (captionDesc) captionDesc.textContent = desc;
  }

  // Click on buttons
  selectorButtons.forEach((btn, index) => {
    btn.addEventListener('click', () => {
      isUserInteracting = true;
      currentIndex = index;
      setScreen(btn, true);
      resetAutoTimer();
    });
  });

  // Auto-cycle screens every 5 seconds
  function startAutoCycle() {
    autoTimer = setInterval(() => {
      if (!isUserInteracting) {
        currentIndex = (currentIndex + 1) % selectorButtons.length;
        setScreen(selectorButtons[currentIndex], true);
      }
    }, 4500);
  }

  function resetAutoTimer() {
    clearInterval(autoTimer);
    // Resume auto-cycle after 10s of inactivity
    setTimeout(() => {
      isUserInteracting = false;
      startAutoCycle();
    }, 10000);
  }

  startAutoCycle();
}

/**
 * Scroll Observer for distinct block animations
 * Triggers unique transitions per section and data-anim attribute
 */
function initScrollAnimations() {
  const revealElements = document.querySelectorAll(
    '.reveal-header, .reveal-bento, .reveal-screen-card, .reveal-tech-pill, .reveal-cta'
  );
  
  if (!revealElements.length) return;

  // Fallback for environments without IntersectionObserver
  if (!('IntersectionObserver' in window)) {
    revealElements.forEach(el => el.classList.add('is-visible'));
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

  revealElements.forEach(el => observer.observe(el));
}

