<?php

use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\PageController;
use App\Http\Controllers\Api\UserStateController;
use Illuminate\Support\Facades\Route;

Route::middleware('guest')->group(function () {
    Route::get('/login',    [AuthController::class, 'showLogin'])->name('login');
    Route::post('/login',   [AuthController::class, 'login']);
    Route::get('/register', [AuthController::class, 'showRegister'])->name('register');
    Route::post('/register',[AuthController::class, 'register']);
});

Route::post('/logout', [AuthController::class, 'logout'])
    ->middleware('auth')->name('logout');

Route::middleware('auth')->group(function () {
    Route::get('/',          [PageController::class, 'home'])->name('home');
    Route::get('/katalog',   [PageController::class, 'catalog'])->name('catalog');
    Route::get('/kuis',      [PageController::class, 'quiz'])->name('quiz');
    Route::get('/challenge', [PageController::class, 'challenge'])->name('challenge');
    Route::get('/statistik', [PageController::class, 'statistik'])->name('statistik');
    Route::get('/chat-ai',   [PageController::class, 'chatAi'])->name('chatai');

    Route::get('/state',             [UserStateController::class, 'index']);
    Route::post('/wishlist/toggle',  [UserStateController::class, 'toggleWishlist']);
    Route::post('/wishlist/clear',   [UserStateController::class, 'clearWishlist']);
    Route::post('/ratings',          [UserStateController::class, 'setRating']);
    Route::post('/history',          [UserStateController::class, 'addHistory']);
    Route::post('/history/clear',    [UserStateController::class, 'clearHistory']);
    Route::post('/compare/toggle',   [UserStateController::class, 'toggleCompare']);
    Route::post('/compare/clear',    [UserStateController::class, 'clearCompare']);
    Route::post('/challenge',        [UserStateController::class, 'setChallenge']);
    Route::post('/challenge/reset',  [UserStateController::class, 'resetChallenge']);
    Route::post('/readbooks',        [UserStateController::class, 'addReadBook']);
    Route::delete('/readbooks/{id}', [UserStateController::class, 'removeReadBook']);
    Route::post('/quiz-result',      [UserStateController::class, 'saveQuizResult']);
});