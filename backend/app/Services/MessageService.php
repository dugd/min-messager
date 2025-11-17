<?php

namespace App\Services;

use App\Models\Conversation;
use App\Models\Message;
use Ramsey\Collection\Collection;

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
        $message = Message::create([
            'conversation_id' => $conversationId,
            'sender_id' => $senderId,
            'body' => $body,
        ]);

        return $message->fresh();
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

    /**
     * Fetch messages for a conversation with optional before_id + limit filters.
     *
     * @param Conversation $conversation
     * @param int|null $beforeId
     * @param int $limit
     */
    public function getMessages(Conversation $conversation, ?int $beforeId = null, int $limit = 50)
    {
        $limit = min($limit, 100);

        $query = $conversation->messages()
            ->orderByDesc('created_at');

        if ($beforeId) {
            $query->where('id', '<', $beforeId);
        }

        return $query->take($limit)->get();
    }
}
