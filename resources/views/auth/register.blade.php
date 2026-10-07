@extends('layouts.auth')
@section('title', 'Daftar')

@section('content')
<h2 class="auth-title">Buat Akun BookMatch</h2>
<p class="auth-sub">Sudah punya akun? <a href="{{ route('login') }}">Masuk di sini</a></p>

@if($errors->any())
  <div class="auth-error">{{ $errors->first() }}</div>
@endif

<form method="POST" action="{{ route('register') }}" class="auth-form">
  @csrf
  <div class="form-group">
    <label>Nama Lengkap</label>
    <input type="text" name="name" value="{{ old('name') }}"
           placeholder="Nama kamu" required autofocus/>
  </div>
  <div class="form-group">
    <label>Email</label>
    <input type="email" name="email" value="{{ old('email') }}"
           placeholder="email@kamu.com" required/>
  </div>
  <div class="form-group">
    <label>Password</label>
    <input type="password" name="password" placeholder="Min. 6 karakter" required/>
  </div>
  <div class="form-group">
    <label>Konfirmasi Password</label>
    <input type="password" name="password_confirmation" placeholder="Ulangi password" required/>
  </div>
  <button type="submit" class="auth-btn">Daftar Sekarang</button>
</form>
@endsection
