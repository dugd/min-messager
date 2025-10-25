<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MessageStatus extends Model
{
    /** @use HasFactory<\Database\Factories\MessageStatusFactory> */
    use HasFactory;

    public $timestamps = false;

    protected $fillable = [
        'message_id',
        'recipient_id',
        'delivered_at',
        'read_at',
    ];

    protected function casts(): array
    {
        return [
            'delivered_at' => 'datetime',
            'read_at' => 'datetime',
        ];
    }

    /**
     * Get the message.
     */
    public function message()
    {
        return $this->belongsTo(Message::class);
    }

    /**
     * Get the recipient.
     */
    public function recipient()
    {
        return $this->belongsTo(User::class, 'recipient_id');
    }
}
