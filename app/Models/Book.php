<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Book extends Model
{
    protected $fillable = [
        'id', 'title', 'author', 'year', 'rating',
        'cover', 'color', 'description', 'features',
    ];

    protected $casts = [
        'features' => 'array',
        'rating'   => 'float',
    ];

    /**
     * Format buku untuk dikirim ke frontend (sesuai struktur data.js lama).
     * Dipakai di BookController@apiIndex agar JS (cbf.js) tidak perlu berubah.
     */
    public function toFrontendArray(): array
    {
        return [
            'id'       => $this->id,
            'title'    => $this->title,
            'author'   => $this->author,
            'year'     => $this->year,
            'rating'   => (float) $this->rating,
            'cover'    => $this->cover,
            'color'    => $this->color,
            'desc'     => $this->description,
            'features' => $this->features,
        ];
    }

    /**
     * Relasi ke wishlist user-user yang menyimpan buku ini.
     */
    public function wishlists()
    {
        return $this->hasMany(Wishlist::class);
    }

    /**
     * Relasi ke rating-rating yang diberikan untuk buku ini.
     */
    public function ratings()
    {
        return $this->hasMany(Rating::class);
    }

    /**
     * Relasi ke riwayat baca user untuk buku ini.
     */
    public function readingHistories()
    {
        return $this->hasMany(ReadingHistory::class);
    }

    /**
     * Relasi ke daftar perbandingan yang menyertakan buku ini.
     */
    public function compareLists()
    {
        return $this->hasMany(CompareList::class);
    }
}