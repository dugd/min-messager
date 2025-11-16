<?php

namespace App\Http\Controllers;

use App\Http\Requests\CreateGroupRequest;
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

    /**
     * Create new conversation (only for group chats).
     */
    public function store(CreateGroupRequest $request) {
        $this->authorize('create', Conversation::class);

        $data = $request->validated();

        $createdConversation = $this->conversationService->createGroup(
            $request->user()->id,
            $data['title'],
            $data['participants'],
            $data['avatar_url'] ?? null,
        );

        // Get full conversation details
        // TODO: Optimize
        $conversation = $this->conversationService->getConversationById($createdConversation->id);

        return response()->json([
            'conversation' => new ConversationResource($conversation),
        ]);
    }
}
