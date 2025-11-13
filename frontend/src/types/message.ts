import type { messageType } from "./common";
import type { UserParticipant } from "./user";

export type Message = {
    id: number;
    conversation_id: number;
    sender_id: number;
    body: string;
    type: messageType;
    reply_to_id: number | null;
    edited_at: string | null; // ISO date string or null
    deleted_at: string | null; // ISO date string or null
    created_at: string; // ISO date string
}

// TODO: Implement in backend
export type MessageWithSender = Message & {
    sender: UserParticipant;
}

// Payloads
// Used for sending a direct message (first message in a direct conversation)
export type SendDirectMessagePayload = {
    recipient_id: number;
    body: string;
    type: messageType;
    reply_to_id?: number | null;
}

export type SendConversationMessagePayload = {
    body: string;
    type: messageType;
    reply_to_id?: number | null;
}

export type MessageUpdatePayload = {
    body?: string;
}

// Responses
export type MessageResponse = {
    message: Message;
}

export type MessagesLoadResponse = {
    conversation_id: number;
    messages: Message[];
}