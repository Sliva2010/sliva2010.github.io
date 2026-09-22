/**
 * VYACHESLAV PORTFOLIO — INTERACTIVE SCRIPTS (v5.0)
 * 3D Coverflow Carousel, Scroll-reactive Warp Canvas, Scroll Reveal & Telegram Lead Flow.
 */

document.addEventListener('DOMContentLoaded', () => {
  initBlockAnimations();
  initCoverflowCarousel();
  initScrollWarpCanvas();
  initScrollTracking();
  initContactForm();
});

/* ==========================================================================
   1. VISIBLE ENTRANCE & SCROLL REVEAL ANIMATIONS
   ========================================================================== */
function initBlockAnimations() {
  const blocks = document.querySelectorAll('.anim-block');
  if (!blocks.length) return;

  // Immediate animated reveal of the first screen (Hero)
  setTimeout(() => {
    const heroBlock = document.querySelector('#hero .anim-block');
    if (heroBlock) heroBlock.classList.add('is-visible');
  }, 100);

  // IntersectionObserver for remaining screens
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        }
      });
    }, {
      threshold: 0.08,
      rootMargin: '0px 0px -40px 0px'
    });

    blocks.forEach((el) => observer.observe(el));
  }

  // Robust Fallback: check on scroll
  function checkScrollReveal() {
    const windowH = window.innerHeight;
    blocks.forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.top < windowH * 0.92) {
        el.classList.add('is-visible');
      }
    });
  }

  window.addEventListener('scroll', checkScrollReveal, { passive: true });
  checkScrollReveal();

  // Safety net: ensure everything is visible after 800ms regardless
  setTimeout(() => {
    blocks.forEach((el) => el.classList.add('is-visible'));
  }, 800);
}

/* ==========================================================================
   2. 3D COVERFLOW CAROUSEL (EXACT MATCH TO REFERENCE 2)
   ========================================================================== */
function initCoverflowCarousel() {
  const slides = document.querySelectorAll('.carousel-slide');
  const prevBtn = document.getElementById('prevSlideBtn');
  const nextBtn = document.getElementById('nextSlideBtn');
  const dots = document.querySelectorAll('.dot-btn');
  const container = document.getElementById('carouselTrackContainer');
  
  const pillEl = document.getElementById('activeProjectPill');
  const nameEl = document.getElementById('activeProjectName');
  const descEl = document.getElementById('activeProjectDesc');
  const viewBtn = document.getElementById('viewProjectBtn');

  if (!slides.length) return;

  const total = slides.length;
  let currentIndex = 0;

  function updateCarousel(newIndex) {
    currentIndex = (newIndex + total) % total;

    const prevIndex = (currentIndex - 1 + total) % total;
    const nextIndex = (currentIndex + 1) % total;

    slides.forEach((slide, idx) => {
      if (idx === currentIndex) {
        slide.className = 'carousel-slide active';
      } else if (idx === prevIndex) {
        slide.className = 'carousel-slide prev';
      } else if (idx === nextIndex) {
        slide.className = 'carousel-slide next';
      } else {
        slide.className = 'carousel-slide hidden-slide';
      }
    });

    // Update active project info
    const activeSlide = slides[currentIndex];
    const title = activeSlide.getAttribute('data-title') || '';
    const tag = activeSlide.getAttribute('data-tag') || '';
    const desc = activeSlide.getAttribute('data-desc') || '';
    const url = activeSlide.getAttribute('data-url') || '#';

    if (pillEl) pillEl.textContent = `0${currentIndex + 1} / 05 • ${tag}`;
    if (nameEl) nameEl.textContent = title;
    if (descEl) descEl.textContent = desc;
    if (viewBtn) viewBtn.setAttribute('href', url);

    // Update pagination dots
    dots.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === currentIndex);
    });
  }

  // Navigation Arrows
  if (prevBtn) {
    prevBtn.addEventListener('click', (e) => {
      e.preventDefault();
      updateCarousel(currentIndex - 1);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', (e) => {
      e.preventDefault();
      updateCarousel(currentIndex + 1);
    });
  }

  // Pagination Dot Clicks
  dots.forEach((dot) => {
    dot.addEventListener('click', () => {
      const idx = parseInt(dot.getAttribute('data-index'), 10);
      if (!isNaN(idx)) updateCarousel(idx);
    });
  });

  // Clicking on Cards
  slides.forEach((slide, idx) => {
    slide.addEventListener('click', () => {
      if (idx === currentIndex) {
        // Active card: Open live project in new tab
        const url = slide.getAttribute('data-url');
        if (url) window.open(url, '_blank');
      } else {
        // Side card: Bring to center
        updateCarousel(idx);
      }
    });
  });

  // Touch Swipe on Mobile
  if (container) {
    let startX = 0;
    let endX = 0;

    container.addEventListener('touchstart', (e) => {
      startX = e.changedTouches[0].screenX;
    }, { passive: true });

    container.addEventListener('touchend', (e) => {
      endX = e.changedTouches[0].screenX;
      const diff = endX - startX;
      if (Math.abs(diff) > 35) {
        if (diff < 0) {
          updateCarousel(currentIndex + 1); // Swipe left
        } else {
          updateCarousel(currentIndex - 1); // Swipe right
        }
      }
    }, { passive: true });
  }

  // Initialize first slide
  updateCarousel(0);
}

