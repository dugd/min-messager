<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Database\Eloquent\Collection;

class UserSearchService
{
    /**
     * Search users by name or username.
     *
     * @param string $query Search query
     * @param int|null $excludeUserId User ID to exclude from results (optional)
     * @param int $limit Maximum number of results
     * @return Collection
     */
    public function search(string $query, ?int $excludeUserId = null, int $limit = 10): Collection
    {
        $searchQuery = User::query()
            ->where(function ($q) use ($query) {
                $q->where('name', 'LIKE', "%{$query}%")
                  ->orWhere('username', 'LIKE', "%{$query}%");
            });

        // Exclude specific user if provided
        if ($excludeUserId) {
            $searchQuery->where('id', '!=', $excludeUserId);
        }

        return $searchQuery
            ->select(['id', 'name', 'username', 'avatar_url'])
            ->limit($limit)
            ->get();
    }
}
