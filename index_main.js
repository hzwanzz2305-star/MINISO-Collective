/* main.js - slideshow, dropdown, mobile menu, dark mode, animations */

document.addEventListener('DOMContentLoaded', () => {
  /* ---------- SLIDESHOW ---------- */
  const slideContainer = document.querySelector('.slides-container');
  const slides = Array.from(document.querySelectorAll('.slide'));
  const nextBtn = document.querySelector('.slide-btn.next');
  const prevBtn = document.querySelector('.slide-btn.prev');
  const dotsWrap = document.querySelector('.slide-dots');
  let index = 0;
  let autoTimer = null;
  const AUTO_INTERVAL = 5000;

  function createDots(){
    if (!dotsWrap) return;
    dotsWrap.innerHTML = '';
    slides.forEach((s,i) => {
      const d = document.createElement('button');
      d.className = 'slide-dot' + (i===0 ? ' active' : '');
      d.setAttribute('aria-label','Go to slide ' + (i+1));
      d.addEventListener('click', ()=>goTo(i));
      dotsWrap.appendChild(d);
    });
  }

  function updateSlides(){
    slides.forEach((s, i) => s.classList.toggle('active', i === index));
    const dots = Array.from(document.querySelectorAll('.slide-dot'));
    dots.forEach((d,i)=>d.classList.toggle('active', i === index));
  }

  function goTo(i){
    index = (i + slides.length) % slides.length;
    updateSlides();
    resetAuto();
  }

  nextBtn && nextBtn.addEventListener('click', ()=> goTo(index + 1));
  prevBtn && prevBtn.addEventListener('click', ()=> goTo(index - 1));

  function startAuto(){
    stopAuto();
    autoTimer = setInterval(()=> goTo(index + 1), AUTO_INTERVAL);
  }
  function stopAuto(){
    if (autoTimer) { clearInterval(autoTimer); autoTimer = null; }
  }
  function resetAuto(){ stopAuto(); startAuto(); }

  if (slides.length){
    createDots();
    updateSlides();
    startAuto();
    // pause on hover
    const slideshowEl = document.querySelector('.slideshow');
    slideshowEl && slideshowEl.addEventListener('mouseenter', stopAuto);
    slideshowEl && slideshowEl.addEventListener('mouseleave', startAuto);
  }

  // keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') goTo(index + 1);
    if (e.key === 'ArrowLeft') goTo(index - 1);
  });

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

  

  /* ---------- ANIMATE ON SCROLL ---------- */
  const animatedEls = document.querySelectorAll('.animate-fade-up');
  const obsOptions = {root:null, rootMargin:'0px', threshold: 0.12};
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(en => {
      if (en.isIntersecting) {
        en.target.style.animation = 'none';
        setTimeout(() => {
          en.target.style.animation = '';
        }, 10);
      }
    });
  }, obsOptions);
  animatedEls.forEach(el => obs.observe(el));
});