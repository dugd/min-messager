import type { conversationType } from "./common";
import type { Message } from "./message";
import type { UserParticipant } from "./user";

// Includes 'direct' and 'group'
export type Conversation = {
    id: number;
    type: conversationType;
    title?: string;
    avatar_url?: string;
    created_at: string; // ISO date string
    updated_at: string; // ISO date string
    participants: UserParticipant[];
    last_message?: Message;
}

// Basic info without participants and last message
export type ConversationInfo = {
    id: number;
    type: conversationType;
    title?: string;
    avatar_url?: string;
    created_at: string; // ISO date string
    updated_at: string; // ISO date string
}

// Responses
export type ConversationResponse = {
    conversation: Conversation;
}

export type ConversationInfoResponse = {
    conversation: ConversationInfo;
}

export type ConversationsListResponse = {
    conversations: Conversation[];
}

// Request types
export type CreateConversationRequest = {
    type: conversationType;
    title?: string;
    avatar_url?: string;
    participant_ids: number[];
}

export type UpdateConversationRequest = {
    title?: string;
    avatar_url?: string;
}

export type AddParticipantsRequest = {
    user_ids: number[];
}
