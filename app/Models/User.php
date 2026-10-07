<?php

namespace App\Models;

// Note: extends Authenticatable (Laravel default User model location is app/Models/User.php)
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    protected $fillable = [
        'name', 'email', 'password',
    ];

    protected $hidden = [
        'password', 'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    // ── RELATIONSHIPS ─────────────────────────────────────────────

    public function wishlists()
    {
        return $this->hasMany(Wishlist::class);
    }

    public function ratings()
    {
        return $this->hasMany(Rating::class);
    }

    public function readingHistories()
    {
        return $this->hasMany(ReadingHistory::class);
    }

    public function compareLists()
    {
        return $this->hasMany(CompareList::class);
    }

    public function readingChallenges()
    {
        return $this->hasMany(ReadingChallenge::class);
    }

    public function readBooks()
    {
        return $this->hasMany(ReadBook::class);
    }

    public function quizResult()
    {
        return $this->hasOne(QuizResult::class)->latestOfMany();
    }

    // ── HELPER: bookIds untuk wishlist/compare (dipakai di view) ──

    public function wishlistBookIds(): array
    {
        return $this->wishlists()->pluck('book_id')->map(fn($id) => (int) $id)->toArray();
    }

    public function compareBookIds(): array
    {
        return $this->compareLists()->pluck('book_id')->map(fn($id) => (int) $id)->toArray();
    }

    public function ratingsMap(): array
    {
        return $this->ratings()->pluck('rating', 'book_id')->toArray();
    }
}
