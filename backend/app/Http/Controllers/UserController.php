<?php

namespace App\Http\Controllers;

use App\Services\UserSearchService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function __construct(
        private UserSearchService $searchService
    ) {}

    /**
     * Search users by name or username.
     */
    public function search(Request $request): JsonResponse
    {
        $request->validate([
            'q' => 'required|string|min:1|max:255',
        ]);

        $query = $request->input('q');
        $currentUserId = $request->user()?->id;

        $users = $this->searchService->search($query, $currentUserId);

        return response()->json([
            'data' => $users,
        ]);
    }
}
