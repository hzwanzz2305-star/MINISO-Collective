// Force scroll to top on page load
window.onload = () => {
  window.scrollTo(0, 0);
};

/* ---------------------------------------
   DARK MODE TOGGLE (same as home page)
---------------------------------------- */
const themeToggle = document.getElementById("themeToggle");
function updateThemeIcon(){
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  if (!themeToggle) return;
  themeToggle.textContent = isDark ? '☀️' : '🌙';
  themeToggle.setAttribute('aria-pressed', String(isDark));
}
// initialize theme from localStorage
const savedTheme = localStorage.getItem('theme');
if (savedTheme) document.documentElement.setAttribute('data-theme', savedTheme);
updateThemeIcon();
themeToggle?.addEventListener("click", () => {
  const html = document.documentElement;
  const current = html.getAttribute("data-theme") || 'light';
  const next = current === "light" ? "dark" : "light";
  html.setAttribute("data-theme", next);
  localStorage.setItem('theme', next);
  updateThemeIcon();
});

/* ---------------------------------------
   MOBILE NAV
---------------------------------------- */
const mobileMenuBtn = document.getElementById("mobileMenuBtn");
const mobileNav = document.getElementById("mobileNav");

mobileMenuBtn?.addEventListener("click", () => {
  const expanded = mobileMenuBtn.getAttribute("aria-expanded") === "true";
  mobileMenuBtn.setAttribute("aria-expanded", String(!expanded));
  if (!expanded) {
    mobileNav.classList.add('open');
    mobileNav.setAttribute('aria-hidden', 'false');
  } else {
    mobileNav.classList.remove('open');
    mobileNav.setAttribute('aria-hidden', 'true');
  }
});

// Products dropdown accessibility
const productDropdownBtn = document.getElementById('productDropdownBtn');
const productDropdownMenu = document.getElementById('productDropdownMenu');
if (productDropdownBtn && productDropdownMenu) {
  productDropdownBtn.setAttribute('aria-controls', 'productDropdownMenu');
  // ensure parent .dropdown has aria-expanded for CSS selector
  const dropParent = productDropdownBtn.closest('.dropdown');
  if (dropParent) dropParent.setAttribute('aria-expanded','false');
  productDropdownBtn.addEventListener('click', () => {
    const open = productDropdownBtn.getAttribute('aria-expanded') === 'true';
    productDropdownBtn.setAttribute('aria-expanded', String(!open));
    productDropdownMenu.setAttribute('aria-hidden', String(open));
    if (dropParent) dropParent.setAttribute('aria-expanded', String(!open));
    // focus first menu item for keyboard users
    const first = productDropdownMenu.querySelector('a');
    if (first) first.focus();
  });
  productDropdownBtn.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); productDropdownBtn.click(); }
    if (e.key === 'Escape') { productDropdownBtn.setAttribute('aria-expanded','false'); productDropdownMenu.setAttribute('aria-hidden','true'); if (dropParent) dropParent.setAttribute('aria-expanded','false'); }
  });
  document.addEventListener('click', (e) => {
    if (!productDropdownBtn.contains(e.target) && !productDropdownMenu.contains(e.target)) {
      productDropdownBtn.setAttribute('aria-expanded','false'); productDropdownMenu.setAttribute('aria-hidden','true'); if (dropParent) dropParent.setAttribute('aria-expanded','false');
    }
  });
}

/* ---------------------------------------
   SEARCH + FILTER FUNCTIONS
---------------------------------------- */
const searchBar = document.getElementById("searchBar");
const tagButtons = Array.from(document.querySelectorAll(".tag-btn"));
const cards = Array.from(document.querySelectorAll(".product-card"));
let activeTag = 'all';

function filterProducts(){
  const q = (searchBar.value || '').trim().toLowerCase();
  const noResultsEl = document.getElementById('noResults');
  cards.forEach(card => {
    const name = (card.dataset.name || '').toLowerCase();
    const tag = card.dataset.tag || '';
    const matchesQ = q === '' || name.includes(q);
    const matchesTag = activeTag === 'all' || tag === activeTag;
    if (matchesQ && matchesTag) {
      card.style.display = '';
    } else {
      card.style.display = 'none';
    }
  });
  // show no-results if none visible
  if (noResultsEl) {
    const any = cards.some(c => c.style.display !== 'none');
    noResultsEl.style.display = any ? 'none' : '';
  }
}

searchBar.addEventListener('input', filterProducts);
tagButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    tagButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    activeTag = btn.dataset.tag || 'all';
    filterProducts();
  });
});

// IntersectionObserver reveal for product cards
const observer = new IntersectionObserver((entries) => {
  entries.forEach(ent => {
    if (ent.isIntersecting) ent.target.classList.add('visible');
  });
}, {threshold: 0.12});
cards.forEach(c => observer.observe(c));

