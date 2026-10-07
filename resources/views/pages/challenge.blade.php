@extends('layouts.app')
@section('title','Reading Challenge')
@section('page-css')<link rel="stylesheet" href="{{ asset('assets/css/challenge.css') }}"/>@endsection
@section('content')
<div class="ch-page">
  <div class="ch-header">
    <h1>🏆 Reading Challenge</h1>
    <p>Tetapkan target baca dan pantau perjalananmu. Setiap buku adalah pencapaian!</p>
  </div>

  <div class="ch-setup" id="chSetup">
    <div class="setup-card">
      <div class="setup-icon">🎯</div>
      <h2>Mulai Challenge-mu!</h2>
      <p>Berapa buku yang ingin kamu baca tahun ini?</p>
      <div class="target-picker">
        <button class="tp-btn" data-val="6">6 buku</button>
        <button class="tp-btn" data-val="12">12 buku</button>
        <button class="tp-btn" data-val="24">24 buku</button>
        <button class="tp-btn" data-val="36">36 buku</button>
        <button class="tp-btn" data-val="52">52 buku</button>
      </div>
      <div class="custom-target">
        <span>Atau tentukan sendiri:</span>
        <input type="number" id="customTarget" min="1" max="365" placeholder="Jumlah"/>
        <button id="setCustom">Set!</button>
      </div>
    </div>
  </div>

  <div class="ch-dashboard" id="chDashboard" style="display:none">
    <div class="ch-overview">
      <div class="ch-ring-wrap">
        <svg class="ch-ring" viewBox="0 0 120 120">
          <circle class="ring-bg" cx="60" cy="60" r="50"/>
          <circle class="ring-fill" id="ringFill" cx="60" cy="60" r="50" stroke-dasharray="314" stroke-dashoffset="314"/>
        </svg>
        <div class="ring-center">
          <span id="ringDone">0</span>
          <span class="ring-of">dari <span id="ringTotal">12</span></span>
        </div>
      </div>
      <div class="ch-ov-info">
        <h2 id="chTitle">Challenge 2025</h2>
        <div class="ov-stats">
          <div class="os-item"><span class="os-n" id="ovDone">0</span><span class="os-l">Selesai</span></div>
          <div class="os-item"><span class="os-n" id="ovLeft">0</span><span class="os-l">Tersisa</span></div>
          <div class="os-item"><span class="os-n" id="ovPct">0%</span><span class="os-l">Progress</span></div>
          <div class="os-item"><span class="os-n" id="ovPM">0</span><span class="os-l">per bulan</span></div>
        </div>
        <div class="ch-badges" id="chBadges"></div>
        <div class="ch-actions-top">
          <button class="ch-add-btn" id="openAdd">＋ Tambah Buku</button>
          <button class="btn-danger" id="resetCh">Reset Challenge</button>
        </div>
      </div>
    </div>
    <div class="ch-monthly"><h3>📅 Progress Per Bulan</h3><div class="month-bars" id="monthBars"></div></div>
    <div class="ch-list">
      <div class="ch-list-head"><h3>📚 Buku yang Sudah Dibaca (<span id="readCount">0</span>)</h3></div>
      <div id="readList"></div>
      <div class="empty-read" id="emptyRead"><div>📭</div><p>Belum ada buku. Tambahkan buku pertamamu!</p></div>
    </div>
    <div class="ch-next">
      <h3>💡 Buku Berikutnya yang Direkomendasikan</h3>
      <p class="ch-next-sub">Berdasarkan buku yang sudah kamu baca</p>
      <div class="book-row" id="nextRow"></div>
    </div>
  </div>
</div>

<div class="abm-overlay" id="abmOverlay" style="display:none">
  <div class="abm-card">
    <div class="abm-head"><h3>＋ Tambah Buku Selesai</h3><button class="abm-close" id="closeAdd">✕</button></div>
    <div class="abm-search"><input type="text" id="abmSearch" placeholder="Cari judul buku..."/></div>
    <div class="abm-list" id="abmList"></div>
    <div class="abm-custom">
      <p>Buku tidak ada di katalog?</p>
      <div class="abm-form">
        <input type="text" id="abmTitle" placeholder="Judul buku"/>
        <input type="text" id="abmAuthor" placeholder="Penulis"/>
        <button id="abmAdd">Tambah</button>
      </div>
    </div>
  </div>
</div>
@endsection
@section('page-js')<script src="{{ asset('assets/js/pages/challenge/challenge.js') }}"></script>@endsection
