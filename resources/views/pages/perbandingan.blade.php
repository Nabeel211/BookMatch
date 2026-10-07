@extends('layouts.app')
@section('title','Perbandingan TOPSIS vs SAW')
@section('page-css')<link rel="stylesheet" href="{{ asset('assets/css/perbandingan.css') }}"/>@endsection
@section('content')
<div class="pb-page">
  <div class="pb-header">
    <h1>⚖️ Perbandingan TOPSIS vs SAW</h1>
    <p>Bandingkan hasil rekomendasi menggunakan dua metode multi-kriteria berbeda pada kandidat yang sama</p>
  </div>

  <div class="pb-input-card">
    <h3>🔍 Pilih Buku Referensi</h3>
    <div class="pb-search-row">
      <select id="pbBookSel"></select>
      <button id="pbRunBtn">⚙️ Jalankan Perbandingan</button>
    </div>
    <div class="pb-weights">
      <h4>⚙️ Bobot Kriteria <small style="color:var(--ink3)">(total harus = 1.0)</small></h4>
      <div class="weight-grid" id="weightGrid"></div>
      <div class="weight-total">Total bobot: <span id="weightTotal">1.00</span></div>
    </div>
  </div>

  <div id="pbResults" style="display:none">
    <div class="pb-card">
      <h3>📊 Matriks Keputusan (Nilai Kriteria Setiap Kandidat)</h3>
      <div class="pb-table-wrap" id="decisionMatrix"></div>
    </div>

    <div class="pb-compare-grid">
      <div class="pb-method-card topsis-card">
        <div class="pb-method-header">
          <h3>🔷 Metode TOPSIS</h3>
          <span class="pb-method-badge">Technique for Order of Preference by Similarity to Ideal Solution</span>
        </div>
        <div id="topsisResult"></div>
      </div>
      <div class="pb-method-card saw-card">
        <div class="pb-method-header">
          <h3>🔶 Metode SAW</h3>
          <span class="pb-method-badge">Simple Additive Weighting</span>
        </div>
        <div id="sawResult"></div>
      </div>
    </div>

    <div class="pb-card">
      <h3>📈 Analisis Perbandingan Ranking</h3>
      <div id="analysisResult"></div>
    </div>
  </div>
</div>
@endsection
@section('page-js')<script src="{{ asset('assets/js/pages/perbandingan/perbandingan.js') }}"></script>@endsection
