<?php

namespace App\Http\Controllers;

use App\Http\Requests\UpdateUserRequest;
use App\Http\Resources\ProfileResource;
use App\Models\User;
use App\Services\UserSearchService;
use App\Services\UserService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function __construct(
        private UserSearchService $searchService,
        private UserService $userService,
    ) {}

    /**
     * Get authenticated user profile.
     */
    public function me(Request $request): JsonResponse
    {
        return response()->json([
            'user' => $request->user(),
        ]);
    }

    /**
     * Get user profile by ID.
     */
    public function show(User $user): JsonResponse
    {
        $this->authorize('view', $user);

        return response()->json([
            'user' => new ProfileResource($user),
        ]);
    }

    /**
     * Update authenticated user profile.
     */
    public function update(UpdateUserRequest $request): JsonResponse
    {
        $user = $request->user();
        $this->authorize('update', $user);

        $data = $request->validated();

        $updatedUser = $this->userService->update($user, $data);

        return response()->json([
            'user' => $updatedUser,
        ]);
    }

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
