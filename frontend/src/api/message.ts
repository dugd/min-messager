import type { Message, MessageResponse, MessagesLoadResponse, MessageUpdatePayload, SendConversationMessagePayload, SendDirectMessagePayload } from "../types/message";
import { del, get, patch, post } from "./shared/utils";


export const MessageApi = {
  loadMessages: async (conversationId: string, beforeMessageId?: number, limit: number = 50 ): Promise<Message[]> => {
    const params = new URLSearchParams();
    if (beforeMessageId !== undefined) {
      params.append('before_id', beforeMessageId.toString());
    }
    params.append('limit', limit.toString());

    const response = await get<MessagesLoadResponse>(`/conversations/${conversationId}/messages?${params.toString()}`);
    return response.messages;
  },

  // only for first message in a draft direct conversation
  sendDirectMessage: (messageData: SendDirectMessagePayload): Promise<Message> => {
    return post<MessageResponse>(`/messages`, messageData)
      .then(response => response.message);
  },

  // for sending messages in existing conversations (group or direct)
  sendConversationMessage: async (conversationId: string, messageData: SendConversationMessagePayload): Promise<Message> => {
    const response = await post<MessageResponse>(`/conversations/${conversationId}/messages`, messageData);
    return response.message;
  },

  updateMessage: async (messageId: number, updateData: MessageUpdatePayload): Promise<Message> => {
    const response = await patch<MessageResponse>(`/messages/${messageId}`, updateData);
    return response.message;
  },

  deleteMessage: async (messageId: number): Promise<void> => {
    await del<void>(`/messages/${messageId}`);
  }
};
