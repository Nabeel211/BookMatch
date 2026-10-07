// public/assets/js/pages/chat-ai/chat-ai.js
// Chat AI BookMatch — menggunakan Claude API via Laravel backend

let chatHistory = [];    // riwayat percakapan [{role, content}]
let isLoading   = false; // mencegah double-send
let allBooks    = [];    // cache buku dari state

// ── INIT ──────────────────────────────────────────────────────────────
document.addEventListener('state-loaded', () => {
  allBooks = BOOKS;
  initChat();
});

function initChat() {
  const input   = document.getElementById('chatInput');
  const sendBtn = document.getElementById('chatSendBtn');
  const clearBtn= document.getElementById('chatClearBtn');
  const charCount = document.getElementById('charCount');

  // Auto-resize textarea
  input.addEventListener('input', () => {
    input.style.height = 'auto';
    input.style.height = Math.min(input.scrollHeight, 120) + 'px';
    charCount.textContent = input.value.length;
  });

  // Kirim dengan Enter (Shift+Enter untuk newline)
  input.addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });

  sendBtn.addEventListener('click', sendMessage);
  clearBtn.addEventListener('click', resetChat);

  // Suggestion chips
  document.querySelectorAll('.sug-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      input.value = chip.dataset.text;
      input.style.height = 'auto';
      input.style.height = Math.min(input.scrollHeight, 120) + 'px';
      charCount.textContent = input.value.length;
      input.focus();
      // Auto-send setelah klik chip
      setTimeout(sendMessage, 150);
    });
  });
}

// ── KIRIM PESAN ──────────────────────────────────────────────────────
async function sendMessage() {
  if (isLoading) return;

  const input = document.getElementById('chatInput');
  const text  = input.value.trim();
  if (!text) return;

  // Sembunyikan suggestions setelah pesan pertama
  const suggestions = document.getElementById('chatSuggestions');
  if (suggestions) suggestions.style.display = 'none';

  // Tampilkan pesan user
  appendMessage('user', text);
  chatHistory.push({ role: 'user', content: text });

  // Reset input
  input.value = '';
  input.style.height = 'auto';
  document.getElementById('charCount').textContent = '0';

  // Tampilkan typing indicator
  const typingId = showTyping();
  setLoading(true);

  try {
    const res = await fetch('/api/ai/chat', {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-CSRF-TOKEN': window.CSRF_TOKEN,
      },
      body: JSON.stringify({
        message: text,
        history: chatHistory.slice(-10), // kirim max 10 pesan terakhir
      }),
    });

    removeTyping(typingId);

    const data = await res.json();

    if (!res.ok || data.error) {
      appendError(data.error || 'Terjadi kesalahan. Coba lagi.');
      return;
    }

    // Tampilkan balasan AI
    appendMessage('ai', data.reply);
    chatHistory.push({ role: 'assistant', content: data.reply });

    // Update panel rekomendasi buku
    if (data.recommended_books && data.recommended_books.length > 0) {
      updateRecPanel(data.recommended_books, text);
    }

  } catch (err) {
    removeTyping(typingId);
    appendError('Gagal menghubungi server. Pastikan koneksi internet kamu aktif.');
    console.error('Chat AI error:', err);
  } finally {
    setLoading(false);
  }
}

// ── UI HELPERS ────────────────────────────────────────────────────────
function appendMessage(role, text) {
  const container = document.getElementById('chatMessages');

  const row = document.createElement('div');
  row.className = `msg-row ${role === 'user' ? 'user-row' : 'ai-row'}`;

  const avatar = document.createElement('div');
  avatar.className = 'msg-avatar';
  avatar.textContent = role === 'user' ? '👤' : '🤖';

  const bubble = document.createElement('div');
  bubble.className = `msg-bubble ${role === 'user' ? 'user-bubble' : 'ai-bubble'}`;

  // Render teks dengan format sederhana (bold, list)
  bubble.innerHTML = formatAiText(text);

  row.appendChild(avatar);
  row.appendChild(bubble);
  container.appendChild(row);
  scrollToBottom();
}

function appendError(msg) {
  const container = document.getElementById('chatMessages');
  const row = document.createElement('div');
  row.className = 'msg-row ai-row';

  const avatar = document.createElement('div');
  avatar.className = 'msg-avatar';
  avatar.textContent = '⚠️';

  const bubble = document.createElement('div');
  bubble.className = 'error-bubble';
  bubble.textContent = msg;

  row.appendChild(avatar);
  row.appendChild(bubble);
  container.appendChild(row);
  scrollToBottom();
}

