<?php

namespace App\Http\Controllers;

use App\Http\Requests\AddParticipantsRequest;
use App\Http\Requests\CreateGroupRequest;
use App\Http\Requests\UpdateConversationRequest;
use App\Http\Resources\ConversationInfoResource;
use App\Models\Conversation;
use App\Models\User;
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

    /**
     * Update conversation details (group only).
     */
    public function update(UpdateConversationRequest $request, Conversation $conversation)
    {
        $this->authorize('update', $conversation);

        $data = $request->validated();

        $updatedConversation = $this->conversationService->updateConversation($conversation->id, $data);

        return response()->json([
            'conversation' => new ConversationInfoResource($updatedConversation),
        ]);
    }

    /**
     * Add participants to a group conversation.
     */
    public function addParticipants(AddParticipantsRequest $request, Conversation $conversation)
    {
        $this->authorize('addParticipants', $conversation);

        $data = $request->validated();

        $this->conversationService->addParticipants($conversation->id, $data['participants']);

        $conversation = $this->conversationService->getConversationById($conversation->id);

        return response()->json([
            'conversation' => new ConversationResource($conversation),
        ]);
    }

    /**
     * Remove a participant from a group conversation.
     */
    public function removeParticipant(Conversation $conversation, User $user)
    {
        $this->authorize('removeParticipant', [$conversation, $user]);

        $this->conversationService->removeParticipant($conversation->id, $user->id);

        $conversation = $this->conversationService->getConversationById($conversation->id);

        return response()->json([
            'conversation' => new ConversationResource($conversation),
        ]);
    }

    /**
     * Leave a group conversation.
     */
    public function leave(Conversation $conversation)
    {
        $this->authorize('leave', $conversation);

        $this->conversationService->leaveConversation($conversation->id, auth()->id());

        return response()->json([
            'message' => 'Successfully left the conversation',
        ]);
    }

    /**
     * Delete a conversation.
     */
    public function destroy(Conversation $conversation)
    {
        $this->authorize('delete', $conversation);

        $this->conversationService->deleteConversation($conversation->id);

        return response()->json([
            'message' => 'Conversation deleted successfully',
        ]);
    }
}
