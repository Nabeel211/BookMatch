// public/assets/js/pages/catalog/catalog.js

let catView = 'grid', catGenre = '', catEra = '', catRating = 4.0, catSort = '';
let sidebarOpen = true;

// ── FILTER & RENDER ──────────────────────────────────────────────
function getFiltered() {
  let books = [...BOOKS];
  if (catGenre) books = books.filter(b => b.features.includes(catGenre));
  if (catEra === 'classic') books = books.filter(b => b.year < 2000);
  if (catEra === 'modern')  books = books.filter(b => b.year >= 2000);
  books = books.filter(b => b.rating >= catRating);
  switch (catSort) {
    case 'rd': books.sort((a,b) => b.rating - a.rating); break;
    case 'ra': books.sort((a,b) => a.rating - b.rating); break;
    case 'yd': books.sort((a,b) => b.year - a.year); break;
    case 'ya': books.sort((a,b) => a.year - b.year); break;
    case 'az': books.sort((a,b) => a.title.localeCompare(b.title)); break;
  }
  return books;
}

function renderCatalog() {
  const grid = document.getElementById('catGrid');
  grid.className = 'book-grid' + (catView === 'list' ? ' list-mode' : '');
  grid.innerHTML = '';
  const books = getFiltered();
  document.getElementById('catInfo').textContent = `${books.length} dari ${BOOKS.length} buku`;
  books.forEach(b => grid.appendChild(mkCard(b)));
  document.getElementById('catSearchResult').style.display = 'none';
}

// ── SMART SEARCH ─────────────────────────────────────────────────
function renderCatSearch(query) {
  const result = cbf.smartSearch(query, 8);
  const { exactMatches, partialMatches, recommendations } = result;
  const body = document.getElementById('catSearchBody');
  document.getElementById('catSearchLabel').textContent = query;
  body.innerHTML = '';
  document.getElementById('catGrid').innerHTML = '';
  document.getElementById('catInfo').textContent = '';

  const total = exactMatches.length + partialMatches.length + recommendations.length;
  if (!total) {
    body.innerHTML = `<div style="text-align:center;padding:32px;color:var(--ink3);font-size:.85rem">
      🔍 Tidak ada hasil untuk "<strong>${query}</strong>".</div>`;
    document.getElementById('catSearchResult').style.display = 'block';
    return;
  }

  const lmE = { 'exact':'🎯 Judul Persis','starts':'🎯 Judul Diawali' };
  const lmP = { 'title-contains':'🔍 Judul Mengandung','all-words':'🔍 Semua Kata','author':'✍️ Penulis Cocok','partial-word':'🔍 Kata Cocok' };

  function makeGroup(items, headerClass, icon, title, scoreKey) {
    if (!items.length) return;
    const g = document.createElement('div'); g.className = 'search-group';
    g.innerHTML = `<div class="search-group-header ${headerClass}">
      <span class="sg-icon">${icon}</span><h3>${title}</h3>
      <span class="sg-count">${items.length} buku</span></div>`;
    if (scoreKey === 'score') {
      g.innerHTML += `<div class="sim-legend">
        <span class="sl sh">≥70% Sangat Mirip</span>
        <span class="sl sm">≥40% Mirip</span>
        <span class="sl ss">Cukup Mirip</span></div>`;
    }
    const grid = document.createElement('div'); grid.className = 'book-grid';
    items.forEach(({ book, matchType, score }) =>
      grid.appendChild(mkCard(book, scoreKey === 'score' ? score : null, scoreKey !== 'score' ? (lmE[matchType] || lmP[matchType] || '🔍') : null))
    );
    g.appendChild(grid); body.appendChild(g);
  }

  makeGroup(exactMatches,   'exact-group',   '🎯', 'Hasil Tepat',      'matchType');
  makeGroup(partialMatches, 'partial-group', '🔍', 'Hasil Pencarian',  'matchType');
  makeGroup(recommendations,'rec-group',     '✨', 'Rekomendasi Serupa','score');

  document.getElementById('catSearchResult').style.display = 'block';
}

