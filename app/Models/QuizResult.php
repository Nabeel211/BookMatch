<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class QuizResult extends Model
{
    protected $fillable = ['user_id', 'genre', 'profile_label'];

    public function user() { return $this->belongsTo(User::class); }
}
