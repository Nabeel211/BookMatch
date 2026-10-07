{{-- resources/views/pages/home.blade.php --}}
@extends('layouts.app')
@section('title', 'Beranda')
@section('page-css')
  <link rel="stylesheet" href="{{ asset('assets/css/home.css') }}"/>
@endsection

@section('content')

{{-- ── HERO ── --}}
<section class="hero">
  <div class="hero-bg">
    <div class="hero-orb hero-orb-1"></div>
    <div class="hero-orb hero-orb-2"></div>
    <div class="hero-orb hero-orb-3"></div>
  </div>
  <div class="hero-inner">
    <div class="hero-left">
      <div class="hero-eyebrow">
        <span class="eyebrow-dot"></span>
        Sistem Rekomendasi Buku Berbasis Perasaan
      </div>
      <h1 class="hero-title">
        Temukan Buku yang<br/>
        <span class="hero-title-em">Bicara ke Hatimu</span>
      </h1>
      <p class="hero-desc">
        Ceritakan perasaanmu, atau cari buku apapun — sistem kami memahami konteks dan merekomendasikan bacaan yang benar-benar cocok denganmu.
      </p>

      {{-- SEARCH BAR --}}
      <div class="hero-search">
        <div class="search-input-wrap">
          <svg class="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input type="text" id="heroSearch" placeholder="Cari judul, penulis, atau genre..."/>
          <button id="heroSearchBtn">Cari</button>
        </div>
        <div class="search-chips">
          <button class="chip" data-q="sedih">😔 Lagi sedih</button>
          <button class="chip" data-q="fantasy">✨ Fantasy</button>
          <button class="chip" data-q="stres">😤 Butuh rileks</button>
          <button class="chip" data-q="indonesia">🇮🇩 Karya Indonesia</button>
          <button class="chip" data-q="motivasi">💪 Butuh motivasi</button>
          <button class="chip" data-q="misteri">🔍 Misteri</button>
        </div>
      </div>

      {{-- STATS ROW --}}
      <div class="hero-stats">
        <div class="hstat">
          <span class="hstat-n" id="sbTotal">—</span>
          <span class="hstat-l">Koleksi Buku</span>
        </div>
        <div class="hstat-sep"></div>
        <div class="hstat">
          <span class="hstat-n">8+</span>
          <span class="hstat-l">Genre</span>
        </div>
        <div class="hstat-sep"></div>
        <div class="hstat">
          <span class="hstat-n" id="sbWish">0</span>
          <span class="hstat-l">Wishlistmu</span>
        </div>
        <div class="hstat-sep"></div>
        <div class="hstat">
          <span class="hstat-n" id="sbRead">0</span>
          <span class="hstat-l">Sudah Dibaca</span>
        </div>
      </div>
    </div>

    {{-- FLOATING BOOKS --}}
    <div class="hero-right">
      <div class="books-float" id="heroBooksFloat"></div>
    </div>
  </div>
</section>

{{-- ── HASIL PENCARIAN ── --}}
<section id="searchResultSection" style="display:none">
  <div class="container">
    <div class="search-result-header">
      <h2>🔍 Hasil: "<span id="searchQueryLabel"></span>"</h2>
      <button class="close-search-btn" id="closeSearchBtn">✕ Tutup</button>
    </div>
    <div id="searchResultBody"></div>
  </div>
</section>

{{-- ── CHAT AI PROMO ── --}}
<section class="ai-section">
  <div class="container">
    <div class="ai-promo">
      <div class="ai-promo-left">
        <div class="ai-tag">✨ Fitur Unggulan</div>
        <h2>Rekomendasi Berbasis<br/><strong>Perasaanmu</strong></h2>
        <p>Tidak perlu tahu judul atau genre. Cukup ceritakan suasana hatimu — AI kami akan menemukan buku yang paling cocok dengan kondisi emosionalmu saat ini.</p>
        <div class="ai-examples">
          <div class="ai-ex">"Aku lagi stres ujian dan butuh pelarian..."</div>
          <div class="ai-ex">"Pengen baca yang bikin semangat lagi..."</div>
          <div class="ai-ex">"Lagi penasaran sama sains tapi yang seru..."</div>
        </div>
        <a href="{{ route('chatai') }}" class="ai-cta">
          Coba Chat AI
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
        </a>
      </div>
      <div class="ai-promo-right">
        <div class="chat-preview">
          <div class="cp-header">
            <div class="cp-dot red"></div>
            <div class="cp-dot yellow"></div>
            <div class="cp-dot green"></div>
            <span>BookMatch AI</span>
          </div>
          <div class="cp-body">
            <div class="cp-msg user">Aku lagi sedih dan butuh semangat 😔</div>
            <div class="cp-msg ai">
              Aku dengar kamu sedang tidak baik-baik saja. Ini beberapa buku yang mungkin bisa membantu menemukan cahaya di hari yang berat...
              <div class="cp-books">
                <div class="cp-book" style="background:#b45309">🌈</div>
                <div class="cp-book" style="background:#92400e">✨</div>
                <div class="cp-book" style="background:#1e3a5f">🕌</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

