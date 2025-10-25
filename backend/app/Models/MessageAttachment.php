<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MessageAttachment extends Model
{
    /** @use HasFactory<\Database\Factories\MessageAttachmentFactory> */
    use HasFactory;

    protected $fillable = [
        'message_id',
        'kind',
        'url',
        'mime',
        'size_bytes',
    ];

    /**
     * Get the message.
     */
    public function message()
    {
        return $this->belongsTo(Message::class);
    }
}
