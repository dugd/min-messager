<?php

namespace App\Services;

use App\Models\User;

class UserService
{
    /**
     * Update user profile.
     *
     * @param User $user
     * @param array $data
     * @return User
     */
    public function update(User $user, array $data): User
    {
        $user->update($data);
        return $user->fresh();
    }
}
