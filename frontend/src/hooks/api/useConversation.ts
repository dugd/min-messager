import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ConversationApi } from '../../api/conversation';
import type { CreateConversationRequest } from '../../types/conversation';

// Query keys
export const conversationKeys = {
  all: ['conversations'] as const,
  lists: () => [...conversationKeys.all, 'list'] as const,
  details: () => [...conversationKeys.all, 'detail'] as const,
  detail: (id: number) => [...conversationKeys.details(), id] as const,
};

// Get all conversations with polling
export const useConversations = () => {
  return useQuery({
    queryKey: conversationKeys.lists(),
    queryFn: () => ConversationApi.getConversations(),
    refetchInterval: 30000, // Poll every 30 seconds until WebSockets
  });
};

// Get conversation by ID
export const useConversationById = (conversationId: number, enabled = true) => {
  return useQuery({
    queryKey: conversationKeys.detail(conversationId),
    queryFn: () => ConversationApi.getConversationById(conversationId),
    enabled: enabled && !!conversationId,
  });
};

// Create new conversation
export const useCreateConversation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateConversationRequest) =>
      ConversationApi.createConversation(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: conversationKeys.lists() });
    },
  });
};
