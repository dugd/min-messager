<?php

namespace App\Http\Controllers;

use App\Http\Requests\SendDirectMessageRequest;
use App\Http\Requests\SendGroupMessageRequest;
use App\Http\Requests\UpdateMessageRequest;
use App\Models\Conversation;
use App\Models\Message;
use App\Services\ConversationService;
use App\Services\MessageService;

class MessageController extends Controller
{
    public function __construct(
        private MessageService $messageService,
        private ConversationService $conversationService,
    ) {}

    /**
     * Send direct message to user.
     */
    public function direct(SendDirectMessageRequest $request)
    {
        $data = $request->validated();

        $conversation = $this->conversationService->findOrCreateDirect(
            $request->user()->id,
            $data['recipient_id'],
        );

        $message = $this->messageService->create($conversation->id, auth()->id(), $data['body']);

        // TODO: Broadcast message to receiver

        return response()->json([
            'message' => $message,
        ]);
    }

    /**
     * Send message to group conversation.
     */
    public function group(SendGroupMessageRequest $request, Conversation $conversation) {
        $this->authorize('send', $conversation);

        $data = $request->validated();

        $message = $this->messageService->create($conversation->id, auth()->id(), $data['body']);

        return response()->json([
            'message' => $message,
        ]);
    }

    /**
     * Update message content.
     */
    public function update(UpdateMessageRequest $request, Message $message)
    {
        $this->authorize('update', $message);

        $data = $request->validated();

        $message->update([
            'body' => $data['body'],
            'edited_at' => now(),
        ]);

        // Broadcast MessageUpdated event

        return response()->json($message);
    }

    /**
     * Delete message.
     */
    public function destroy(Message $message)
    {
        $this->authorize('delete', $message);

        $message->update(['deleted_at' => now()]);

        // Broadcast MessageDeleted event

        return response()->json(['message' => 'Message deleted'], 200);
    }
}
