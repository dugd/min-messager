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

    /**
     * Update the body of a message.
     *
     * @param Message $message
     * @param string $body
     * @return Message
     */
    public function update(Message $message, string $body): Message {
        $message->update([
            'body' => $body,
            'edited_at' => now(),
        ]);
        return $message;
    }

    /**
     * Mark a message as deleted.
     *
     * @param Message $message
     * @return void
     */
    public function delete(Message $message): void {
        $message->update(['deleted_at' => now()]);
    }
}
