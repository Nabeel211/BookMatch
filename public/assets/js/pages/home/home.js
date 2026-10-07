// public/assets/js/pages/home/home.js

const GENRES = [
  { g: 'fantasy',     emoji: '✨', name: 'Fantasy',     color: '#4a1d96' },
  { g: 'sci-fi',      emoji: '🚀', name: 'Sci-Fi',      color: '#1e3a5f' },
  { g: 'mystery',     emoji: '🔍', name: 'Misteri',     color: '#312e81' },
  { g: 'dystopia',    emoji: '😱', name: 'Dystopia',    color: '#7f1d1d' },
  { g: 'romance',     emoji: '💕', name: 'Romansa',     color: '#881337' },
  { g: 'self-help',   emoji: '💡', name: 'Self-Help',   color: '#065f46' },
  { g: 'indonesia',   emoji: '🇮🇩', name: 'Indonesia',   color: '#b45309' },
  { g: 'non-fiction', emoji: '📊', name: 'Non-Fiksi',   color: '#0c4a6e' },
  { g: 'adventure',   emoji: '🗺️', name: 'Petualangan', color: '#92400e' },
  { g: 'thriller',    emoji: '😰', name: 'Thriller',    color: '#1c1917' },
  { g: 'historical',  emoji: '🏛️', name: 'Sejarah',     color: '#374151' },
  { g: 'philosophy',  emoji: '🧠', name: 'Filosofi',    color: '#1a3a1a' },
];

// ── RENDER FLOATING BOOKS ─────────────────────────────────────────
function renderFloatingBooks() {
  const wrap = document.getElementById('heroBooksFloat');
  if (!wrap || !BOOKS.length) return;

  // Ambil 5 buku dengan rating tertinggi
  const top5 = [...BOOKS].sort((a, b) => b.rating - a.rating).slice(0, 5);

  top5.forEach(book => {
    const card = document.createElement('div');
    card.className = 'bf-card';
    card.style.background = book.color;
    card.innerHTML = book.cover;
    card.title = book.title;
    card.addEventListener('click', () => openModal(book));
    wrap.appendChild(card);
  });
}

// ── RENDER POPULAR BOOKS ──────────────────────────────────────────
function renderPopular() {
  const row = document.getElementById('popularRow');
  if (!row || !BOOKS.length) return;

  const top = [...BOOKS].sort((a, b) => b.rating - a.rating).slice(0, 8);
  top.forEach(b => row.appendChild(mkCard(b)));
}

// ── RENDER GENRE GRID ─────────────────────────────────────────────
function renderGenres() {
  const grid = document.getElementById('genreGrid');
  if (!grid) return;

  GENRES.forEach(({ g, emoji, name, color }) => {
    const count = BOOKS.filter(b => b.features.includes(g)).length;
    if (!count) return;

    const card = document.createElement('a');
    card.className = 'genre-card';
    card.href = `/katalog?genre=${g}`;
    card.innerHTML = `
      <div class="gc-emoji">${emoji}</div>
      <div class="gc-name">${name}</div>
      <div class="gc-count">${count} buku</div>`;
    grid.appendChild(card);
  });
}

// ── RANDOM BOOK ───────────────────────────────────────────────────
function renderRandom() {
  const wrap = document.getElementById('randomResult');
  if (!wrap || !BOOKS.length) return;

  const book = BOOKS[Math.floor(Math.random() * BOOKS.length)];
  wrap.innerHTML = '';
  wrap.appendChild(mkCard(book));
}

document.getElementById('randomBtn')?.addEventListener('click', () => {
  renderRandom();
});

