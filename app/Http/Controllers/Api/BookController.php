<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Book;
use Illuminate\Http\JsonResponse;

class BookController extends Controller
{
    public function index(): JsonResponse
    {
        $books = Book::orderBy('id')
            ->get()
            ->map(fn($b) => $b->toFrontendArray());

        return response()->json($books);
    }
}