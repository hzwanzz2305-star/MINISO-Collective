/* about_main.js - About Us page interactivity */

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

  /* ---------- PILLAR CARD INTERACTIONS ---------- */
  const pillarCards = document.querySelectorAll('.pillar-card');
  pillarCards.forEach(card => {
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        card.style.transform = 'translateY(-8px) scale(1.02)';
        setTimeout(() => {
          card.style.transform = '';
        }, 300);
      }
    });
  });

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