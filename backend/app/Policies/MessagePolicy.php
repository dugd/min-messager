<?php

namespace App\Policies;

use App\Models\Message;
use App\Models\User;

class MessagePolicy
{
    /**
     * Determine if the user can view the message.
     */
    public function view(User $user, Message $message): bool
    {
        return $message->conversation->participants()
            ->where('user_id', $user->id)
            ->exists();
    }

    /**
     * Determine if the user can update the message.
     */
    public function update(User $user, Message $message): bool
    {
        return $user->id === $message->sender_id;
    }

    /**
     * Determine if the user can delete the message.
     */
    public function delete(User $user, Message $message): bool
    {
        if ($user->id === $message->sender_id) {
            return true;
        }

        $participant = $message->conversation->participants()
            ->where('user_id', $user->id)
            ->first();

        if (!$participant) {
            return false;
        }

        return in_array($participant->pivot->role, ['owner', 'admin']);
    }
}
