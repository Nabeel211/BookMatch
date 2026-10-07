<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Book;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Http;

class ClaudeAiController extends Controller
{
    public function chat(Request $request): JsonResponse
    {
        $request->validate([
            'message' => 'required|string|max:1000',
            'history' => 'nullable|array|max:20',
        ]);

        $userMessage = $request->message;

        try {
            // ── SELECTIVE RAG ─────────────────────────────────────────
            // Ambil hanya buku yang relevan dengan pesan user
            // daripada kirim semua 200 buku
            $relevantBooks = $this->selectRelevantBooks($userMessage);

            $bookCatalogJson = json_encode($relevantBooks, JSON_UNESCAPED_UNICODE);

            $systemPrompt = <<<PROMPT
Kamu adalah BookMatch AI, kurator buku yang empatik.
Rekomendasikan buku dari katalog berdasarkan PERASAAN atau SITUASI pengguna.

ATURAN:
- Pilih 2-4 buku yang paling cocok secara emosional
- Jelaskan mengapa setiap buku cocok dengan perasaan mereka
- Gunakan bahasa hangat dan personal dalam bahasa Indonesia
- Mulai dengan mengakui perasaan pengguna
- Di akhir respons WAJIB tulis tepat seperti ini di baris baru:
{"recommended_ids": [1, 3, 19]}

KATALOG BUKU YANG TERSEDIA (sudah difilter relevan):
$bookCatalogJson
PROMPT;

            // Bangun messages
            $messages = [
                ['role' => 'system', 'content' => $systemPrompt]
            ];

            foreach (($request->history ?? []) as $msg) {
                if (isset($msg['role'], $msg['content'])) {
                    $messages[] = [
                        'role'    => $msg['role'],
                        'content' => $msg['content'],
                    ];
                }
            }
            $messages[] = ['role' => 'user', 'content' => $userMessage];

            $apiKey = config('services.groq.key');

            if (!$apiKey) {
                return response()->json([
                    'error' => 'API key Groq belum dikonfigurasi. Tambahkan GROQ_API_KEY di file .env'
                ], 500);
            }

            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $apiKey,
                'Content-Type'  => 'application/json',
            ])->timeout(60)->post('https://api.groq.com/openai/v1/chat/completions', [
                'model'            => 'qwen/qwen3.8-27b',
                'max_tokens'       => 800,
                'temperature'      => 0.7,
                'messages'         => $messages,
                'reasoning_format' => 'hidden', // sembunyikan proses thinking dari respons
                'reasoning_effort'  => 'none',
            ]);

            if ($response->failed()) {
                \Log::error('Groq API error', [
                    'status' => $response->status(),
                    'body'   => $response->body(),
                ]);
                return response()->json([
                    'error' => 'Gagal menghubungi AI: ' . $response->status()
                ], 502);
            }

            $data   = $response->json();
            $aiText = $data['choices'][0]['message']['content'] ?? '';

            if (empty($aiText)) {
                return response()->json(['error' => 'AI tidak memberikan respons.'], 500);
            }

            // ── Bersihkan thinking mode jika masih muncul ──────────────
            // Menangani 2 kemungkinan format:
            // (a) <think>...</think> lengkap, atau
            // (b) hanya ada </think> tanpa tag pembuka (khas Qwen3.5+ di Groq)
            if (str_contains($aiText, '</think>')) {
                $parts  = explode('</think>', $aiText);
                $aiText = trim(end($parts));
            } else {
                $aiText = preg_replace('/<think>[\s\S]*?<\/think>/i', '', $aiText);
            }
            $aiText = trim($aiText);

            // Ekstrak recommended_ids
            $recommendedIds = [];
            $patterns = [
                '/\{\s*"recommended_ids"\s*:\s*\[([^\]]*)\]\s*\}/s',
                '/\{\s*\'recommended_ids\'\s*:\s*\[([^\]]*)\]\s*\}/s',
                '/recommended_ids\s*[":]+\s*\[([^\]]+)\]/s',
            ];

