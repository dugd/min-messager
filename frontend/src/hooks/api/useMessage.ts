import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
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

// Get messages for a conversation (initial 50)
export const useConversationMessages = (conversationId: number, enabled = true) => {
  return useQuery({
    queryKey: messageKeys.list(conversationId),
    queryFn: async () => {
      const messages = await MessageApi.loadMessages(conversationId.toString(), undefined, 50);
      // Reverse to show oldest first (at top)
      return messages.reverse();
    },
    enabled: enabled && !!conversationId,
  });
};

// Load more older messages (pagination)
export const useLoadMoreMessages = (conversationId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (beforeMessageId: number) =>
      MessageApi.loadMessages(conversationId.toString(), beforeMessageId, 50),
    onSuccess: (newMessages) => {
      queryClient.setQueryData<Message[]>(
        messageKeys.list(conversationId),
        (oldMessages = []) => [...newMessages.reverse(), ...oldMessages]
      );
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
    onSuccess: () => {
      // Invalidate messages for this conversation
      queryClient.invalidateQueries({ queryKey: messageKeys.list(conversationId) });
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
      // Update message in cache
      queryClient.setQueryData<Message[]>(
        messageKeys.list(updatedMessage.conversation_id),
        (oldMessages = []) =>
          oldMessages.map((msg) => (msg.id === updatedMessage.id ? updatedMessage : msg))
      );
    },
  });
};

// Delete message
export const useDeleteMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      messageId,
      conversationId,
    }: {
      messageId: number;
      conversationId: number;
    }) => MessageApi.deleteMessage(messageId),
    onSuccess: (_, variables) => {
      // Remove message from cache
      queryClient.setQueryData<Message[]>(
        messageKeys.list(variables.conversationId),
        (oldMessages = []) => oldMessages.filter((msg) => msg.id !== variables.messageId)
      );
      // Invalidate conversations list in case it was the last message
      queryClient.invalidateQueries({ queryKey: conversationKeys.lists() });
    },
  });
};