// ── REC PANEL (grid layout) ───────────────────────────────────────
window.showRecResults = function(results, label) {
  const panel = document.getElementById('recPanel');
  const grid  = document.getElementById('recPanelGrid');
  grid.innerHTML = '';
  document.getElementById('recPanelLabel').textContent = label || 'Rekomendasi Serupa';
  document.getElementById('recPanelSub').textContent   = `${results.length} buku ditemukan`;
  results.forEach(({ book, score }) => grid.appendChild(mkCard(book, score)));
  panel.style.display = 'block';
  panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

// ── WISHLIST / COMPARE MINI ───────────────────────────────────────
function renderWishMini() {
  const w = ST.wish;
  document.getElementById('wishCount').textContent = w.length;
  const mini = document.getElementById('wishMini'); mini.innerHTML = '';
  document.getElementById('clWish').style.display = w.length ? 'block' : 'none';
  w.slice(0, 5).forEach(id => {
    const b = BOOKS.find(x => x.id === id); if (!b) return;
    const d = document.createElement('div'); d.className = 'mini-item';
    d.innerHTML = `<span>${b.cover}</span>
      <span style="flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${b.title.slice(0,18)}</span>
      <button class="mini-rm" data-id="${b.id}">✕</button>`;
    d.querySelector('[data-id]').addEventListener('click', e => { e.stopPropagation(); toggleWish(b.id); });
    mini.appendChild(d);
  });
  if (w.length > 5) {
    const m = document.createElement('div');
    m.style.cssText = 'font-size:.68rem;color:var(--ink3);padding:2px 0';
    m.textContent = `+${w.length - 5} lainnya`; mini.appendChild(m);
  }
}

function renderCompMini() {
  const c = ST.compare;
  document.getElementById('compCount').textContent = c.length;
  const mini = document.getElementById('compMini'); mini.innerHTML = '';
  document.getElementById('compActions').style.display = c.length >= 2 ? 'flex' : 'none';
  c.forEach(id => {
    const b = BOOKS.find(x => x.id === id); if (!b) return;
    const d = document.createElement('div'); d.className = 'mini-item';
    d.innerHTML = `<span>${b.cover}</span>
      <span style="flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${b.title.slice(0,18)}</span>`;
    mini.appendChild(d);
  });
}

function onWishChange()    { renderWishMini(); }
function onCompareChange() { renderCompMini(); }

// ── SIDEBAR TOGGLE ────────────────────────────────────────────────
function initSidebar() {
  const sidebar  = document.getElementById('catSidebar');
  const btn      = document.getElementById('sidebarToggleBtn');
  const overlay  = document.getElementById('sidebarOverlay');
  const icon     = document.getElementById('toggleBtnIcon');
  const text     = document.getElementById('toggleBtnText');
  const isMobile = () => window.innerWidth <= 900;

  function open() {
    sidebarOpen = true;
    btn.classList.add('open');
    icon.textContent = '▶';
    text.textContent = 'Tutup';
    if (isMobile()) {
      sidebar.classList.remove('hidden');
      sidebar.classList.add('mobile-open');
      overlay.classList.add('show');
    } else {
      sidebar.classList.remove('hidden');
    }
  }

  function close() {
    sidebarOpen = false;
    btn.classList.remove('open');
    icon.textContent = '◀';
    text.textContent = 'Filter';
    if (isMobile()) {
      sidebar.classList.remove('mobile-open');
      overlay.classList.remove('show');
    } else {
      sidebar.classList.add('hidden');
    }
  }

  // Default: sidebar terbuka di desktop, tertutup di mobile
  if (isMobile()) {
    close();
  }

  btn.addEventListener('click', () => sidebarOpen ? close() : open());
  overlay.addEventListener('click', close);

  window.addEventListener('resize', () => {
    if (!isMobile() && sidebarOpen) {
      sidebar.classList.remove('mobile-open');
      overlay.classList.remove('show');
      sidebar.classList.remove('hidden');
    }
  });
}

// ── INIT ──────────────────────────────────────────────────────────
function initCatalog() {
  const urlP = new URLSearchParams(location.search);
  if (urlP.get('genre')) {
    catGenre = urlP.get('genre');
    document.querySelectorAll('.ftag[data-g]').forEach(b =>
      b.classList.toggle('active', b.dataset.g === catGenre)
    );
  }

  renderCatalog();
  renderWishMini();
  renderCompMini();
  initSidebar();

  // Search
  const doSearch = () => {
    const q = document.getElementById('catSearch').value.trim();
    if (q) renderCatSearch(q); else renderCatalog();
  };
  document.getElementById('catSearchBtn').addEventListener('click', doSearch);
  document.getElementById('catSearch').addEventListener('keydown', e => { if (e.key === 'Enter') doSearch(); });
  document.getElementById('closeCatSearch').addEventListener('click', () => {
    document.getElementById('catSearchResult').style.display = 'none';
    document.getElementById('catSearch').value = '';
    renderCatalog();
  });

  // Panels
  document.getElementById('closeRec').addEventListener('click', () =>
    document.getElementById('recPanel').style.display = 'none');
  document.getElementById('closeComp').addEventListener('click', () =>
    document.getElementById('compPanel').style.display = 'none');

  // Filter genre
  document.querySelectorAll('.ftag[data-g]').forEach(b => b.addEventListener('click', () => {
    document.querySelectorAll('.ftag[data-g]').forEach(x => x.classList.remove('active'));
    b.classList.add('active'); catGenre = b.dataset.g; renderCatalog();
  }));

  // Filter era
  document.querySelectorAll('.ftag[data-era]').forEach(b => b.addEventListener('click', () => {
    document.querySelectorAll('.ftag[data-era]').forEach(x => x.classList.remove('active'));
    b.classList.add('active'); catEra = b.dataset.era; renderCatalog();
  }));

  // Rating
  document.getElementById('rFilter').addEventListener('input', e => {
    catRating = parseFloat(e.target.value);
    document.getElementById('rFilterVal').textContent = catRating.toFixed(1) + '+';
    renderCatalog();
  });

  // Sort
  document.getElementById('sortSel').addEventListener('change', e => {
    catSort = e.target.value; renderCatalog();
  });

  // View grid/list
  document.getElementById('gBtn').addEventListener('click', () => {
    catView = 'grid';
    document.getElementById('gBtn').classList.add('active');
    document.getElementById('lBtn').classList.remove('active');
    renderCatalog();
  });
  document.getElementById('lBtn').addEventListener('click', () => {
    catView = 'list';
    document.getElementById('lBtn').classList.add('active');
    document.getElementById('gBtn').classList.remove('active');
    renderCatalog();
  });

  // Clear wishlist/compare
  document.getElementById('clWish').addEventListener('click', async () => {
    await clearWishlist(); renderWishMini();
  });
  document.getElementById('clComp').addEventListener('click', async () => {
    await clearCompare(); renderCompMini();
  });

  // Bandingkan
  document.getElementById('compGo').addEventListener('click', () => {
    const books = ST.compare.map(id => BOOKS.find(b => b.id === id)).filter(Boolean);
    if (books.length < 2) { showToast('Pilih minimal 2 buku', 'warn'); return; }
    const rows = [
      { l:'Cover',       f: b        => `<span style="font-size:1.3rem">${b.cover}</span>` },
      { l:'Tahun',       f: b        => b.year },
      { l:'Rating',      f: b        => `<span class="${b.rating===Math.max(...books.map(x=>x.rating))?'comp-best':''}">${b.rating} ★</span>` },
      { l:'Penulis',     f: b        => b.author },
      { l:'Genre',       f: b        => b.features.slice(0,3).map(f=>`<span class="tag">${f}</span>`).join(' ') },
      { l:'Rating Kamu', f: b        => ST.ratings[b.id] ? `${ST.ratings[b.id]}★` : '—' },
      { l:'Kemiripan #1',f: (b,i)   => i===0 ? '<em style="color:var(--ink3)">referensi</em>' : `${Math.round(cbf.getSim(books[0].id,b.id)*100)}%` },
    ];
    const t = document.createElement('table'); t.className = 'comp-tbl';
    t.innerHTML = `<thead><tr><th>Aspek</th>${books.map(b=>`<th>${b.cover} ${b.title.slice(0,16)}</th>`).join('')}</tr></thead>
      <tbody>${rows.map(r=>`<tr><td class="rl">${r.l}</td>${books.map((b,i)=>`<td>${r.f(b,i)}</td>`).join('')}</tr>`).join('')}</tbody>`;
    document.getElementById('compTblWrap').innerHTML = '';
    document.getElementById('compTblWrap').appendChild(t);
    document.getElementById('compPanel').style.display = 'block';
    document.getElementById('compPanel').scrollIntoView({ behavior:'smooth' });
  });
}

document.addEventListener('state-loaded', initCatalog);
