<?php

use App\Http\Controllers\Api\BookController;
use App\Http\Controllers\Api\ClaudeAiController;
use Illuminate\Support\Facades\Route;

Route::get('/books', [BookController::class, 'index']);
Route::post('/ai/chat', [ClaudeAiController::class, 'chat']);