import type { InfiniteData } from '@tanstack/react-query';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import type { Message } from '../types/message';
import { messageKeys } from './api/useMessage';
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
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!echo || !conversationId) return;

    const channel = echo.private(`conversation.${conversationId}`);

    // Listen for new messages
    channel.listen('.MessageSent', (event: MessageSentEvent) => {
      queryClient.setQueryData<InfiniteData<Message[]>>(
        messageKeys.list(conversationId),
        (old) => {
          if (!old) return old;

          // Add to the last page
          return {
            ...old,
            pages: old.pages.map((page, index) =>
              index === old.pages.length - 1 ? [...page, event.message] : page
            ),
          };
        }
      );
    });

    // Listen for message updates
    channel.listen('.MessageUpdated', (event: MessageUpdatedEvent) => {
      queryClient.setQueryData<InfiniteData<Message[]>>(
        messageKeys.list(conversationId),
        (old) => {
          if (!old) return old;

          return {
            ...old,
            pages: old.pages.map((page) =>
              page.map((msg) =>
                msg.id === event.message.id
                  ? {
                      ...msg,
                      body: event.message.body,
                      edited_at: event.message.edited_at,
                    }
                  : msg
              )
            ),
          };
        }
      );
    });

    // Listen for message deletions
    channel.listen('.MessageDeleted', (event: MessageDeletedEvent) => {
      queryClient.setQueryData<InfiniteData<Message[]>>(
        messageKeys.list(conversationId),
        (old) => {
          if (!old) return old;

          return {
            ...old,
            pages: old.pages.map((page) => page.filter((msg) => msg.id !== event.message_id)),
          };
        }
      );
    });

    // Cleanup: leave channel and remove listeners
    return () => {
      channel.stopListening('.MessageSent');
      channel.stopListening('.MessageUpdated');
      channel.stopListening('.MessageDeleted');
      echo.leave(`conversation.${conversationId}`);
    };
  }, [echo, conversationId, queryClient]);
};
