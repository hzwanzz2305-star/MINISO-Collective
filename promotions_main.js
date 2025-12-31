/* promotions_main.js - Promotions page interactivity */

document.addEventListener('DOMContentLoaded', () => {
  /* ---------- DROPDOWN ---------- */
  const dropdowns = document.querySelectorAll('.dropdown');
  dropdowns.forEach(dropdown => {
    const toggle = dropdown.querySelector('.dropdown-toggle');
    const menu = dropdown.querySelector('.dropdown-menu');
    if (!toggle || !menu) return;
    
    toggle.setAttribute('aria-controls', menu.id || 'dropdown-menu');
    toggle.addEventListener('click', (e) => {
      const expanded = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!expanded));
      dropdown.setAttribute('aria-expanded', String(!expanded));
      menu.setAttribute('aria-hidden', String(expanded));
      if (!expanded) {
        const first = menu.querySelector('a');
        if (first) first.focus();
      }
    });
    
    toggle.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle.click(); }
      if (e.key === 'Escape') {
        toggle.setAttribute('aria-expanded','false');
        dropdown.setAttribute('aria-expanded','false');
        menu.setAttribute('aria-hidden','true');
      }
    });

    document.addEventListener('click', e => {
      if (!dropdown.contains(e.target)) {
        toggle.setAttribute('aria-expanded','false');
        dropdown.setAttribute('aria-expanded','false');
        menu.setAttribute('aria-hidden','true');
      }
    });
  });

  /* ---------- MOBILE NAV ---------- */
  const mobileBtn = document.getElementById('mobileMenuBtn');
  const mobileNav = document.getElementById('mobileNav');
  if (mobileBtn && mobileNav) {
    mobileBtn.addEventListener('click', () => {
      const expanded = mobileBtn.getAttribute('aria-expanded') === 'true';
      mobileBtn.setAttribute('aria-expanded', String(!expanded));
      if (!expanded) {
        mobileNav.classList.add('open');
        mobileNav.setAttribute('aria-hidden', 'false');
      } else {
        mobileNav.classList.remove('open');
        mobileNav.setAttribute('aria-hidden', 'true');
      }
    });
  }

  /* ---------- DARK MODE / THEME TOGGLE ---------- */
  const themeBtn = document.getElementById('themeToggle');
  function applyTheme(theme){
    document.documentElement.setAttribute('data-theme', theme);
    if (themeBtn) themeBtn.setAttribute('aria-pressed', String(theme==='dark'));
    if (themeBtn) themeBtn.textContent = theme === 'dark' ? '☀️' : '🌙';
    localStorage.setItem('miniso_theme', theme);
  }
  
  const savedTheme = localStorage.getItem('miniso_theme') || 'light';
  applyTheme(savedTheme);
  
  if (themeBtn) themeBtn.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme') || 'light';
    applyTheme(current === 'light' ? 'dark' : 'light');
  });

  /* ---------- PROMO CARD INTERACTIONS ---------- */
  const promoCards = document.querySelectorAll('.promo-card');
  promoCards.forEach(card => {
    const btn = card.querySelector('.promo-btn');
    if (!btn) return;

    btn.addEventListener('click', (e) => {
      if (!btn.disabled) {
        const title = card.querySelector('h3').textContent;
        console.log('Promo selected:', title);
      }
    });

    // Add keyboard interaction
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !btn.disabled) {
        btn.click();
      }
    });
  });

  /* ---------- NEWSLETTER FORM ---------- */
  const newsletterForm = document.querySelector('.newsletter-form');
  if (newsletterForm) {
    const submitBtn = newsletterForm.querySelector('.btn-subscribe');
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const emailInput = newsletterForm.querySelector('input[type="email"]');
      if (emailInput && emailInput.value) {
        // Simulate subscription
        const originalText = submitBtn.textContent;
        submitBtn.textContent = '✓ Subscribed!';
        submitBtn.style.background = '#4ade80';
        
        setTimeout(() => {
          submitBtn.textContent = originalText;
          submitBtn.style.background = '';
          emailInput.value = '';
        }, 2000);
      }
    });
  }

  /* ---------- SCROLL ANIMATIONS ---------- */
  const animatedEls = document.querySelectorAll('.animate-fade-up');
  const obsOptions = {root:null, rootMargin:'0px', threshold: 0.12};
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(en => {
      if (en.isIntersecting) {
        en.style.animation = 'none';
        setTimeout(() => {
          en.style.animation = '';
        }, 10);
      }
    });
  }, obsOptions);
  animatedEls.forEach(el => obs.observe(el));
});
