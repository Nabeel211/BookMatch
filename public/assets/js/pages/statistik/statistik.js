// public/assets/js/pages/statistik/statistik.js

let readBooksSortMode = 'recent';

function renderStatistik() {
  const wish       = ST.wish;
  const ratings    = ST.ratings;
  const history    = ST.history;
  const readList   = ST.readBooks;
  const quizResult = ST.quizResult;

  const wishBooks    = wish.map(id => BOOKS.find(b => b.id === id)).filter(Boolean);
  const ratedEntries = Object.entries(ratings)
    .map(([id, r]) => ({ book: BOOKS.find(b => b.id === parseInt(id)), rating: r }))
    .filter(x => x.book);

  // ── OVERVIEW CARDS ──────────────────────────────────────────────
  const ovEl = document.getElementById('statOverview');
  ovEl.innerHTML = '';
  [
    { icon:'❤️', num: wish.length,                   label:'Buku di Wishlist' },
    { icon:'⭐', num: Object.keys(ratings).length,    label:'Buku Diberi Rating' },
    { icon:'🕐', num: history.length,                 label:'Buku Dilihat' },
    { icon:'✅', num: readList.length,                label:'Buku Selesai Dibaca' },
  ].forEach(({ icon, num, label }) => {
    const d = document.createElement('div');
    d.className = 'ov-card';
    d.innerHTML = `<div class="ov-card-icon">${icon}</div>
      <div class="ov-card-num">${num}</div>
      <div class="ov-card-label">${label}</div>`;
    ovEl.appendChild(d);
  });

  // ── GENRE CHART ─────────────────────────────────────────────────
  const gCount = {};
  // Hitung dari wishlist
  wishBooks.forEach(b => {
    b.features.slice(0, 3).forEach(f => { gCount[f] = (gCount[f] || 0) + 1; });
  });
  // Hitung dari rating
  ratedEntries.forEach(({ book }) => {
    book.features.slice(0, 3).forEach(f => { gCount[f] = (gCount[f] || 0) + 1; });
  });
  // Hitung dari readBooks
  readList.forEach(r => {
    const b = BOOKS.find(x => x.id === r.id);
    if (b) b.features.slice(0, 3).forEach(f => { gCount[f] = (gCount[f] || 0) + 1; });
  });

  const topG  = Object.entries(gCount).sort((a, b) => b[1] - a[1]).slice(0, 8);
  const maxG  = topG[0]?.[1] || 1;
  const gChart = document.getElementById('genreChart');
  gChart.innerHTML = '';
  if (topG.length) {
    topG.forEach(([g, c]) => {
      const d = document.createElement('div');
      d.className = 'gc-row';
      d.innerHTML = `<span class="gc-lbl">${g}</span>
        <div class="gc-bar-w"><div class="gc-bar" style="width:${Math.round(c/maxG*100)}%"></div></div>
        <span class="gc-val">${c}</span>`;
      gChart.appendChild(d);
    });
  } else {
    gChart.innerHTML = '<p style="font-size:.8rem;color:var(--ink3)">Tambahkan buku ke wishlist atau beri rating untuk melihat distribusi genre.</p>';
  }

  // ── RATING DISTRIBUTION ─────────────────────────────────────────
  const rDist = { 5:0, 4:0, 3:0, 2:0, 1:0 };
  Object.values(ratings).forEach(r => { rDist[r] = (rDist[r] || 0) + 1; });
  const maxR   = Math.max(...Object.values(rDist), 1);
  const rChart = document.getElementById('ratingChart');
  rChart.innerHTML = '';
  [5,4,3,2,1].forEach(r => {
    const c = rDist[r];
    const d = document.createElement('div');
    d.className = 'rc-row';
    d.innerHTML = `<span class="rc-lbl">${'★'.repeat(r)}</span>
      <div class="rc-bar-w"><div class="rc-bar" style="width:${Math.round(c/maxR*100)}%"></div></div>
      <span class="rc-val">${c}</span>`;
    rChart.appendChild(d);
  });
  if (!Object.keys(ratings).length) {
    rChart.innerHTML = '<p style="font-size:.8rem;color:var(--ink3)">Belum ada rating.</p>';
  }

  // ── WISHLIST ANALYSIS ────────────────────────────────────────────
  const wa = document.getElementById('wishAnalysis');
  if (wishBooks.length) {
    const avgR  = (wishBooks.reduce((s, b) => s + b.rating, 0) / wishBooks.length).toFixed(2);
    const avgY  = Math.round(wishBooks.reduce((s, b) => s + b.year, 0) / wishBooks.length);
    const topGn = topG[0]?.[0] || '—';
    wa.innerHTML = `<div class="wa-grid">
      <div class="wa-card"><div class="wa-lbl">Rata-rata Rating</div><div class="wa-val">${avgR} ★</div></div>
      <div class="wa-card"><div class="wa-lbl">Rata-rata Tahun</div><div class="wa-val">${avgY}</div></div>
      <div class="wa-card"><div class="wa-lbl">Genre Terfavorit</div><div class="wa-val">${topGn}</div></div>
      <div class="wa-card"><div class="wa-lbl">Jumlah Wishlist</div><div class="wa-val">${wishBooks.length} buku</div></div>
    </div>`;
  } else {
    wa.innerHTML = '<p style="font-size:.82rem;color:var(--ink3)">Tambahkan buku ke wishlist untuk melihat analisis.</p>';
  }

  // ── TOP RATED ────────────────────────────────────────────────────
  const topRow  = document.getElementById('topRatedRow');
  const emptyEl = document.getElementById('emptyRated');
  topRow.innerHTML = '';
  if (ratedEntries.length) {
    emptyEl.style.display = 'none';
    topRow.style.display  = '';
    ratedEntries.sort((a, b) => b.rating - a.rating).slice(0, 8)
      .forEach(({ book }) => topRow.appendChild(mkCard(book)));
  } else {
    topRow.style.display  = 'none';
    emptyEl.style.display = 'block';
  }

  // ── READ BOOKS LIST ──────────────────────────────────────────────
  renderReadBooks(readList);

  // ── SIMILARITY MAP ───────────────────────────────────────────────
  const simMap     = document.getElementById('simMap');
  const emptySimEl = document.getElementById('emptySimMap');
  if (wishBooks.length >= 3) {
    if (emptySimEl) emptySimEl.style.display = 'none';
    simMap.style.display = '';
    simMap.innerHTML     = '';
    const short = b => b.title.length > 11 ? b.title.slice(0, 11) + '…' : b.title;
    const t = document.createElement('table');
    t.className = 'sim-matrix';
    t.innerHTML = `<thead><tr><th></th>${wishBooks.map(b => `<th>${b.cover} ${short(b)}</th>`).join('')}</tr></thead>
      <tbody>${wishBooks.map(a => `<tr><th>${a.cover} ${short(a)}</th>${wishBooks.map(b => {
        if (a.id === b.id) return '<td><div class="sim-cell" style="background:var(--bg);color:var(--ink3)">—</div></td>';
        const s   = Math.round(cbf.getSim(a.id, b.id) * 100);
        const bg  = s >= 70 ? 'var(--green-bg)' : s >= 40 ? 'var(--amber-bg)' : '#f5f5f5';
        const col = s >= 70 ? 'var(--green)'    : s >= 40 ? 'var(--amber-text)' : 'var(--ink3)';
        return `<td><div class="sim-cell" style="background:${bg};color:${col}">${s}%</div></td>`;
      }).join('')}</tr>`).join('')}</tbody>`;
    simMap.appendChild(t);
  } else {
    simMap.style.display = 'none';
    if (emptySimEl) emptySimEl.style.display = 'block';
  }

  // ── PROFIL PEMBACA ───────────────────────────────────────────────
  const ch      = ST.challenge;
  const avgRating = ratedEntries.length
    ? (ratedEntries.reduce((s, r) => s + r.rating, 0) / ratedEntries.length).toFixed(1)
    : '—';
  const profEl = document.getElementById('profileGrid');
  profEl.innerHTML = '';
  [
    { icon:'🎭', label:'Genre Favorit',          val: topG[0]?.[0] || 'Belum ada data' },
    { icon:'⭐', label:'Rata-rata Rating Kamu',  val: avgRating !== '—' ? `${avgRating}/5` : 'Belum ada rating' },
    { icon:'📚', label:'Total Buku Dieksplorasi',val: `${history.length} buku` },
    { icon:'✅', label:'Buku Selesai Dibaca',    val: `${readList.length} buku` },
    { icon:'🎯', label:'Hasil Kuis Genre',       val: quizResult ? quizResult.profile : 'Belum ikut kuis' },
    { icon:'📅', label:'Target Baca Tahun Ini',  val: ch ? `${readList.length} / ${ch.target} buku` : 'Belum set target' },
  ].forEach(({ icon, label, val }) => {
    const d = document.createElement('div');
    d.className = 'pc-item';
    d.innerHTML = `<div class="pc-icon">${icon}</div>
      <div class="pc-lbl">${label}</div>
      <div class="pc-val">${val}</div>`;
    profEl.appendChild(d);
  });
}

