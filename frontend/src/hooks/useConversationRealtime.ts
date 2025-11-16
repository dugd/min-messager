import { useEffect } from 'react';
import { useMessageStore } from '../stores/messageStore';
import type { Message } from '../types/message';
import { useEcho } from './useEcho';

interface MessageSentEvent {
  message: Message;
}

interface MessageUpdatedEvent {
  message: Message;
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
  const echo = useEcho();
  const { addMessage, updateMessage, deleteMessage } = useMessageStore();

  useEffect(() => {
    if (!echo || !conversationId) return;

    throw "Not implemented yet"; // Real-time updates are not implemented yet

  }, [echo, conversationId, addMessage, updateMessage, deleteMessage]);
};
