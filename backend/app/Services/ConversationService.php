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

    /**
     * Create a group conversation.
     *
     * @param int $ownerId Owner user ID
     * @param string $title Group conversation title
     * @param array $participantIds Array of participant user IDs
     * @param ?string $avatar_url Optional group avatar URL
     * @return Conversation
     */
    public function createGroup(int $ownerId, string $title, array $participantIds, ?string $avatar_url = null): Conversation {
        $conversation = Conversation::create([
            'type' => 'group',
            'title' => $title,
            'avatar_url' => $avatar_url,
        ]);

        // Attach owner
        $conversation->participants()->attach($ownerId, ['role' => 'owner']);

        // Attach other participants
        $participantAttachments = array_fill_keys($participantIds, ['role' => 'member']);
        $conversation->participants()->attach($participantAttachments);

        return $conversation;
    }

    /**
     * Update conversation details (title, avatar_url).
     *
     * @param int $conversationId
     * @param array $data
     * @return Conversation
     */
    public function updateConversation(int $conversationId, array $data): Conversation
    {
        $conversation = Conversation::findOrFail($conversationId);
        $conversation->update($data);

        return $conversation;
    }

    /**
     * Add participants to a group conversation.
     *
     * @param int $conversationId
     * @param array $participantIds
     * @return void
     */
    public function addParticipants(int $conversationId, array $participantIds): void
    {
        $conversation = Conversation::findOrFail($conversationId);

        $existingParticipantIds = $conversation->participants()->pluck('user_id')->toArray();
        $newParticipantIds = array_diff($participantIds, $existingParticipantIds);

        if (!empty($newParticipantIds)) {
            $participantAttachments = array_fill_keys($newParticipantIds, ['role' => 'member']);
            $conversation->participants()->attach($participantAttachments);
        }
    }

    /**
     * Remove a participant from a group conversation.
     *
     * @param int $conversationId
     * @param int $userId
     * @return void
     */
    public function removeParticipant(int $conversationId, int $userId): void
    {
        $conversation = Conversation::findOrFail($conversationId);
        $conversation->participants()->detach($userId);
    }

    /**
     * User leaves a group conversation.
     *
     * @param int $conversationId
     * @param int $userId
     * @return void
     */
    public function leaveConversation(int $conversationId, int $userId): void
    {
        $conversation = Conversation::findOrFail($conversationId);
        $conversation->participants()->detach($userId);
    }

    /**
     * Delete a conversation and all its messages.
     *
     * @param int $conversationId
     * @return void
     */
    public function deleteConversation(int $conversationId): void
    {
        $conversation = Conversation::findOrFail($conversationId);
        $conversation->delete();
    }
}