/* ==========================================================================
   3. SCROLL-WARP AMBIENT BACKGROUND CANVAS
   Accelerates and forms speed trails when scrolling.
   ========================================================================== */
function initScrollWarpCanvas() {
  const canvas = document.getElementById('ambient-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  let mouse = {
    x: width / 2,
    y: height / 2,
    targetX: width / 2,
    targetY: height / 2,
  };

  let scrollVelocity = 0;
  let lastScrollY = window.scrollY;

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  window.addEventListener('mousemove', (e) => {
    mouse.targetX = e.clientX;
    mouse.targetY = e.clientY;
  });

  window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;
    const delta = currentScrollY - lastScrollY;
    scrollVelocity = delta * 0.15;
    lastScrollY = currentScrollY;
  }, { passive: true });

  // Generate particles with 3D depth (z coordinate)
  const count = Math.min(Math.floor((width * height) / 12000), 90);
  const particles = [];

  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      z: Math.random() * 2.2 + 0.6,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      baseRadius: Math.random() * 1.5 + 0.8,
      alpha: Math.random() * 0.5 + 0.25,
    });
  }

  function render() {
    ctx.clearRect(0, 0, width, height);

    // Friction decay on scroll velocity
    scrollVelocity *= 0.92;
    if (Math.abs(scrollVelocity) < 0.01) scrollVelocity = 0;

    // Smooth mouse lerp
    mouse.x += (mouse.targetX - mouse.x) * 0.05;
    mouse.y += (mouse.targetY - mouse.y) * 0.05;

    // Render particles
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];

      p.x += p.vx;
      p.y += p.vy - scrollVelocity * p.z;

      // Wrap boundaries
      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;
      if (p.y < 0) p.y = height;
      if (p.y > height) p.y = 0;

      // Draw speed streak when scrolling
      const streakLength = scrollVelocity * p.z * 1.8;

      ctx.beginPath();
      if (Math.abs(streakLength) > 1.2) {
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x, p.y + streakLength);
        ctx.strokeStyle = `rgba(255, 255, 255, ${p.alpha * 0.85})`;
        ctx.lineWidth = p.baseRadius;
        ctx.stroke();
      } else {
        ctx.arc(p.x, p.y, p.baseRadius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha})`;
        ctx.fill();
      }

      // Constellation lines between nearby particles
      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const dx = p.x - p2.x;
        const dy = p.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 125) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(255, 255, 255, ${0.07 * (1 - dist / 125)})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }

      // Mouse magnetic reaction
      const mdx = p.x - mouse.x;
      const mdy = p.y - mouse.y;
      const mDist = Math.sqrt(mdx * mdx + mdy * mdy);
      if (mDist < 160) {
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(mouse.x, mouse.y);
        ctx.strokeStyle = `rgba(6, 182, 212, ${0.14 * (1 - mDist / 160)})`;
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }
    }

    requestAnimationFrame(render);
  }

  render();
}

/* ==========================================================================
   4. SCROLL PROGRESS BAR
   ========================================================================== */
function initScrollTracking() {
  const scrollThumb = document.getElementById('scrollThumb');
  if (!scrollThumb) return;

  function updateScroll() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    scrollThumb.style.width = `${Math.max(progress, 15)}%`;
  }

  window.addEventListener('scroll', updateScroll, { passive: true });
  updateScroll();
}

/* ==========================================================================
   5. CONTACT FORM -> DIRECT TELEGRAM LEAD GENERATION
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contactForm');
  const feedback = document.getElementById('formFeedback');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('userName')?.value.trim() || 'Не указано';
    const contact = document.getElementById('userContact')?.value.trim() || 'Не указано';
    const projectType = document.getElementById('projectType')?.value || '3D-лендинг';
    const message = document.getElementById('userMessage')?.value.trim() || 'Без дополнительных комментариев';

    const textPayload = 
`Здравствуйте, Вячеслав! Хочу заказать проект.

👤 Имя: ${name}
📱 Контакт для связи: ${contact}
📌 Тип проекта: ${projectType}
📝 О задаче: ${message}`;

    const tgUrl = `https://t.me/SLAVASDF?text=${encodeURIComponent(textPayload)}`;

    if (feedback) {
      feedback.textContent = '✓ Открываем Telegram с готовой заявкой...';
      feedback.style.color = '#10b981';
    }

    window.open(tgUrl, '_blank');

    setTimeout(() => {
      form.reset();
      if (feedback) {
        feedback.textContent = 'Спасибо! Если Telegram не открылся, напишите напрямую на @SLAVASDF';
      }
    }, 2500);
  });
}
