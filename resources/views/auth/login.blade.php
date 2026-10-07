@extends('layouts.auth')
@section('title', 'Login')

@section('content')
<h2 class="auth-title">Masuk ke BookMatch</h2>
<p class="auth-sub">Belum punya akun? <a href="{{ route('register') }}">Daftar sekarang</a></p>

@if($errors->any())
  <div class="auth-error">{{ $errors->first() }}</div>
@endif

<form method="POST" action="{{ route('login') }}" class="auth-form">
  @csrf
  <div class="form-group">
    <label>Email</label>
    <input type="email" name="email" value="{{ old('email') }}"
           placeholder="email@kamu.com" required autofocus/>
  </div>
  <div class="form-group">
    <label>Password</label>
    <input type="password" name="password" placeholder="••••••" required/>
  </div>
  <div class="form-check">
    <input type="checkbox" name="remember" id="remember" {{ old('remember') ? 'checked' : '' }}/>
    <label for="remember">Ingat saya</label>
  </div>
  <button type="submit" class="auth-btn">Masuk</button>
</form>
@endsection
