/**
 * TEMER Real Estate — Main Application Script
 * Brand: TEMER Real Estate | Addis Ababa, Ethiopia
 * Contact: +251 94 124 6658
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initHeroVideo();
  initScrollAnimations();
  initStatsCounters();
  initContactForms();
});

/* --------------------------------------------------------------------------
   Navigation & Header (Modern Luxury Drawer & Mobile UX)
   -------------------------------------------------------------------------- */
function initNavigation() {
  const header = document.querySelector('.site-header');
  const navToggle = document.querySelector('.nav-toggle');
  const mainNav = document.querySelector('.main-nav');
  const navLinks = document.querySelectorAll('.nav-link');
  const isSubPage = window.location.pathname.includes('/pages/');

  // 1. Dynamic Mobile Backdrop Overlay
  let navBackdrop = document.querySelector('.nav-backdrop');
  if (!navBackdrop) {
    navBackdrop = document.createElement('div');
    navBackdrop.className = 'nav-backdrop';
    document.body.appendChild(navBackdrop);
  }

  // 2. Add Mobile Fast-Call Action to Header (Next to hamburger)
  const headerContainer = document.querySelector('.header-container');
  if (headerContainer && navToggle && !document.querySelector('.header-mobile-controls')) {
    const mobileControls = document.createElement('div');
    mobileControls.className = 'header-mobile-controls';
    mobileControls.innerHTML = `
      <a href="tel:+251941246658" class="mobile-call-btn" aria-label="Call TEMER Real Estate" title="Call Direct">
        <i class="fa-solid fa-phone"></i>
      </a>
    `;
    navToggle.parentNode.insertBefore(mobileControls, navToggle);
  }

  // 3. Inject Mobile Drawer Header & Footer if not already present
  if (mainNav && !mainNav.querySelector('.mobile-drawer-header')) {
    // Drawer Top Header
    const drawerHeader = document.createElement('div');
    drawerHeader.className = 'mobile-drawer-header';
    drawerHeader.innerHTML = `
      <div class="brand-logo" style="gap:10px;">
        <div class="logo-badge" style="width:36px; height:36px; font-size:1.1rem;">T</div>
        <div class="logo-text">
          <span class="logo-title" style="font-size:1.1rem;">TEMER</span>
          <span class="logo-subtitle" style="font-size:0.58rem;">Real Estate</span>
        </div>
      </div>
      <button class="mobile-drawer-close" aria-label="Close navigation menu">
        <i class="fa-solid fa-xmark"></i>
      </button>
    `;
    mainNav.insertBefore(drawerHeader, mainNav.firstChild);

    // Drawer Bottom Action Footer
    const drawerFooter = document.createElement('div');
    drawerFooter.className = 'mobile-drawer-footer';
    const consultHref = isSubPage ? 'contact.html#consultation' : 'pages/contact.html#consultation';
    drawerFooter.innerHTML = `
      <div class="drawer-contact-card">
        <div class="drawer-contact-title">Direct Sales & Advisory</div>
        <a href="tel:+251941246658" class="drawer-contact-phone">
          <i class="fa-solid fa-phone text-gold" style="font-size:0.9rem; margin-right:6px;"></i> +251 94 124 6658
        </a>
        <div class="drawer-contact-actions">
          <a href="https://wa.me/251941246658" target="_blank" rel="noopener noreferrer" class="btn btn-whatsapp btn-sm" style="min-height:42px; font-size:0.82rem; padding:8px 10px;">
            <i class="fa-brands fa-whatsapp"></i> WhatsApp
          </a>
          <a href="${consultHref}" class="btn btn-primary btn-sm" style="min-height:42px; font-size:0.82rem; padding:8px 10px;">
            Inquire
          </a>
        </div>
      </div>
      <div style="font-size:0.75rem; text-align:center; color:var(--text-muted); margin-top:4px;">
        <i class="fa-solid fa-location-dot text-gold"></i> Addis Ababa, Ethiopia
      </div>
    `;
    mainNav.appendChild(drawerFooter);

    // Close button event
    drawerHeader.querySelector('.mobile-drawer-close')?.addEventListener('click', closeMenu);
  }

  // 4. Open / Close Menu Handlers
  function openMenu() {
    navToggle?.classList.add('open');
    mainNav?.classList.add('open');
    navBackdrop?.classList.add('active');
    navToggle?.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    navToggle?.classList.remove('open');
    mainNav?.classList.remove('open');
    navBackdrop?.classList.remove('active');
    navToggle?.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  if (navToggle && mainNav) {
    navToggle.addEventListener('click', () => {
      const isOpen = mainNav.classList.contains('open');
      if (isOpen) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    // Close when clicking outside on backdrop
    navBackdrop?.addEventListener('click', closeMenu);

    // Close on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mainNav.classList.contains('open')) {
        closeMenu();
      }
    });

    // Close on any nav link click
    mainNav.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', closeMenu);
    });
  }

  // 5. Sticky Header Scroll Effect
  window.addEventListener('scroll', () => {
    if (window.scrollY > 25) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
  }, { passive: true });

  // 6. Active Link Highlighting
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href && (href === currentPath || href.endsWith(currentPath))) {
      link.classList.add('active');
    }
  });
}

