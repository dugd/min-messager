<?php

namespace App\Http\Controllers;

use App\Events\MessageDeleted;
use App\Events\MessageSent;
use App\Events\MessageUpdated;
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
     * Get messages for conversation.
     */
    public function messages(\Illuminate\Http\Request $request, Conversation $conversation)
    {
        $this->authorize('view', $conversation);

        $messages = $this->messageService->getMessages(
            $conversation,
            $request->query('before_id'),
            $request->query('limit', 50)
        );

        return response()->json([
            'conversation_id' => $conversation->id,
            'messages' => $messages,
        ]);
    }

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

        broadcast(new MessageSent($message))->toOthers();

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

        broadcast(new MessageSent($message))->toOthers();

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

        $this->messageService->update($message, $data['body']);

        broadcast(new MessageUpdated($message))->toOthers();

        return response()->json([
            'message' => $message,
        ]);
    }

    /**
     * Delete message.
     */
    public function destroy(Message $message)
    {
        $this->authorize('delete', $message);

        $this->messageService->delete($message);

        broadcast(new MessageDeleted($message))->toOthers();

        return response()->json(['message' => 'Message deleted'], 200);
    }
}
