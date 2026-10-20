/**
 * TEMER Real Estate — Main Application Script
 * Brand: TEMER Real Estate / TEMER Properties | Addis Ababa, Ethiopia
 * Reference: https://temerpropertiessales.com
 * Contact: +251 941 246 658 | info@temerpropertiessales.com
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initHeroSlider();
  initScrollAnimations();
  initStatsCounters();
  initFaqAccordion();
  initFloatingWidget();
  initContactForms();
  initHomeFilters();
});

/* --------------------------------------------------------------------------
   Navigation & Header
   -------------------------------------------------------------------------- */
function initNavigation() {
  const header = document.querySelector('.site-header');
  const navToggle = document.querySelector('.nav-toggle');
  const mainNav = document.querySelector('.main-nav');
  const navLinks = document.querySelectorAll('.nav-link');

  // Sticky Header with Blur
  function handleScroll() {
    if (window.scrollY > 30) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Initial check

  // Mobile Menu Toggle
  if (navToggle && mainNav) {
    navToggle.addEventListener('click', () => {
      const isOpen = navToggle.classList.toggle('open');
      mainNav.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close mobile nav on link click
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navToggle.classList.remove('open');
        mainNav.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  // Active Link Highlighting based on current path
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href && (href === currentPath || href.endsWith(currentPath))) {
      link.classList.add('active');
    }
  });
}

/* --------------------------------------------------------------------------
   Hero Slideshow / Slider
   -------------------------------------------------------------------------- */
function initHeroSlider() {
  const slides = document.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('.slide-dot');
  if (!slides.length) return;

  let currentIndex = 0;
  let slideInterval = null;

  function showSlide(index) {
    slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === index);
    });
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === index);
    });
    currentIndex = index;
  }

  function nextSlide() {
    const nextIdx = (currentIndex + 1) % slides.length;
    showSlide(nextIdx);
  }

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      clearInterval(slideInterval);
      showSlide(i);
      startInterval();
    });
  });

  function startInterval() {
    slideInterval = setInterval(nextSlide, 6000);
  }

  startInterval();
}

/* --------------------------------------------------------------------------
   FAQ Accordion
   -------------------------------------------------------------------------- */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  if (!faqItems.length) return;

  faqItems.forEach(item => {
    const btn = item.querySelector('.faq-question-btn');
    if (!btn) return;

    btn.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      // Close other items
      faqItems.forEach(other => {
        if (other !== item) other.classList.remove('active');
      });
      // Toggle current
      item.classList.toggle('active', !isActive);
    });
  });
}

/* --------------------------------------------------------------------------
   Floating Quick Contact Widget
   -------------------------------------------------------------------------- */
function initFloatingWidget() {
  const widget = document.getElementById('floating-contact-widget');
  if (!widget) return;

  const mainBtn = widget.querySelector('.floating-main-btn');
  const menu = widget.querySelector('.floating-contact-menu');

  if (mainBtn && menu) {
    mainBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = menu.classList.toggle('open');
      mainBtn.classList.toggle('active', isOpen);
    });

    document.addEventListener('click', (e) => {
      if (!widget.contains(e.target)) {
        menu.classList.remove('open');
        mainBtn.classList.remove('active');
      }
    });
  }
}

/* --------------------------------------------------------------------------
   Home Page Search & Quick Filter
   -------------------------------------------------------------------------- */
