<?php

namespace App\Services;

use App\Models\Conversation;

class ConversationService
{
    /**
     * List user conversations.
     * @param int $userId
     * @return \Illuminate\Database\Eloquent\Collection
     */

    public function indexUserConversations(int $userId) {
        $conversations = Conversation::whereHas('participants', function ($q) use ($userId) {
            $q->where('user_id', $userId);
        })->with(['participants', 'lastMessage'])->get();

        return $conversations;
    }

    /**
     * Get conversation by id with participants.
     * @param int $conversationId
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getConversationById(int $conversationId) {
        $conversation = Conversation::with(['participants', 'lastMessage'])->findOrFail($conversationId);

        return $conversation;
    }

    /**
     * Find or create a direct conversation between two users.
     *
     * @param int $user1Id
     * @param int $user2Id
     * @return Conversation
     */
    public function findOrCreateDirect(int $user1Id, int $user2Id): Conversation
    {
        $conversation = Conversation::where('type', 'direct')
            ->whereHas('participants', function ($q) use ($user1Id) {
                $q->where('user_id', $user1Id);
            })
            ->whereHas('participants', function ($q) use ($user2Id) {
                $q->where('user_id', $user2Id);
            })
            ->first();

        if (!$conversation) {
            $conversation = Conversation::create(['type' => 'direct']);
            $conversation->participants()->attach([
                $user1Id => ['role' => 'member'],
                $user2Id => ['role' => 'member'],
            ]);
        }

        return $conversation;
    }
}
