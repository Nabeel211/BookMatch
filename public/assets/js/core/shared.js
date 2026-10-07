// public/assets/js/core/shared.js
// State global → API Laravel

const ST = {
  wish:       [],
  ratings:    {},
  history:    [],
  compare:    [],
  challenge:  null,
  readBooks:  [],
  quizResult: null,
};

// ── API HELPERS ──────────────────────────────────────────────────
async function apiPost(url, body = {}) {
  const res = await fetch(url, {
    method:      'POST',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
      'Accept':       'application/json',
      'X-CSRF-TOKEN': window.CSRF_TOKEN,
    },
    body: JSON.stringify(body),
  });
  return res.json();
}

async function apiDelete(url) {
  const res = await fetch(url, {
    method:      'DELETE',
    credentials: 'same-origin',
    headers: {
      'Accept':       'application/json',
      'X-CSRF-TOKEN': window.CSRF_TOKEN,
    },
  });
  return res.json();
}

// ── LOAD STATE ───────────────────────────────────────────────────
async function loadState() {
  try {
    const res = await fetch('/state', {
      credentials: 'same-origin',
      headers: { 'Accept': 'application/json' }
    });
    const data = await res.json();
    ST.wish       = data.wish       || [];
    ST.ratings    = data.ratings    || {};
    ST.history    = data.history    || [];
    ST.compare    = data.compare    || [];
    ST.challenge  = data.challenge  || null;
    ST.readBooks  = data.readBooks  || [];
    ST.quizResult = data.quizResult || null;
    updateNavBadge();
    document.dispatchEvent(new Event('state-loaded'));
  } catch (e) {
    console.error('Gagal memuat state:', e);
    document.dispatchEvent(new Event('state-loaded'));
  }
}

// ── TOAST ────────────────────────────────────────────────────────
let _toastTimer;
function showToast(msg, type = 'default') {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.className   = 'toast show' + (type !== 'default' ? ' toast-' + type : '');
  clearTimeout(_toastTimer);
  _toastTimer = setTimeout(() => t.classList.remove('show'), 2800);
}

// ── NAVBAR BADGE ─────────────────────────────────────────────────
function updateNavBadge() {
  document.querySelectorAll('.nav-wish-count').forEach(el => el.textContent = ST.wish.length);
}

// ── MOBILE NAV ───────────────────────────────────────────────────
function initMobileNav() {
  const btn  = document.getElementById('navToggle');
  const menu = document.getElementById('mobileMenu');
  if (!btn || !menu) return;
  btn.addEventListener('click', () => menu.classList.toggle('open'));
  document.addEventListener('click', e => {
    if (!btn.contains(e.target) && !menu.contains(e.target)) menu.classList.remove('open');
  });
}

// ── WISHLIST ─────────────────────────────────────────────────────
async function toggleWish(id) {
  const data = await apiPost('/wishlist/toggle', { book_id: id });
  ST.wish = data.wish || ST.wish;
  showToast(data.added ? '❤️ Ditambahkan ke Wishlist' : 'Dihapus dari Wishlist');
  updateNavBadge();
  refreshCardStates();
  if (typeof onWishChange === 'function') onWishChange();
  // ← Trigger update statistik jika halaman statistik terbuka
  if (typeof updateStatIfOpen === 'function') updateStatIfOpen();
}

async function clearWishlist() {
  const data = await apiPost('/wishlist/clear');
  ST.wish = data.wish || [];
  updateNavBadge();
  refreshCardStates();
  if (typeof onWishChange === 'function') onWishChange();
}

// ── COMPARE ──────────────────────────────────────────────────────
async function toggleCompare(id) {
  const data = await apiPost('/compare/toggle', { book_id: id });
  if (data.error === 'max_reached') { showToast('⚠️ Maksimal 4 buku', 'warn'); return; }
  ST.compare = data.compare || ST.compare;
  refreshCardStates();
  if (typeof onCompareChange === 'function') onCompareChange();
}

async function clearCompare() {
  const data = await apiPost('/compare/clear');
  ST.compare = data.compare || [];
  refreshCardStates();
  if (typeof onCompareChange === 'function') onCompareChange();
}