/* --------------------------------------------------------------------------
   Cinematic Hero Video Controls
   -------------------------------------------------------------------------- */
function initHeroVideo() {
  const heroVideo = document.getElementById('hero-video');
  const toggleBtn = document.getElementById('hero-video-toggle');

  if (!heroVideo || !toggleBtn) return;

  const icon = toggleBtn.querySelector('i') || toggleBtn;

  toggleBtn.addEventListener('click', () => {
    if (heroVideo.paused) {
      heroVideo.play().then(() => {
        toggleBtn.setAttribute('aria-label', 'Pause architectural video');
        if (icon.classList) {
          icon.className = 'fa-solid fa-pause';
        } else {
          toggleBtn.textContent = '⏸';
        }
      }).catch(err => {
        console.warn('Playback error:', err);
      });
    } else {
      heroVideo.pause();
      toggleBtn.setAttribute('aria-label', 'Play architectural video');
      if (icon.classList) {
        icon.className = 'fa-solid fa-play';
      } else {
        toggleBtn.textContent = '▶';
      }
    }
  });

  // Respect user preference for reduced motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    heroVideo.pause();
    if (icon.classList) {
      icon.className = 'fa-solid fa-play';
    } else {
      toggleBtn.textContent = '▶';
    }
  }
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
      rootMargin: '0px 0px -60px 0px',
      threshold: 0.15
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
          el.textContent = `${prefix}${current}${suffix}`;

          if (progress < 1) {
            requestAnimationFrame(update);
          } else {
            el.textContent = `${prefix}${target}${suffix}`;
          }
        }

        requestAnimationFrame(update);
        obs.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
}

/* --------------------------------------------------------------------------
   Contact Form Validation & User Feedback
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

      // Generate a formatted WhatsApp link prefilled with the inquiry!
      const inquiryText = encodeURIComponent(
        `Hello TEMER Real Estate,\n\n` +
        `I am submitting an inquiry via your website:\n` +
        `Name: ${nameInput.value.trim()}\n` +
        `Phone: ${phoneInput.value.trim()}\n` +
        (emailInput?.value ? `Email: ${emailInput.value.trim()}\n` : '') +
        (propertyInput?.value ? `Interest: ${propertyInput.value.trim()}\n` : '') +
        (messageInput?.value ? `Message: ${messageInput.value.trim()}\n` : '') +
        `\nPlease reach out to me with further details.`
      );

      const whatsappUrl = `https://wa.me/251941246658?text=${inquiryText}`;

      // Open WhatsApp inquiry directly
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.textContent = 'Opening WhatsApp Direct...';
      submitBtn.disabled = true;

      setTimeout(() => {
        window.open(whatsappUrl, '_blank');
        submitBtn.textContent = 'Inquiry Sent / Connected!';
        setTimeout(() => {
          submitBtn.textContent = originalText;
          submitBtn.disabled = false;
          form.reset();
        }, 3000);
      }, 600);
    });
  });
}
