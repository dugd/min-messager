import { useEffect } from 'react';
import { useMessageStore } from '../stores/messageStore';
import type { Message } from '../types/message';
import { useEcho } from './useEcho';

type UpdatedMessage = {
  id: number;
  body: string;
  edited_at: string;
};

interface MessageSentEvent {
  message: Message;
}

interface MessageUpdatedEvent {
  message: UpdatedMessage;
}

interface MessageDeletedEvent {
  message_id: number;
}

/**
 * Hook to handle real-time updates for a conversation via Laravel Echo
 *
 * Listens to the private channel: `conversation.{conversationId}`
 *
 * Events:
 * - MessageSent: New message received
 * - MessageUpdated: Message was edited
 * - MessageDeleted: Message was deleted
 * - ReceiptUpdated: Delivery/read status changed (future)
 */
export const useConversationRealtime = (conversationId: number | null) => {
  const { echo } = useEcho();
  const { addMessage, updateMessage, deleteMessage } = useMessageStore();

  useEffect(() => {
    if (!echo || !conversationId) return;

    const channel = echo.private(`conversation.${conversationId}`);

    // Listen for new messages
    channel.listen('MessageSent', (event: MessageSentEvent) => {
      addMessage(conversationId, event.message);
    });

    // Listen for message updates
    channel.listen('MessageUpdated', (event: MessageUpdatedEvent) => {
      updateMessage(event.message.id, {
        body: event.message.body,
        edited_at: event.message.edited_at,
      });
    });

    // Listen for message deletions
    channel.listen('MessageDeleted', (event: MessageDeletedEvent) => {
      deleteMessage(event.message_id);
    });

    // Cleanup: leave channel and remove listeners
    return () => {
      channel.stopListening('MessageSent');
      channel.stopListening('MessageUpdated');
      channel.stopListening('MessageDeleted');
      echo.leave(`conversation.${conversationId}`);
    };
  }, [echo, conversationId, addMessage, updateMessage, deleteMessage]);
};