function showTyping() {
  const container = document.getElementById('chatMessages');
  const id = 'typing-' + Date.now();

  const row = document.createElement('div');
  row.className = 'msg-row ai-row';
  row.id = id;

  const avatar = document.createElement('div');
  avatar.className = 'msg-avatar';
  avatar.textContent = '🤖';

  const bubble = document.createElement('div');
  bubble.className = 'typing-bubble';
  bubble.innerHTML = `<div class="typing-dots"><span></span><span></span><span></span></div>`;

  row.appendChild(avatar);
  row.appendChild(bubble);
  container.appendChild(row);
  scrollToBottom();
  return id;
}

function removeTyping(id) {
  const el = document.getElementById(id);
  if (el) el.remove();
}

function setLoading(state) {
  isLoading = state;
  const btn = document.getElementById('chatSendBtn');
  const input = document.getElementById('chatInput');
  btn.disabled = state;
  input.disabled = state;
}

function scrollToBottom() {
  const container = document.getElementById('chatMessages');
  container.scrollTop = container.scrollHeight;
}

function resetChat() {
  if (!confirm('Reset percakapan? Riwayat chat akan dihapus.')) return;
  chatHistory = [];
  const container = document.getElementById('chatMessages');
  container.innerHTML = '';

  // Tampilkan kembali pesan sambutan
  appendMessage('ai', 'Percakapan direset! 👋 Ceritakan lagi bagaimana perasaanmu hari ini?');

  // Tampilkan kembali suggestions
  const suggestions = document.getElementById('chatSuggestions');
  if (suggestions) suggestions.style.display = 'block';

  // Reset panel rekomendasi
  document.getElementById('recBooksList').innerHTML = `
    <div class="rec-empty">
      <div class="rec-empty-icon">📖</div>
      <p>Belum ada rekomendasi.<br/>Mulai ceritakan perasaanmu!</p>
    </div>`;
  document.getElementById('recPanelSub').textContent = 'Buku yang cocok akan muncul di sini setelah kamu bercerita';
}

// ── FORMAT TEXT AI ────────────────────────────────────────────────────
// Konversi markdown sederhana ke HTML
function formatAiText(text) {
  // Escape HTML
  let html = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // Bold **text**
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

  // Italic *text*
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');

  // Baris baru → <br>
  html = html.replace(/\n\n/g, '</p><p>');
  html = html.replace(/\n/g, '<br>');

  // Wrap dengan <p>
  html = `<p>${html}</p>`;

  return html;
}

// ── UPDATE PANEL REKOMENDASI ──────────────────────────────────────────
function updateRecPanel(books, userMessage) {
  const list = document.getElementById('recBooksList');
  const sub  = document.getElementById('recPanelSub');

  sub.textContent = `${books.length} buku direkomendasikan untuk kamu`;

  list.innerHTML = '';

  books.forEach(book => {
    const card = document.createElement('div');
    card.className = 'ai-book-card';

    const isWished = ST.wish.includes(book.id);

    card.innerHTML = `
      <div class="ai-book-cover" style="background:${book.color}">${book.cover}</div>
      <div class="ai-book-info">
        <div class="ai-book-title">${book.title}</div>
        <div class="ai-book-author">${book.author} · ${book.year}</div>
        <div class="ai-book-tags">
          ${(book.features || []).slice(0, 3).map(f => `<span class="ai-book-tag">${f}</span>`).join('')}
        </div>
      </div>
      <button class="ai-book-wish ${isWished ? 'w-on' : ''}" data-wish="${book.id}" title="Tambah ke Wishlist">
        ${isWished ? '❤️' : '🤍'}
      </button>`;

    // Klik kartu → buka modal
    card.addEventListener('click', e => {
      if (e.target.closest('.ai-book-wish')) return;
      openModal(book);
    });

    // Klik wish button
    card.querySelector('.ai-book-wish').addEventListener('click', async e => {
      e.stopPropagation();
      await toggleWish(book.id);
      const btn = card.querySelector('.ai-book-wish');
      const iW  = ST.wish.includes(book.id);
      btn.textContent = iW ? '❤️' : '🤍';
      btn.className   = `ai-book-wish ${iW ? 'w-on' : ''}`;
    });

    list.appendChild(card);
  });
}
