{{-- resources/views/pages/statistik.blade.php --}}
@extends('layouts.app')
@section('title','Statistik')
@section('page-css')
  <link rel="stylesheet" href="{{ asset('assets/css/statistik.css') }}"/>
@endsection

@section('content')
<div class="stat-page">
  <div class="stat-header">
    <h1>📊 Statistik Bacaanmu</h1>
    <p>Insight mendalam tentang aktivitas dan preferensi membacamu</p>
  </div>

  {{-- OVERVIEW CARDS --}}
  <div class="stat-overview" id="statOverview"></div>

  {{-- GENRE & RATING CHART --}}
  <div class="stat-grid">
    <div class="stat-card-big">
      <h3>🎨 Distribusi Genre Favorit</h3>
      <p class="stat-sub">Dari wishlist, rating, dan buku yang sudah dibaca</p>
      <div id="genreChart"></div>
    </div>
    <div class="stat-card-big">
      <h3>⭐ Distribusi Rating Kamu</h3>
      <p class="stat-sub">Rating bintang yang pernah kamu berikan</p>
      <div id="ratingChart"></div>
    </div>
  </div>

  {{-- WISHLIST ANALYSIS --}}
  <div class="stat-sec">
    <h3>❤️ Analisis Wishlist</h3>
    <div id="wishAnalysis"></div>
  </div>

  {{-- BUKU SELESAI DIBACA --}}
  <div class="stat-sec">
    <h3>✅ Buku yang Sudah Kamu Baca</h3>
    <p class="stat-sub">Semua buku yang kamu tandai selesai dibaca — dari Katalog maupun Challenge</p>
    <div class="read-books-grid" id="readBooksSection"></div>
  </div>

  {{-- TOP RATED --}}
  <div class="stat-sec">
    <h3>🏆 Buku Favoritmu (Rating Tertinggi dari Kamu)</h3>
    <div class="book-row" id="topRatedRow"></div>
    <div id="emptyRated" style="display:none">
      <p style="font-size:.82rem;color:var(--ink3)">
        Belum ada rating. <a href="{{ route('catalog') }}" style="color:var(--amber)">Mulai beri bintang →</a>
      </p>
    </div>
  </div>

  {{-- SIMILARITY MAP --}}
  <div class="stat-sec">
    <h3>🕸️ Peta Kemiripan Wishlist</h3>
    <p class="stat-sub">Seberapa mirip buku-buku di wishlistmu satu sama lain</p>
    <div id="simMap"></div>
    <div id="emptySimMap">
      <p style="font-size:.82rem;color:var(--ink3)">
        Tambahkan minimal 3 buku ke wishlist untuk melihat peta kemiripan.
      </p>
    </div>
  </div>

  {{-- PROFIL PEMBACA --}}
  <div class="stat-sec">
    <h3>🧬 Profil Pembaca</h3>
    <div class="profile-grid" id="profileGrid"></div>
  </div>
</div>
@endsection

@section('page-js')
  <script src="{{ asset('assets/js/pages/statistik/statistik.js') }}"></script>
@endsection
