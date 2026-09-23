/**
 * LUMINA AI STUDIO INTERACTIVE APPLICATION (v1.0)
 * Before/After Split Slider, Gallery Filtering, AI Simulator, FAQ & Scroll Reveals
 */

document.addEventListener('DOMContentLoaded', () => {
  initBeforeAfterSlider();
  initGalleryFilter();
  initSimulator();
  initPricingActions();
  initFAQ();
  initScrollReveal();
});

/**
 * 1. Interactive Before / After Split Slider
 */
function initBeforeAfterSlider() {
  const container = document.getElementById('beforeAfterSlider');
  const layerBefore = document.getElementById('layerBefore');
  const sliderHandle = document.getElementById('sliderHandle');
  const beforeImg = layerBefore ? layerBefore.querySelector('.compare-img') : null;
  const btnAutoSlide = document.getElementById('btnAutoSlide');

  if (!container || !layerBefore || !sliderHandle || !beforeImg) return;

  let isDragging = false;
  let autoSlideInterval = null;

  function updateImageWidth() {
    const width = container.offsetWidth;
    beforeImg.style.width = `${width}px`;
  }

  function setSliderPosition(percentage) {
    const clamped = Math.max(0, Math.min(100, percentage));
    layerBefore.style.width = `${clamped}%`;
    sliderHandle.style.left = `${clamped}%`;
  }

  function handleMove(clientX) {
    const rect = container.getBoundingClientRect();
    const positionX = clientX - rect.left;
    const percentage = (positionX / rect.width) * 100;
    setSliderPosition(percentage);
  }

  // Mouse & Touch Listeners
  container.addEventListener('mousedown', (e) => {
    isDragging = true;
    stopAutoSlide();
    handleMove(e.clientX);
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  });

  window.addEventListener('mouseup', () => {
    isDragging = false;
  });

  container.addEventListener('touchstart', (e) => {
    isDragging = true;
    stopAutoSlide();
    if (e.touches[0]) handleMove(e.touches[0].clientX);
  }, { passive: true });

  window.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    if (e.touches[0]) handleMove(e.touches[0].clientX);
  }, { passive: true });

  window.addEventListener('touchend', () => {
    isDragging = false;
  });

  // Keep before image responsive with container size
  window.addEventListener('resize', updateImageWidth);
  updateImageWidth();

  // Auto-demonstration animation
  function startAutoSlide() {
    let t = 0;
    btnAutoSlide.classList.add('active');
    autoSlideInterval = setInterval(() => {
      t += 0.035;
      const pct = 50 + Math.sin(t) * 35;
      setSliderPosition(pct);
    }, 20);
  }

  function stopAutoSlide() {
    if (autoSlideInterval) {
      clearInterval(autoSlideInterval);
      autoSlideInterval = null;
      if (btnAutoSlide) btnAutoSlide.classList.remove('active');
    }
  }

  if (btnAutoSlide) {
    btnAutoSlide.addEventListener('click', () => {
      if (autoSlideInterval) {
        stopAutoSlide();
        showToast('Авто-демонстрация остановлена');
      } else {
        startAutoSlide();
        showToast('Запущена авто-демонстрация слайдера');
      }
    });
  }
}

/**
 * 2. Gallery Filter Tabs
 */
function initGalleryFilter() {
  const filterButtons = document.querySelectorAll('.gallery-tabs .filter-btn');
  const cards = document.querySelectorAll('.photo-card');

  if (!filterButtons.length || !cards.length) return;

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      cards.forEach(card => {
        const cat = card.getAttribute('data-category');
        if (filter === 'all' || cat === filter) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0) scale(1)';
          }, 40);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px) scale(0.96)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 300);
        }
      });
    });
  });
}

/**
 * 3. AI Generation Simulator
 */
function initSimulator() {
  const styleBtns = document.querySelectorAll('#styleSelector .pill-btn');
  const lightBtns = document.querySelectorAll('#lightSelector .pill-btn');
  const startBtn = document.getElementById('btnStartRender');
  const statusEl = document.getElementById('renderStatus');
  const percentEl = document.getElementById('renderPercent');
  const progressFill = document.getElementById('progressBarFill');

  if (!startBtn || !progressFill || !statusEl || !percentEl) return;

  let currentStyle = 'Бизнес Forbes';
  let currentLight = 'Softbox 120cm';
  let isRendering = false;

  styleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      styleBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentStyle = btn.textContent.trim();
      statusEl.textContent = `Выбран стиль: «${currentStyle}» + «${currentLight}»`;
    });
  });

  lightBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      lightBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentLight = btn.textContent.trim();
      statusEl.textContent = `Выбран свет: «${currentLight}»`;
    });
  });

  startBtn.addEventListener('click', () => {
    if (isRendering) return;
    isRendering = true;
    startBtn.disabled = true;
    startBtn.style.opacity = '0.6';

    const steps = [
      { pct: 15, text: 'Анализ геометрии лица и пропорций черт...' },
      { pct: 35, text: `Построение виртуального сетапа: ${currentLight}...` },
      { pct: 60, text: `Стилизация гардероба и ткани: ${currentStyle}...` },
      { pct: 85, text: 'Рендеринг микротекстуры кожи и взгляда 8K...' },
      { pct: 100, text: 'Готово! Превью фотосессии успешно синтезировано.' }
    ];

    let stepIndex = 0;
    progressFill.style.width = '0%';
    percentEl.textContent = '0%';

    const interval = setInterval(() => {
      if (stepIndex < steps.length) {
        const step = steps[stepIndex];
        progressFill.style.width = `${step.pct}%`;
        percentEl.textContent = `${step.pct}%`;
        statusEl.textContent = step.text;
        stepIndex++;
      } else {
        clearInterval(interval);
        isRendering = false;
        startBtn.disabled = false;
        startBtn.style.opacity = '1';
        showToast(`Пресет «${currentStyle}» готов к съёмке!`);
      }
    }, 700);
  });
}

/**
 * 4. Pricing Plan Selector Actions
 */
function initPricingActions() {
  const planButtons = document.querySelectorAll('.btn-plan');
  planButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const planName = btn.getAttribute('data-plan') || 'PRO';
      showToast(`Выбран тариф «${planName}». Переход к загрузке селфи...`);
    });
  });
}

/**
 * 5. FAQ Accordion
 */
function initFAQ() {
  const items = document.querySelectorAll('.faq-item');
  items.forEach(item => {
    const trigger = item.querySelector('.faq-trigger');
    if (!trigger) return;

    trigger.addEventListener('click', () => {
      const isOpen = item.classList.contains('is-open');
      items.forEach(i => i.classList.remove('is-open'));
      if (!isOpen) {
        item.classList.add('is-open');
      }
    });
  });
}

/**
 * 6. Smooth Scroll Reveal on Intersection
 */
function initScrollReveal() {
  const elements = document.querySelectorAll('.reveal-up, .reveal-scale, .reveal-fade');
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
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  elements.forEach(el => observer.observe(el));
}

/**
 * Toast Notification Helper
 */
let toastTimer = null;
function showToast(message) {
  const toast = document.getElementById('toastBox');
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add('is-visible');

  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove('is-visible');
  }, 2600);
}
