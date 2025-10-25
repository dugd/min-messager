<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Post extends Model
{
    /** @use HasFactory<\Database\Factories\PostFactory> */
    use HasFactory;

    protected $fillable = [
        'author_id',
        'body',
        'deleted_at',
    ];

    protected function casts(): array
    {
        return [
            'deleted_at' => 'datetime',
        ];
    }

    /**
     * Get the author.
     */
    public function author()
    {
        return $this->belongsTo(User::class, 'author_id');
    }

    /**
     * Get attachments.
     */
    public function attachments()
    {
        return $this->hasMany(PostAttachment::class);
    }

    /**
     * Get likes.
     */
    public function likes()
    {
        return $this->hasMany(PostLike::class);
    }

    /**
     * Get comments.
     */
    public function comments()
    {
        return $this->hasMany(PostComment::class);
    }
}