            foreach ($patterns as $pattern) {
                if (preg_match($pattern, $aiText, $matches)) {
                    $ids = array_values(array_filter(
                        array_map('intval',
                            array_map('trim',
                                preg_split('/[\s,]+/', trim($matches[1]))
                            )
                        ),
                        fn($v) => $v > 0
                    ));
                    if (!empty($ids)) {
                        $recommendedIds = $ids;
                        break;
                    }
                }
            }

            // Bersihkan teks dari JSON
            $cleanText = preg_replace('/```json[\s\S]*?```/i', '', $aiText);
            $cleanText = preg_replace('/\{\s*["\']?recommended_ids["\']?\s*:\s*\[[^\]]*\]\s*\}/s', '', $cleanText);
            $cleanText = trim($cleanText);

            // Ambil detail buku yang direkomendasikan
            $recommendedBooks = [];
            if (!empty($recommendedIds)) {
                $recommendedBooks = Book::whereIn('id', $recommendedIds)
                    ->get()
                    ->map(fn($b) => $b->toFrontendArray())
                    ->toArray();
            }

            return response()->json([
                'reply'             => $cleanText,
                'recommended_ids'   => $recommendedIds,
                'recommended_books' => $recommendedBooks,
            ]);

        } catch (\Throwable $e) {
            \Log::error('Groq API exception', [
                'message' => $e->getMessage(),
                'file'    => $e->getFile(),
                'line'    => $e->getLine(),
            ]);
            return response()->json([
                'error' => 'Terjadi kesalahan: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * SELECTIVE RAG — Filter buku relevan berdasarkan pesan user
     * Daripada kirim semua 200 buku, kita pilih maksimal 20 buku
     * yang paling relevan dengan kata kunci dari pesan user
     */
    private function selectRelevantBooks(string $message): array
    {
        // Kata kunci emosi → genre yang relevan
        $emotionKeywords = [
            // Sedih / galau
            'sedih'       => ['inspirational', 'hope', 'friendship', 'drama'],
            'galau'       => ['romance', 'inspirational', 'drama', 'literary'],
            'patah hati'  => ['romance', 'inspirational', 'drama', 'self-help'],
            'kecewa'      => ['inspirational', 'self-help', 'philosophy', 'literary'],
            'menangis'    => ['drama', 'literary', 'inspirational', 'romance'],

            // Stres / cemas
            'stres'       => ['self-help', 'philosophy', 'inspirational', 'comedy'],
            'cemas'       => ['self-help', 'psychology', 'philosophy', 'inspirational'],
            'tertekan'    => ['self-help', 'inspirational', 'philosophy', 'psychology'],
            'burnout'     => ['self-help', 'inspirational', 'comedy', 'adventure'],
            'capek'       => ['comedy', 'adventure', 'fantasy', 'inspirational'],
            'lelah'       => ['inspirational', 'self-help', 'comedy', 'fantasy'],

            // Bosan / jenuh
            'bosan'       => ['adventure', 'fantasy', 'mystery', 'sci-fi', 'thriller'],
            'jenuh'       => ['adventure', 'fantasy', 'mystery', 'comedy'],
            'monoton'     => ['adventure', 'sci-fi', 'fantasy', 'mystery'],

            // Semangat / motivasi
            'semangat'    => ['inspirational', 'self-help', 'adventure', 'non-fiction'],
            'motivasi'    => ['self-help', 'inspirational', 'non-fiction', 'psychology'],
            'produktif'   => ['self-help', 'non-fiction', 'productivity', 'psychology'],
            'berkembang'  => ['self-help', 'non-fiction', 'inspirational', 'education'],

            // Penasaran / ingin tahu
            'penasaran'   => ['mystery', 'thriller', 'sci-fi', 'non-fiction'],
            'ingin tahu'  => ['non-fiction', 'science', 'history', 'mystery'],
            'berpikir'    => ['philosophy', 'non-fiction', 'psychology', 'science'],

            // Petualangan / kabur
            'petualangan' => ['adventure', 'fantasy', 'sci-fi', 'epic'],
            'kabur'       => ['fantasy', 'sci-fi', 'adventure', 'dystopia'],
            'bebas'       => ['adventure', 'inspirational', 'fantasy', 'travel'],

            // Takut / horor
            'takut'       => ['thriller', 'mystery', 'horror', 'suspense'],
            'tegang'      => ['thriller', 'mystery', 'crime', 'suspense'],
            'deg-degan'   => ['thriller', 'mystery', 'adventure', 'suspense'],

            // Bangga / nasionalisme
            'indonesia'   => ['indonesia', 'historical', 'inspirational', 'drama'],
            'bangga'      => ['indonesia', 'inspirational', 'historical', 'drama'],
            'nusantara'   => ['indonesia', 'historical', 'literary', 'drama'],

            // Kesepian
            'kesepian'    => ['friendship', 'romance', 'inspirational', 'literary'],
            'sendiri'     => ['friendship', 'self-help', 'inspirational', 'philosophy'],
            'sepi'        => ['romance', 'friendship', 'literary', 'inspirational'],

            // Bahagia
            'bahagia'     => ['comedy', 'romance', 'inspirational', 'adventure'],
            'senang'      => ['comedy', 'adventure', 'romance', 'fantasy'],
            'gembira'     => ['comedy', 'adventure', 'fantasy', 'inspirational'],
        ];

        $messageLower   = mb_strtolower($message);
        $matchedGenres  = [];

        // Cari genre yang relevan berdasarkan kata kunci emosi
        foreach ($emotionKeywords as $keyword => $genres) {
            if (str_contains($messageLower, $keyword)) {
                $matchedGenres = array_merge($matchedGenres, $genres);
            }
        }

        // Hapus duplikat dan ambil genre unik
        $matchedGenres = array_unique($matchedGenres);

        if (!empty($matchedGenres)) {
            // Ambil buku yang memiliki genre yang cocok
            // Prioritaskan buku dengan lebih banyak genre yang cocok
            $books = Book::all()->map(function ($book) use ($matchedGenres) {
                $features     = $book->features ?? [];
                $matchCount   = count(array_intersect($features, $matchedGenres));
                return [
                    'book'       => $book,
                    'matchCount' => $matchCount,
                ];
            })
            ->filter(fn($item) => $item['matchCount'] > 0)
            ->sortByDesc('matchCount')
            ->take(20) // Ambil maksimal 20 buku paling relevan
            ->map(fn($item) => [
                'id'       => $item['book']->id,
                'title'    => $item['book']->title,
                'author'   => $item['book']->author,
                'features' => $item['book']->features,
            ])
            ->values()
            ->toArray();

            // Kalau buku yang cocok kurang dari 10, tambah buku rating tertinggi
            if (count($books) < 10) {
                $existingIds  = array_column($books, 'id');
                $topBooks     = Book::whereNotIn('id', $existingIds)
                    ->orderByDesc('rating')
                    ->take(10 - count($books))
                    ->get()
                    ->map(fn($b) => [
                        'id'       => $b->id,
                        'title'    => $b->title,
                        'author'   => $b->author,
                        'features' => $b->features,
                    ])
                    ->toArray();
                $books = array_merge($books, $topBooks);
            }

            return $books;
        }

        // Kalau tidak ada kata kunci emosi yang cocok
        // kirim 20 buku dengan rating tertinggi sebagai fallback
        return Book::orderByDesc('rating')
            ->take(20)
            ->get()
            ->map(fn($b) => [
                'id'       => $b->id,
                'title'    => $b->title,
                'author'   => $b->author,
                'features' => $b->features,
            ])
            ->toArray();
    }
}