// product_main.js - handles dropdown, mobile nav, theme toggle, filtering, modal, comments

document.addEventListener('DOMContentLoaded', () => {
  // NAV: dropdown toggle
  document.querySelectorAll('.dropdown').forEach(dd => {
    const btn = dd.querySelector('.dropdown-toggle');
    const menu = dd.querySelector('.dropdown-menu');
    if (!btn) return;
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!expanded));
      dd.setAttribute('aria-expanded', String(!expanded));
      if (menu) menu.setAttribute('aria-hidden', String(expanded));
    });
  });

  // close dropdowns when clicking outside
  document.addEventListener('click', () => {
    document.querySelectorAll('.dropdown').forEach(dd => {
      const btn = dd.querySelector('.dropdown-toggle');
      const menu = dd.querySelector('.dropdown-menu');
      if (btn) btn.setAttribute('aria-expanded','false');
      if (menu) menu.setAttribute('aria-hidden','true');
      dd.setAttribute('aria-expanded','false');
    });
  });

  // MOBILE NAV
  const mobileBtn = document.getElementById('mobileMenuBtn');
  const mobileNav = document.getElementById('mobileNav');
  if (mobileBtn && mobileNav){
    mobileBtn.addEventListener('click', () => {
      const expanded = mobileBtn.getAttribute('aria-expanded') === 'true';
      mobileBtn.setAttribute('aria-expanded', String(!expanded));
      mobileNav.setAttribute('aria-hidden', String(expanded));
    });
  }

  // THEME TOGGLE
  const themeBtn = document.getElementById('themeToggle');
  function applyTheme(t){ 
    document.documentElement.setAttribute('data-theme', t);
    localStorage.setItem('miniso_theme', t);
  }
  const saved = localStorage.getItem('miniso_theme') || 'light';
  applyTheme(saved);
  if (themeBtn){
    themeBtn.addEventListener('click', ()=>{
      const cur = document.documentElement.getAttribute('data-theme') || 'light';
      applyTheme(cur === 'light' ? 'dark' : 'light');
    });
  }

  // FILTER & SEARCH
  const searchBar = document.getElementById('searchBar');
  const tagBtns = Array.from(document.querySelectorAll('.tag-btn'));
  const cards = Array.from(document.querySelectorAll('.product-card'));
  let activeTag = 'all';

  function filterCards(){
    const q = (searchBar && searchBar.value ? searchBar.value.trim().toLowerCase() : '');
    cards.forEach(card => {
      const name = (card.dataset.name || '').toLowerCase();
      const tag = (card.dataset.tag || '').toLowerCase();
      const matchesTag = (activeTag === 'all') || (tag === activeTag);
      const matchesQ = q === '' || name.includes(q) || tag.includes(q);
      card.style.display = (matchesTag && matchesQ) ? '' : 'none';
    });
  }

  if (searchBar) searchBar.addEventListener('input', () => { filterCards(); });

  tagBtns.forEach(b => {
    b.addEventListener('click', () => {
      tagBtns.forEach(x => x.classList.remove('active'));
      b.classList.add('active');
      activeTag = b.dataset.tag || 'all';
      filterCards();
    });
  });

  // MODAL: show details when clicking .view-btn or card
  const modal = document.getElementById('productModal');
  const modalBody = document.getElementById('modalBody');
  const modalClose = document.getElementById('modalClose');

  function openModalFromCard(card){
    if (!modal || !modalBody) return;
    const name = card.dataset.name || '';
    const tag = card.dataset.tag || '';
    const img = card.querySelector('img') ? card.querySelector('img').src : '';
    const priceEl = card.querySelector('.price');
    const price = priceEl ? priceEl.textContent : '';
    modalBody.innerHTML = `
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
        <div><img src="${escapeHtml(img)}" alt="${escapeHtml(name)}" style="width:100%;height:260px;object-fit:cover;border-radius:8px"></div>
        <div>
          <h2 id="modalTitle">${escapeHtml(name)}</h2>
          <p style="color:var(--muted)"><strong>Category:</strong> ${escapeHtml(tag)}</p>
          <p style="font-weight:800;color:var(--gold);margin-top:8px">${escapeHtml(price)}</p>
          <div style="margin-top:12px"><button id="modalToComment" class="btn">Add Comment</button></div>
        </div>
      </div>
    `;
    modal.setAttribute('aria-hidden','false');
    modal.style.display = 'flex';

    const toComment = document.getElementById('modalToComment');
    if (toComment){
      toComment.addEventListener('click', ()=>{
        // focus comment name input
        const nameInput = document.getElementById('commentName');
        if (nameInput) nameInput.focus();
        // store selected product name
        sessionStorage.setItem('selectedProduct', name);
        // close modal
        closeModal();
      });
    }
  }

  cards.forEach(c => {
    const btn = c.querySelector('.view-btn');
    if (btn) btn.addEventListener('click', (e)=>{ e.stopPropagation(); openModalFromCard(c); });
    c.addEventListener('click', ()=> openModalFromCard(c));
  });

  if (modalClose) modalClose.addEventListener('click', closeModal);
  if (modal) modal.addEventListener('click', (e)=>{ if(e.target === modal) closeModal(); });
  document.addEventListener('keydown', (e)=>{ if(e.key === 'Escape') closeModal(); });

  function closeModal(){ 
    if (!modal) return;
    modal.setAttribute('aria-hidden','true'); 
    modal.style.display = 'none'; 
  }

  // COMMENTS (localStorage)
  const commentForm = document.getElementById('commentForm');
  const commentList = document.getElementById('commentList');

  function loadComments(){
    if (!commentList) return;
    const raw = localStorage.getItem('miniso_comments');
    const arr = raw ? JSON.parse(raw) : [];
    commentList.innerHTML = arr.map(c => `
      <div class="comment-item">
        <strong>${escapeHtml(c.name)}</strong> <small style="color:var(--muted)">• ${escapeHtml(c.product || 'General')}</small>
        <p style="margin:6px 0 0">${escapeHtml(c.text)}</p>
      </div>
    `).join('');
  }

  if (commentForm){
    commentForm.addEventListener('submit', (e)=>{
      e.preventDefault();
      const nameEl = document.getElementById('commentName');
      const textEl = document.getElementById('commentText');
      if (!nameEl || !textEl) return;
      const name = nameEl.value.trim();
      const text = textEl.value.trim();
      const product = sessionStorage.getItem('selectedProduct') || 'General';
      if(!name || !text) return;
      const raw = localStorage.getItem('miniso_comments');
      const arr = raw ? JSON.parse(raw) : [];
      arr.unshift({ name, text, product, date: new Date().toISOString() });
      localStorage.setItem('miniso_comments', JSON.stringify(arr));
      commentForm.reset();
      sessionStorage.removeItem('selectedProduct');
      loadComments();
    });
  }

  // load comments initially
  loadComments();

  // helper to escape HTML
  function escapeHtml(s){
    return String(s).replace(/[&<>"']/g, function (c) {
      return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c];
    });
  }
});