document.addEventListener('DOMContentLoaded', () => {
  // Theme toggle (shared behavior)
  const themeBtn = document.getElementById('themeToggle');
  function applyTheme(theme){
    document.documentElement.setAttribute('data-theme', theme);
    if (themeBtn) themeBtn.setAttribute('aria-pressed', String(theme==='dark'));
    if (themeBtn) themeBtn.textContent = theme === 'dark' ? '☀️' : '🌙';
    localStorage.setItem('miniso_theme', theme);
  }
  const saved = localStorage.getItem('miniso_theme') || 'light';
  applyTheme(saved);
  themeBtn?.addEventListener('click', () => {
    const cur = document.documentElement.getAttribute('data-theme') || 'light';
    applyTheme(cur === 'light' ? 'dark' : 'light');
  });

  // Mobile nav
  const mobileBtn = document.getElementById('mobileMenuBtn');
  const mobileNav = document.getElementById('mobileNav');
  mobileBtn?.addEventListener('click', () => {
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

  // Dropdown accessibility (copy of other page behavior)
  document.querySelectorAll('.dropdown').forEach(dropdown => {
    const toggle = dropdown.querySelector('.dropdown-toggle');
    const menu = dropdown.querySelector('.dropdown-menu');
    if (!toggle || !menu) return;

    toggle.setAttribute('aria-controls', menu.id || 'dropdown-menu');
    const dropParent = toggle.closest('.dropdown');
    if (dropParent) dropParent.setAttribute('aria-expanded','false');

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

  // Reveal animation for soft-cards
  const items = document.querySelectorAll('.animate-fade-up');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(en => { if (en.isIntersecting) en.target.classList.add('visible'); });
  }, { threshold: 0.12 });
  items.forEach(i => obs.observe(i));
});
