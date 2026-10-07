<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Book;
use App\Models\CompareList;
use App\Models\QuizResult;
use App\Models\ReadBook;
use App\Models\ReadingChallenge;
use App\Models\ReadingHistory;
use App\Models\Wishlist;
use App\Models\Rating;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class UserStateController extends Controller
{
    /**
     * Ambil user dari session web (bukan token API).
     * Mengembalikan null jika belum login.
     */
    private function getUser()
    {
        return Auth::guard('web')->user();
    }

    /**
     * Respons state kosong untuk user yang belum login.
     */
    private function emptyState(): JsonResponse
    {
        return response()->json([
            'wish'       => [],
            'ratings'    => [],
            'history'    => [],
            'compare'    => [],
            'challenge'  => null,
            'readBooks'  => [],
            'quizResult' => null,
        ]);
    }

    // ── GET /api/state ───────────────────────────────────────────
    public function index(): JsonResponse
    {
        $user = $this->getUser();
        if (!$user) return $this->emptyState();

        $challenge = ReadingChallenge::where('user_id', $user->id)
            ->where('year', now()->year)
            ->first();

        $readBooks = ReadBook::where('user_id', $user->id)
            ->with('book')
            ->orderBy('finished_at')
            ->get()
            ->map(fn($r) => $r->toFrontendArray());

        $quiz = QuizResult::where('user_id', $user->id)->latest()->first();

        return response()->json([
            'wish'       => $user->wishlistBookIds(),
            'ratings'    => $user->ratingsMap(),
            'history'    => $user->readingHistories()->orderByDesc('viewed_at')->pluck('book_id'),
            'compare'    => $user->compareBookIds(),
            'challenge'  => $challenge ? ['target' => $challenge->target, 'year' => $challenge->year] : null,
            'readBooks'  => $readBooks,
            'quizResult' => $quiz ? ['genre' => $quiz->genre, 'profile' => $quiz->profile_label, 'date' => $quiz->created_at->format('Y-m-d')] : null,
        ]);
    }

    // ── WISHLIST ─────────────────────────────────────────────────

    public function toggleWishlist(Request $request): JsonResponse
    {
        $user = $this->getUser();
        if (!$user) return response()->json(['error' => 'Unauthenticated'], 401);

        $data = $request->validate(['book_id' => 'required|exists:books,id']);

        $existing = Wishlist::where('user_id', $user->id)->where('book_id', $data['book_id'])->first();
        if ($existing) {
            $existing->delete();
            $added = false;
        } else {
            Wishlist::create(['user_id' => $user->id, 'book_id' => $data['book_id']]);
            $added = true;
        }

        return response()->json(['added' => $added, 'wish' => $user->wishlistBookIds()]);
    }

    public function clearWishlist(): JsonResponse
    {
        $user = $this->getUser();
        if (!$user) return response()->json(['error' => 'Unauthenticated'], 401);

        $user->wishlists()->delete();
        return response()->json(['wish' => []]);
    }

    // ── RATING ───────────────────────────────────────────────────

    public function setRating(Request $request): JsonResponse
    {
        $user = $this->getUser();
        if (!$user) return response()->json(['error' => 'Unauthenticated'], 401);

        $data = $request->validate([
            'book_id' => 'required|exists:books,id',
            'rating'  => 'required|integer|min:1|max:5',
        ]);

        Rating::updateOrCreate(
            ['user_id' => $user->id, 'book_id' => $data['book_id']],
            ['rating' => $data['rating']]
        );

        return response()->json(['ratings' => $user->ratingsMap()]);
    }

    // ── HISTORY ──────────────────────────────────────────────────

    public function addHistory(Request $request): JsonResponse
    {
        $user = $this->getUser();
        if (!$user) return response()->json(['ok' => false]);

        $data = $request->validate(['book_id' => 'required|exists:books,id']);

        ReadingHistory::updateOrCreate(
            ['user_id' => $user->id, 'book_id' => $data['book_id']],
            ['viewed_at' => now()]
        );

        $ids = $user->readingHistories()->orderByDesc('viewed_at')->pluck('id');
        if ($ids->count() > 30) {
            ReadingHistory::whereIn('id', $ids->slice(30))->delete();
        }

        return response()->json(['ok' => true]);
    }

    public function clearHistory(): JsonResponse
    {
        $user = $this->getUser();
        if (!$user) return response()->json(['error' => 'Unauthenticated'], 401);

        $user->readingHistories()->delete();
        return response()->json(['history' => []]);
    }

    // ── COMPARE ──────────────────────────────────────────────────

    public function toggleCompare(Request $request): JsonResponse
    {
        $user = $this->getUser();
        if (!$user) return response()->json(['error' => 'Unauthenticated'], 401);

        $data = $request->validate(['book_id' => 'required|exists:books,id']);

        $existing = CompareList::where('user_id', $user->id)->where('book_id', $data['book_id'])->first();
        if ($existing) {
            $existing->delete();
        } else {
            if ($user->compareLists()->count() >= 4) {
                return response()->json(['error' => 'max_reached', 'compare' => $user->compareBookIds()], 422);
            }
            CompareList::create(['user_id' => $user->id, 'book_id' => $data['book_id']]);
        }

        return response()->json(['compare' => $user->compareBookIds()]);
    }

    public function clearCompare(): JsonResponse
    {
        $user = $this->getUser();
        if (!$user) return response()->json(['error' => 'Unauthenticated'], 401);

        $user->compareLists()->delete();
        return response()->json(['compare' => []]);
    }

    // ── CHALLENGE ────────────────────────────────────────────────

    public function setChallenge(Request $request): JsonResponse
    {
        $user = $this->getUser();
        if (!$user) return response()->json(['error' => 'Unauthenticated'], 401);

        $data = $request->validate(['target' => 'required|integer|min:1|max:365']);

        $challenge = ReadingChallenge::updateOrCreate(
            ['user_id' => $user->id, 'year' => now()->year],
            ['target' => $data['target']]
        );

        return response()->json(['challenge' => ['target' => $challenge->target, 'year' => $challenge->year]]);
    }

    public function resetChallenge(): JsonResponse
    {
        $user = $this->getUser();
        if (!$user) return response()->json(['error' => 'Unauthenticated'], 401);

        $user->readingChallenges()->where('year', now()->year)->delete();
        $user->readBooks()->delete();
        return response()->json(['ok' => true]);
    }

    // ── READ BOOKS ───────────────────────────────────────────────

    public function addReadBook(Request $request): JsonResponse
    {
        $user = $this->getUser();
        if (!$user) return response()->json(['error' => 'Unauthenticated'], 401);

        $data = $request->validate([
            'book_id'       => 'nullable|exists:books,id',
            'custom_title'  => 'nullable|string|max:255',
            'custom_author' => 'nullable|string|max:255',
        ]);

        if (empty($data['book_id']) && empty($data['custom_title'])) {
            return response()->json(['error' => 'title_required'], 422);
        }

        if (!empty($data['book_id'])) {
            $exists = ReadBook::where('user_id', $user->id)->where('book_id', $data['book_id'])->first();
            if ($exists) return response()->json(['error' => 'already_added'], 422);
        }

        $readBook = ReadBook::create([
            'user_id'       => $user->id,
            'book_id'       => $data['book_id'] ?? null,
            'custom_title'  => $data['custom_title'] ?? null,
            'custom_author' => $data['custom_author'] ?? null,
            'finished_at'   => now()->toDateString(),
            'month'         => now()->month - 1,
        ]);

        $readBook->load('book');
        return response()->json([
            'readBook' => array_merge(
                $readBook->toFrontendArray(),
                ['recordId' => $readBook->id]  // ← tambahkan ini
            )
        ]);
    }

    public function removeReadBook(int $id): JsonResponse
    {
        $user = $this->getUser();
        if (!$user) return response()->json(['error' => 'Unauthenticated'], 401);

        ReadBook::where('user_id', $user->id)->where('id', $id)->delete();
        return response()->json(['ok' => true]);
    }

    // ── QUIZ RESULT ──────────────────────────────────────────────

    public function saveQuizResult(Request $request): JsonResponse
    {
        $user = $this->getUser();
        if (!$user) return response()->json(['error' => 'Unauthenticated'], 401);

        $data = $request->validate([
            'genre'   => 'required|string|max:50',
            'profile' => 'required|string|max:100',
        ]);

        $result = QuizResult::create([
            'user_id'       => $user->id,
            'genre'         => $data['genre'],
            'profile_label' => $data['profile'],
        ]);

        return response()->json([
            'quizResult' => [
                'genre'   => $result->genre,
                'profile' => $result->profile_label,
                'date'    => $result->created_at->format('Y-m-d'),
            ]
        ]);
    }
}