function initHomeFilters() {
  const form = document.getElementById('home-search-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const loc = document.getElementById('home-filter-location')?.value || 'all';
    const type = document.getElementById('home-filter-type')?.value || 'all';
    const beds = document.getElementById('home-filter-bedrooms')?.value || 'all';

    // If properties section exists on page, scroll and filter
    const propsSec = document.getElementById('featured-properties') || document.getElementById('properties');
    if (propsSec) {
      propsSec.scrollIntoView({ behavior: 'smooth' });

      // If filter inputs exist
      const fLoc = document.getElementById('filter-location');
      const fType = document.getElementById('filter-type');
      const fBeds = document.getElementById('filter-bedrooms');

      if (fLoc && loc !== 'all') fLoc.value = loc;
      if (fType && type !== 'all') fType.value = type;
      if (fBeds && beds !== 'all') fBeds.value = beds;

      // Trigger filter change event
      fLoc?.dispatchEvent(new Event('change'));
    } else {
      // Navigate to properties page with query params
      window.location.href = `pages/properties.html?location=${encodeURIComponent(loc)}&type=${encodeURIComponent(type)}&bedrooms=${encodeURIComponent(beds)}`;
    }
  });
}

/* --------------------------------------------------------------------------
   Scroll Reveal Animations
   -------------------------------------------------------------------------- */
function initScrollAnimations() {
  const revealElements = document.querySelectorAll('.reveal-fade-up');
  if (!revealElements.length) return;

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          obs.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: '0px 0px -40px 0px',
      threshold: 0.1
    });

    revealElements.forEach(el => observer.observe(el));
  } else {
    revealElements.forEach(el => el.classList.add('is-revealed'));
  }
}

/* --------------------------------------------------------------------------
   Animated Statistics Counter
   -------------------------------------------------------------------------- */
function initStatsCounters() {
  const counters = document.querySelectorAll('.stat-number[data-target]');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-target'), 10);
        const prefix = el.getAttribute('data-prefix') || '';
        const suffix = el.getAttribute('data-suffix') || '';
        const duration = 1800; // ms
        const startTime = performance.now();

        function update(now) {
          const progress = Math.min((now - startTime) / duration, 1);
          const easeProgress = 1 - Math.pow(1 - progress, 3); // ease-out cubic
          const current = Math.floor(easeProgress * target);
          el.textContent = `${prefix}${current.toLocaleString()}${suffix}`;

          if (progress < 1) {
            requestAnimationFrame(update);
          } else {
            el.textContent = `${prefix}${target.toLocaleString()}${suffix}`;
          }
        }

        requestAnimationFrame(update);
        obs.unobserve(el);
      }
    });
  }, { threshold: 0.3 });

  counters.forEach(c => observer.observe(c));
}

/* --------------------------------------------------------------------------
   Contact Form Submission to WhatsApp Direct
   -------------------------------------------------------------------------- */
function initContactForms() {
  const forms = document.querySelectorAll('.ajax-contact-form');

  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = form.querySelector('[name="fullName"]');
      const phoneInput = form.querySelector('[name="phone"]');
      const emailInput = form.querySelector('[name="email"]');
      const messageInput = form.querySelector('[name="message"]');
      const propertyInput = form.querySelector('[name="propertyInterest"]');

      if (!nameInput?.value.trim() || !phoneInput?.value.trim()) {
        alert('Please provide your full name and contact phone number.');
        return;
      }

      const inquiryText = encodeURIComponent(
        `Hello TEMER Properties,\n\n` +
        `I am submitting an inquiry via your website:\n` +
        `Name: ${nameInput.value.trim()}\n` +
        `Phone: ${phoneInput.value.trim()}\n` +
        (emailInput?.value ? `Email: ${emailInput.value.trim()}\n` : '') +
        (propertyInput?.value ? `Property of Interest: ${propertyInput.value.trim()}\n` : '') +
        (messageInput?.value ? `Message: ${messageInput.value.trim()}\n` : '') +
        `\nPlease provide me with current availability, pricing, and project inspection schedules.`
      );

      const whatsappUrl = `https://wa.me/251941246658?text=${inquiryText}`;

      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.textContent = 'Connecting on WhatsApp...';
      submitBtn.disabled = true;

      setTimeout(() => {
        window.open(whatsappUrl, '_blank');
        submitBtn.textContent = 'Inquiry Sent!';
        setTimeout(() => {
          submitBtn.textContent = originalText;
          submitBtn.disabled = false;
          form.reset();
        }, 3000);
      }, 500);
    });
  });
}
