<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
  <title>BookMatch — @yield('title')</title>
  <link rel="stylesheet" href="{{ asset('assets/css/shared.css') }}"/>
  <link rel="stylesheet" href="{{ asset('assets/css/auth.css') }}"/>
</head>
<body class="auth-body">
  <div class="auth-wrap">
    <div class="auth-logo">📚 BookMatch</div>
    <div class="auth-card">
      @yield('content')
    </div>
    <p class="auth-footer">© 2025 BookMatch · Content-Based Filtering + TOPSIS + SAW</p>
  </div>
</body>
</html>
