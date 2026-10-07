<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // ── READING CHALLENGE (target tahunan per user) ───────────
        Schema::create('reading_challenges', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->unsignedSmallInteger('year');
            $table->unsignedSmallInteger('target');
            $table->timestamps();
            $table->unique(['user_id', 'year']);
        });

        // ── BUKU YANG SUDAH DIBACA (untuk challenge) ──────────────
        // book_id nullable agar bisa input manual (buku custom non-katalog)
        Schema::create('read_books', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('book_id')->nullable()->constrained()->onDelete('cascade');
            $table->string('custom_title')->nullable();
            $table->string('custom_author')->nullable();
            $table->date('finished_at');
            $table->unsignedTinyInteger('month'); // 0-11, untuk grafik bulanan
            $table->timestamps();
        });

        // ── QUIZ RESULT (hasil kuis genre terakhir) ───────────────
        Schema::create('quiz_results', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('genre');
            $table->string('profile_label');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('quiz_results');
        Schema::dropIfExists('read_books');
        Schema::dropIfExists('reading_challenges');
    }
};
