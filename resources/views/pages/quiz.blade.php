{{-- resources/views/pages/quiz.blade.php --}}
@extends('layouts.app')
@section('title','Kuis Genre')
@section('page-css')<link rel="stylesheet" href="{{ asset('assets/css/quiz.css') }}"/>@endsection
@section('content')
<div class="quiz-page">
  <div class="quiz-intro" id="quizIntro">
    <div class="qi-icon">🎯</div>
    <h1>Kuis Genre Bacaan</h1>
    <p>Jawab 6 pertanyaan singkat untuk menemukan genre dan buku yang paling cocok dengan kepribadian membacamu!</p>
    <div class="qi-meta"><span>⏱️ ~2 menit</span><span>❓ 6 pertanyaan</span><span>📚 Rekomendasi personal</span></div>
    <button class="quiz-start-btn" id="startQuiz">Mulai Kuis!</button>
  </div>
  <div class="quiz-main" id="quizMain" style="display:none">
    <div class="quiz-prog-bar"><div class="quiz-prog-fill" id="quizFill"></div></div>
    <div class="quiz-prog-label" id="quizProgLabel">Pertanyaan 1 dari 6</div>
    <div class="quiz-card" id="quizCard">
      <div class="quiz-q" id="quizQ"></div>
      <div class="quiz-opts" id="quizOpts"></div>
    </div>
    <button class="quiz-back-btn" id="quizBack" style="display:none">← Sebelumnya</button>
  </div>
  <div class="quiz-result" id="quizResult" style="display:none">
    <div class="qr-badge" id="qrBadge"></div>
    <h2 id="qrTitle"></h2>
    <p id="qrDesc"></p>
    <div class="qr-tags" id="qrTags"></div>
    <h3 style="font-family:'Lora',serif;margin:28px 0 14px">📚 Rekomendasi Khusus Untukmu</h3>
    <div class="book-grid" id="qrGrid"></div>
    <div class="qr-actions">
      <button class="quiz-start-btn" id="retakeQuiz">🔄 Ulangi Kuis</button>
      <a href="{{ route('catalog') }}" class="qr-cat-link">Jelajahi Katalog →</a>
    </div>
  </div>
</div>
@endsection
@section('page-js')<script src="{{ asset('assets/js/pages/quiz/quiz.js') }}"></script>@endsection