// ── RATING ───────────────────────────────────────────────────────
async function setRating(id, r) {
  const data = await apiPost('/ratings', { book_id: id, rating: r });
  ST.ratings = data.ratings || ST.ratings;
  showToast(`⭐ Rating ${r}/5 tersimpan`);
  refreshCardStates();
}

// ── HISTORY ──────────────────────────────────────────────────────
async function addHistory(id) {
  await apiPost('/history', { book_id: id });
  if (!ST.history.includes(id)) ST.history.unshift(id);
}

async function clearHistory() {
  await apiPost('/history/clear');
  ST.history = [];
}

// ── MARK AS READ ─────────────────────────────────────────────────
// FIX: Sekarang bisa ditekan TANPA perlu challenge aktif.
// Kalau challenge aktif, otomatis masuk ke challenge sekaligus.
async function markAsRead(book) {
  const existing = ST.readBooks.find(r => r.id === book.id);

  // Kalau sudah dibaca → hapus (toggle off)
  if (existing) {
    const dbId = existing.dbId || existing.id;
    // Cari id record di readBooks (bukan book id)
    const record = ST.readBooks.find(r => r.id === book.id);
    if (record && record.recordId) {
      await apiDelete(`/readbooks/${record.recordId}`);
    } else {
      // Fallback: cari lewat index
      const idx = ST.readBooks.findIndex(r => r.id === book.id);
      if (idx !== -1) ST.readBooks.splice(idx, 1);
    }
    ST.readBooks = ST.readBooks.filter(r => r.id !== book.id);
    showToast(`📖 "${book.title}" ditandai belum dibaca`);
    if (typeof updateStatIfOpen === 'function') updateStatIfOpen();
    if (typeof renderDash === 'function') renderDash();
    return 'removed';
  }

  // Belum dibaca → tambah
  const data = await apiPost('/readbooks', { book_id: book.id });

  if (data.error === 'already_added') {
    showToast('Buku ini sudah ada di daftar bacaan!');
    return 'exists';
  }

  if (data.readBook) {
    // Simpan recordId untuk keperluan delete nanti
    data.readBook.recordId = data.readBook.recordId || data.readBook.dbId || null;
    ST.readBooks.push(data.readBook);
    if (ST.challenge) {
      showToast(`✅ "${book.title}" sudah dibaca + masuk Challenge!`, 'success');
    } else {
      showToast(`✅ "${book.title}" ditandai sudah dibaca!`, 'success');
    }
    if (typeof updateStatIfOpen === 'function') updateStatIfOpen();
    if (typeof renderDash === 'function') renderDash();
    return 'added';
  }

  showToast('Gagal. Coba lagi.', 'warn');
  return 'error';
}

// ── CARD CREATION ────────────────────────────────────────────────
function mkCard(book, score = null, badgeLabel = null) {
  const card = document.createElement('div');
  card.className = 'book-card';
  card.dataset.id = book.id;

  const iW = ST.wish.includes(book.id);
  const iC = ST.compare.includes(book.id);
  const ur = ST.ratings[book.id];
  const stars = '★'.repeat(Math.round(book.rating)) + '☆'.repeat(5 - Math.round(book.rating));

  let pill = '';
  if (badgeLabel) {
    pill = `<span class="match-pill">${badgeLabel}</span>`;
  } else if (score !== null) {
    const p  = Math.round(score * 100);
    const cl = p >= 70 ? 'sh' : p >= 40 ? 'sm' : 'ss';
    pill = `<span class="sim-pill ${cl}">${p}%</span>`;
  }

  card.innerHTML = `${pill}
    <div class="card-actions">
      <button class="act-btn ${iW ? 'w-on' : ''}" data-w="${book.id}" title="Wishlist">${iW ? '❤️' : '🤍'}</button>
      <button class="act-btn ${iC ? 'c-on' : ''}" data-c="${book.id}" title="Bandingkan">⊕</button>
    </div>
    <div class="book-cover" style="background:${book.color}">${book.cover}</div>
    <div class="book-body">
      <div class="book-title">${book.title}</div>
      <div class="book-author">${book.author} · ${book.year}</div>
      <div class="book-rating">${stars} ${book.rating}${ur ? ` · Kamu:${ur}★` : ''}</div>
      <div class="book-tags">${book.features.slice(0, 3).map(f => `<span class="tag">${f}</span>`).join('')}</div>
    </div>`;

  card.querySelector('[data-w]').addEventListener('click', e => { e.stopPropagation(); toggleWish(book.id); });
  card.querySelector('[data-c]').addEventListener('click', e => { e.stopPropagation(); toggleCompare(book.id); });
  card.addEventListener('click', () => openModal(book));
  return card;
}

