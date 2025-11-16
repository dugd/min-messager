import { create } from 'zustand';
import type { Message } from '../types/message';

interface MessageStore {
  // Message storage by conversation ID
  messagesByConversation: Record<number, Message[]>;

  // Actions
  setMessages: (conversationId: number, messages: Message[]) => void;
  addMessage: (conversationId: number, message: Message) => void;
  updateMessage: (messageId: number, updates: Partial<Message>) => void;
  deleteMessage: (messageId: number) => void;
  prependMessages: (conversationId: number, messages: Message[]) => void;
  clearConversation: (conversationId: number) => void;

  // Optimistic updates
  addOptimisticMessage: (conversationId: number, message: Partial<Message>) => number;
  removeOptimisticMessage: (tempId: number) => void;

  // Utilities
  getConversationMessages: (conversationId: number) => Message[];
  findMessage: (messageId: number) => Message | undefined;
}

export const useMessageStore = create<MessageStore>((set, get) => ({
  messagesByConversation: {},

  setMessages: (conversationId, messages) =>
    set((state) => ({
      messagesByConversation: {
        ...state.messagesByConversation,
        [conversationId]: messages,
      },
    })),

  addMessage: (conversationId, message) =>
    set((state) => {
      const existing = state.messagesByConversation[conversationId] || [];
      // Check if message already exists to avoid duplicates
      if (existing.some((m) => m.id === message.id)) {
        return state;
      }
      return {
        messagesByConversation: {
          ...state.messagesByConversation,
          [conversationId]: [...existing, message],
        },
      };
    }),

  updateMessage: (messageId, updates) =>
    set((state) => {
      const newState = { ...state.messagesByConversation };

      // Find and update the message in the appropriate conversation
      for (const conversationId in newState) {
        const messages = newState[conversationId];
        const index = messages.findIndex((m) => m.id === messageId);

        if (index !== -1) {
          const updatedMessages = [...messages];
          updatedMessages[index] = { ...messages[index], ...updates };
          newState[conversationId] = updatedMessages;
          break;
        }
      }

      return { messagesByConversation: newState };
    }),

  deleteMessage: (messageId) =>
    set((state) => {
      const newState = { ...state.messagesByConversation };

      // Find and remove the message from the appropriate conversation
      for (const conversationId in newState) {
        const messages = newState[conversationId];
        const filtered = messages.filter((m) => m.id !== messageId);

        if (filtered.length !== messages.length) {
          newState[conversationId] = filtered;
          break;
        }
      }

      return { messagesByConversation: newState };
    }),

  prependMessages: (conversationId, messages) =>
    set((state) => {
      const existing = state.messagesByConversation[conversationId] || [];
      // Filter out duplicates
      const newMessages = messages.filter(
        (newMsg) => !existing.some((existingMsg) => existingMsg.id === newMsg.id)
      );
      return {
        messagesByConversation: {
          ...state.messagesByConversation,
          [conversationId]: [...newMessages, ...existing],
        },
      };
    }),

  clearConversation: (conversationId) =>
    set((state) => {
      const newState = { ...state.messagesByConversation };
      delete newState[conversationId];
      return { messagesByConversation: newState };
    }),

  // Optimistic message handling (for pending sends)
  addOptimisticMessage: (conversationId, message) => {
    // Use negative timestamp for temporary ID to avoid conflicts with real message IDs
    const tempNumericId = -Date.now();

    set((state) => {
      const existing = state.messagesByConversation[conversationId] || [];
      const optimisticMessage: Message = {
        id: tempNumericId,
        conversation_id: conversationId,
        sender_id: message.sender_id || 0,
        body: message.body || '',
        type: message.type || 'text',
        reply_to_id: message.reply_to_id || null,
        edited_at: null,
        deleted_at: null,
        created_at: new Date().toISOString(),
      };

      return {
        messagesByConversation: {
          ...state.messagesByConversation,
          [conversationId]: [...existing, optimisticMessage],
        },
      };
    });

    return tempNumericId;
  },

  removeOptimisticMessage: (tempId) =>
    set((state) => {
      const newState = { ...state.messagesByConversation };

      for (const conversationId in newState) {
        const messages = newState[conversationId];
        const filtered = messages.filter((m) => m.id !== tempId);

        if (filtered.length !== messages.length) {
          newState[conversationId] = filtered;
          break;
        }
      }

      return { messagesByConversation: newState };
    }),

  // Utilities
  getConversationMessages: (conversationId) => {
    return get().messagesByConversation[conversationId] || [];
  },

  findMessage: (messageId) => {
    const state = get();
    for (const conversationId in state.messagesByConversation) {
      const message = state.messagesByConversation[conversationId].find(
        (m) => m.id === messageId
      );
      if (message) return message;
    }
    return undefined;
  },
}));
