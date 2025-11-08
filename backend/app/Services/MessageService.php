<?php

namespace App\Services;

use App\Models\Message;

class MessageService
{
    /**
     * Create a new message in the conversation.
     *
     * @param int $conversationId
     * @param int $senderId
     * @param int $body
     * @return Message
     */
    public function create(int $conversationId, int $senderId, string $body): Message
    {
        return Message::create([
            'conversation_id' => $conversationId,
            'sender_id' => $senderId,
            'body' => $body,
        ]);
    }
}