function refreshCardStates() {
  document.querySelectorAll('.book-card[data-id]').forEach(card => {
    const id = parseInt(card.dataset.id);
    const wb = card.querySelector('[data-w]');
    const cb = card.querySelector('[data-c]');
    if (wb) {
      const iW = ST.wish.includes(id);
      wb.className  = 'act-btn ' + (iW ? 'w-on' : '');
      wb.textContent = iW ? '❤️' : '🤍';
    }
    if (cb) {
      const iC = ST.compare.includes(id);
      cb.className = 'act-btn ' + (iC ? 'c-on' : '');
    }
  });
  updateNavBadge();
}

// ── MODAL ────────────────────────────────────────────────────────
function openModal(book) {
  addHistory(book.id);

  const iW    = ST.wish.includes(book.id);
  const iC    = ST.compare.includes(book.id);
  const ur    = ST.ratings[book.id] || 0;
  const stars = '★'.repeat(Math.round(book.rating)) + '☆'.repeat(5 - Math.round(book.rating));

  // Cek apakah sudah dibaca
  const isRead = ST.readBooks.some(r => r.id === book.id);

  document.getElementById('modalInner').innerHTML = `
    <div class="modal-cover-big" style="background:${book.color}">${book.cover}</div>
    <div class="modal-body">
      <div class="modal-title">${book.title}</div>
      <div class="modal-author">${book.author} · ${book.year}</div>
      <div class="modal-rating-row">
        <span class="modal-stars">${stars}</span>
        <span class="modal-rating-val">${book.rating}/5 global</span>
      </div>
      <div class="user-rate-box">
        <p>Rating kamu ${ur ? `(${ur}/5)` : '— belum dinilai'}</p>
        <div class="star-row">
          ${[1,2,3,4,5].map(s => `<span class="sp ${ur >= s ? 'on' : ''}" data-r="${s}">★</span>`).join('')}
        </div>
      </div>
      <div class="modal-desc">${book.desc}</div>
      <div class="modal-tags">${book.features.map(f => `<span class="tag">${f}</span>`).join('')}</div>
      <div class="modal-acts">
        <button class="mbtn primary" id="mRec">🔍 Rekomendasikan</button>
        <button class="mbtn ${iW ? 'w-on' : ''}" id="mWish">${iW ? '❤️ Tersimpan' : '🤍 Wishlist'}</button>
        <button class="mbtn ${iC ? 'c-on' : ''}" id="mComp">${iC ? '⊕ Di-compare' : '⊕ Bandingkan'}</button>
        <button class="mbtn ${isRead ? 'read-done' : 'ch-on'}" id="mRead">
          ${isRead ? '✅ Sudah Dibaca (klik untuk batal)' : '📖 Tandai Sudah Dibaca'}
        </button>
      </div>
      ${isRead ? '<p class="modal-read-note">✅ Buku ini sudah ada di daftar bacaanmu</p>' : ''}
      ${ST.challenge && !isRead ? `<p class="modal-challenge-note">🏆 Challenge aktif: otomatis masuk ke challenge juga</p>` : ''}
    </div>`;

  const inner = document.getElementById('modalInner');

  // Bintang rating
  inner.querySelectorAll('.sp').forEach(s => {
    s.addEventListener('click', () => {
      setRating(book.id, parseInt(s.dataset.r));
      inner.querySelectorAll('.sp').forEach((x, i) => x.classList.toggle('on', i < parseInt(s.dataset.r)));
      inner.querySelector('.user-rate-box p').textContent = `Rating kamu (${s.dataset.r}/5)`;
    });
    s.addEventListener('mouseenter', () =>
      inner.querySelectorAll('.sp').forEach((x, i) =>
        x.style.color = i < parseInt(s.dataset.r) ? '#c8781a' : '#ddd')
    );
  });
  inner.querySelector('.star-row')?.addEventListener('mouseleave', () => {
    const r = ST.ratings[book.id] || 0;
    inner.querySelectorAll('.sp').forEach((x, i) =>
      x.style.color = i < r ? '#c8781a' : '#ddd');
  });

  // Rekomendasi
  inner.querySelector('#mRec').addEventListener('click', () => {
    closeModal();
    if (typeof showRecResults === 'function') {
      showRecResults(cbf.rec(book.id, 8), `Karena kamu suka: "${book.title}"`);
    }
  });

  // Wishlist
  inner.querySelector('#mWish').addEventListener('click', async () => {
    await toggleWish(book.id);
    const btn = inner.querySelector('#mWish');
    const w   = ST.wish.includes(book.id);
    btn.textContent = w ? '❤️ Tersimpan' : '🤍 Wishlist';
    btn.className   = 'mbtn ' + (w ? 'w-on' : '');
  });

  // Compare
  inner.querySelector('#mComp').addEventListener('click', async () => {
    await toggleCompare(book.id);
    const btn = inner.querySelector('#mComp');
    const c   = ST.compare.includes(book.id);
    btn.textContent = c ? '⊕ Di-compare' : '⊕ Bandingkan';
    btn.className   = 'mbtn ' + (c ? 'c-on' : '');
  });

  // Sudah Dibaca — FIX: tidak perlu challenge aktif
  inner.querySelector('#mRead').addEventListener('click', async () => {
    const btn    = inner.querySelector('#mRead');
    const isNowRead = ST.readBooks.some(r => r.id === book.id);

    btn.disabled    = true;
    btn.textContent = '⏳ Memproses...';

    const result = await markAsRead(book);

    if (result === 'added') {
      btn.disabled    = false;
      btn.textContent = '✅ Sudah Dibaca (klik untuk batal)';
      btn.className   = 'mbtn read-done';
      inner.querySelector('.modal-challenge-note')?.remove();
      inner.querySelector('.modal-read-note')?.remove();
      const note = document.createElement('p');
      note.className   = 'modal-read-note';
      note.textContent = '✅ Buku ini ada di daftar bacaanmu';
      inner.querySelector('.modal-acts').after(note);

    } else if (result === 'removed') {
      btn.disabled    = false;
      btn.textContent = '📖 Tandai Sudah Dibaca';
      btn.className   = 'mbtn ch-on';
      inner.querySelector('.modal-read-note')?.remove();
      if (ST.challenge) {
        const note = document.createElement('p');
        note.className   = 'modal-challenge-note';
        note.textContent = '🏆 Challenge aktif: otomatis masuk ke challenge juga';
        inner.querySelector('.modal-acts').after(note);
      }

    } else {
      btn.disabled    = false;
      btn.textContent = isNowRead ? '✅ Sudah Dibaca (klik untuk batal)' : '📖 Tandai Sudah Dibaca';
    }
  });

  document.getElementById('modalOverlay').classList.add('active');
}

function closeModal() {
  document.getElementById('modalOverlay').classList.remove('active');
}

// ── INIT ─────────────────────────────────────────────────────────
document.getElementById('modalClose')?.addEventListener('click', closeModal);
document.getElementById('modalOverlay')?.addEventListener('click', e => {
  if (e.target === document.getElementById('modalOverlay')) closeModal();
});

document.addEventListener('books-loaded', () => {
  const wait = setInterval(() => {
    if (typeof cbf !== 'undefined') {
      clearInterval(wait);
      loadState();
    }
  }, 50);
});

initMobileNav();
