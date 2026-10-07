{{-- resources/views/layouts/app.blade.php --}}
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
  <meta name="csrf-token" content="{{ csrf_token() }}"/>
  <title>BookMatch — @yield('title', 'Beranda')</title>
  <link rel="stylesheet" href="{{ asset('assets/css/shared.css') }}"/>
  @yield('page-css')
</head>
<body>
@php
  $navItems = [
    ['route' => 'home',      'icon' => '🏠', 'label' => 'Beranda'],
    ['route' => 'catalog',   'icon' => '📖', 'label' => 'Katalog'],
    ['route' => 'quiz',      'icon' => '🎯', 'label' => 'Kuis Genre'],
    ['route' => 'challenge', 'icon' => '🏆', 'label' => 'Challenge'],
    ['route' => 'statistik', 'icon' => '📊', 'label' => 'Statistik'],
    ['route' => 'chatai',    'icon' => '🤖', 'label' => 'Chat AI'],
    // Tentang dihapus dari navbar
  ];
@endphp

<nav class="navbar">
  <a href="{{ route('home') }}" class="nav-logo">📚 BookMatch</a>
  <div class="nav-links">
    @foreach($navItems as $item)
      <a href="{{ route($item['route']) }}"
         class="nav-link {{ request()->routeIs($item['route']) ? 'active' : '' }}">
        {{ $item['icon'] }} {{ $item['label'] }}
      </a>
    @endforeach
  </div>
  <div class="nav-right">
    <a href="{{ route('catalog') }}" class="nav-wish-btn">
      ❤️ <span class="nav-wish-count">0</span>
    </a>
    <div class="nav-user-menu">
      <button class="nav-user-btn" id="navUserBtn">👤 {{ Auth::user()->name }}</button>
      <div class="nav-user-dropdown" id="navUserDropdown">
        <form method="POST" action="{{ route('logout') }}">
          @csrf
          <button type="submit" class="nav-logout-btn">🚪 Logout</button>
        </form>
      </div>
    </div>
    <button class="nav-mobile-btn" id="navToggle">☰</button>
  </div>
</nav>

<div class="nav-mobile-menu" id="mobileMenu">
  @foreach($navItems as $item)
    <a href="{{ route($item['route']) }}">{{ $item['icon'] }} {{ $item['label'] }}</a>
  @endforeach
  <form method="POST" action="{{ route('logout') }}" style="padding:10px 8px">
    @csrf
    <button type="submit"
      style="background:none;border:none;color:var(--red);font-size:.88rem;cursor:pointer;font-family:'Plus Jakarta Sans',sans-serif">
      🚪 Logout
    </button>
  </form>
</div>

@if(session('success'))
  <div class="flash-message" data-flash="{{ session('success') }}"></div>
@endif

@yield('content')

<div class="modal-overlay" id="modalOverlay">
  <div class="modal">
    <button class="modal-close" id="modalClose">✕</button>
    <div id="modalInner"></div>
  </div>
</div>
<div class="toast" id="toast"></div>

<script>
  window.CSRF_TOKEN = document.querySelector('meta[name="csrf-token"]').content;
  window.AUTH_USER  = @json(['id' => Auth::id(), 'name' => Auth::user()->name]);
</script>
<script src="{{ asset('assets/js/core/data.js') }}"></script>
<script src="{{ asset('assets/js/core/cbf.js') }}"></script>
<script src="{{ asset('assets/js/core/shared.js') }}"></script>
@yield('page-js')
<script>
  document.addEventListener('DOMContentLoaded', () => {
    const flash = document.querySelector('[data-flash]');
    if (flash && typeof showToast === 'function') showToast(flash.dataset.flash, 'success');

    const userBtn  = document.getElementById('navUserBtn');
    const dropdown = document.getElementById('navUserDropdown');
    if (userBtn && dropdown) {
      userBtn.addEventListener('click', () => dropdown.classList.toggle('open'));
      document.addEventListener('click', e => {
        if (!userBtn.contains(e.target) && !dropdown.contains(e.target))
          dropdown.classList.remove('open');
      });
    }
  });
</script>
</body>
</html>