// ── READ BOOKS: render, sort, card ─────────────────────────────────
function renderReadBooks(readList) {
  const readSection = document.getElementById('readBooksSection');
  const badge       = document.getElementById('readCountBadge');
  if (!readSection) return;

  if (badge) badge.textContent = `${readList.length} buku`;

  let entries = readList
    .map(r => ({ r, b: BOOKS.find(x => x.id === r.id) }))
    .filter(x => x.b);

  if (!entries.length) {
    readSection.innerHTML = '<p style="font-size:.82rem;color:var(--ink3)">Belum ada buku yang ditandai selesai dibaca. Tandai dari halaman Katalog!</p>';
    return;
  }

  entries = sortReadEntries(entries, readBooksSortMode);

  readSection.innerHTML = '';
  entries.forEach(({ r, b }) => readSection.appendChild(mkReadCard(b, r)));
}

function sortReadEntries(entries, mode) {
  const arr = [...entries];
  switch (mode) {
    case 'title':
      return arr.sort((x, y) => x.b.title.localeCompare(y.b.title));
    case 'rating':
      return arr.sort((x, y) => (ST.ratings[y.b.id] || 0) - (ST.ratings[x.b.id] || 0));
    case 'genre':
      return arr.sort((x, y) => (x.b.features[0] || '').localeCompare(y.b.features[0] || ''));
    case 'recent':
    default:
      return arr.reverse();
  }
}

