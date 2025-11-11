<?php

namespace App\Http\Controllers;

use App\Services\ConversationService;
use App\Http\Resources\ConversationResource;
use Illuminate\Http\Request;

class ConversationController extends Controller
{
    public function __construct(
        private ConversationService $conversationService,
    ) {}

    /**
     * Get user conversations.
     */
    public function index() {
        $conversations = $this->conversationService->indexUserConversations(auth()->id());

        return response()->json([
            'conversations' => ConversationResource::collection($conversations),
        ]);
    }
}
