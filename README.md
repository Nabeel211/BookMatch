# 📦 BookMatch Chat AI — Panduan Instalasi

## File yang Perlu Dicopy ke Project Laravel

```
bookmatch-ai/
├── web.php                    → routes/web.php
├── api.php                    → routes/api.php
├── PageController.php         → app/Http/Controllers/PageController.php
├── ClaudeAiController.php     → app/Http/Controllers/Api/ClaudeAiController.php
├── services.php               → config/services.php
├── app.blade.php              → resources/views/layouts/app.blade.php
├── home.blade.php             → resources/views/pages/home.blade.php
├── chat-ai.blade.php          → resources/views/pages/chat-ai.blade.php
├── chat-ai.css                → public/assets/css/chat-ai.css
├── home-ai-additions.css      → TAMBAHKAN isinya ke public/assets/css/home.css (di paling bawah)
└── chat-ai.js                 → public/assets/js/pages/chat-ai/chat-ai.js
```

## Step-by-Step

### 1. Copy semua file di atas ke lokasi yang sesuai

### 2. Buat folder baru untuk JS halaman Chat AI
```
public/assets/js/pages/chat-ai/
```
Lalu taruh chat-ai.js di dalamnya.

### 3. Tambahkan ANTHROPIC_API_KEY di .env
Buka file .env, tambahkan baris ini di bagian paling bawah:
```
ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxxxxxx
```
Ganti dengan API key milikmu dari https://console.anthropic.com

### 4. Tambahkan CSS AI Promo ke home.css
Buka public/assets/css/home.css, scroll ke paling bawah,
lalu paste seluruh isi file home-ai-additions.css.

### 5. Clear cache Laravel
```bash
php artisan config:clear
php artisan cache:clear
php artisan route:clear
php artisan view:clear
```

### 6. Jalankan server
```bash
php artisan serve
```

### 7. Test
Buka http://localhost:8000/chat-ai
Ketik: "Aku lagi sedih dan butuh buku yang bisa bikin semangat"
AI akan merekomendasikan 2-4 buku yang cocok!

---

## Cara Dapat API Key Anthropic

1. Buka https://console.anthropic.com
2. Login atau daftar akun baru
3. Klik "API Keys" di menu kiri
4. Klik "Create Key"
5. Copy key-nya, paste ke .env

## Troubleshooting

**"API key Anthropic belum dikonfigurasi"**
→ Pastikan ANTHROPIC_API_KEY sudah ada di .env dan sudah run php artisan config:clear

**Chat tidak merespons / loading terus**
→ Cek Console browser (F12), kemungkinan CORS atau network error
→ Pastikan server php artisan serve masih berjalan

**Rekomendasi buku tidak muncul di panel kanan**
→ Pastikan database sudah ada bukunya: php artisan db:seed --class=BookSeeder
