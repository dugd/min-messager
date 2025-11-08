<?php

namespace App\Http\Controllers;

use App\Http\Requests\SendMessageRequest;
use App\Services\ConversationService;
use App\Services\MessageService;
use Illuminate\Http\Request;

class MessageController extends Controller
{
    public function __construct(
        private MessageService $messageService,
        private ConversationService $conversationService,
    ) {}

    /**
     * Send direct message to user.
     */
    public function store(SendMessageRequest $request)
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
     * Update message content.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Delete message.
     */
    public function destroy(string $id)
    {
        //
    }
}