function mkReadCard(b, r) {
  const d = document.createElement('div');
  d.className = 'rb-card';

  const userRating = ST.ratings[b.id];
  const ratingHtml = userRating
    ? `<span class="rb-rating">${'★'.repeat(userRating)}${'☆'.repeat(5 - userRating)}</span>`
    : '';
  const dateHtml  = r.date ? `<span class="rb-date">${r.date}</span>` : '';
  const genreHtml = b.features?.[0]
    ? `<span class="rb-genre-tag">${b.features[0]}</span>`
    : '';

  d.innerHTML = `
    <div class="rb-cover-box" style="background:${b.color}">
      <span class="rb-cover-emoji">${b.cover}</span>
      <span class="rb-check">✓</span>
    </div>
    <div class="rb-body">
      <div class="rb-title">${b.title}</div>
      <div class="rb-author">${b.author}</div>
      <div class="rb-meta">${ratingHtml}${dateHtml}</div>
      ${genreHtml}
    </div>`;
  d.style.cursor = 'pointer';
  d.addEventListener('click', () => openModal(b));
  return d;
}

// Bind sort dropdown once the page's DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const sortSelect = document.getElementById('readBooksSort');
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      readBooksSortMode = e.target.value;
      if (typeof ST !== 'undefined' && ST.readBooks) renderReadBooks(ST.readBooks);
    });
  }
});

// ── FUNGSI LIVE UPDATE ────────────────────────────────────────────
// Dipanggil dari shared.js ketika wishlist/readBooks berubah
window.updateStatIfOpen = function() {
  if (document.getElementById('statOverview')) {
    renderStatistik();
  }
};

// ── INIT ─────────────────────────────────────────────────────────
document.addEventListener('state-loaded', renderStatistik);