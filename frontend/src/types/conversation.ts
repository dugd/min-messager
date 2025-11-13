import type { conversationType } from "./common";
import type { Message } from "./message";
import type { UserParticipant } from "./user";

export type Conversation = {
    id: number;
    type: conversationType;
    title?: string;
    created_at: string; // ISO date string
    updated_at: string; // ISO date string
    participants: UserParticipant[];
    last_message: Message;
}

// Responses
export type ConversationResponse = {
    conversation: Conversation;
}

export type ConversationsListRespose = {
    conversations: Conversation[];
}
