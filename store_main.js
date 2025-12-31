/* store_main.js - Store locations page with interactive map and modal */

document.addEventListener('DOMContentLoaded', () => {
  // Store data with coordinates
  const stores = {
    kl: {
      name: 'KLCC Outlet',
      address: 'Lot GF-12, Suria KLCC, Kuala Lumpur 50088',
      hours: '10:00 AM – 10:00 PM (Daily)',
      phone: '+60 3 2382 2888',
      coords: '3.1389,101.6894'
    },
    pavilion: {
      name: 'Pavilion Mall',
      address: 'Lot L2-51, Pavilion KL, 168, Jln Bukit Bintang, 55100 KL',
      hours: '10:00 AM – 10:00 PM (Daily)',
      phone: '+60 3 2148 3800',
      coords: '3.1604,101.7105'
    },
    sunway: {
      name: 'Sunway Pyramid',
      address: 'Ground Floor, Sunway Pyramid, 3 Jln PJU 1/41, 62200 Petaling Jaya',
      hours: '10:00 AM – 10:00 PM (Daily)',
      phone: '+60 3 7490 5000',
      coords: '3.0503,101.5864'
    },
    jb: {
      name: 'Johor Bahru',
      address: 'Level 2, City Square JB, 1A Jalan Wong Ah Fook, 80000 Johor Bahru',
      hours: '10:00 AM – 9:00 PM (Daily)',
      phone: '+60 7 223 8003',
      coords: '1.4854,103.7618'
    },
    penang: {
      name: 'Penang',
      address: 'Gurney Plaza, Level 2, 2295, Jln Burma, 10250 Penang',
      hours: '10:00 AM – 10:00 PM (Daily)',
      phone: '+60 4 228 8006',
      coords: '5.3521,100.3330'
    },
    sabah: {
      name: 'Kota Kinabalu',
      address: 'The Mines Shopping Centre, Jln Tun Fuad Stephens, 87000 Sabah',
      hours: '10:00 AM – 9:00 PM (Daily)',
      phone: '+60 88 222 333',
      coords: '5.3596,118.1086'
    }
  };

  /* ---------- GOOGLE MAP INTERACTION ---------- */
  // Map is embedded as a My Maps iframe showing all locations by default.
  // No quick-select pin buttons are used; the iframe remains unchanged.
  const googleMap = document.getElementById('googleMap');

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

  // Modal and view details functionality removed — store details are in the static list.

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