{{-- ── BUKU POPULER ── --}}
<section class="home-section">
  <div class="container">
    <div class="sec-head">
      <div>
        <h2>🔥 Buku Terpopuler</h2>
        <p class="sec-sub">Koleksi dengan rating tertinggi di sistem</p>
      </div>
      <a href="{{ route('catalog') }}" class="sec-link">Lihat semua →</a>
    </div>
    <div class="book-row" id="popularRow"></div>
  </div>
</section>

{{-- ── GENRE ── --}}
<section class="genre-section">
  <div class="container">
    <div class="sec-head">
      <div>
        <h2>📂 Jelajahi Genre</h2>
        <p class="sec-sub">Temukan buku berdasarkan genre favoritmu</p>
      </div>
    </div>
    <div class="genre-grid" id="genreGrid"></div>
  </div>
</section>

{{-- ── FITUR UNGGULAN ── --}}
<section class="features-section">
  <div class="container">
    <div class="features-head">
      <h2>Semua yang Kamu Butuhkan<br/>untuk Perjalanan Membacamu</h2>
    </div>
    <div class="features-grid">
      <a href="{{ route('catalog') }}" class="feat">
        <div class="feat-icon-wrap" style="background:linear-gradient(135deg,#1e3a5f,#1a5fa8)">📖</div>
        <h3>Katalog Lengkap</h3>
        <p>Filter berdasarkan genre, rating, dan era. Bandingkan hingga 4 buku sekaligus.</p>
      </a>
      <a href="{{ route('chatai') }}" class="feat feat-highlight">
        <div class="feat-icon-wrap" style="background:linear-gradient(135deg,#4a1d96,#7c3aed)">🤖</div>
        <h3>Chat AI</h3>
        <p>Ceritakan perasaanmu — AI merekomendasikan buku yang cocok dengan kondisi emosionalmu.</p>
        <span class="feat-badge">Baru</span>
      </a>
      <a href="{{ route('quiz') }}" class="feat">
        <div class="feat-icon-wrap" style="background:linear-gradient(135deg,#065f46,#059669)">🎯</div>
        <h3>Kuis Genre</h3>
        <p>6 pertanyaan untuk menemukan profil pembacamu dan rekomendasi personal.</p>
      </a>
      <a href="{{ route('challenge') }}" class="feat">
        <div class="feat-icon-wrap" style="background:linear-gradient(135deg,#92400e,#c8781a)">🏆</div>
        <h3>Reading Challenge</h3>
        <p>Target baca tahunan, grafik bulanan, dan badge pencapaian.</p>
      </a>
      <a href="{{ route('statistik') }}" class="feat">
        <div class="feat-icon-wrap" style="background:linear-gradient(135deg,#7f1d1d,#dc2626)">📊</div>
        <h3>Statistik</h3>
        <p>Visualisasi aktivitas, peta kemiripan wishlist, dan profil pembacamu.</p>
      </a>
    </div>
  </div>
</section>

{{-- ── RANDOM PICK ── --}}
<section class="random-section">
  <div class="container">
    <div class="random-wrap">
      <div class="random-text">
        <h2>Tidak Tahu Mau Baca Apa?</h2>
        <p>Biarkan sistem memilihkan buku untukmu secara acak — atau gunakan Chat AI untuk rekomendasi berbasis perasaan.</p>
        <div class="random-actions">
          <button class="btn-random" id="randomBtn">🎲 Pilihkan Buku</button>
          <a href="{{ route('chatai') }}" class="btn-chat">🤖 Chat AI</a>
        </div>
      </div>
      <div id="randomResult"></div>
    </div>
  </div>
</section>

{{-- ── FOOTER ── --}}
<footer class="site-footer">
  <div class="container">
    <div class="footer-inner">
      <div class="footer-brand">
        <div class="footer-logo">
          <span style="color:var(--amber);font-family:'Lora',serif;font-size:1.4rem;font-weight:700">Book</span><span style="font-family:'Lora',serif;font-size:1.4rem;font-weight:700">Match</span>
        </div>
        <p>Sistem rekomendasi buku berbasis perasaan pengguna menggunakan Content-Based Filtering dan RAG.</p>
      </div>
      <div class="footer-nav">
        <div class="footer-col">
          <div class="footer-col-title">Halaman</div>
          <a href="{{ route('home') }}">Beranda</a>
          <a href="{{ route('catalog') }}">Katalog</a>
          <a href="{{ route('quiz') }}">Kuis Genre</a>
        </div>
        <div class="footer-col">
          <div class="footer-col-title">Fitur</div>
          <a href="{{ route('challenge') }}">Reading Challenge</a>
          <a href="{{ route('statistik') }}">Statistik</a>
          <a href="{{ route('chatai') }}">Chat AI</a>
        </div>
      </div>
    </div>
    <div class="footer-bottom">
      <p>© 2026 BookMatch · Content-Based Filtering + Retrieval-Augmented Generation</p>
    </div>
  </div>
</footer>

@endsection

@section('page-js')
<script>
  window.ROUTES = {
    catalog:   "{{ route('catalog') }}",
    quiz:      "{{ route('quiz') }}",
    challenge: "{{ route('challenge') }}",
    statistik: "{{ route('statistik') }}",
    chatai:    "{{ route('chatai') }}",
  };
</script>
<script src="{{ asset('assets/js/pages/home/home.js') }}"></script>
@endsection
