<?php

namespace App\Policies;

use App\Models\Conversation;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class ConversationPolicy
{
    /**
     * If participant is in conversation.
     */
    public function view(User $user, Conversation $conversation): bool
    {
        return $conversation->participants()
            ->where('user_id', $user->id)
            ->exists();
    }

    /**
     * NOTE: It's for group conversation.
     * Always allow user to create conversation.
    */
    public function create(User $user): bool
    {
        return true; // Allow all users to create conversations
    }

    /**
     * NODE: It's for group conversation.
     * Only allow owner or admin participant to update conversation.
     */
    public function update(User $user, Conversation $conversation): bool
    {
        return false; // TODO: Implement update method.
    }

    /**
     * For direct: user can delete conversation only if he is participant.
     * For group: only owner can delete conversation.
     */
    public function delete(User $user, Conversation $conversation): bool
    {
        return false; // TODO: Implement delete method.
    }

    /**
     * If participant is in conversation.
     */
    public function send(User $user, Conversation $conversation): bool
    {
        return $conversation->participants()
            ->where('user_id', $user->id)
            ->exists();
    }
}
