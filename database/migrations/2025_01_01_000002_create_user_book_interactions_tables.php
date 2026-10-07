<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // ── WISHLIST ─────────────────────────────────────────────
        Schema::create('wishlists', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('book_id')->constrained()->onDelete('cascade');
            $table->timestamps();
            $table->unique(['user_id', 'book_id']);
        });

        // ── RATINGS ──────────────────────────────────────────────
        Schema::create('ratings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('book_id')->constrained()->onDelete('cascade');
            $table->unsignedTinyInteger('rating'); // 1-5
            $table->timestamps();
            $table->unique(['user_id', 'book_id']);
        });

        // ── READING HISTORY (buku yang pernah dilihat) ────────────
        Schema::create('reading_histories', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('book_id')->constrained()->onDelete('cascade');
            $table->timestamp('viewed_at')->useCurrent();
            $table->unique(['user_id', 'book_id']);
        });

        // ── COMPARE LIST (sementara, max 4 buku) ──────────────────
        Schema::create('compare_lists', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('book_id')->constrained()->onDelete('cascade');
            $table->timestamps();
            $table->unique(['user_id', 'book_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('compare_lists');
        Schema::dropIfExists('reading_histories');
        Schema::dropIfExists('ratings');
        Schema::dropIfExists('wishlists');
    }
};
