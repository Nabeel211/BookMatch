{{-- resources/views/pages/chat-ai.blade.php --}}
@extends('layouts.app')
@section('title', 'Chat AI — Rekomendasi Buku')
@section('page-css')
<link rel="stylesheet" href="{{ asset('assets/css/chat-ai.css') }}"/>
@endsection

@section('content')
<div class="chat-page">

  {{-- HEADER --}}
  <div class="chat-header">
    <div class="chat-header-icon">🤖</div>
    <div class="chat-header-text">
      <h1>BookMatch <span class="ai-badge">AI</span></h1>
      <p>Ceritakan perasaan atau suasana hatimu — biarkan AI menemukan buku yang tepat untukmu</p>
    </div>
  </div>

  <div class="chat-layout">

    {{-- PANEL KIRI: CHAT --}}
    <div class="chat-panel">
      <div class="chat-messages" id="chatMessages">
        {{-- Pesan sambutan awal --}}
        <div class="msg-row ai-row">
          <div class="msg-avatar">🤖</div>
          <div class="msg-bubble ai-bubble">
            <p>Halo! Aku <strong>BookMatch AI</strong> 👋</p>
            <p style="margin-top:8px">Ceritakan padaku bagaimana perasaanmu hari ini, atau situasi yang sedang kamu hadapi. Aku akan merekomendasikan buku yang paling cocok dengan kondisimu — bukan berdasarkan genre atau judul, tapi berdasarkan apa yang kamu rasakan. 💙</p>
            <p style="margin-top:8px;font-style:italic;color:var(--ink3);font-size:.82rem">Contoh: <em>"Aku lagi stres banget sama kuliah dan butuh sesuatu yang bisa bikin rileks"</em></p>
          </div>
        </div>
      </div>

      {{-- PROMPT SUGGESTIONS --}}
      <div class="chat-suggestions" id="chatSuggestions">
        <div class="sug-label">💡 Coba ceritakan:</div>
        <div class="sug-chips">
          <button class="sug-chip" data-text="Aku lagi sedih dan butuh buku yang bisa bikin semangat lagi">😔 Lagi sedih, butuh semangat</button>
          <button class="sug-chip" data-text="Aku pengen baca sesuatu yang bikin tegang dan penasaran sampai tidak bisa berhenti">😱 Pengen sesuatu yang bikin deg-degan</button>
          <button class="sug-chip" data-text="Aku lagi bosen sama rutinitas dan pengen kabur ke dunia lain lewat buku">✨ Bosen, pengen kabur ke dunia lain</button>
          <button class="sug-chip" data-text="Aku mau produktif dan butuh inspirasi untuk berkembang">💡 Butuh inspirasi berkembang</button>
          <button class="sug-chip" data-text="Aku lagi patah hati dan butuh teman lewat buku">💔 Lagi patah hati</button>
        </div>
      </div>

      {{-- INPUT --}}
      <div class="chat-input-wrap">
        <div class="chat-input-box">
          <textarea
            id="chatInput"
            placeholder="Ceritakan perasaan atau suasana hatimu..."
            rows="1"
            maxlength="1000"
          ></textarea>
          <button id="chatSendBtn" title="Kirim">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </div>
        <div class="chat-input-meta">
          <span id="charCount">0</span>/1000 karakter
          <button class="chat-clear-btn" id="chatClearBtn">🗑️ Reset percakapan</button>
        </div>
      </div>
    </div>

    {{-- PANEL KANAN: REKOMENDASI BUKU --}}
    <div class="rec-panel-ai" id="recPanelAi">
      <div class="rec-panel-header">
        <h3>📚 Rekomendasi Untukmu</h3>
        <p id="recPanelSub">Buku yang cocok akan muncul di sini setelah kamu bercerita</p>
      </div>
      <div class="rec-books-list" id="recBooksList">
        <div class="rec-empty">
          <div class="rec-empty-icon">📖</div>
          <p>Belum ada rekomendasi.<br/>Mulai ceritakan perasaanmu!</p>
        </div>
      </div>
    </div>

  </div>
</div>
@endsection

@section('page-js')
<script src="{{ asset('assets/js/pages/chat-ai/chat-ai.js') }}"></script>
@endsection
