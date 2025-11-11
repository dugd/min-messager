<?php

namespace App\Http\Controllers;

use App\Models\Conversation;
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

    public function show(Conversation $conversation) {
        $this->authorize('view', $conversation);

        $conversation = $this->conversationService->getConversationById($conversation->id);

        return response()->json([
            'conversation' => new ConversationResource($conversation),
        ]);
    }
}