// If navigated here from the home page (or another site) we want the
// product page to start at the top and run the reveal animations from
// the beginning. Use the pageshow event (covers normal load and bfcache).
window.addEventListener('pageshow', () => {
  try {
    const ref = document.referrer ? new URL(document.referrer) : null;
    const fromIndex = ref && ref.pathname.endsWith('index.html');
    if (fromIndex) {
      if (location.hash) history.replaceState(null, '', location.pathname + location.search);
      window.scrollTo({ top: 0, left: 0 });
      // reset and re-run reveal animations
      cards.forEach(c => {
        c.classList.remove('visible');
        observer.unobserve(c);
        observer.observe(c);
      });
    }
  } catch (e) {
    // ignore URL parsing errors
  }
});

/* ---------------------------------------
   VIEW DETAILS MODAL
---------------------------------------- */
const modal = document.getElementById("productModal");
const modalImg = document.getElementById("modalImg");
const modalName = document.getElementById("modalName");
const modalPrice = document.getElementById("modalPrice");
const modalCommentForm = document.getElementById('modalCommentForm');
const modalCommentList = document.getElementById('modalCommentList');
const modalClose = document.querySelector(".modal-close");

let lastFocused = null;

function openModalForCard(card){
  lastFocused = document.activeElement;
  const pname = card.dataset.name || '';
  const pdesc = card.dataset.desc || '';
  const imgSrc = card.dataset.img || card.querySelector('img').src;
  modalImg.src = imgSrc;
  modalName.textContent = pname;
  modalPrice.textContent = card.dataset.price || card.querySelector('.price').textContent;
  // SKU (use provided data-sku or generate a short code)
  const skuEl = document.getElementById('modalSKU');
  const sku = card.dataset.sku || (pname ? pname.replace(/[^A-Za-z0-9]+/g,'-').toUpperCase().slice(0,12) : 'N/A');
  if (skuEl) skuEl.textContent = sku;

  // set image source input
  const imgSrcInput = document.getElementById('modalImgSrc');
  if (imgSrcInput) imgSrcInput.value = imgSrc;

  const modalDesc = document.getElementById('modalDesc');
  if (modalDesc) modalDesc.textContent = pdesc;

  // load reviews
  loadReviews(pname);

  modal.setAttribute('aria-hidden','false');
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
  
  // scroll to top of page
  window.scrollTo(0, 0);
  
  // scroll modal content to top
  const modalContent = modal.querySelector('.modal-content');
  if (modalContent) modalContent.scrollTop = 0;

  // focus first control in modal (after animation)
  setTimeout(() => {
    const first = modal.querySelector('input, textarea');
    if (first) first.focus();
  }, 280);
}

// open handlers: click on view-btn or Enter/Space on card
document.querySelectorAll('.view-btn').forEach(btn => btn.addEventListener('click', (e) => {
  const card = e.target.closest('.product-card');
  if (card) openModalForCard(card);
}));

cards.forEach(card => {
  card.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openModalForCard(card); }
  });
});

// close modal
function closeModal(){
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden','true');
  document.body.style.overflow = 'auto';
  // restore focus
  if (lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus();
}
modalClose && modalClose.addEventListener('click', closeModal);
modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });



// focus trap inside modal
modal.addEventListener('keydown', (e) => {
  if (e.key !== 'Tab') return;
  const focusables = Array.from(modal.querySelectorAll('button, [href], input, textarea, select')).filter(el => !el.hasAttribute('disabled'));
  if (focusables.length === 0) return;
  const idx = focusables.indexOf(document.activeElement);
  if (e.shiftKey && idx === 0) { e.preventDefault(); focusables[focusables.length -1].focus(); }
  else if (!e.shiftKey && idx === focusables.length -1) { e.preventDefault(); focusables[0].focus(); }
});

/* ---------------------------------------
   MODAL COMMENTS (saved per session)
---------------------------------------- */
// Reviews persisted per-product in localStorage
function reviewKey(name){ return 'reviews:' + name; }
function loadReviews(name){
  modalCommentList.innerHTML = '';
  const arr = JSON.parse(localStorage.getItem(reviewKey(name)) || '[]');
  if (!arr.length) modalCommentList.innerHTML = '<p class="muted">No reviews yet.</p>';
  arr.forEach(r => {
    const d = document.createElement('div'); d.className='comment-item';
    d.innerHTML = `<strong>${escapeHtml(r.name)}</strong><div style="font-size:.8rem;color:var(--muted)">${new Date(r.t).toLocaleString()}</div><p>${escapeHtml(r.text)}</p>`;
    modalCommentList.appendChild(d);
  });
}

modalCommentForm && modalCommentForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.getElementById('modalCommentName').value.trim();
  const text = document.getElementById('modalCommentText').value.trim();
  if (!name || !text) return;
  const key = reviewKey(modalName.textContent || '');
  const arr = JSON.parse(localStorage.getItem(key) || '[]');
  arr.unshift({name,text,t:Date.now()});
  localStorage.setItem(key, JSON.stringify(arr));
  modalCommentForm.reset();
  loadReviews(modalName.textContent || '');
});

function escapeHtml(s){ return String(s).replace(/[&<>"]+/g, (m)=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m]||m)); }