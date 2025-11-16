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
        if ($conversation->type !== 'group') {
            return false;
        }

        $participant = $conversation->participants()
            ->where('user_id', $user->id)
            ->first();

        return $participant && in_array($participant->pivot->role, ['owner', 'admin']);
    }

    /**
     * For direct: user can delete conversation only if he is participant.
     * For group: only owner can delete conversation.
     */
    public function delete(User $user, Conversation $conversation): bool
    {
        if ($conversation->type === 'direct') {
            return $conversation->participants()
                ->where('user_id', $user->id)
                ->exists();
        }

        $participant = $conversation->participants()
            ->where('user_id', $user->id)
            ->first();

        return $participant && $participant->pivot->role === 'owner';
    }

    /**
     * Only owner or admin can add participants to group conversation.
     */
    public function addParticipants(User $user, Conversation $conversation): bool
    {
        if ($conversation->type !== 'group') {
            return false;
        }

        $participant = $conversation->participants()
            ->where('user_id', $user->id)
            ->first();

        return $participant && in_array($participant->pivot->role, ['owner', 'admin']);
    }

    /**
     * Owner/admin can remove anyone, or user can remove themselves.
     */
    public function removeParticipant(User $user, Conversation $conversation, User $targetUser): bool
    {
        if ($conversation->type !== 'group') {
            return false;
        }

        if ($user->id === $targetUser->id) {
            return true;
        }

        $participant = $conversation->participants()
            ->where('user_id', $user->id)
            ->first();

        return $participant && in_array($participant->pivot->role, ['owner', 'admin']);
    }

    /**
     * Any participant can leave, except owner.
     */
    public function leave(User $user, Conversation $conversation): bool
    {
        if ($conversation->type !== 'group') {
            return false;
        }

        $participant = $conversation->participants()
            ->where('user_id', $user->id)
            ->first();

        return $participant && $participant->pivot->role !== 'owner';
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
