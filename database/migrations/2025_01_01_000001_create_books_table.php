<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('books', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('author');
            $table->unsignedSmallInteger('year');
            $table->decimal('rating', 3, 2)->default(0);
            $table->string('cover', 16);   // emoji
            $table->string('color', 9);    // hex color
            $table->text('description');
            $table->json('features');      // array genre/fitur untuk CBF
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('books');
    }
};