// ── SMART SEARCH ─────────────────────────────────────────────────
function doSearch(query) {
  if (!query.trim()) {
    document.getElementById('searchResultSection').style.display = 'none';
    return;
  }

  const result = cbf.smartSearch(query, 8);
  const { exactMatches, partialMatches, recommendations } = result;
  const body = document.getElementById('searchResultBody');
  body.innerHTML = '';

  document.getElementById('searchQueryLabel').textContent = query;

  const total = exactMatches.length + partialMatches.length + recommendations.length;
  if (!total) {
    body.innerHTML = `<div style="text-align:center;padding:32px;color:var(--ink3);font-size:.85rem">
      🔍 Tidak ada hasil untuk "<strong>${query}</strong>". Coba kata kunci lain.</div>`;
    document.getElementById('searchResultSection').style.display = 'block';
    document.getElementById('searchResultSection').scrollIntoView({ behavior: 'smooth' });
    return;
  }

  const lmE = { 'exact': '🎯 Judul Persis', 'starts': '🎯 Judul Diawali' };
  const lmP = { 'title-contains': '🔍 Judul Mengandung', 'all-words': '🔍 Semua Kata', 'author': '✍️ Penulis Cocok', 'partial-word': '🔍 Kata Cocok' };

  function mkGroup(items, cls, icon, title, scoreKey) {
    if (!items.length) return;
    const g    = document.createElement('div');
    g.className = 'search-group';
    g.innerHTML = `<div class="search-group-header ${cls}">
      <span class="sg-icon">${icon}</span><h3>${title}</h3>
      <span class="sg-count">${items.length} buku</span></div>`;
    if (scoreKey === 'score') {
      g.innerHTML += `<div class="sim-legend">
        <span class="sl sh">≥70% Sangat Mirip</span>
        <span class="sl sm">≥40% Mirip</span>
        <span class="sl ss">Cukup Mirip</span></div>`;
    }
    const grid = document.createElement('div');
    grid.className = 'book-grid';
    items.forEach(({ book, matchType, score }) =>
      grid.appendChild(mkCard(book, scoreKey === 'score' ? score : null,
        scoreKey !== 'score' ? (lmE[matchType] || lmP[matchType] || '') : null))
    );
    g.appendChild(grid);
    body.appendChild(g);
  }

  mkGroup(exactMatches,   'exact-group',   '🎯', 'Hasil Tepat',       'matchType');
  mkGroup(partialMatches, 'partial-group', '🔍', 'Hasil Pencarian',   'matchType');
  mkGroup(recommendations,'rec-group',     '✨', 'Rekomendasi Serupa','score');

  document.getElementById('searchResultSection').style.display = 'block';
  document.getElementById('searchResultSection').scrollIntoView({ behavior: 'smooth' });
}

// Search events
document.getElementById('heroSearchBtn')?.addEventListener('click', () => {
  doSearch(document.getElementById('heroSearch').value.trim());
});
document.getElementById('heroSearch')?.addEventListener('keydown', e => {
  if (e.key === 'Enter') doSearch(e.target.value.trim());
});

// Chips
document.querySelectorAll('.chip').forEach(chip => {
  chip.addEventListener('click', () => {
    const q = chip.dataset.q;
    document.getElementById('heroSearch').value = q;
    doSearch(q);
  });
});

// Tutup search
document.getElementById('closeSearchBtn')?.addEventListener('click', () => {
  document.getElementById('searchResultSection').style.display = 'none';
  document.getElementById('heroSearch').value = '';
});

// ── UPDATE STATS ──────────────────────────────────────────────────
function updateStats() {
  const totalEl = document.getElementById('sbTotal');
  const wishEl  = document.getElementById('sbWish');
  const readEl  = document.getElementById('sbRead');

  if (totalEl) totalEl.textContent = BOOKS.length;
  if (wishEl)  wishEl.textContent  = ST.wish.length;
  if (readEl)  readEl.textContent  = ST.readBooks.length;
}

// ── INIT ─────────────────────────────────────────────────────────
document.addEventListener('books-loaded', () => {
  document.getElementById('sbTotal').textContent = BOOKS.length;
});

document.addEventListener('state-loaded', () => {
  renderFloatingBooks();
  renderPopular();
  renderGenres();
  renderRandom();
  updateStats();
});
