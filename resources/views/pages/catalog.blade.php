{{-- resources/views/pages/catalog.blade.php --}}
@extends('layouts.app')
@section('title', 'Katalog')
@section('page-css')
  <link rel="stylesheet" href="{{ asset('assets/css/catalog.css?v=2') }}"/>
@endsection

@section('content')

{{-- TOMBOL TOGGLE SIDEBAR (di luar cat-layout) --}}
<button class="sidebar-toggle-btn" id="sidebarToggleBtn">
  <span id="toggleBtnIcon">◀</span>
  <span id="toggleBtnText">Filter</span>
</button>

<div class="cat-layout" id="catLayout">

  {{-- SIDEBAR --}}
  <aside class="cat-sidebar" id="catSidebar">
    <div class="sidebar-inner">
      <div class="sb-header">
        <span class="sb-title">🔽 Filter & Urutkan</span>
      </div>

      <div class="fgroup">
        <div class="flabel">Genre</div>
        <button class="ftag active" data-g="">Semua</button>
        <button class="ftag" data-g="fantasy">✨ Fantasy</button>
        <button class="ftag" data-g="sci-fi">🚀 Sci-Fi</button>
        <button class="ftag" data-g="mystery">🔍 Misteri</button>
        <button class="ftag" data-g="dystopia">😱 Dystopia</button>
        <button class="ftag" data-g="romance">💕 Romansa</button>
        <button class="ftag" data-g="self-help">💡 Self-Help</button>
        <button class="ftag" data-g="indonesia">🇮🇩 Indonesia</button>
        <button class="ftag" data-g="non-fiction">📊 Non-Fiksi</button>
      </div>

      <div class="fgroup">
        <div class="flabel">Rating Minimum</div>
        <div class="range-row">
          <input type="range" id="rFilter" min="4" max="5" step="0.1" value="4"/>
          <span id="rFilterVal">4.0+</span>
        </div>
      </div>

      <div class="fgroup">
        <div class="flabel">Era Terbit</div>
        <button class="ftag active" data-era="">Semua Era</button>
        <button class="ftag" data-era="classic">Klasik (sebelum 2000)</button>
        <button class="ftag" data-era="modern">Modern (2000+)</button>
      </div>

      <div class="fgroup">
        <div class="flabel">Urutkan</div>
        <select id="sortSel">
          <option value="">Default</option>
          <option value="rd">Rating Tertinggi</option>
          <option value="ra">Rating Terendah</option>
          <option value="yd">Terbaru</option>
          <option value="ya">Terlama</option>
          <option value="az">Judul A–Z</option>
        </select>
      </div>

      <div class="fgroup">
        <div class="flabel">Tampilan</div>
        <div class="view-row">
          <button class="vt active" id="gBtn">⊞ Grid</button>
          <button class="vt" id="lBtn">☰ List</button>
        </div>
      </div>

      <div class="fgroup">
        <div class="flabel">❤️ Wishlist (<span id="wishCount">0</span>)</div>
        <div id="wishMini"></div>
        <button class="mini-clear" id="clWish" style="display:none">Hapus Semua</button>
      </div>

      <div class="fgroup">
        <div class="flabel">⚖️ Bandingkan (<span id="compCount">0</span>)</div>
        <div id="compMini"></div>
        <div id="compActions" style="display:none">
          <button class="comp-go" id="compGo">Lihat Perbandingan</button>
          <button class="mini-clear" id="clComp">Hapus</button>
        </div>
      </div>
    </div>
  </aside>

  {{-- MAIN CONTENT --}}
  <main class="cat-main" id="catMain">
    <div class="cat-topbar">
      <div class="cat-search-wrap">
        <span>⌕</span>
        <input id="catSearch" placeholder="Cari judul, penulis, genre..."/>
        <button id="catSearchBtn">Cari</button>
      </div>
      <span class="res-info" id="catInfo"></span>
    </div>

    <div id="catSearchResult" style="display:none">
      <div class="search-result-header">
        <h2>🔍 Hasil: "<span id="catSearchLabel"></span>"</h2>
        <button class="close-search-btn" id="closeCatSearch">✕ Tutup</button>
      </div>
      <div id="catSearchBody"></div>
    </div>

    <div class="rec-panel" id="recPanel" style="display:none">
      <div class="rp-head">
        <div class="rp-head-left">
          <span style="font-size:1.2rem">✨</span>
          <div>
            <div class="rp-title" id="recPanelLabel">Rekomendasi Serupa</div>
            <div class="rp-sub" id="recPanelSub"></div>
          </div>
        </div>
        <button class="close-search-btn" id="closeRec">✕ Tutup</button>
      </div>
      <div class="sim-legend">
        <span class="sl sh">≥70% Sangat Mirip</span>
        <span class="sl sm">≥40% Mirip</span>
        <span class="sl ss">Cukup Mirip</span>
      </div>
      <div class="book-grid" id="recPanelGrid"></div>
    </div>

    <div class="rec-panel" id="compPanel" style="display:none">
      <div class="rp-head">
        <h3>⚖️ Perbandingan Buku</h3>
        <button class="close-search-btn" id="closeComp">✕ Tutup</button>
      </div>
      <div class="comp-tbl-wrap" id="compTblWrap"></div>
    </div>

    <div class="book-grid" id="catGrid"></div>
  </main>
</div>

{{-- OVERLAY untuk mobile --}}
<div class="sidebar-overlay" id="sidebarOverlay"></div>

@endsection

@section('page-js')
  <script src="{{ asset('assets/js/pages/catalog/catalog.js?v=2') }}"></script>
@endsection
