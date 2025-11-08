<?php

namespace App\Policies;

use App\Models\User;

class UserPolicy
{
    /**
     * Determine whether the user can view the profile.
     */
    public function view(?User $user, User $profile): bool
    {
        return true;
    }

    /**
     * Determine whether the user can update the profile.
     */
    public function update(User $user, User $profile): bool
    {
        return $user->id === $profile->id;
    }
}
