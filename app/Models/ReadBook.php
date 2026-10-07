<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ReadBook extends Model
{
    protected $fillable = [
        'user_id', 'book_id', 'custom_title', 'custom_author', 'finished_at', 'month',
    ];

    protected $casts = [
        'finished_at' => 'date',
    ];

    public function user() { return $this->belongsTo(User::class); }
    public function book() { return $this->belongsTo(Book::class); }

    /**
     * Format untuk frontend (sesuai struktur readlist lama di localStorage)
     */
    public function toFrontendArray(): array
    {
        $book = $this->book;
        return [
            'recordId' => $this->id,
            'id'     => $this->book_id,
            'title'  => $book?->title ?? $this->custom_title,
            'author' => $book?->author ?? $this->custom_author,
            'cover'  => $book?->cover ?? '📖',
            'color'  => $book?->color ?? '#888888',
            'date'   => $this->finished_at?->format('Y-m-d'),
            'month'  => $this->month,
        ];
    }
}
