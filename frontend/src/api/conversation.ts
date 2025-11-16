import type {
  AddParticipantsRequest,
  Conversation,
  ConversationInfo,
  ConversationInfoResponse,
  ConversationResponse,
  ConversationsListResponse,
  CreateConversationRequest,
  UpdateConversationRequest
} from '../types/conversation';
import { del, get, patch, post } from './shared/utils';

export const ConversationApi = {
  getConversations: async (): Promise<Conversation[]> => {
    const response = await get<ConversationsListResponse>('/conversations');
    return response.conversations;
  },

  getConversationById: async (conversationId: number): Promise<Conversation> => {
    const response = await get<ConversationResponse>(`/conversations/${conversationId}`);
    return response.conversation;
  },

  createConversation: async (data: CreateConversationRequest): Promise<Conversation> => {
    const response = await post<ConversationResponse>('/conversations', data);
    return response.conversation;
  },

  updateConversation: async (conversationId: number, data: UpdateConversationRequest): Promise<ConversationInfo> => {
    const response = await patch<ConversationInfoResponse>(`/conversations/${conversationId}`, data);
    return response.conversation;
  },

  deleteConversation: async (conversationId: number): Promise<void> => {
    await del<void>(`/conversations/${conversationId}`);
  },

  addParticipants: async (conversationId: number, data: AddParticipantsRequest): Promise<Conversation> => {
    const response = await post<ConversationResponse>(`/conversations/${conversationId}/participants`, data);
    return response.conversation;
  },

  removeParticipant: async (conversationId: number, userId: number): Promise<Conversation> => {
    const response = await del<ConversationResponse>(`/conversations/${conversationId}/participants/${userId}`);
    return response.conversation;
  },

  leaveConversation: async (conversationId: number): Promise<void> => {
    await post<void>(`/conversations/${conversationId}/leave`);
  },
}