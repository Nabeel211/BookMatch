let BOOKS = [];

async function loadBooks() {
  try {
    const res = await fetch('/api/books', {
      credentials: 'same-origin',  
      headers: {
        'Accept': 'application/json',
        'X-CSRF-TOKEN': window.CSRF_TOKEN || '',
        'X-Requested-With': 'XMLHttpRequest',
      }
    });

    if (!res.ok) {
      console.error('API books gagal:', res.status, res.statusText);
      return;
    }

    BOOKS = await res.json();
    console.log('Books loaded:', BOOKS.length);
    document.dispatchEvent(new Event('books-loaded'));
  } catch (e) {
    console.error('Gagal memuat data buku:', e);
  }
}

loadBooks();