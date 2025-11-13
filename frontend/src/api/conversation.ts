import type { Conversation, ConversationResponse, ConversationsListRespose } from '../types/conversation';
import { get } from './shared/utils';

export const ConversationApi = {
  getConversations: async (): Promise<Conversation[]> => {
    const response = await get<ConversationsListRespose>('/conversations');
    return response.conversations;
  },
  getConversationById: async (conversationId: number): Promise<Conversation> => {
    const response = await get<ConversationResponse>(`/conversations/${conversationId}`);
    return response.conversation;
  },
}