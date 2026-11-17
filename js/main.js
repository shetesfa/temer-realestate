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
   Home Page Search & Quick Filter Engine
   -------------------------------------------------------------------------- */
function initHomeFilters() {
  const form = document.getElementById('home-search-form');
  const searchInput = document.getElementById('home-filter-search');
  const suggestionsBox = document.getElementById('home-search-suggestions');
  const locSelect = document.getElementById('home-filter-location');
  const typeSelect = document.getElementById('home-filter-type');
  const bedsSelect = document.getElementById('home-filter-bedrooms');
  const resetBtn = document.getElementById('home-filter-reset');
  const quickTags = document.querySelectorAll('.quick-tag-btn');
  const propsContainer = document.getElementById('properties-grid-container');

  if (!form) return;

  function runHomeSearch(scroll = false) {
    const q = (searchInput?.value || '').trim();
    const loc = locSelect?.value || 'all';
    const type = typeSelect?.value || 'all';
    const beds = bedsSelect?.value || 'all';

    // If on homepage with live properties container and search API
    if (propsContainer && window.TEMER_SEARCH && typeof TEMER_PROPERTIES !== 'undefined') {
      const results = window.TEMER_SEARCH.search({
        query: q,
        location: loc,
        type: type,
        bedrooms: beds
      });

      renderHomeResults(results, q);

      if (scroll) {
        const sec = document.getElementById('featured-properties');
        if (sec) {
          sec.scrollIntoView({ behavior: 'smooth' });
        }
      }
    } else {
      // Navigate to full properties catalog with query
      const params = new URLSearchParams();
      if (q) params.set('search', q);
      if (loc !== 'all') params.set('location', loc);
      if (type !== 'all') params.set('type', type);
      if (beds !== 'all') params.set('bedrooms', beds);
      window.location.href = `pages/properties.html?${params.toString()}`;
    }
  }

  function renderHomeResults(list, query) {
    if (!propsContainer) return;

    if (list.length === 0) {
      propsContainer.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 50px 20px; background: #ffffff; border-radius: var(--radius-lg); border: 1px dashed var(--border); box-shadow: 0 4px 16px rgba(0,0,0,0.04);">
          <div style="font-size: 2.6rem; color: var(--primary); margin-bottom: 12px;">🏙️</div>
          <h3 style="margin-bottom: 8px; font-size:1.35rem;">No properties found for "${query}"</h3>
          <p style="margin-bottom: 20px; color: var(--text-muted); max-width: 480px; margin-left:auto; margin-right:auto;">
            Try another search keyword (e.g. "Ayat", "Bole", "3 Bed") or contact our direct sales office.
          </p>
          <div style="display:flex; justify-content:center; gap:10px; flex-wrap:wrap;">
            <button type="button" class="btn btn-outline btn-sm" id="btn-home-clear-search">Reset Search</button>
            <a href="tel:+251941246658" class="btn btn-primary btn-sm"><i class="fa-solid fa-phone"></i> Call 0941246658</a>
          </div>
        </div>
      `;
      document.getElementById('btn-home-clear-search')?.addEventListener('click', resetAllHomeFilters);
      return;
    }

    const isSubPage = window.location.pathname.includes('/pages/');
    const basePath = isSubPage ? '' : 'pages/';

    propsContainer.innerHTML = list.slice(0, 6).map(prop => {
      const waMsg = encodeURIComponent(
        `Hello TEMER Real Estate,\n\nI am interested in:\n${prop.title} (${prop.location})\nPrice: ${prop.price} (${prop.priceUsd})\nArea: ${prop.area} m²\n\nPlease send me availability and floor details.`
      );
      const waUrl = `https://wa.me/${prop.contact?.whatsappNumber || '251941246658'}?text=${waMsg}`;
      const detailUrl = `${basePath}property-details.html?id=${prop.id}`;

      let imgSrc = prop.image;
      if (!isSubPage && imgSrc.startsWith('../')) {
        imgSrc = imgSrc.replace('../', '');
      }

      return `
        <article class="property-card" data-id="${prop.id}">
          <div class="card-media">
            <img src="${imgSrc}" alt="${prop.title}" class="card-img" loading="lazy" onerror="this.src='assets/images/photo_2026-10-09_10-14-17.jpg'">
            <span class="card-badge-status">${prop.status}</span>
            <span class="card-badge-verified">
              <i class="fa-solid fa-circle-check"></i> TEMER Verified
            </span>
            <div class="card-price-overlay">
              <div>
                <div class="price-main">${prop.price}</div>
                <div class="price-usd">${prop.priceUsd} Guide</div>
              </div>
            </div>
          </div>
          <div class="card-body">
            <div class="card-location">
              <i class="fa-solid fa-location-dot"></i> ${prop.location}, Addis Ababa
            </div>
            <h3 class="card-title">
              <a href="${detailUrl}">${prop.title}</a>
            </h3>
            <p class="card-description">${prop.description}</p>
            
            <div class="card-specs">
              <div class="spec-item" title="Bedrooms">
                <i class="fa-solid fa-bed"></i> ${prop.bedrooms} Beds
              </div>
              <div class="spec-item" title="Bathrooms">
                <i class="fa-solid fa-bath"></i> ${prop.bathrooms} Baths
              </div>
              <div class="spec-item" title="Total Floor Area">
                <i class="fa-solid fa-ruler-combined"></i> ${prop.area} m²
              </div>
            </div>

            <div class="card-actions">
              <a href="${detailUrl}" class="btn btn-outline btn-sm">
                View Details
              </a>
              <a href="${waUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-whatsapp btn-sm" title="Chat directly with TEMER sales on WhatsApp">
                <i class="fa-brands fa-whatsapp"></i> Inquire
              </a>
            </div>
          </div>
        </article>
      `;
    }).join('');
  }

  function resetAllHomeFilters() {
    if (searchInput) searchInput.value = '';
    if (locSelect) locSelect.value = 'all';
    if (typeSelect) typeSelect.value = 'all';
    if (bedsSelect) bedsSelect.value = 'all';
    if (suggestionsBox) suggestionsBox.style.display = 'none';
    quickTags.forEach(b => b.classList.remove('active'));
    document.querySelector('.quick-tag-btn[data-search="temer"]')?.classList.add('active');
    runHomeSearch(false);
  }

  // Live typing & suggestions
  if (searchInput && suggestionsBox) {
    searchInput.addEventListener('input', () => {
      const q = searchInput.value.trim();
      runHomeSearch(false);

      if (q.length >= 1 && window.TEMER_SEARCH) {
        const matches = window.TEMER_SEARCH.getSuggestions(q, 5);
        if (matches.length > 0) {
          const isSub = window.location.pathname.includes('/pages/');
          const prefix = isSub ? '' : 'pages/';

          suggestionsBox.innerHTML = matches.map(m => {
            let thumb = m.image;
            if (!isSub && thumb.startsWith('../')) thumb = thumb.replace('../', '');
            return `
              <a href="${prefix}property-details.html?id=${m.id}" class="suggestion-item">
                <img src="${thumb}" alt="${m.title}" class="suggestion-thumb" onerror="this.src='assets/images/photo_2026-10-09_10-14-17.jpg'">
                <div class="suggestion-info">
                  <div class="suggestion-title">${m.title}</div>
                  <div class="suggestion-meta">
                    <span><i class="fa-solid fa-location-dot"></i> ${m.location}</span>
                    <span>•</span>
                    <span>${m.bedrooms} Beds</span>
                    <span>•</span>
                    <span class="suggestion-price">${m.price}</span>
                  </div>
                </div>
              </a>
            `;
          }).join('') + `
            <div style="padding: 8px 12px; background: #f8fafc; text-align: center; font-size: 0.8rem; border-top: 1px solid var(--border);">
              <a href="pages/properties.html?search=${encodeURIComponent(q)}" style="color:var(--primary); font-weight:600;">
                View all results for "${q}" &rarr;
              </a>
            </div>
          `;
          suggestionsBox.style.display = 'block';
        } else {
          suggestionsBox.style.display = 'none';
        }
      } else {
        suggestionsBox.style.display = 'none';
      }
    });

    // Close suggestions when clicking outside
    document.addEventListener('click', (e) => {
      if (!searchInput.contains(e.target) && !suggestionsBox.contains(e.target)) {
        suggestionsBox.style.display = 'none';
      }
    });
  }

  // Dropdown changes trigger live search
  locSelect?.addEventListener('change', () => runHomeSearch(false));
  typeSelect?.addEventListener('change', () => runHomeSearch(false));
  bedsSelect?.addEventListener('change', () => runHomeSearch(false));

  // Reset button
  resetBtn?.addEventListener('click', resetAllHomeFilters);

  // Form submit (e.g. user hits enter or clicks Search button)
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (suggestionsBox) suggestionsBox.style.display = 'none';
    runHomeSearch(true);
  });

  // Quick Tags
  quickTags.forEach(btn => {
    btn.addEventListener('click', () => {
      quickTags.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const term = btn.getAttribute('data-search') || '';
      if (searchInput) {
        searchInput.value = term;
      }
      if (suggestionsBox) suggestionsBox.style.display = 'none';
      runHomeSearch(true);
    });
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
