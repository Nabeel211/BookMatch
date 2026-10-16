<?php

use App\Http\Controllers\Api\BookController;
use App\Http\Controllers\Api\AiController;
use Illuminate\Support\Facades\Route;

Route::get('/books', [BookController::class, 'index']);
Route::post('/ai/chat', [AiController::class, 'chat']);