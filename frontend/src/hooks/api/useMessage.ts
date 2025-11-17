import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { MessageApi } from '../../api/message';
import type {
  Message,
  MessageUpdatePayload,
  SendConversationMessagePayload,
  SendDirectMessagePayload,
} from '../../types/message';
import { conversationKeys } from './useConversation';

// Query keys
export const messageKeys = {
  all: ['messages'] as const,
  lists: () => [...messageKeys.all, 'list'] as const,
  list: (conversationId: number) => [...messageKeys.lists(), conversationId] as const,
};

// Get messages for a conversation with infinite scroll pagination
export const useConversationMessages = (conversationId: number, enabled = true) => {
  return useInfiniteQuery({
    queryKey: messageKeys.list(conversationId),
    queryFn: async ({ pageParam }) => {
      const messages = await MessageApi.loadMessages(
        conversationId.toString(),
        pageParam,
        50
      );
      // Reverse to show oldest first
      return messages.reverse();
    },
    initialPageParam: undefined as number | undefined,
    getNextPageParam: (lastPage) => {
      if (lastPage.length < 50) return undefined;
      return lastPage[0]?.id;
    },
    enabled: enabled && !!conversationId,
    staleTime: Infinity, // Messages don't go stale (real-time updates via WebSocket)
    gcTime: 1000 * 60 * 30, // Keep in cache for 30 minutes
    select: (data) => {
      // Reverse pages order (oldest pages first), then flatten
      // This gives us: [oldest messages...newest messages]
      const allMessages = data.pages.slice().reverse().flat();
      return {
        messages: allMessages,
        pages: data.pages,
        pageParams: data.pageParams,
      };
    },
  });
};

// Send direct message (first message to user, auto-creates conversation)
export const useSendDirectMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: SendDirectMessagePayload) => MessageApi.sendDirectMessage(payload),
    onSuccess: () => {
      // Invalidate conversations list to show new conversation
      queryClient.invalidateQueries({ queryKey: conversationKeys.lists() });
    },
  });
};

// Send message in existing conversation
export const useSendConversationMessage = (conversationId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: SendConversationMessagePayload) =>
      MessageApi.sendConversationMessage(conversationId.toString(), payload),
    onMutate: async (payload) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: messageKeys.list(conversationId) });

      // Snapshot previous value
      const previousData = queryClient.getQueryData(messageKeys.list(conversationId));

      // Optimistically update
      queryClient.setQueryData(messageKeys.list(conversationId), (old: any) => {
        if (!old) return old;

        const optimisticMessage: Message = {
          id: -Date.now(), // Temporary negative ID
          conversation_id: conversationId,
          sender_id: 0, // Will be filled by server
          body: payload.body,
          type: payload.type,
          reply_to_id: payload.reply_to_id || null,
          edited_at: null,
          deleted_at: null,
          created_at: new Date().toISOString(),
        };

        return {
          ...old,
          pages: old.pages.map((page: Message[], index: number) =>
            index === old.pages.length - 1 ? [...page, optimisticMessage] : page
          ),
        };
      });

      return { previousData };
    },
    onError: (_err, _variables, context) => {
      // Rollback on error
      if (context?.previousData) {
        queryClient.setQueryData(messageKeys.list(conversationId), context.previousData);
      }
    },
    onSuccess: (newMessage) => {
      // Replace optimistic message with real one from server
      queryClient.setQueryData(messageKeys.list(conversationId), (old: any) => {
        if (!old) return old;

        return {
          ...old,
          pages: old.pages.map((page: Message[]) =>
            page.map((msg) => (msg.id < 0 ? newMessage : msg))
          ),
        };
      });

      // Invalidate conversations list to update last message
      queryClient.invalidateQueries({ queryKey: conversationKeys.lists() });
    },
  });
};

// Update message
export const useUpdateMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ messageId, data }: { messageId: number; data: MessageUpdatePayload }) =>
      MessageApi.updateMessage(messageId, data),
    onSuccess: (updatedMessage) => {
      // Update message in all conversation caches
      queryClient.setQueriesData({ queryKey: messageKeys.lists() }, (old: any) => {
        if (!old) return old;

        return {
          ...old,
          pages: old.pages.map((page: Message[]) =>
            page.map((msg) => (msg.id === updatedMessage.id ? updatedMessage : msg))
          ),
        };
      });

      // Invalidate conversations list in case it was the last message
      queryClient.invalidateQueries({ queryKey: conversationKeys.lists() });
    },
  });
};

// Delete message
export const useDeleteMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ messageId }: { messageId: number; conversationId: number }) =>
      MessageApi.deleteMessage(messageId),
    onSuccess: (_, variables) => {
      // Remove message from cache
      queryClient.setQueryData(messageKeys.list(variables.conversationId), (old: any) => {
        if (!old) return old;

        return {
          ...old,
          pages: old.pages.map((page: Message[]) =>
            page.filter((msg) => msg.id !== variables.messageId)
          ),
        };
      });

      // Invalidate conversations list in case it was the last message
      queryClient.invalidateQueries({ queryKey: conversationKeys.lists() });
    },
  });
};
